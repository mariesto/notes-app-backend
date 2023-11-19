/* eslint-disable camelcase */

const mapDBToModelAlbum = ({
  id,
  name,
  year,
}) => ({
  id,
  name,
  year,
});

const mapDBToModelSongs = ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
}) => ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
});

module.exports = { mapDBToModelAlbum, mapDBToModelSongs };
