import { usingConnect, sql } from './pg-helpers';
import Promise from 'bluebird';
import crypto from 'crypto';
import scmp from 'scmp';

const pbkdf2 = Promise.promisify(crypto.pbkdf2, crypto);
const randomBytes = Promise.promisify(crypto.randomBytes, crypto);

function hashPassword(password, salt) {
  return pbkdf2(password, salt, 25000, 512, 'sha256')
    .then(hashed => new Buffer(hashed, 'binary').toString('hex'));
}

class User {
  constructor(userData) {
    this.id = userData.id;
    this.email = userData.email;
    this.passwordHash = userData.passwordhash;
    this.salt = userData.salt;
    this.isAdmin = userData.admin;
    this.active = userData.active;
  }

  validatePassword(password) {
    return hashPassword(password, this.salt)
      .then(hash => scmp(hash, this.passwordHash));
  }
}

function generatePasswordHashAndSalt(password) {
  return randomBytes(32)
    .then(buffer => buffer.toString('hex'))
    .then(salt => hashPassword(password, salt).then(passwordHash => [passwordHash, salt]));
}

export class UserRepository {
  constructor(connectionString) {
    this.connectionString = connectionString;
  }

  getAll() {
    const query = `SELECT
      *
    FROM users`;
    return usingConnect(this.connectionString, client =>
      client.queryAsync(query)
        .then(result => result.rows.map(user => new User(user))));
  }

  findById(id) {
    const query = sql`SELECT
      *
    FROM users
    WHERE id=${id}`;
    return usingConnect(this.connectionString, client =>
      client.queryAsync(query)
        .then(result => result.rows.length === 0
          ? undefined
          : new User(result.rows[0])));
  }

  findByEmail(email) {
    const query = sql`SELECT
      *
    FROM users
    WHERE email=${email}`;
    return usingConnect(this.connectionString, client =>
      client.queryAsync(query)
        .then(result => result.rows.length === 0
          ? undefined
          : new User(result.rows[0])));
  }

  updatePasswordById(id, password) {
    function getQuery(passwordHash, salt) {
      return sql`UPDATE
        users
      SET
        passwordHash=${passwordHash},
        salt=${salt}
      WHERE id=${id}`;
    }

    return generatePasswordHashAndSalt(password)
      .spread((passwordHash, salt) => usingConnect(this.connectionString, client =>
        client.queryAsync(getQuery(passwordHash, salt))));
  }

  addUser(user) {
    const email = user.email;
    const isAdmin = user.isAdmin || false;
    function getQuery(passwordHash, salt) {
      return sql`INSERT
      INTO users
        (
          email,
          passwordHash,
          salt,
          admin
        )
      VALUES
        (
          ${email},
          ${passwordHash},
          ${salt},
          ${isAdmin}
        )`;
    }

    return generatePasswordHashAndSalt(user.password)
      .spread((passwordHash, salt) => usingConnect(this.connectionString, client =>
        client.queryAsync(getQuery(passwordHash, salt))));
  }

  deleteById(id) {
    const query = sql`UPDATE
      users
    SET
      active='false'
    WHERE id=${id}`;

    return usingConnect(this.connectionString, client =>
      client.queryAsync(query));
  }

  setAdminStatusById(id, newIsAdmin) {
    const query = sql`UPDATE
      users
    SET
      admin=${newIsAdmin}
    WHERE id=${id}`;

    return usingConnect(this.connectionString, client =>
      client.queryAsync(query));
  }
}
