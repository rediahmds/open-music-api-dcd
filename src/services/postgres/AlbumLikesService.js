const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');

class AlbumLikesService {
  constructor(cacheService) {
    this._pool = new Pool();
    this._cacheService = cacheService;
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

    await this._cacheService.del(`likes:${albumId}`);
  }

  async getAlbumLikesCount(albumId) {
    try {
      const result = await this._cacheService.get(`likes:${albumId}`);
      return { likes: JSON.parse(result), fromCache: true };
    } catch (error) {
      const albumLikesCounterQuery = {
        text: 'SELECT COUNT(*) AS likes FROM album_likes WHERE album_id = $1;',
        values: [albumId],
      };

      const result = await this._pool.query(albumLikesCounterQuery);

      const { likes } = result.rows[0];
      await this._cacheService.set(`likes:${albumId}`, likes);
      return { likes: parseInt(likes, 10), fromCache: false };
    }
  }

  async deleteLikeAlbum(userId, albumId) {
    const deleteLikeAlbumQuery = {
      text: 'DELETE FROM album_likes WHERE user_id = $1 AND album_id = $2;',
      values: [userId, albumId],
    };

    await this._pool.query(deleteLikeAlbumQuery);
    await this._cacheService.del(`likes:${albumId}`);
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
