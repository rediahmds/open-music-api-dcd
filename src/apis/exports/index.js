const ExportsHandler = require('./ExportsHandler');
const routes = require('./routes');

module.exports = {
  name: 'exports',
  version: '1.0.0',
  register: async (server, { producerService, exportsValidator }) => {
    const exportsHandler = new ExportsHandler(
      producerService,
      exportsValidator
    );

    server.route(routes(exportsHandler));
  },
};
