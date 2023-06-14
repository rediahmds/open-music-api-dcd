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

module.exports = { mapDBtoModel, getSongsByAlbumId };
