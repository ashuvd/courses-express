import mongoose from 'mongoose';
export default function DB() {
  return new Promise((resolve, reject) => {
    const URI = 'mongodb://localhost:27017/courses';
    mongoose.connect(URI, {useNewUrlParser: true, useUnifiedTopology: true});
    const db = mongoose.connection;
    db.on('error', () => {
      reject('Ошибка подключения к базе данных')
    });
    db.once('open', () => {
      resolve('Подключение к mongodb прошло успешно');
    });
  })
}
