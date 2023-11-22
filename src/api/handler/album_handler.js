const autoBind = require('auto-bind');

class AlbumHandler {
  constructor(albumService, songService, storageService, validator) {
    this._albumService = albumService;
    this._songService = songService;
    this._storageService = storageService;
    this._validator = validator;

    autoBind(this);
  }

  async postAlbumHandler(request, h) {
    this._validator.validateAlbumPayload(request.payload);
    const {
      name,
      year,
    } = request.payload;
    const albumId = await this._albumService.createNewAlbum({
      name,
      year,
    });

    const response = h.response({
      status: 'success',
      message: 'Album created successfully',
      data: {
        albumId,
      },
    });

    response.code(201);
    return response;
  }

  async getAlbumByIdHandler(request) {
    const { id } = request.params;
    const album = await this._albumService.getAlbumById(id);
    album.songs = await this._songService.getSongsByAlbumId(id);
    return {
      status: 'success',
      data: {
        album,
      },
    };
  }

  async putAlbumByIdHandler(request) {
    this._validator.validateAlbumPayload(request.payload);
    const { id } = request.params;

    await this._albumService.editAlbumById(id, request.payload);
    return {
      status: 'success',
      message: 'Album updated successfully',
    };
  }

  async deleteAlbumByIdHandler(request) {
    const { id } = request.params;

    await this._albumService.deleteAlbumById(id);
    return {
      status: 'success',
      message: 'Album deleted successfully',
    };
  }

  async postAlbumLikesHandler(request, h) {
    const { id } = request.params;
    const { id: userId } = request.auth.credentials;

    await this._albumService.getAlbumById(id);

    await this._albumService.addAlbumLikes(userId, id);
    const response = h.response({
      status: 'success',
      message: 'Liked album added',
    });

    response.code(201);
    return response;
  }

  async getAlbumLikesHandler(request, h) {
    const { id: albumId } = request.params;
    const { count, isCache } = await this._albumService.getAlbumLikes(albumId);
    const likes = count;

    const response = h.response({
      status: 'success',
      data: {
        likes,
      },
    });

    response.code(200);
    if (isCache) {
      response.header('X-Data-Source', 'cache');
    }

    return response;
  }

  async deleteAlbumLikesHandler(request) {
    const { id } = request.params;
    const { id: userId } = request.auth.credentials;

    await this._albumService.deleteAlbumLikes(userId, id);
    return {
      status: 'success',
      message: 'Removed liked album',
    };
  }

  async postUploadCoverAlbumHandler(request, h) {
    const { cover: covers } = request.payload;
    const { id } = request.params;
    this._validator.validateImageHeaders(covers.hapi.headers);

    const filename = await this._storageService.writeFile(covers, covers.hapi);
    const coverUrl = `http://${process.env.HOST}:${process.env.PORT}/albums/${id}/covers/${filename}`;

    await this._albumService.addAlbumCover(id, coverUrl);

    const response = h.response({
      status: 'success',
      message: 'Cover image uploaded',
    });
    response.code(201);
    return response;
  }
}

module.exports = AlbumHandler;
