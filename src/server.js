const Hapi = require('@hapi/hapi');
const ClientError = require('./exceptions/ClientError');

// apis
const albums = require('./apis/albums');
const songs = require('./apis/songs');

// services
const AlbumsService = require('./services/AlbumsService');
const SongsService = require('./services/SongsService');

// validators
const AlbumsValidator = require('./validators/albums');
const SongsValidator = require('./validators/songs');

const init = async () => {
  const albumsService = new AlbumsService();
  const songsService = new SongsService();
  
  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register([
    {
      plugin: albums,
      options: {
        service: albumsService,
        validator: AlbumsValidator,
      },
    },
    {
      plugin: songs,
      options: {
        service: songsService,
        validator: SongsValidator,
      },
    },
  ]);

  server.ext('onPreResponse', (request, h) => {
    const { response } = request;

    if (response instanceof Error) {
      if (response instanceof ClientError) {
        const newResponse = h
          .response({
            status: 'fail',
            message: response.message,
          })
          .code(response.statusCode);

        return newResponse;
      }

      if (!response.isServer) return h.continue;

      // Server ERROR
      const serverErrorResponse = h
        .response({
          status: 'error',
          message: 'terjadi kegagalan di server kami',
        })
        .code(500);
      return serverErrorResponse;
    }
    return h.continue;
  });

  await server.start();
  console.log(`Server is running on ${server.info.uri}`);
};

init();
