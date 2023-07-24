const Hapi = require('@hapi/hapi');

// jwt utilities
const Jwt = require('@hapi/jwt');
const TokenManager = require('./tokenize/TokenManager');

// apis
const albums = require('./apis/albums');
const songs = require('./apis/songs');
const users = require('./apis/users');
const authentications = require('./apis/authentications');
const playlists = require('./apis/playlists');
const tracks = require('./apis/tracks');
const collaborations = require('./apis/collaborations');

// exceptions
const ClientError = require('./exceptions/ClientError');

// services
const AlbumsService = require('./services/AlbumsService');
const SongsService = require('./services/SongsService');
const UsersService = require('./services/UsersService');
const AuthenticationsService = require('./services/AuthenticationsService');
const PlaylistsService = require('./services/PlaylistsService');
const TracksService = require('./services/TracksService');
const CollaborationsService = require('./services/CollaborationsService');

// validators
const AlbumsValidator = require('./validators/albums');
const SongsValidator = require('./validators/songs');
const UsersValidator = require('./validators/users');
const AuthenticationsValidator = require('./validators/authentications');
const PlaylistsValidator = require('./validators/playlists');
const TracksValidator = require('./validators/tracks');
const CollaborationsValidator = require('./validators/collaborations');

const init = async () => {
  const albumsService = new AlbumsService();
  const songsService = new SongsService();
  const usersService = new UsersService();
  const authenticationsService = new AuthenticationsService();
  const playlistsService = new PlaylistsService(); // TODO: add collab service as constructor arg
  const tracksService = new TracksService(playlistsService);
  const collaborationsService = new CollaborationsService();

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  // register external plugins
  await server.register([
    {
      plugin: Jwt,
    },
  ]);

  server.auth.strategy('openmusic_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
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
    {
      plugin: users,
      options: {
        service: usersService,
        validator: UsersValidator,
      },
    },
    {
      plugin: authentications,
      options: {
        authenticationsService,
        usersService,
        tokenManager: TokenManager,
        authenticationsValidator: AuthenticationsValidator,
      },
    },
    {
      plugin: playlists,
      options: {
        service: playlistsService,
        validator: PlaylistsValidator,
      },
    },
    {
      plugin: tracks,
      options: {
        tracksService,
        playlistsService,
        songsService,
        tracksValidator: TracksValidator,
      },
    },
    {
      plugin: collaborations,
      options: {
        collaborationsService,
        playlistsService,
        CollaborationsValidator,
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
