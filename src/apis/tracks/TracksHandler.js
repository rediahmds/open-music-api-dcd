class TracksHandler {
  constructor(tracksService, playlistsService, songsService, tracksValidator) {
    this._tracksService = tracksService;
    this._playlistsService = playlistsService;
    this._tracksValidator = tracksValidator;
    this._songsService = songsService;
  }

  async postTrackHandler(request, h) {
    this._tracksValidator.validateTrackPayload(request.payload);

    const { songId } = request.payload;
    await this._songsService.verifySongExistence(songId);

    const { id: playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;
    await this._tracksService.verifyPlaylistAccess(playlistId, credentialId);

    await this._tracksService.addTrack(playlistId, songId);

    return h
      .response({
        status: 'success',
        message: 'Lagu berhasil ditambahkan ke playlist',
      })
      .code(201);
  }

  async getTracksHandler(request, h) {
    const { id: playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._tracksService.verifyPlaylistAccess(playlistId, credentialId);

    const tracksInPlaylist = await this._tracksService.getTracksInPlaylist(
      playlistId
    );
    const playlistDetails = await this._playlistsService.getPlaylistDetailsById(
      playlistId
    );

    return h.response({
      status: 'success',
      data: {
        playlist: {
          ...playlistDetails,
          songs: tracksInPlaylist,
        },
      },
    });
  }

  async deleteTrackHandler(request, h) {
    this._tracksValidator.validateTrackPayload(request.payload);

    const { id: playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._tracksService.verifyPlaylistAccess(playlistId, credentialId);

    const { id: songId } = request.payload;

    await this._tracksService.deleteTrackById(playlistId, songId);

    return h.response({
      status: 'success',
      message: 'Berhasil menghapus lagu dari playlist',
    });
  }
}

module.exports = TracksHandler;
