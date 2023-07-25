class CollaborationsHandler {
  constructor(
    collaborationsService,
    playlistsService,
    usersService,
    collaborationsValidator
  ) {
    this._collaborationsService = collaborationsService;
    this._playlistsService = playlistsService;
    this._usersService = usersService;
    this._collaborationsValidator = collaborationsValidator;
  }

  async postCollaborationHandler(request, h) {
    this._collaborationsValidator.validateCollaborationPayload(request.payload);

    const { id: credentialId } = request.auth.credentials;
    const { playlistId, userId: collaboratorId } = request.payload;

    await this._playlistsService.verifyPlaylistOwnership(
      playlistId,
      credentialId
    );
    await this._usersService.verifyUserExistenceById(collaboratorId);

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

    await this._playlistsService.verifyPlaylistOwnership(playlistId, credentialId);
    await this._collaborationsService.deleteCollaboration(playlistId, collaboratorId);

    return h.response({
      status: 'success',
      message: 'Kolaborasi berhasil dihapus',
    });
  }
}

module.exports = CollaborationsHandler;
