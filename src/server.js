require('dotenv').config();
const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');
const handler = require('./api');
const PayloadValidator = require('./validator');
const ClientError = require('./exceptions/ClientError');
const AlbumService = require('./services/album_service');
const SongService = require('./services/song_service');
const UserService = require('./services/user_service');
const AuthenticationService = require('./services/authentication_service');
const TokenManager = require('./tokenize/token_manager');
const PlayListService = require('./services/playlist_service');
const CollaborationService = require('./services/collaboration_service');

function registerServices() {
  const albumService = new AlbumService();
  const songService = new SongService();
  const userService = new UserService();
  const authenticationService = new AuthenticationService();
  const collaborationService = new CollaborationService();
  const playListService = new PlayListService(collaborationService);
  return {
    albumService,
    songService,
    userService,
    playListService,
    collaborationService,
    authenticationService,
  };
}

const init = async () => {
  const {
    albumService,
    songService,
    userService,
    playListService,
    collaborationService,
    authenticationService,
  } = registerServices();

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
    debug: { request: ['error'] },
  });

  await server.register({
    plugin: Jwt,
  });

  server.auth.strategy('open-music-app_jwt', 'jwt', {
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

  await server.register({
    plugin: handler,
    options: {
      albumService,
      songService,
      userService,
      authenticationService,
      playListService,
      collaborationService,
      tokenManager: TokenManager,
      validator: PayloadValidator,
    },
  });

  server.ext('onPreResponse', (request, h) => {
    const { response } = request;

    if (response instanceof Error) {
      if (response instanceof ClientError) {
        const newResponse = h.response({
          status: 'fail',
          message: response.message,
        });
        newResponse.code(response.statusCode);
        if (response.statusCode === 404) return newResponse;
        return newResponse;
      }

      if (!response.isServer) {
        return h.continue;
      }

      const newResponse = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      newResponse.code(500);
      return newResponse;
    }

    return h.continue;
  });

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
