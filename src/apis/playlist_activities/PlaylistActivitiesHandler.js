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

    const { activities, fromCache } = await this._playlistActivitiesService
      .getPlaylistActivitiesByPlaylistId(playlistId);

    const response = h.response({
      status: 'success',
      message: 'Berhasil mendapatkan daftar aktivitas playlist',
      data: {
        playlistId,
        activities,
      },
    });

    if (fromCache) {
      return response.header('X-Data-Source', 'cache');
    }

    return response;
  }
}

module.exports = PlaylistActivitiesHandler;
