import { v4 as uuid } from 'uuid';
import fs from 'fs';
import path from 'path';

import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
// const __dirname = path.dirname(new URL(import.meta.url).pathname).slice(1);

export default class Lesson {
  constructor({ courseId, title, desc, video, files, links }) {
    this.courseId = courseId;
    this.title = title;
    this.desc = desc;
    this.video = video;
    this.files = files;
    this.links = links;
    this.id = uuid();
  }

  toJSON() {
    return {
      id: this.id,
      courseId: this.courseId,
      title: this.title,
      desc: this.desc,
      video: this.video,
      files: this.files,
      links: this.links
    };
  }

  async save() {
    const lessons = await Lesson.getAll();
    lessons.push(this.toJSON());
    return new Promise((resolve, reject) => {
      fs.writeFile(
        path.join(__dirname, '..', 'data', 'lessons.json'),
        JSON.stringify(lessons),
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
        path.join(__dirname, '..', 'data', 'lessons.json'),
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
    const lessons = await Lesson.getAll();
    return lessons.find(l => l.id === id);
  }
  static async getLessonsByCourseId(courseId) {
    const lessons = await Lesson.getAll();
    return lessons.filter(l => l.courseId === courseId);
  }
}
