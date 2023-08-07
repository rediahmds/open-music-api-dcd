const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class AlbumsService {
  constructor() {
    this._pool = new Pool();
  }

  async addAlbum({ name, year }) {
    const id = `album-${nanoid(16)}`;

    const addAlbumQuery = {
      text: 'INSERT INTO albums VALUES($1, $2, $3) RETURNING id',
      values: [id, name, year],
    };

    const result = await this._pool.query(addAlbumQuery);

    if (!result.rows[0].id) {
      throw new InvariantError(
        'Album gagal ditambahkan. Mohon cek lagi data yang anda kirimkan.'
      );
    }
    return result.rows[0].id;
  }

  async addAlbumartURLById(url, id) {
    const addAlbumCoverQuery = {
      text: 'UPDATE albums SET cover = $1 WHERE id = $2;',
      values: [url, id],
    };

    await this._pool.query(addAlbumCoverQuery);
  }

  async getAlbums() {
    const result = await this._pool.query('SELECT * FROM albums');
    return result.rows;
  }

  async getAlbumById(id) {
    const getAlbumByIDQuery = {
      text: 'SELECT * FROM albums WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(getAlbumByIDQuery);

    if (!result.rowCount) {
      throw new NotFoundError('Album tidak ditemukan.');
    }

    const getSongsByAlbumIdQuery = {
      text: 'SELECT id, title, performer FROM songs WHERE album_id = $1',
      values: [id],
    };

    const songs = (await this._pool.query(getSongsByAlbumIdQuery)).rows;

    const { cover, ...album } = result.rows[0];
    return { album: { ...album, coverUrl: cover }, songs };
  }

  async editAlbumById(id, { name, year }) {
    const editAlbumByIDQuery = {
      text: 'UPDATE albums SET name = $1, year = $2 WHERE id = $3 RETURNING id',
      values: [name, year, id],
    };

    const result = await this._pool.query(editAlbumByIDQuery);

    if (!result.rowCount) {
      throw new NotFoundError('Album tak ditemukan. Gagal memperbarui album.');
    }
  }

  async deleteAlbumById(id) {
    const deleteAlbumByIDQuery = {
      text: 'DELETE FROM albums WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(deleteAlbumByIDQuery);

    if (!result.rowCount) {
      throw new NotFoundError('Album tak ditemukan. Gagal menghapus album.');
    }
  }
}

module.exports = AlbumsService;
