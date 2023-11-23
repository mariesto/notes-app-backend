/* eslint-disable max-len */
const path = require('path');

const routes = ([
  albumHandler,
  songHandler,
  userHandler,
  playListHandler,
  collaborationHandler,
  exportHandler,
  authenticationHandler,
]) => [
  // albums
  {
    method: 'POST',
    path: '/albums',
    handler: (request, h) => albumHandler.postAlbumHandler(request, h),
  },
  {
    method: 'GET',
    path: '/albums/{id}',
    handler: (request) => albumHandler.getAlbumByIdHandler(request),
  },
  {
    method: 'PUT',
    path: '/albums/{id}',
    handler: (request) => albumHandler.putAlbumByIdHandler(request),
  },
  {
    method: 'DELETE',
    path: '/albums/{id}',
    handler: (request) => albumHandler.deleteAlbumByIdHandler(request),
  },
  {
    method: 'POST',
    path: '/albums/{id}/likes',
    handler: (request, h) => albumHandler.postAlbumLikesHandler(request, h),
    options: {
      auth: 'open-music-app_jwt',
    },
  },
  {
    method: 'GET',
    path: '/albums/{id}/likes',
    handler: (request, h) => albumHandler.getAlbumLikesHandler(request, h),
  },
  {
    method: 'DELETE',
    path: '/albums/{id}/likes',
    handler: (request) => albumHandler.deleteAlbumLikesHandler(request),
    options: {
      auth: 'open-music-app_jwt',
    },
  },
  {
    method: 'POST',
    path: '/albums/{id}/covers',
    handler: (request, h) => albumHandler.postUploadCoverAlbumHandler(request, h),
    options: {
      payload: {
        allow: 'multipart/form-data',
        multipart: true,
        output: 'stream',
        maxBytes: 512000,
      },
    },
  },
  {
    method: 'GET',
    path: '/albums/{id}/covers/{param*}',
    handler: {
      directory: {
        path: path.resolve(__dirname, 'assets'),
      },
    },
  },

  // songs
  {
    method: 'POST',
    path: '/songs',
    handler: (request, h) => songHandler.postSongHandler(request, h),
  },
  {
    method: 'GET',
    path: '/songs',
    handler: (request) => songHandler.getSongsHandler(request),
  },
  {
    method: 'GET',
    path: '/songs/{id}',
    handler: (request) => songHandler.getSongByIdHandler(request),
  },
  {
    method: 'PUT',
    path: '/songs/{id}',
    handler: (request) => songHandler.putSongByIdHandler(request),
  },
  {
    method: 'DELETE',
    path: '/songs/{id}',
    handler: (request) => songHandler.deleteSongByIdHandler(request),
  },

  // users
  {
    method: 'POST',
    path: '/users',
    handler: (request, h) => userHandler.postUserHandler(request, h),
  },
  {
    method: 'GET',
    path: '/users/{id}',
    handler: (request) => userHandler.getUserByIdHandler(request),
  },
  {
    method: 'POST',
    path: '/authentications',
    handler: (request, h) => authenticationHandler.postAuthenticationHandler(request, h),
  },
  {
    method: 'PUT',
    path: '/authentications',
    handler: authenticationHandler.putAuthenticationHandler,
  },
  {
    method: 'DELETE',
    path: '/authentications',
    handler: authenticationHandler.deleteAuthenticationHandler,
  },

  // playlist
  {
    method: 'POST',
    path: '/playlists',
    handler: (request, h) => playListHandler.postPlaylistHandler(request, h),
    options: {
      auth: 'open-music-app_jwt',
    },
  },
  {
    method: 'GET',
    path: '/playlists',
    handler: (request) => playListHandler.getPlaylistsHandler(request),
    options: {
      auth: 'open-music-app_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/playlists/{id}',
    handler: (request) => playListHandler.deletePlaylistByIdHandler(request),
    options: {
      auth: 'open-music-app_jwt',
    },
  },
  {
    method: 'POST',
    path: '/playlists/{id}/songs',
    handler: (request, h) => playListHandler.postSongToPlaylistHandler(request, h),
    options: {
      auth: 'open-music-app_jwt',
    },
  },
  {
    method: 'GET',
    path: '/playlists/{id}/songs',
    handler: (request) => playListHandler.getSongsFromPlaylistHandler(request),
    options: {
      auth: 'open-music-app_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/playlists/{id}/songs',
    handler: (request) => playListHandler.deleteSongFromPlaylistHandler(request),
    options: {
      auth: 'open-music-app_jwt',
    },
  },
  {
    method: 'GET',
    path: '/playlists/{id}/activities',
    handler: (request) => playListHandler.getPlaylistActivitiesHandler(request),
    options: {
      auth: 'open-music-app_jwt',
    },
  },

  // collaborator
  {
    method: 'POST',
    path: '/collaborations',
    handler: (request, h) => collaborationHandler.postCollaborationHandler(request, h),
    options: {
      auth: 'open-music-app_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/collaborations',
    handler: (request) => collaborationHandler.deleteCollaborationHandler(request),
    options: {
      auth: 'open-music-app_jwt',
    },
  },

  // exports
  {
    method: 'POST',
    path: '/export/playlists/{playlistId}',
    handler: (request, h) => exportHandler.postExportHandler(request, h),
    options: {
      auth: 'open-music-app_jwt',
    },
  },
];

module.exports = routes;
