const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class PlaylistActivitiesService {
  constructor(cacheService) {
    this._pool = new Pool();
    this._cacheService = cacheService;
  }

  async writeAddTrackActivity({ playlistId, songId, userId }) {
    const id = `activity-${nanoid(16)}`;
    const action = 'add';
    const timestamp = new Date().toISOString();

    const addActivityQuery = {
      text: 'INSERT INTO playlist_song_activities VALUES($1, $2, $3, $4, $5, $6) RETURNING id',
      values: [id, playlistId, songId, userId, action, timestamp],
    };

    const result = await this._pool.query(addActivityQuery);

    if (!result.rows[0].id) {
      throw new InvariantError('Gagal mencatat aktivitas');
    }

    this._cacheService.del(`activities:${playlistId}`);
  }

  async writeDeleteTrackActivity({ playlistId, songId, userId }) {
    const id = `activity-${nanoid(16)}`;
    const action = 'delete';
    const timestamp = new Date().toISOString();

    const addActivityQuery = {
      text: 'INSERT INTO playlist_song_activities VALUES($1, $2, $3, $4, $5, $6) RETURNING id',
      values: [id, playlistId, songId, userId, action, timestamp],
    };

    const result = await this._pool.query(addActivityQuery);

    if (!result.rows[0].id) {
      throw new InvariantError('Gagal mencatat aktivitas');
    }

    this._cacheService.del(`activities:${playlistId}`);
  }

  async getPlaylistActivitiesByPlaylistId(playlistId) {
    try {
      const result = await this._cacheService.get(`activities:${playlistId}`);
      return { activities: JSON.parse(result), fromCache: true };
    } catch (error) {
      const getPlaylistActivitiesQuery = {
        text: `
        SELECT u.username, s.title, a.action, a.time
        FROM playlist_song_activities a
        INNER JOIN users u ON a.user_id = u.id
        INNER JOIN songs s ON a.song_id = s.id
        WHERE a.playlist_id = $1
        ORDER BY a.time ASC;
      `,
        values: [playlistId],
      };

      const result = await this._pool.query(getPlaylistActivitiesQuery);

      if (!result.rowCount) {
        throw new NotFoundError('Playlist tidak ditemukan');
      }

      await this._cacheService.set(`activities:${playlistId}`, JSON.stringify(result.rows));
      return { activities: result.rows, fromCache: false };
    }
  }
}

module.exports = PlaylistActivitiesService;
