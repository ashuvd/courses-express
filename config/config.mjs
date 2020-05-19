import dotenv from 'dotenv';
dotenv.config();

const defaultConfig = {
  port: +process.env.SERVER_PORT || 0,
  host: process.env.SERVER_HOST || '0.0.0.0',
  mongoUri: process.env.MONGO_URI,
  sslKey: process.env.SSL_KEY || '',
  sslCert: process.env.SSL_CERT || '',
  keys: {
    secret: process.env.KEY_SECRET || 'secret'
  }
};

export default defaultConfig;
