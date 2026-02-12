const nodemailer = require("nodemailer");

module.exports = async (req, res) => {
  if (req.method !== "POST" && req.method !== "GET") {
    res.setHeader("Allow", ["POST", "GET"]);
    return res.status(405).json({ status: "error", message: "Method not allowed" });
  }

  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;

  if (!emailUser || !emailPass) {
    return res.status(500).json({
      status: "error",
      message: "Missing EMAIL_USER or EMAIL_PASS environment variables",
    });
  }

  const identityEmails = {
    Noxxorp: process.env.NOXXORP_EMAIL || "noxxlab214@gmail.com",
    Rambo: process.env.RAMBO_EMAIL || "nisharg214@gmail.com",
    Rudy: process.env.RUDY_EMAIL || "rudradhirendrapatel@gmail.com",
  };

  let selectedIdentity =
    req.method === "GET" ? req.query?.identity : req.body?.identity;

  if (typeof selectedIdentity === "string") {
    selectedIdentity = selectedIdentity.trim();
  }

  if (!selectedIdentity || !identityEmails[selectedIdentity]) {
    return res.status(400).json({
      status: "error",
      message: "Please provide a valid identity: Noxxorp, Rambo, or Rudy.",
    });
  }

  const recipients = Object.entries(identityEmails)
    .filter(([identity]) => identity !== selectedIdentity)
    .map(([, email]) => email);

  const htmlContent = `
    <div style="background-color: #0f0c29; color: #00d2ff; padding: 30px; border: 2px solid #00d2ff; border-radius: 15px; text-align: center; font-family: 'Segoe UI', Arial, sans-serif;">
      <h1 style="margin: 0; text-shadow: 0 0 10px #00d2ff;">SUMMON ALERT</h1>
      <p style="color: white; font-size: 1.1rem;"><strong>${selectedIdentity}</strong> has summoned you.</p>
      <div style="margin: 20px 0; border-top: 1px dashed #00d2ff;"></div>
      <p style="font-weight: bold; letter-spacing: 2px;">ENTER THE LOBBY NOW</p>
    </div>
  `;

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: emailUser,
        pass: emailPass,
      },
    });

    await transporter.sendMail({
      from: emailUser,
      to: recipients.join(", "),
      subject: `${selectedIdentity} has summoned you`,
      html: htmlContent,
    });

    return res.status(200).json({
      status: "success",
      message: `${selectedIdentity} summoned ${recipients.length} player(s).`,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message || "Failed to send email",
    });
  }
};
