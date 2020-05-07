import fs from 'fs';
import path from 'path';
const __dirname = path.dirname(new URL(import.meta.url).pathname).slice(1);
export default function() {
  return new Promise((resolve, reject) => {
    fs.readdir(path.join(__dirname, '..', 'public', 'upload'), (err, files) => {
      if (err) {
        reject(err);
      } else {
        Promise.all(files.map(file => {
          const [extension] = file.indexOf('.') !== -1 ? file.split('.').reverse() : [''];
          if (!extension) {
            return new Promise((resolveU, rejectU) => {
              fs.unlink(path.join(__dirname, '..', 'public', 'upload', file), (err) => {
                if (err) {
                  rejectU(err);
                } else {
                  resolveU();
                }
              });
            })
          } else {
            return Promise.resolve();
          }
        }))
          .then(() => resolve()).catch(error => reject(error));
      }
    })
  })
}
