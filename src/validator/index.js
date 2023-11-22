require('../exceptions/InvariantError');
const {
  SongPayloadSchema,
  AlbumPayloadSchema,
  UserPayloadSchema,
  PostAuthenticationPayloadSchema,
  PutAuthenticationPayloadSchema,
  DeleteAuthenticationPayloadSchema,
  PostPlaylistPayloadSchema,
  PostSongToPlaylistPayloadSchema,
  CollaborationPayloadSchema,
  ImageHeadersSchema,
  ExportPlaylistPayloadSchema,
} = require('./schema');
const ClientError = require('../exceptions/ClientError');
const InvariantError = require('../exceptions/InvariantError');

const PayloadValidator = {

  validateSongPayload: (payload) => {
    const validationResult = SongPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new ClientError(validationResult.error.message);
    }
  },

  validateAlbumPayload: (payload) => {
    const validationResult = AlbumPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new ClientError(validationResult.error.message);
    }
  },

  validateUserPayload: (payload) => {
    const validationResult = UserPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new ClientError(validationResult.error.message);
    }
  },

  validatePostAuthenticationPayload: (payload) => {
    const validationResult = PostAuthenticationPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },

  validatePutAuthenticationPayload: (payload) => {
    const validationResult = PutAuthenticationPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },

  validateDeleteAuthenticationPayload: (payload) => {
    const validationResult = DeleteAuthenticationPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new ClientError(validationResult.error.message);
    }
  },

  validatePostPlaylistPayload: (payload) => {
    const validationResult = PostPlaylistPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },

  validatePostSongToPlaylistPayload: (payload) => {
    const validationResult = PostSongToPlaylistPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },

  validateCollaborationPayload: (payload) => {
    const validationResult = CollaborationPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },

  validateExportPlaylistPayload: (payload) => {
    const validationResult = ExportPlaylistPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },

  validateImageHeaders: (headers) => {
    const validationResult = ImageHeadersSchema.validate(headers);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = PayloadValidator;
