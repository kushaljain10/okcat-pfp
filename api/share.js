import path from "path";
import fs from "fs/promises";

const traitNames = [
  "background",
  "body",
  "eyes",
  "head",
  "mouth",
  "sticker",
];

const listsCache = new Map(); // trait -> string[]
async function loadList(fnRoot, trait) {
  const cached = listsCache.get(trait);
  if (cached) return cached;
  const p = path.join(fnRoot, "assets", trait, "list.csv");
  const buf = await fs.readFile(p);
  const content = buf.toString("utf-8");
  const arr = content
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 0);
  listsCache.set(trait, arr);
  return arr;
}

const alphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const charToVal = Object.fromEntries(alphabet.split("").map((c, i) => [c, i]));
function decodeBase62(id) {
  let n = 0;
  for (const ch of id) {
    const v = charToVal[ch];
    if (v === undefined) throw new Error("invalid base62 character");
    n = n * 62 + v;
  }
  return n;
}

export default async function handler(req, res) {
  try {
    const fnRoot = process.cwd();
    const id = (req.query.id || "").trim();

    let selections = null;

    if (id) {
      // Decode compact ID into trait indices via mixed-radix
      const lists = await Promise.all(traitNames.map((t) => loadList(fnRoot, t)));
      const radixes = lists.map((arr) => arr.length);
      let value = decodeBase62(id);
      const indices = [];
      for (let i = 0; i < traitNames.length; i++) {
        const r = radixes[i];
        const idx = value % r;
        indices.push(idx);
        value = Math.floor(value / r);
      }
      selections = Object.fromEntries(
        traitNames.map((t, i) => [t, lists[i][indices[i]] || ""])
      );
    } else {
      // Fallback to query params
      const {
        background = "",
        body = "",
        eyes = "",
        head = "",
        mouth = "",
        sticker = "",
      } = req.query;
      selections = { background, body, eyes, head, mouth, sticker };
    }

    const baseUrl = `${req.headers["x-forwarded-proto"] || "https"}://${req.headers.host}`;
    const qs = new URLSearchParams(selections).toString();
    const imgUrl = `${baseUrl}/api/image?${qs}`;
    const pageUrl = id
      ? `${baseUrl}/share/${id}`
      : `${baseUrl}/share?${qs}`;

    const title = "ok pfp maker";
    const description = "Generated a crisp 1080×1080 ok cat pfp.";

    const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title}</title>
    <meta name="description" content="${description}" />
    <!-- Open Graph -->
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:type" content="website" />
    <meta property="og:image" content="${imgUrl}" />
    <meta property="og:image:type" content="image/png" />
    <meta property="og:image:alt" content="ok cat pfp preview" />
    <meta property="og:site_name" content="$ok" />
    <meta property="og:locale" content="en_US" />
    <meta property="og:url" content="${pageUrl}" />
    <meta property="og:image:width" content="1080" />
    <meta property="og:image:height" content="1080" />
    <!-- Twitter Cards -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${description}" />
    <meta name="twitter:image" content="${imgUrl}" />
    <meta name="twitter:image:alt" content="ok cat pfp preview" />
    <meta name="twitter:site" content="@okcryingcat" />
    <meta name="twitter:creator" content="@okcryingcat" />
    <meta name="theme-color" content="#f8fafc" />
    <style>body{font-family:system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Cantarell,Noto Sans,sans-serif;background:#f8fafc;color:#111;margin:0;padding:24px;}main{max-width:680px;margin:0 auto;background:#fff;border:1px solid #e5e7eb;border-radius:12px;padding:24px;box-shadow:0 1px 3px rgba(0,0,0,0.06);}h1{font-size:20px;margin:0 0 12px;}p{color:#4b5563;margin:0 0 16px;}img{width:100%;max-width:480px;border-radius:8px;border:1px solid #e5e7eb;}a.button{display:inline-block;background:#4f46e5;color:#fff;padding:10px 14px;border-radius:8px;text-decoration:none;font-weight:600;}a.button:hover{background:#4338ca}</style>
  </head>
  <body>
    <main>
      <h1>Your ok cat fit</h1>
      <p>Direct share URL for your generated image. Social platforms will render the preview automatically.</p>
      <img src="${imgUrl}" alt="ok cat pfp" />
      <p style="margin-top:16px"><a class="button" href="/" aria-label="Make another">Make another</a></p>
    </main>
  </body>
</html>`;

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.status(200).send(html);
  } catch (err) {
    res.status(500).json({ error: "Failed to render share page", details: String(err) });
  }
}