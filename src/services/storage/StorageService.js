const fs = require('fs');

class StorageService {
  constructor(folderName) {
    this._folder = folderName;

    if (!fs.existsSync(folderName)) {
      fs.mkdirSync(folderName, { recursive: true });
    }
  }

  writeFile(file, meta) {
    const filename = `${+new Date()}${meta.filename}`;
    const path = `./${this._folder}/${filename}`;

    const fileStream = fs.createWriteStream(path);

    return new Promise((resolve, reject) => {
      fileStream.on('error', (error) => reject(error));
      file.pipe(fileStream);
      file.on('end', () => resolve(filename));
    });
  }
}

module.exports = StorageService;
