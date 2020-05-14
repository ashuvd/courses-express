import mongoose from 'mongoose';
import config from '../config/config.mjs';
export default function DB() {
  return new Promise((resolve, reject) => {
    mongoose.connect(config.mongoUri, {useNewUrlParser: true, useUnifiedTopology: true});
    const db = mongoose.connection;
    db.on('error', () => {
      reject('Ошибка подключения к базе данных')
    });
    db.once('open', () => {
      resolve('Подключение к mongodb прошло успешно');
    });
  })
}
