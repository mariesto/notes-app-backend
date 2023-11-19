require('../exceptions/InvariantError');
const {
  SongPayloadSchema,
  AlbumPayloadSchema,
} = require('./schema');
const ClientError = require('../exceptions/ClientError');

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
};

module.exports = PayloadValidator;
