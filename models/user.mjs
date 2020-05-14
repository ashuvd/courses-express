import { v4 as uuid } from 'uuid';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
// const __dirname = path.dirname(new URL(import.meta.url).pathname);

export default class User {
  constructor(login, password = "", id = "", access = []) {
    this.id = id || uuid();
    this.login = login;
    this.password = password;
    this.access = access;
  }

  hashPassword(password) {
    return new Promise((resolve, reject) => {
      crypto.pbkdf2(password, 'otus', 100000, 32, 'sha256', (err, derivedKey) => {
        if (err){
          reject(err);
        } else {
          this.password = derivedKey.toString('hex');
          resolve()
        }
      });
    })
  }

  toJSON() {
    return {
      id: this.id,
      login: this.login,
      password: this.password,
      access: this.access
    };
  }

  checkPassword(password) {
    return new Promise((resolve, reject) => {
      crypto.pbkdf2(password, 'otus', 100000, 32, 'sha256', (err, derivedKey) => {
        if (err){
          reject(err);
        } else {
          resolve(this.password === derivedKey.toString('hex'))
        }
      });
    })
  }

  async save() {
    const users = await User.getAll();
    users.push(this.toJSON());
    return new Promise((resolve, reject) => {
      fs.writeFile(
        path.join(__dirname, '..', 'data', 'users.json'),
        JSON.stringify(users),
        err => {
          if (err) {
            return reject(err);
          } else {
            resolve();
          }
        }
      );
    });
  }

  static getAll() {
    return new Promise((resolve, reject) => {
      fs.readFile(
        path.join(__dirname, '..', 'data', 'users.json'),
        'utf-8',
        (err, data) => {
          if (err) {
            return reject(err);
          } else {
            resolve(JSON.parse(data));
          }
        }
      );
    });
  }

  static async getByLogin(login) {
    const users = await User.getAll();
    const user = users.find(u => u.login === login);
    if (!user) {
      return false;
    }
    return new User(user.login, user.password, user.id);
  }

  static async getById(id) {
    const users = await User.getAll();
    const user = users.find(u => u.id === id);
    if (!user) {
      return false;
    }
    return new User(user.login, user.password, user.id, user.access);
  }

  async setAccess(ids) {
    this.access = [...ids];
    const users = await User.getAll();
    const idx = users.findIndex(u => u.id === this.id);
    users[idx] = this.toJSON();
    return new Promise((resolve, reject) => {
      fs.writeFile(
        path.join(__dirname, '..', 'data', 'users.json'),
        JSON.stringify(users),
        err => {
          if (err) {
            return reject(err);
          } else {
            resolve();
          }
        }
      );
    });
  }
}
