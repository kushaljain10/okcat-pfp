import sharp from "sharp";

async function generateBro(background, body, eyes, head, mouth, hand, sticker) {
  const inputPNGs = [
    `./assets/background/${background}.png`,
    `./assets/body/${body}.png`,
    `./assets/head/${head}.png`,
    `./assets/eyes/${eyes}.png`,
    // `./assets/hand/${hand}.png`,
    `./assets/mouth/${mouth}.png`,
    `./assets/sticker/${sticker}.png`,
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

  await base
    .composite(layers)
    .png()
    .toFile(
      `./random/${background} ${body} ${eyes} ${head} ${mouth} ${sticker}.png`
    );
}

const backgroundsList = [
  "Windows XP Field",
  "The Trenches",
  "McDonalds",
  "Jail Cell",
  "This is Fine",
  "Valhalla Moon",
  "Green God Candle",
  "Red Nuke",
  "Matrix Code",
];
const bodiesList = ["Classic", "Shiba", "Naked", "Zombie", "Gold", "Glitch"];
const eyesList = [
  "Classic",
  "Stoner",
  "Thug Life",
  "Dead",
  "Hypnotized",
  "Money Bags",
  "Laser Eyes",
  "VR Goggles",
  "Void",
];
const headsList = [
  "None",
  "McDonalds Cap",
  "Traffic Cone",
  "Propeller Hat",
  "Tin Foil Hat",
  "Pink Beanie",
  "Headset",
  "Top Hat",
  "Wizard Hat",
  "Crown",
];
const mouthsList = [
  "None",
  "Cigarette",
  "Vape",
  "Pacifier",
  "Ramen Noodle",
  "Fat Blunt",
  "Foaming",
  "Mouse Tail",
  "Gold Grillz",
];
// const handsList = [
//   "Middle Finger",
//   "Paper Hand",
//   "Bag",
//   "Phone",
//   "Uno Reverse",
//   "Diamond Hand",
//   "Gun",
// ];
const stickersList = [
  "None",
  "Band-aid",
  "GM",
  "WAGMI",
  "Clown Nose",
  "Teardrop Tattoo",
  "Jeet",
  "Losing Streak",
  "Dev",
];

//   let all_dicks = []
let frequency = {};
(async () => {
  for (let i = 0; i < 600; i++) {
    const background =
      backgroundsList[Math.floor(Math.random() * backgroundsList.length)];
    const body = bodiesList[Math.floor(Math.random() * bodiesList.length)];
    const eyes = eyesList[Math.floor(Math.random() * eyesList.length)];
    const head = headsList[Math.floor(Math.random() * headsList.length)];
    const mouth = mouthsList[Math.floor(Math.random() * mouthsList.length)];
    // const hand = handsList[Math.floor(Math.random() * handsList.length)];
    const sticker =
      stickersList[Math.floor(Math.random() * stickersList.length)];

    await generateBro(background, body, eyes, head, mouth, sticker);
  }
})();
// if (frequency[face]) {
//     frequency[face]++;
// } else {
//     frequency[face] = 1;
// }
//   const header = Object.keys(frequency).join(',') + '\n';
//   const rows = Object.values(frequency).join(',') + '\n';

//   const file = 'data.csv';

//   fs.appendFile(file, header+rows, err => {
//     if (err) {
//       console.error('Error writing to CSV file:', err);
//     } else {
//       console.log('Data appended to CSV file successfully.');
//     }
//   });
