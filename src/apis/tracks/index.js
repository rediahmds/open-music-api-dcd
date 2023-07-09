const TracksHandler = require('./TracksHandler');
const routes = require('./routes');

module.exports = {
  name: 'playlistSongs',
  version: '1.0.0',
  register: async (
    server,
    { tracksService, playlistsService, tracksValidator }
  ) => {
    const playlistSongsHandler = new TracksHandler(
      tracksService,
      playlistsService,
      tracksValidator
    );
    server.route(routes(playlistSongsHandler));
  },
};
