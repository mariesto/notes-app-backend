const autoBind = require('auto-bind');

class PlayListHandler {
  constructor(playlistService, songService, validator) {
    this._playlistService = playlistService;
    this._songService = songService;
    this._validator = validator;

    autoBind(this);
  }

  async postPlaylistHandler(request, h) {
    this._validator.validatePostPlaylistPayload(request.payload);
    const { name = 'untitled' } = request.payload;
    const { id: username } = request.auth.credentials;

    const playlistId = await this._playlistService.addPlaylist({
      name,
      username,
    });

    const response = h.response({
      status: 'success',
      message: 'Playlist created successfully',
      data: {
        playlistId,
      },
    });

    response.code(201);
    return response;
  }

  async getPlaylistsHandler(request) {
    const { id: username } = request.auth.credentials;
    const playlists = await this._playlistService.getPlaylists(username);

    return {
      status: 'success',
      data: {
        playlists,
      },
    };
  }

  async deletePlaylistByIdHandler(request) {
    const { id } = request.params;
    const { id: username } = request.auth.credentials;

    await this._playlistService.verifyPlaylistOwner(id, username);
    await this._playlistService.deletePlaylistById(id);

    return {
      status: 'success',
      message: 'Playlist deleted!',
    };
  }

  async postSongToPlaylistHandler(request, h) {
    this._validator.validatePostSongToPlaylistPayload(request.payload);
    const { id: playlistId } = request.params;
    const { songId } = request.payload;
    const { id: userId } = request.auth.credentials;

    await this._songService.getSongById(songId);
    await this._playlistService.verifyPlaylistAccess(playlistId, userId);
    await this._playlistService.addSongToPlaylist(playlistId, songId);
    await this._playlistService.addPlaylistActivities(playlistId, songId, userId, 'add');
    const response = h.response({
      status: 'success',
      message: 'Added song to the playlist',
    });
    response.code(201);
    return response;
  }

  async getSongsFromPlaylistHandler(request) {
    const { id: playlistId } = request.params;
    const { id: userId } = request.auth.credentials;

    await this._playlistService.verifyPlaylistAccess(playlistId, userId);
    const playlists = await this._playlistService.getPlaylistById(playlistId);
    playlists.songs = await this._songService.getSongsByPlaylist(playlistId);

    return {
      status: 'success',
      data: {
        playlist: playlists,
      },
    };
  }

  async deleteSongFromPlaylistHandler(request) {
    const { id: playlistId } = request.params;
    const { songId } = request.payload;
    const { id: userId } = request.auth.credentials;

    await this._playlistService.verifyPlaylistAccess(playlistId, userId);
    await this._playlistService.deleteSongFromPlaylist(playlistId, songId);
    await this._playlistService.addPlaylistActivities(playlistId, songId, userId, 'delete');

    return {
      status: 'success',
      message: 'Song removed from playlist',
    };
  }

  async getPlaylistActivitiesHandler(request) {
    const { id: playlistId } = request.params;
    const { id: userId } = request.auth.credentials;

    await this._playlistService.verifyPlaylistAccess(playlistId, userId);
    const activities = await this._playlistService.getPlaylistActivities(playlistId);

    return {
      status: 'success',
      data: {
        playlistId,
        activities,
      },
    };
  }
}

module.exports = PlayListHandler;
