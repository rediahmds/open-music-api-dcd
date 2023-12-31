const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthorizationError = require('../../exceptions/AuthorizationError');

class PlaylistsService {
  constructor(collaborationsService, cacheService) {
    this._pool = new Pool();
    this._collaborationsService = collaborationsService;
    this._cacheService = cacheService;
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
    await this._cacheService.del(`playlists:${owner}`);
    return result.rows[0].id;
  }

  async getPlaylists(owner) {
    try {
      const result = await this._cacheService.get(`playlists:${owner}`);
      const playlists = JSON.parse(result);
      return { playlists, fromCache: true };
    } catch (error) {
      const getAllOwnerPlaylistsQuery = {
        text: `SELECT playlists.id, playlists.name, users.username
        FROM playlists
        LEFT JOIN collaborations ON collaborations.playlist_id = playlists.id
        LEFT JOIN users ON users.id = playlists.owner
        WHERE playlists.owner = $1 OR collaborations.user_id = $1
        GROUP BY playlists.id, users.username;
        `,
        values: [owner],
      };

      const result = await this._pool.query(getAllOwnerPlaylistsQuery);
      const playlists = result.rows;
      await this._cacheService.set(
        `playlists:${owner}`,
        JSON.stringify(playlists),
        900
      );
      return { playlists, fromCache: false };
    }
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

    return result.rows[0];
  }

  async deletePlaylistById(playlistId) {
    const deleteOwnerPlaylistQuery = {
      text: 'DELETE FROM playlists WHERE id = $1 RETURNING owner',
      values: [playlistId],
    };

    const result = await this._pool.query(deleteOwnerPlaylistQuery);

    if (!result.rowCount) {
      throw new NotFoundError('Gagal menghapus. Playlist tak ditemukan');
    }

    const { owner } = result.rows[0];
    await this._cacheService.del(`playlists:${owner}`);
  }

  async verifyPlaylistExistence(playlistId) {
    const verifyPlaylistExistQuery = {
      text: 'SELECT * FROM playlists WHERE id = $1',
      values: [playlistId],
    };

    const result = await this._pool.query(verifyPlaylistExistQuery);

    if (!result.rowCount) {
      throw new NotFoundError('Playlist tidak ditemukan');
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

  async verifyPlaylistAccess(playlistId, userId) {
    try {
      await this.verifyPlaylistOwnership(playlistId, userId);
    } catch (error) {
      if (!(error instanceof NotFoundError)) {
        await this._collaborationsService.verifyCollaborator(
          playlistId,
          userId
        );
      }
    }
  }
}

module.exports = PlaylistsService;
