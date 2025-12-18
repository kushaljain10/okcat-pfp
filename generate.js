import sharp from "sharp";

export async function generateBro(req, res) {
  try {
    const inputPNGs = [
      "./assets/background/" + req.query.background + ".png",
      "./assets/body/" + req.query.body + ".png",
      "./assets/eyes/" + req.query.eyes + ".png",
      "./assets/head/" + req.query.head + ".png",
      "./assets/mouth/" + req.query.mouth + ".png",
      "./assets/hand/" + req.query.hand + ".png",
      "./assets/sticker/" + req.query.sticker + ".png",
    ];

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
