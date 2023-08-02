class ExportsHandler {
  constructor(producerService, exportsValidator) {
    this._service = producerService;
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
