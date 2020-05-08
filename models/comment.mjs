import { v4 as uuid } from 'uuid';
import fs from 'fs';
import path from 'path';

import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
// const __dirname = path.dirname(new URL(import.meta.url).pathname).slice(1);

export default class Comment {
  constructor({ userId, lessonId, message }) {
    this.userId = userId;
    this.lessonId = lessonId;
    this.message = message;
    this.date = new Date();
    this.id = uuid();
  }

  toJSON() {
    return {
      id: this.id,
      userId: this.userId,
      lessonId: this.lessonId,
      message: this.message,
      date: this.date
    };
  }

  async save() {
    const comments = await Comment.getAll();
    comments.push(this.toJSON());
    return new Promise((resolve, reject) => {
      fs.writeFile(
        path.join(__dirname, '..', 'data', 'comments.json'),
        JSON.stringify(comments),
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
        path.join(__dirname, '..', 'data', 'comments.json'),
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

  static async getCommentsByLessonId(lessonId) {
    const comments = await Comment.getAll();
    return comments.filter(c => c.lessonId === lessonId);
  }
}
