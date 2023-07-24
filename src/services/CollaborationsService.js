const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../exceptions/InvariantError');

class CollaborationsService {
  constructor() {
    this._pool = new Pool();
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
  }

  async verifyCollaborator(playlistId, userId) {
    const checkCollaboratorQuery = {
      text: 'SELECT * FROM collaborations WHERE playlist_id = $1 AND user_id = $2',
      values: [playlistId, userId],
    };
    const result = await this._pool.query(checkCollaboratorQuery);

    if (!result.rowCount) {
      throw new InvariantError('Gagal meverifikasi kolaborasi');
    }
  }
}

module.exports = CollaborationsService;