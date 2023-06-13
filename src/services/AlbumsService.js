/* eslint-disable import/no-extraneous-dependencies */
const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../exceptions/InvariantError');
const NotFoundError = require('../exceptions/NotFoundError');

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

    if (!result.rows.length) {
      throw new NotFoundError('Album tidak ditemukan.');
    }

    return result.rows[0];
  }

  async editAlbumById(id, { name, year }) {
    const editAlbumByIDQuery = {
      text: 'UPDATE albums SET name = $1, year = $2 WHERE id = $3 RETURNING id',
      values: [name, year, id],
    };

    const result = await this._pool.query(editAlbumByIDQuery);

    if (!result.rows.length) {
      throw new NotFoundError('Album tak ditemukan. Gagal memperbarui album.');
    }
  }

  async deleteAlbumById(id) {
    const deleteAlbumByIDQuery = {
      text: 'DELETE FROM albums WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(deleteAlbumByIDQuery);

    if (!result.rows.length) {
      throw new NotFoundError('Album tak ditemukan. Gagal menghapus album.');
    }
  }
}

module.exports = AlbumsService;
