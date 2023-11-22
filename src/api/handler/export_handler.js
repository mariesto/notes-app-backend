const autoBind = require('auto-bind');

class ExportHandler {
  constructor(producerService, playListService, validator) {
    this._producerService = producerService;
    this._playListService = playListService;
    this._validator = validator;
    autoBind(this);
  }

  async postExportHandler(request, h) {
    this._validator.validateExportPlaylistPayload(request.payload);

    const { playlistId } = request.params;
    const { id: userId } = request.auth.credentials;

    await this._playListService.verifyPlaylistAccess(playlistId, userId);

    const message = {
      playlistId,
      targetEmail: request.payload.targetEmail,
    };

    await this._producerService.sendMessage('export:playlists', JSON.stringify(message));

    const response = h.response({
      status: 'success',
      message: 'Your request was added to the queue',
    });
    response.code(201);
    return response;
  }
}

module.exports = ExportHandler;
