import fs from 'fs';
export default function(oldName, newName) {
  return new Promise(function (resolve, reject) {
    fs.rename(oldName, newName, function (err) {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    })
  })
}
