import fs from 'fs';
import path from 'path';

const traits = ['background', 'beard', 'dress', 'eyes', 'eyewear', 'face', 'head', 'skin']

traits.forEach(function(current) {
    let folderPath = './assets/'+current; // Replace with the actual folder path
    let csvFilePath = './assets/'+current+'/list.csv'; // Replace with the desired output CSV file path

    fs.readdir(folderPath, (err, files) => {
        if (err) {
          console.error('Error reading folder:', err);
          return;
        }
      
        const pngFiles = files.filter(file => path.extname(file).toLowerCase() === '.png');
        const csvData = (pngFiles.join('\n')).replace(new RegExp('.png', 'gs'), '');
      //   csvData = csvData.replace('.svg', '');
      
        fs.writeFile(csvFilePath, csvData, err => {
          if (err) {
            console.error('Error writing CSV file:', err);
            return;
          }
      
          console.log('CSV file created successfully:', csvFilePath);
        });
      });
});