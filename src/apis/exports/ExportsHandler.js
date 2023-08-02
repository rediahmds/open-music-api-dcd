class ExportsHandler {
  constructor(producerService, playlistsService, exportsValidator) {
    this._service = producerService;
    this._playlistsService = playlistsService;
    this._validator = exportsValidator;
  }

  async postExportPlaylistHandler(request, h) {
    this._validator.validateExportPlaylistPayload(request.payload);

    const { id: userId } = request.auth.credentials.id;
    const { targetEmail } = request.payload;
    const message = {
      userId,
      targetEmail,
    };

    const { id: playlistId } = request.params;
    await this._playlistsService.verifyPlaylistExistence(playlistId);
    await this._playlistsService.verifyPlaylistOwnership(playlistId, userId);

    await this._service.sendMessage('export:playlist', JSON.stringify(message));

    return h
      .response({
        status: 'success',
        message: 'Permintaan Anda sedang kami proses',
      })
      .code(201);
  }
}

module.exports = ExportsHandler;
