class PlaylistActivitiesHandler {
  constructor(playlistActivitiesService, playlistsService) {
    this._playlistActivitiesService = playlistActivitiesService;
    this._playlistsService = playlistsService;
  }

  async getActivitiesHandler(request, h) {
    const { id: playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._playlistsService.verifyPlaylistExistence(playlistId);
    await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);

    const playlistActivities = await this._playlistActivitiesService
      .getPlaylistActivitiesByPlaylistId(playlistId);

    console.log(playlistActivities);

    return h.response({
      status: 'success',
      message: 'Berhasil mendapatkan daftar aktivitas playlist',
      data: {
        playlistActivities,
      },
    });
  }
}

module.exports = PlaylistActivitiesHandler;
