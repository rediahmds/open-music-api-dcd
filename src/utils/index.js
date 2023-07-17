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

const mapPlaylistProps = ({ id, name, owner: username }) => ({
  id,
  name,
  username,
});

module.exports = { mapDBtoModel, mapPlaylistProps };
