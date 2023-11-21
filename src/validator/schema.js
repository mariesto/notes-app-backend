const Joi = require('joi');

const AlbumPayloadSchema = Joi.object({
  name: Joi.string()
    .required(),
  year: Joi.number()
    .required(),
});

const SongPayloadSchema = Joi.object({
  title: Joi.string()
    .required(),
  year: Joi.number()
    .required(),
  genre: Joi.string()
    .required(),
  performer: Joi.string()
    .required(),
  duration: Joi.number(),
  albumId: Joi.string(),
});

const UserPayloadSchema = Joi.object({
  username: Joi.string()
    .required(),
  password: Joi.string()
    .required(),
  fullname: Joi.string()
    .required(),
});

const PostAuthenticationPayloadSchema = Joi.object({
  username: Joi.string()
    .required(),
  password: Joi.string()
    .required(),
});

const PutAuthenticationPayloadSchema = Joi.object({
  refreshToken: Joi.string()
    .required(),
});

const DeleteAuthenticationPayloadSchema = Joi.object({
  refreshToken: Joi.string()
    .required(),
});

const PostPlaylistPayloadSchema = Joi.object({
  name: Joi.string().required(),
});

const PostSongToPlaylistPayloadSchema = Joi.object({
  songId: Joi.string().required(),
});

const CollaborationPayloadSchema = Joi.object({
  playlistId: Joi.string().required(),
  userId: Joi.string().required(),
});

module.exports = { CollaborationPayloadSchema };

module.exports = {
  AlbumPayloadSchema,
  SongPayloadSchema,
  UserPayloadSchema,
  PostAuthenticationPayloadSchema,
  PutAuthenticationPayloadSchema,
  DeleteAuthenticationPayloadSchema,
  PostPlaylistPayloadSchema,
  PostSongToPlaylistPayloadSchema,
  CollaborationPayloadSchema,
};
