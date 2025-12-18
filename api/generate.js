import sharp from "sharp";
import path from "path";

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
      ["hand", req.query.hand],
      ["sticker", req.query.sticker],
    ];

    const inputPNGs = orderedTraits
      .map(([trait, value]) => toPath(trait, value))
      .filter(Boolean);

    const layers = inputPNGs.map((p) => ({ input: p }));

    const base = sharp({
      create: {
        width: 1080,
        height: 1080,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      },
    });

    const buffer = await base.composite(layers).png().toBuffer();
    const dataUrl = "data:image/png;base64," + buffer.toString("base64");

    res.status(200).json({ bro: dataUrl });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to generate image", details: String(err) });
  }
}