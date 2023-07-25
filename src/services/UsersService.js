const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const bcrypt = require('bcrypt');
const InvariantError = require('../exceptions/InvariantError');
const AuthenticationError = require('../exceptions/AuthenticationError');
const NotFoundError = require('../exceptions/NotFoundError');

class UsersService {
  constructor() {
    this._pool = new Pool();
  }

  async addUser({ username, password, fullname }) {
    await this.validateUsernameUniqueness(username);

    const id = `user-${nanoid(16)}`;
    const hashedPassword = await bcrypt.hash(password, 10);

    const insertUserQuery = {
      text: 'INSERT INTO users VALUES($1, $2, $3, $4) RETURNING id',
      values: [id, username, hashedPassword, fullname],
    };

    const result = await this._pool.query(insertUserQuery);

    if (!result.rowCount) {
      throw new InvariantError('User gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async verifyUserExistenceById(userId) {
    const getUserByIdQuery = {
      text: 'SELECT username FROM users WHERE id = $1',
      values: [userId],
    };

    const result = await this._pool.query(getUserByIdQuery);

    if (!result.rowCount) {
      throw new NotFoundError('User tidak ditemukan');
    }

    return result.rows;
  }

  async validateUsernameUniqueness(username) {
    const usernameQuery = {
      text: 'SELECT username FROM users WHERE username = $1',
      values: [username],
    };

    const result = await this._pool.query(usernameQuery);

    if (result.rowCount) {
      throw new InvariantError(
        'Gagal menambahkan user. Username telah digunakan'
      );
    }
  }

  async verifyUserCredential(username, password) {
    const getUserIdAndPasswordQuery = {
      text: 'SELECT id, password FROM users WHERE username = $1',
      values: [username],
    };

    const result = await this._pool.query(getUserIdAndPasswordQuery);

    if (!result.rowCount) {
      throw new AuthenticationError('Kredensial yang anda berikan salah.');
    }

    const { id, password: hashedPassword } = result.rows[0];
    const isMatch = await bcrypt.compare(password, hashedPassword);

    if (!isMatch) {
      throw new AuthenticationError('Kredensial yang anda berikan salah.');
    }

    return id;
  }
}

module.exports = UsersService;
