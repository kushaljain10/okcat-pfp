import fs from "fs";
import path from "path";

const traits = ["background", "body", "eyes", "head", "mouth", "sticker"];

traits.forEach(function (current) {
  let folderPath = "./assets/" + current; // Source assets path
  let csvFilePath = "./assets/" + current + "/list.csv"; // Output CSV in assets
  let publicCsvPath = "./public/assets/" + current + "/list.csv"; // Mirror CSV into public for UI

  fs.readdir(folderPath, (err, files) => {
    if (err) {
      console.error("Error reading folder:", err);
      return;
    }

    const pngFiles = files.filter(
      (file) => path.extname(file).toLowerCase() === ".png"
    );
    const csvData = pngFiles.join("\n").replace(new RegExp(".png", "gs"), "");
    //   csvData = csvData.replace('.svg', '');

    // Ensure public directory exists
    fs.mkdir(path.dirname(publicCsvPath), { recursive: true }, () => {});

    fs.writeFile(csvFilePath, csvData, (err) => {
      if (err) {
        console.error("Error writing CSV file:", err);
        return;
      }

      console.log("CSV file created successfully:", csvFilePath);
    });

    fs.writeFile(publicCsvPath, csvData, (err) => {
      if (err) {
        console.error("Error writing public CSV file:", err);
        return;
      }
      console.log("Public CSV file created successfully:", publicCsvPath);
    });
  });
});
