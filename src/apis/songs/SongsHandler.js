class SongsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
  }

  async postSongHandler(request, h) {
    this._validator.validateSongsPayload(request.payload);

    const id = await this._service.addSong(request.payload);

    const response = h
      .response({
        status: 'success',
        message: 'Song added successfuly.',
        data: {
          songId: id,
        },
      })
      .code(201);

    return response;
  }

  async getSongsHandler(request, h) {
    const songs = await this._service.getSongs(request.query);

    return h.response({
      status: 'success',
      data: {
        songs,
      },
    });
  }

  async getSongByIdHandler(request, h) {
    const { id } = request.params;

    const song = await this._service.getSongById(id);
    return h.response({
      status: 'success',
      data: {
        song,
      },
    });
  }

  async putSongByIdHandler(request, h) {
    this._validator.validateSongsPayload(request.payload);

    const { id } = request.params;

    await this._service.editSongById(id, request.payload);

    return h.response({
      status: 'success',
      message: 'Song updated successfully.',
    });
  }

  async deleteSongByIdHandler(request, h) {
    const { id } = request.params;

    await this._service.deleteSongById(id);

    return h.response({
      status: 'success',
      message: 'Song deleted successfully.',
    });
  }
}

module.exports = SongsHandler;
