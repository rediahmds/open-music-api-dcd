const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../exceptions/InvariantError');
const NotFoundError = require('../exceptions/NotFoundError');

class PlaylistActivitiesService {
  constructor() {
    this._pool = new Pool();
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
  }

  async getPlaylistActivitiesByPlaylistId(playlistId) {
    const getPlaylistActivitiesQuery = {
      text: `
        SELECT u.username, s.title, a.action, a.timestamp as time
        FROM activities a
        INNER JOIN users u ON a.user_id = u.id
        INNER JOIN songs s ON a.song_id = s.id
        WHERE a.playlist_id = $1
        ORDER BY a.timestamp ASC;
    `,
      values: [playlistId],
    };

    const result = await this._pool.query(getPlaylistActivitiesQuery);

    if (!result.rowCount) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }

    return result;
  }
}

module.exports = PlaylistActivitiesService;
