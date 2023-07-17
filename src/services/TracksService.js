const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const NotFoundError = require('../exceptions/NotFoundError');
const InvariantError = require('../exceptions/InvariantError');

class TracksService {
  constructor(playlistsService) {
    this._pool = new Pool();
    this._playlistsService = playlistsService;
  }

  async addTrack(playlistId, songId) {
    const id = `track-${nanoid(16)}`;
    const addSongToPlaylistQuery = {
      text: 'INSERT INTO playlist_songs VALUES($1, $2, $3) RETURNING id',
      values: [id, playlistId, songId],
    };
    const result = await this._pool.query(addSongToPlaylistQuery);

    if (!result.rows[0].id) {
      throw new InvariantError('Gagal menambahkan lagu ke playlist');
    }
  }

  async getTracksInPlaylist(playlistId) {
    const getTracksInPlaylistQuery = {
      text: `SELECT songs.id, songs.title, songs.performer
        FROM songs
        INNER JOIN playlist_songs ON songs.id = playlist_songs.song_id
        WHERE playlist_songs.playlist_id = $1`,
      values: [playlistId],
    };

    const result = await this._pool.query(getTracksInPlaylistQuery);

    return result.rows;
  }

  async deleteTrackById(playlistId, songId) {
    const deleteTrackQuery = {
      text: 'DELETE FROM playlist_songs WHERE playlist_id = $1 AND song_id = $2 RETURNING song_id',
      values: [playlistId, songId],
    };

    const result = await this._pool.query(deleteTrackQuery);

    if (!result.rowCount) {
      throw new NotFoundError(
        'Gagal menghapus. Lagu atau playlist tak ditemukan'
      );
    }
  }
}

module.exports = TracksService;
