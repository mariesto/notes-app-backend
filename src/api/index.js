/* eslint-disable max-len */
const routes = require('./routes');
const AlbumHandler = require('./handler/album_handler');
const SongHandler = require('./handler/song_handler');
const UserHandler = require('./handler/user_handler');
const AuthenticationHandler = require('./handler/authentication_handler');
const PlayListHandler = require('./handler/playlist_handler');
const CollaborationHandler = require('./handler/collaboration_handler');

module.exports = {
  name: 'handler',
  version: '1.0.0',
  register: async (
    server,
    {
      albumService,
      songService,
      userService,
      authenticationService,
      playListService,
      collaborationService,
      tokenManager,
      validator,
    },
  ) => {
    const albumHandler = new AlbumHandler(albumService, validator);
    const songHandler = new SongHandler(songService, validator);
    const userHandler = new UserHandler(userService, validator);
    const authenticationHandler = new AuthenticationHandler(authenticationService, userService, tokenManager, validator);
    const playListHandler = new PlayListHandler(playListService, songService, validator);
    const collaborationHandler = new CollaborationHandler(collaborationService, playListService, userService, validator);

    server.route(routes([albumHandler, songHandler, userHandler, playListHandler, collaborationHandler, authenticationHandler]));
  },
};
