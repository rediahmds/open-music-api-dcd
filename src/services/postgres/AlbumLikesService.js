const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');

class AlbumLikesService {
  constructor() {
    this._pool = new Pool();
  }

  async addLikeAlbum(userId, albumId) {
    const id = `like-${nanoid(16)}`;
    const addLikeQuery = {
      text: 'INSERT INTO album_likes VALUES($1, $2, $3) RETURNING id;',
      values: [id, userId, albumId],
    };

    const result = await this._pool.query(addLikeQuery);

    if (!result.rows[0].id) {
      throw new InvariantError(
        'Gagal menyukai album. Terjadi masalah saat menambahkan data ke database'
      );
    }
  }

  async getAlbumLikesCount(albumId) {
    const albumLikesCounterQuery = {
      text: 'SELECT COUNT(*) AS likes FROM album_likes WHERE album_id = $1;',
      values: [albumId],
    };

    const result = await this._pool.query(albumLikesCounterQuery);

    const { likes } = result.rows[0];
    return parseInt(likes, 10);
  }

  async deleteLikeAlbum(userId, albumId) {
    const deleteLikeAlbumQuery = {
      text: 'DELETE FROM album_likes WHERE user_id = $1 AND album_id = $2;',
      values: [userId, albumId],
    };

    await this._pool.query(deleteLikeAlbumQuery);
  }

  async isAlbumLikedByUser(userId, albumId) {
    const checkLikeStatusQuery = {
      text: 'SELECT id FROM album_likes WHERE user_id = $1 AND album_id = $2;',
      values: [userId, albumId],
    };

    const result = await this._pool.query(checkLikeStatusQuery);

    if (result.rowCount) {
      throw new InvariantError('User sudah menyukai album ini.');
    }
  }
}

module.exports = AlbumLikesService;
