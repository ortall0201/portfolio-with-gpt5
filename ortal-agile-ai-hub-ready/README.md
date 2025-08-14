# Ortal Agile AI Hub

Lovable-style React + Tailwind + Framer Motion. Contact form posts to `/api/notion-intake` (Vercel function).
If function/env are missing, form falls back to `mailto:`.

## Run
```bash
npm i
npm run dev
```

## Deploy (Vercel)
- Import this repo on Vercel.
- Add env vars:
  - `NOTION_TOKEN`
  - `NOTION_DATABASE_ID`
- Deploy. Test `POST /api/notion-intake`.

## Links
All external links are centralized at the top of `src/App.jsx`.