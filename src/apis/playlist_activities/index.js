const PlaylistActivitiesHandler = require('./PlaylistActivitiesHandler');
const routes = require('./routes');

module.exports = {
  name: 'activities',
  register: async (server, { playlistActivitiesService, playlistsService }) => {
    const playlistActivitiesHandler = new PlaylistActivitiesHandler(
      playlistActivitiesService,
      playlistsService
    );

    server.route(routes(playlistActivitiesHandler));
  },
};
