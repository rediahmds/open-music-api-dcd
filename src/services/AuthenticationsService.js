const { Pool } = require('pg');
const InvariantError = require('../exceptions/InvariantError');

class AuthenticationsService {
  constructor() {
    this._pool = new Pool();
  }

  async addRefreshToken(refreshToken) {
    const addRefreshTokenQuery = {
      text: 'INSERT INTO authentications VALUES($1)',
      values: [refreshToken],
    };

    await this._pool.query(addRefreshTokenQuery);
  }

  async verifyRefreshToken(refreshToken) {
    const checkTokenExistenceQuery = {
      text: 'SELECT token FROM authentications WHERE token = $1',
      values: [refreshToken],
    };

    const result = await this._pool.query(checkTokenExistenceQuery);

    if (!result.rowCount) {
      throw new InvariantError('Refresh token tidak valid.');
    }
  }

  async deleteRefreshToken(refreshToken) {
    const deleteRefreshTokenQuery = {
      text: 'DELETE FROM authentications WHERE token = $1',
      values: [refreshToken],
    };

    await this._pool.query(deleteRefreshTokenQuery);
  }
}

module.exports = AuthenticationsService;
