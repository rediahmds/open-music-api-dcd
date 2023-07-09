const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../exceptions/InvariantError');
const NotFoundError = require('../exceptions/NotFoundError');
const AuthorizationError = require('../exceptions/AuthorizationError');

class PlaylistsService {
  constructor() {
    this._pool = new Pool();
  }

  async addPlaylist(playlistName, owner) {
    const id = `playlist-${nanoid(16)}`;
    const addPlaylistQuery = {
      text: 'INSERT INTO playlists VALUES($1, $2, $3) RETURNING id',
      values: [id, playlistName, owner],
    };

    const result = await this._pool.query(addPlaylistQuery);

    if (!result.rows[0].id) {
      throw new InvariantError('Playlist gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getPlaylists(owner) {
    const getAllOwnerPlaylistsQuery = {
      text: 'SELECT * FROM playlists WHERE owner = $1',
      values: [owner],
    };

    const result = await this._pool.query(getAllOwnerPlaylistsQuery);

    return result.rows;
  }

  async getPlaylistDetailsById(playlistId) {
    const getSpecificPlaylistQuery = {
      text: `SELECT playlists.id, playlists.name, users.username
      FROM playlists
      INNER JOIN users ON playlists.owner = users.id
      WHERE playlists.id = $1`,
      values: [playlistId],
    };

    const result = await this._pool.query(getSpecificPlaylistQuery);

    if (!result.rowCount) {
      throw new NotFoundError('Playlist tak ditemukan');
    }

    return result.rows;
  }

  async deletePlaylistById(playlistId) {
    const deleteOwnerPlaylistQuery = {
      text: 'DELETE FROM playlists WHERE id = $1 RETURNING id',
      values: [playlistId],
    };

    const result = await this._pool.query(deleteOwnerPlaylistQuery);

    if (!result.rowCount) {
      throw new NotFoundError('Gagal menghapus. Playlist tak ditemukan');
    }
  }

  async verifyPlaylistOwnership(playlistId, owner) {
    const getPlaylistAndOwnerQuery = {
      text: 'SELECT owner FROM playlists WHERE id = $1',
      values: [playlistId],
    };

    const result = await this._pool.query(getPlaylistAndOwnerQuery);

    if (!result.rowCount) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }

    const playlist = result.rows[0];

    if (playlist.owner !== owner) {
      throw new AuthorizationError('Anda tidak memiliki akses ke resource ini');
    }
  }
}

module.exports = PlaylistsService;
