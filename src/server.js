require('dotenv').config();
const Hapi = require('@hapi/hapi');
const handler = require('./api/handler');
const PayloadValidator = require('./validator');
const ClientError = require('./exceptions/ClientError');
const AlbumService = require('./services/postgres/album_service');
const SongService = require('./services/postgres/song_service');

const init = async () => {
  const albumService = new AlbumService();
  const songService = new SongService();

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
    plugin: handler,
    options: {
      albumService,
      songService,
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
