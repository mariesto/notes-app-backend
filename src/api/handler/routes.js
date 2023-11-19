const routes = ([albumHandler, songHandler]) => [
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
];

module.exports = routes;
