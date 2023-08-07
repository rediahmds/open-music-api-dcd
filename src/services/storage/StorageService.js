const fs = require('fs');

class StorageService {
  constructor(directory) {
    this._folder = directory;

    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true });
    }
  }

  writeFile(file, meta) {
    const filename = `${+new Date()}${meta.filename}`;
    const path = `${this._folder}/${filename}`;

    const fileStream = fs.createWriteStream(path);

    return new Promise((resolve, reject) => {
      fileStream.on('error', (error) => reject(error));
      file.pipe(fileStream);
      file.on('end', () => resolve(filename));
    });
  }

  getDirectory() {
    return this._folder;
  }
}

module.exports = StorageService;
