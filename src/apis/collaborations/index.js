const CollaborationsHandler = require('./CollaborationsHandler');
const routes = require('./routes');

module.exports = {
  name: 'collaborations',
  version: '1.0.0',
  register: async (
    server,
    { collaborationsService, playlistsService, collaborationsValidator }
  ) => {
    const collaborationsHandler = new CollaborationsHandler(
      collaborationsService,
      playlistsService,
      collaborationsValidator
    );

    server.route(routes(collaborationsHandler));
  },
};
