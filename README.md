# BEACON

A cinematic one-tap summon tool for squad coordination.

Beacon is a lightweight web app that lets a selected identity (`Noxxorp`, `Rambo`, or `Rudy`) trigger an email alert to the other two players using a Vercel Serverless Function and Nodemailer.

## Highlights
- Fast single-page UI with identity lock + local persistence
- Animated "Launch Beacon" action state and live status feedback
- Serverless email API (`/api/send_mail`) for summon broadcasts
- Simple Vercel-friendly structure (static frontend + API route)

## Stack
- HTML/CSS/Vanilla JavaScript (frontend)
- Node.js + `nodemailer` (backend API)
- Vercel Serverless Functions (deployment)

## Project Structure
```text
.
|-- api/
|   `-- send_mail.js        # Serverless function for mail delivery
|-- index.html              # Frontend dashboard
|-- package.json            # Dependencies
`-- vercel.json             # Vercel config
```

## How It Works
1. User selects an identity in the frontend modal.
2. Identity is stored in `localStorage` (`beacon_identity`).
3. Clicking **Launch Beacon** sends `POST /api/send_mail` with `{ identity }`.
4. API validates identity and sends an email to the other two squad members.

## Environment Variables
Create a `.env` file (or configure in Vercel project settings):

```bash
EMAIL_USER=your_gmail_address@gmail.com
EMAIL_PASS=your_gmail_app_password
NOXXORP_EMAIL=noxxlab214@gmail.com
RAMBO_EMAIL=vrund039@gmail.com
RUDY_EMAIL=rudradhirendrapatel@gmail.com
```

Notes:
- `EMAIL_USER` and `EMAIL_PASS` are required.
- Identity emails are optional; defaults in `api/send_mail.js` are used if not set.
- For Gmail, use an App Password (recommended) instead of your main account password.

## Local Run
1. Install dependencies:
   ```bash
   npm install
   ```
2. Run with Vercel dev server:
   ```bash
   npx vercel dev
   ```
3. Open the local URL shown in terminal.

## API Reference
### `POST /api/send_mail`
Send summon mail for a specific identity.

Request body:
```json
{ "identity": "Noxxorp" }
```

Valid identities:
- `Noxxorp`
- `Rambo`
- `Rudy`

Success response:
```json
{
  "status": "success",
  "message": "Noxxorp summoned 2 player(s)."
}
```

Error response example:
```json
{
  "status": "error",
  "message": "Please provide a valid identity: Noxxorp, Rambo, or Rudy."
}
```

### `GET /api/send_mail?identity=<name>`
Also supported for quick testing.

## Deploy
1. Push this repo to GitHub.
2. Import project in Vercel.
3. Add environment variables in Vercel project settings.
4. Deploy.

## Security Notes
- Never commit `.env` or credentials.
- Rotate app passwords if exposed.
- Consider adding rate limiting and auth before broader public access.

## Roadmap Ideas
- Add Discord/Telegram fallback notifications
- Add delivery logs/history panel
- Add cooldown + anti-spam controls
- Add squad management UI (custom identities and emails)

## License
MIT (recommended for public GitHub use).
