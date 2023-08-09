const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const AuthorizationError = require('../../exceptions/AuthorizationError');

class CollaborationsService {
  constructor(cacheService) {
    this._pool = new Pool();
    this._cacheService = cacheService;
  }

  async addCollaboration(playlistId, userId) {
    const id = `collab-${nanoid(16)}`;
    const addCollaborationQuery = {
      text: 'INSERT INTO collaborations VALUES($1, $2, $3) RETURNING id',
      values: [id, playlistId, userId],
    };
    const result = await this._pool.query(addCollaborationQuery);

    if (!result.rows[0].id) {
      throw new InvariantError('Gagal menambahkan kolaborasi');
    }
    await this._cacheService.del(`playlists:${userId}`);
    return result.rows[0].id;
  }

  async deleteCollaboration(playlistId, userId) {
    const deleteCollaborationQuery = {
      text: 'DELETE FROM collaborations WHERE playlist_id = $1 AND user_id = $2 RETURNING id',
      values: [playlistId, userId],
    };
    const result = await this._pool.query(deleteCollaborationQuery);

    if (!result.rowCount) {
      throw new InvariantError('Gagal menghapus kolaborasi');
    }
    await this._cacheService.del(`playlists:${userId}`);
  }

  async verifyCollaborator(playlistId, userId) {
    const checkCollaboratorQuery = {
      text: 'SELECT * FROM collaborations WHERE playlist_id = $1 AND user_id = $2',
      values: [playlistId, userId],
    };
    const result = await this._pool.query(checkCollaboratorQuery);

    if (!result.rowCount) {
      throw new AuthorizationError('Gagal meverifikasi kolaborasi');
    }
  }
}

module.exports = CollaborationsService;
