import csv from "csv-parser";
import sharp from "sharp";

async function generateDick(dick, face, head, eyewear) {
  const inputPNGs = [
    "./assets/dick/" + dick + ".png",
    "./assets/head/" + head + ".png",
    "./assets/eyewear/" + eyewear + ".png",
    "./assets/face/" + face + ".png",
  ];

  const layers = inputPNGs.map((p) => ({ input: p }));
  const base = sharp({
    create: {
      width: 500,
      height: 500,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  });

  await base
    .composite(layers)
    .png()
    .toFile(`./dicks/${dick} ${head} ${eyewear} ${face}.png`);
}

const traitValues = [];

const filePath = './bros.csv'; // Replace with the actual file path

import fs from "fs";

fs.createReadStream(filePath)
  .pipe(csv())
  .on('data', row => {
    traitValues.push(Object.values(row));
  })
  .on('end', async () => {
    for (const currBro of traitValues) {
      const dick = currBro[0];
      const face = currBro[3];
      const eyewear = currBro[2];
      const head = currBro[1];
      await generateDick(dick, face, head, eyewear);
    }
  })
  .on('error', err => {
    console.error('Error reading CSV file:', err);
  });