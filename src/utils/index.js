const mapDBtoModel = ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  album_id: albumId,
}) => ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  albumId,
});

module.exports = { mapDBtoModel };
