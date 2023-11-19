const autoBind = require('auto-bind');

class AlbumHandler {
  constructor(albumService, validator) {
    this._albumService = albumService;
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
}

module.exports = AlbumHandler;
