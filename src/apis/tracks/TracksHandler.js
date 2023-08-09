class TracksHandler {
  constructor(
    tracksService,
    playlistsService,
    songsService,
    playlistActivitiesService,
    tracksValidator
  ) {
    this._tracksService = tracksService;
    this._playlistsService = playlistsService;
    this._tracksValidator = tracksValidator;
    this._songsService = songsService;
    this._playlistActivitiesService = playlistActivitiesService;
  }

  async postTrackHandler(request, h) {
    this._tracksValidator.validateTrackPayload(request.payload);

    const { songId } = request.payload;
    await this._songsService.verifySongExistence(songId);

    const { id: playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;
    await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);

    await this._tracksService.addTrack(playlistId, songId);
    await this._playlistActivitiesService.writeAddTrackActivity({
      playlistId,
      songId,
      userId: credentialId,
    });

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

    await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);

    const playlistDetails = await this._playlistsService.getPlaylistDetailsById(
      playlistId
    );
    const { songs, fromCache } = await this._tracksService.getTracksInPlaylist(
      playlistId
    );

    const response = h.response({
      status: 'success',
      data: {
        playlist: {
          ...playlistDetails,
          songs,
        },
      },
    });

    if (fromCache) {
      return response.header('X-Data-Source', 'cache');
    }

    return response;
  }

  async deleteTrackHandler(request, h) {
    this._tracksValidator.validateTrackPayload(request.payload);

    const { id: playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);

    const { songId } = request.payload;

    await this._tracksService.deleteTrackById(playlistId, songId);
    await this._playlistActivitiesService.writeDeleteTrackActivity({
      playlistId,
      songId,
      userId: credentialId,
    });

    return h.response({
      status: 'success',
      message: 'Berhasil menghapus lagu dari playlist',
    });
  }
}

module.exports = TracksHandler;
