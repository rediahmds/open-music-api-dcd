// HANDLE VALIDATION AND REQ-RES cycle
class AlbumsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
  }

  async postAlbumHandler(request, h) {
    this._validator.validateAlbumsPayload(request.payload);

    const id = await this._service.addAlbum(request.payload);

    const response = h
      .response({
        status: 'success',
        message: 'Album berhasil ditambahkan.',
        data: {
          albumId: id,
        },
      })
      .code(201);

    return response;
  }

  async getAlbumsHandler() {
    const albums = await this._service.getAlbums();

    return {
      status: 'success',
      data: {
        albums,
      },
    };
  }

  async getAlbumByIdHandler(request, h) {
    const { id } = request.params;
    const { album, songs } = await this._service.getAlbumById(id);

    return h.response({
      status: 'success',
      data: {
        album: { ...album, songs },
      },
    });
  }

  async putAlbumByIdHandler(request, h) {
    this._validator.validateAlbumsPayload(request.payload);
    const { id } = request.params;

    await this._service.editAlbumById(id, request.payload);

    return h.response({
      status: 'success',
      message: 'Album berhasil diperbaharui.',
    });
  }

  async deleteAlbumByIdHandler(request, h) {
    const { id } = request.params;

    await this._service.deleteAlbumById(id);

    return h.response({
      status: 'success',
      message: 'Album berhasil dihapus',
    });
  }
}

module.exports = AlbumsHandler;
