import { usingConnect, sql } from './pg-helpers'
import Promise from 'bluebird';
import crypto from 'crypto';
import scmp from 'scmp'

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
  }

  validatePassword(password) {
    return hashPassword(password, this.salt)
      .then(hash => scmp(hash, this.passwordHash));
  }
}

function generatePasswordHashAndSalt(password) {
  return randomBytes(32)
    .then(buffer => buffer.toString('hex'))
    .then(salt => hashPassword(password, salt).then(passwordHash => [passwordHash, salt]))
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

  updatePasswordById(id, password) {
    return generatePasswordHashAndSalt(password)
      .spread((passwordHash, salt) => usingConnect(this.connectionString, client =>
        client.queryAsync(sql`UPDATE users SET passwordHash=${passwordHash}, salt=${salt} WHERE id=${id}`)));
  }

  deleteById(id) {
    return usingConnect(this.connectionString, client => client.queryAsync(sql`DELETE FROM users WHERE id=${id}`));
  }
}
