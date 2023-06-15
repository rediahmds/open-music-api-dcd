const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../exceptions/InvariantError');
const NotFoundError = require('../exceptions/NotFoundError');
const { mapDBtoModel, getSongsByQueryParam } = require('../utils');

class SongsService {
  constructor() {
    this._pool = new Pool();
  }

  async addSong({
    title, year, performer, genre, duration, albumId,
  }) {
    const id = `song-${nanoid(16)}`;

    const addSongQuery = {
      text: 'INSERT INTO songs VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id',
      values: [id, title, year, performer, genre, duration, albumId],
    };

    const result = await this._pool.query(addSongQuery);
    if (!result.rows[0].id) {
      throw new InvariantError('Failed to add song. Fill the data correctly.');
    }
    return result.rows[0].id;
  }

  async getSongs(requestQuery) {
    const songsQuery = getSongsByQueryParam(requestQuery);
    const queryResult = await this._pool.query(songsQuery);

    const songsArr = queryResult.rows.map(({ id, title, performer }) => ({
      id,
      title,
      performer,
    }));

    return songsArr;
  }

  async getSongById(id) {
    const getSongByIDQuery = {
      text: 'SELECT * FROM songs WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(getSongByIDQuery);

    if (!result.rows.length) {
      throw new NotFoundError('Song not found.');
    }

    return result.rows.map(mapDBtoModel)[0];
  }

  async editSongById(id, {
    title, year, performer, genre, duration, albumId,
  }) {
    const editSongByIDQuery = {
      text: `
        UPDATE songs 
        SET title = $1, 
           year = $2, 
           performer = $3, 
           genre = $4, 
           duration = $5, 
           album_id = $6 
           WHERE id = $7 
        RETURNING id
    `,
      values: [title, year, performer, genre, duration, albumId, id],
    };

    const result = await this._pool.query(editSongByIDQuery);

    if (!result.rows.length) {
      throw new NotFoundError('Song could not be found. Failed to update it.');
    }
  }

  async deleteSongById(id) {
    const deleteSongbyIDQuery = {
      text: 'DELETE FROM songs WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(deleteSongbyIDQuery);

    if (!result.rows.length) {
      throw new NotFoundError('Album tak ditemukan. Gagal menghapus album.');
    }
  }
}

module.exports = SongsService;
