const TracksHandler = require('./TracksHandler');
const routes = require('./routes');

module.exports = {
  name: 'playlistSongs',
  version: '1.0.0',
  register: async (
    server,
    {
      tracksService,
      playlistsService,
      songsService,
      playlistActivitiesService,
      tracksValidator,
    }
  ) => {
    const playlistSongsHandler = new TracksHandler(
      tracksService,
      playlistsService,
      songsService,
      playlistActivitiesService,
      tracksValidator
    );
    server.route(routes(playlistSongsHandler));
  },
};
