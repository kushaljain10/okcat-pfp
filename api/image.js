import sharp from "sharp";
import path from "path";
import fs from "fs/promises";

// In-memory caches to speed up warm invocations
const fileCache = new Map(); // path -> Buffer
const resultCache = new Map(); // key -> Buffer
const MAX_RESULT_CACHE = 200;

async function loadBuffer(p) {
  const cached = fileCache.get(p);
  if (cached) return cached;
  const buf = await fs.readFile(p);
  fileCache.set(p, buf);
  return buf;
}

export default async function handler(req, res) {
  try {
    const fnRoot = process.cwd();
    const assetsDir = path.join(fnRoot, "assets");

    const toPath = (trait, value) => {
      if (!value || value === "None") return null;
      return path.join(assetsDir, trait, `${value}.png`);
    };

    const orderedTraits = [
      ["background", req.query.background],
      ["body", req.query.body],
      ["eyes", req.query.eyes],
      ["head", req.query.head],
      ["mouth", req.query.mouth],
      ["sticker", req.query.sticker],
    ];

    const inputPNGs = orderedTraits
      .map(([trait, value]) => toPath(trait, value))
      .filter(Boolean);

    const resultKey = orderedTraits.map(([t, v]) => `${t}:${v || ""}`).join("|");
    const cachedResult = resultCache.get(resultKey);
    if (cachedResult) {
      res.setHeader("Content-Type", "image/png");
      res.setHeader("Cache-Control", "public, max-age=3600");
      return res.status(200).send(cachedResult);
    }

    const buffers = await Promise.all(inputPNGs.map((p) => loadBuffer(p)));
    const layers = buffers.map((b) => ({ input: b }));

    const base = sharp({
      create: {
        width: 1080,
        height: 1080,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      },
    });

    const pngBuffer = await base
      .composite(layers)
      .png({ compressionLevel: 1, effort: 1 })
      .toBuffer();

    // Simple LRU: trim when too large
    resultCache.set(resultKey, pngBuffer);
    if (resultCache.size > MAX_RESULT_CACHE) {
      const firstKey = resultCache.keys().next().value;
      resultCache.delete(firstKey);
    }

    res.setHeader("Content-Type", "image/png");
    res.setHeader("Cache-Control", "public, max-age=3600");
    res.status(200).send(pngBuffer);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to generate image", details: String(err) });
  }
}