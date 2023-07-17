exports.up = (pgm) => {
  pgm.sql(
    "INSERT INTO albums(id, name, year) VALUES ('old_albums', 'Old Albums - Previously NULL', 2019)"
  );
  pgm.sql("UPDATE songs SET album_id = 'old_albums' WHERE album_id IS NULL");

  pgm.sql(
    'ALTER TABLE songs ADD CONSTRAINT album_id FOREIGN KEY (album_id) REFERENCES albums (id)'
  );
};

exports.down = (pgm) => {
  pgm.sql('ALTER TABLE songs DROP CONSTRAINT album_id');

  pgm.sql("UPDATE songs SET album_id = NULL WHERE album_id = 'old_albums'");
  pgm.sql("DELETE FROM albums WHERE id = 'old_albums'");
};
