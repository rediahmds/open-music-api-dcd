const { host, port } = require('../../utils/config').app;

class UploadAlbumartHandler {
  constructor(storageService, albumsService, uploadsValidator) {
    this._storageService = storageService;
    this._albumsService = albumsService;
    this._uploadsValidator = uploadsValidator;
  }

  async postUploadImageHandler(request, h) {
    const { cover } = request.payload;
    this._uploadsValidator.validateImageHeaders(cover.hapi.headers);

    const fileName = await this._storageService.writeFile(cover, cover.hapi);
    const albumartURL = `http://${host}:${port}/${this._storageService.getDirectory()}/${fileName}`;
    const { id: albumId } = request.params;
    await this._albumsService.addAlbumartURLById(albumartURL, albumId);

    return h
      .response({
        status: 'success',
        message: 'Sampul album berhasil diunggah',
      })
      .code(201);
  }
}

module.exports = UploadAlbumartHandler;
