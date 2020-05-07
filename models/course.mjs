import { v4 as uuid } from 'uuid';
import fs from 'fs';
import path from 'path';

const __dirname = path.dirname(new URL(import.meta.url).pathname).slice(1);

export default class Course {
  constructor({ userId, title, price, img }) {
    this.userId = userId;
    this.title = title;
    this.price = price;
    this.img = img;
    this.id = uuid();
  }

  toJSON() {
    return {
      id: this.id,
      userId: this.userId,
      title: this.title,
      price: this.price,
      img: this.img
    };
  }

  async save() {
    const courses = await Course.getAll();
    courses.push(this.toJSON());
    return new Promise((resolve, reject) => {
      fs.writeFile(
        path.join(__dirname, '..', 'data', 'courses.json'),
        JSON.stringify(courses),
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
        path.join(__dirname, '..', 'data', 'courses.json'),
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

  static async getById(id) {
    const courses = await Course.getAll();
    return courses.find(c => c.id === id);
  }

  static async update({ id, userId, title, price, img }) {
    const courses = await Course.getAll();
    const index = courses.findIndex(c => c.id === id);
    if (index < 0) {
      return Promise.reject('Такого курса не существует')
    }
    courses[index] = {
      id, userId, title, price, img
    };
    return new Promise((resolve, reject) => {
      fs.writeFile(
        path.join(__dirname, '..', 'data', 'courses.json'),
        JSON.stringify(courses),
        err => {
          if (err) {
            return reject(err);
          } else {
            resolve();
          }
        }
      )
    })
  }

  static async remove(id) {
    const courses = await Course.getAll();
    const index = courses.findIndex(c => c.id === id);
    if (index < 0) {
      return Promise.reject('Такого курса не существует')
    }
    courses.splice(index, 1);
    return new Promise((resolve, reject) => {
      fs.writeFile(
        path.join(__dirname, '..', 'data', 'courses.json'),
        JSON.stringify(courses),
        err => {
          if (err) {
            return reject(err);
          } else {
            resolve();
          }
        }
      )
    })
  }
}
