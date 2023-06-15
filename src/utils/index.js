/* eslint-disable camelcase */
const mapDBtoModel = ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  album_id,
}) => ({
  id, title, year, performer, genre, duration, albumId: album_id,
});

const getSongsByAlbumId = async (albumId, albumService) => {
  const getSongsByAlbumIdQuery = {
    text: 'SELECT * FROM songs WHERE album_id = $1',
    values: [albumId],
  };

  const result = await albumService.query(getSongsByAlbumIdQuery);

  const songs = result.rows.map(({ id, title, performer }) => ({
    id,
    title,
    performer,
  }));

  return songs;
};

const getSongsByQueryParam = ({ title, performer }) => {
  let query;

  if (title && performer) {
    query = {
      text: 'SELECT * FROM songs WHERE title ILIKE $1 AND performer ILIKE $2',
      values: [`%${title}%`, `%${performer}%`],
    };
  } else if (title) {
    query = {
      text: 'SELECT * FROM songs WHERE title ILIKE $1',
      values: [`%${title}%`],
    };
  } else if (performer) {
    query = {
      text: 'SELECT * FROM songs WHERE performer ILIKE $1',
      values: [`%${performer}%`],
    };
  } else {
    query = {
      text: 'SELECT * FROM songs',
    };
  }

  return query;
};

module.exports = { mapDBtoModel, getSongsByAlbumId, getSongsByQueryParam };
