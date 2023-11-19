const routes = require('./routes');
const AlbumHandler = require('./album_handler');
const SongHandler = require('./song_handler');

module.exports = {
  name: 'handler',
  version: '1.0.0',
  register: async (server, { albumService, songService, validator }) => {
    const albumHandler = new AlbumHandler(albumService, validator);
    const songHandler = new SongHandler(songService, validator);

    server.route(routes([albumHandler, songHandler]));
  },
};
