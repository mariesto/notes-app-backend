/* eslint-disable camelcase */

const mapDBToModelAlbum = ({
  id,
  name,
  year,
  coverUrl,
}) => ({
  id,
  name,
  year,
  coverUrl,
});

const mapDBToModelSongs = ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  album_id,
}) => ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  albumId: album_id,
});

module.exports = { mapDBToModelAlbum, mapDBToModelSongs };
