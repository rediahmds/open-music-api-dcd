const UploadAlbumartHandler = require('./UploadAlbumartHandler');
const routes = require('./routes');

module.exports = {
  name: 'upload_albumart',
  version: '1.0.0',
  register: async (
    server,
    { storageService, albumsService, uploadsValidator }
  ) => {
    const uploadAlbumartHandler = new UploadAlbumartHandler(
      storageService,
      albumsService,
      uploadsValidator
    );

    server.route(routes(uploadAlbumartHandler));
  },
};
