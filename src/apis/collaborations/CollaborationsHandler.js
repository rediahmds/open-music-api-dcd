class CollaborationsHandler {
  constructor(
    collaborationsService,
    playlistsService,
    collaborationsValidator
  ) {
    this._collaborationsService = collaborationsService;
    this._playlistsService = playlistsService;
    this._collaborationsValidator = collaborationsValidator;
  }

  async postCollaborationHandler(request, h) {
    this._collaborationsValidator.validateCollaborationPayload(request.payload);

    const { id: credentialId } = request.auth.credentials;
    const { playlistId, userId: collaboratorId } = request.payload;

    this._playlistsService.verifyPlaylistOwnership(playlistId, credentialId);
    const collaborationId = await this._collaborationsService.addCollaboration(
      playlistId,
      collaboratorId
    );

    return h
      .response({
        status: 'success',
        message: 'Kolaborasi berhasil ditambahkan',
        data: {
          collaborationId,
        },
      })
      .code(201);
  }

  async deleteCollaborationHandler(request, h) {
    this._collaborationsValidator.validateCollaborationPayload(request.payload);

    const { id: credentialId } = request.auth.credentials;
    const { playlistId, userId: collaboratorId } = request.payload;

    this._playlistsService.verifyPlaylistOwnership(playlistId, credentialId);
    this._collaborationsService.deleteCollaboration(playlistId, collaboratorId);

    return h.response({
      status: 'success',
      message: 'Kolaborasi berhasil dihapus',
    });
  }
}

module.exports = CollaborationsHandler;
