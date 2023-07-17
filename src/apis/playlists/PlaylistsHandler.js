class PlaylistsHandler {
  constructor(playlistsService, playlistValidator) {
    this._service = playlistsService;
    this._validator = playlistValidator;
  }

  async postPlaylistHandler(request, h) {
    this._validator.validatePlaylistPayload(request.payload);

    const { name } = request.payload;
    const { id: credentialId } = request.auth.credentials;
    const playlistId = await this._service.addPlaylist(name, credentialId);

    return h
      .response({
        status: 'success',
        message: 'Playlist berhasil ditambahkan',
        data: {
          playlistId,
        },
      })
      .code(201);
  }

  async getPlaylistsHandler(request, h) {
    const { id: credentialId } = request.auth.credentials;
    const playlists = await this._service.getPlaylists(credentialId);

    return h.response({
      status: 'success',
      data: {
        playlists,
      },
    });
  }

  async deletePlaylistHandler(request, h) {
    const { id: playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._service.verifyPlaylistOwnership(playlistId, credentialId);
    await this._service.deletePlaylistById(playlistId);

    return h.response({
      status: 'success',
      message: 'Playlist berhasil dihapus',
    });
  }
}

module.exports = PlaylistsHandler;
