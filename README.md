# Change Cabana

Pre-launch landing page for Change Cabana with a Railway-friendly Node server and a working waitlist form.

## Run locally

```bash
npm install
npm start
```

Then open `http://localhost:3000`.

## Railway deploy

Railway can deploy this app directly from the repo.

- Start command: `npm start`
- Port: Railway will provide `PORT` automatically
- Optional env var: `DATA_DIR=/data`

## Waitlist storage

The waitlist form posts to `/api/waitlist` and stores signups in `waitlist.json`.

Important for Railway:

- If you want signups to persist after restarts or redeploys, attach a Railway volume
- Mount that volume and set `DATA_DIR` to the mounted path, for example `/data`
- Without a persistent volume, local file storage may be lost

## Domain setup

Suggested launch structure:

- `changecabana.com` -> this Railway site
- `shop.changecabana.com` -> Shopify when the store goes live
