const autoBind = require('auto-bind');

class CollaborationHandler {
  constructor(collaborationService, playListService, userService, validator) {
    this._collaborationService = collaborationService;
    this._playListService = playListService;
    this._userService = userService;
    this._validator = validator;

    autoBind(this);
  }

  async postCollaborationHandler(request, h) {
    try {
      this._validator.validateCollaborationPayload(request.payload);
      const { id: username } = request.auth.credentials;
      const {
        playlistId,
        userId,
      } = request.payload;

      await this._userService.getUserById(userId);

      await this._playListService.verifyPlaylistOwner(playlistId, username);
      const collaborationId = await this._collaborationService.addCollaboration(playlistId, userId);

      const response = h.response({
        status: 'success',
        message: 'Collaborator added successfully',
        data: {
          collaborationId,
        },
      });
      response.code(201);
      return response;
    } catch (e) {
      console.log(`error while create collaboration : ${e}`);
      throw e;
    }
  }

  async deleteCollaborationHandler(request) {
    this._validator.validateCollaborationPayload(request.payload);
    const { id: username } = request.auth.credentials;
    const { playlistId, userId } = request.payload;

    await this._playListService.verifyPlaylistOwner(playlistId, username);
    await this._collaborationService.deleteCollaboration(playlistId, userId);

    return {
      status: 'success',
      message: 'Collaborator deleted',
    };
  }
}

module.exports = CollaborationHandler;
