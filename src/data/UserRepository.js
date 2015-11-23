import { usingConnect, sql } from './pg-helpers'
import Promise from 'bluebird';
import crypto from 'crypto';
import scmp from 'scmp'

const pbkdf2 = Promise.promisify(crypto.pbkdf2, crypto);

class User {
  constructor(userData) {
    this.id = userData.id;
    this.email = userData.email;
    this.passwordHash = userData.passwordhash;
    this.salt = userData.salt;
    this.isAdmin = userData.admin;
  }

  validatePassword(password) {
    return pbkdf2(password, this.salt, 25000, 512, 'sha256')
      .then(hashed => new Buffer(hashed, 'binary').toString('hex'))
      .then(hash => scmp(hash, this.passwordHash));
  }
}

export class UserRepository {
  constructor(connectionString) {
    this.connectionString = connectionString;
  }

  findById(id) {
    return usingConnect(this.connectionString, client =>
      client.queryAsync(sql`SELECT * FROM users WHERE id=${id}`)
        .then(result => result.rows.length === 0
          ? undefined
          : new User(result.rows[0])));
  }

  findByEmail(email) {
    return usingConnect(this.connectionString, client =>
      client.queryAsync(sql`SELECT * FROM users WHERE email=${email}`)
        .then(result => result.rows.length === 0
          ? undefined
          : new User(result.rows[0])));
  }
}
