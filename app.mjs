import express from "express";
import multer from 'multer';
import https from "https";
import http from "http";
import session from 'express-session';
import passport from 'passport';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import csrf from 'csurf';
import flash from 'connect-flash';
import path from "path";
import hookJWTStrategy from './services/passportStrategy.mjs';

import authRoutes from './routes/auth.mjs';
import homeRoutes from './routes/home.mjs';
import coursesRoutes from './routes/courses.mjs';
import addRoutes from './routes/add.mjs';
import lessonsRoutes from './routes/lessons.mjs';
import accessRoutes from './routes/access.mjs';

import varMiddleware from './middlewares/variables.mjs';

import db from './db/index.mjs';

import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
// const __dirname = path.dirname(new URL(import.meta.url).pathname).slice(1);

const upload = multer({ dest: path.join(__dirname, 'public', 'upload') });

function Server(options, callback) {
  const app = express();

  // parse application/x-www-form-urlencoded
  app.use(bodyParser.urlencoded({ extended: false }));
  // parse application/json
  app.use(bodyParser.json())
  app.use(upload.any());

  app.use(passport.initialize());
  hookJWTStrategy(passport);

  app.use(express.static(path.join(__dirname, 'public')));

  app.set('views', './views');
  app.set('view engine', 'pug');

  app.use(session({
    secret: 'some secret',
    resave: false,
    saveUninitialized: false
  }))
  app.use(cookieParser());
  app.use(flash());
  app.use(csrf());
  app.use(varMiddleware);

  app.use('/auth', authRoutes);
  app.use('/', homeRoutes);
  app.use('/courses', coursesRoutes(passport));
  app.use('/add', addRoutes(passport));
  app.use('/', lessonsRoutes(passport));
  app.use('/access', accessRoutes(passport));

  let server;
  let protocol;
  if (options.ssl && options.ssl.key && options.ssl.cert) {
    protocol = 'HTTPS';
    options.port += 443;
    server = https.createServer(options.ssl, app);
  } else {
    protocol = 'HTTP';
    options.port += 80;
    server = http.createServer(app);
  }
  db().then((message) => {
    console.log(message);
    server.listen(options.port, options.host, () => callback(server, protocol));
  }).catch((error) => {
    console.log(error);
  })
}

export {
  Server
};
