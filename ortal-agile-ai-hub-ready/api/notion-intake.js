// File: /api/notion-intake.js
// Vercel Node function. Requires NOTION_TOKEN and NOTION_DATABASE_ID env vars.
// DO NOT expose secrets on the client.
module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).send("Method Not Allowed");
  try {
    const { name, email, message, source = "website" } = req.body || {};

    const token = process.env.NOTION_TOKEN;
    const db = process.env.NOTION_DATABASE_ID;
    if (!token || !db) {
      return res.status(500).json({ ok: false, error: "Missing NOTION_TOKEN / NOTION_DATABASE_ID" });
    }

    const payload = {
      parent: { database_id: db },
      properties: {
        Name: { title: [{ text: { content: String(name || "New lead") } }] },
        Email: email ? { email: String(email) } : { email: null },
        Source: { rich_text: [{ text: { content: String(source) } }] },
        "Submitted At": { date: { start: new Date().toISOString() } },
      },
      children: message ? [
        {
          object: "block",
          type: "paragraph",
          paragraph: { rich_text: [{ text: { content: String(message).slice(0, 2000) } }] }
        }
      ] : [],
    };

    const r = await fetch("https://api.notion.com/v1/pages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Notion-Version": "2022-06-28",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!r.ok) return res.status(502).json({ ok: false, error: await r.text() });
    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(500).json({ ok: false, error: e?.message || "Server error" });
  }
};