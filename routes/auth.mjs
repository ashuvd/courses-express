import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user.mjs';
import config from '../config/config.mjs'

import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

router.get('/login', (req, res) => {
  res.render('login', {
    isLogin: true,
    registerError: req.flash('registerError'),
    loginError: req.flash('loginError')
  });
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    let candidate = await User.findOne({ login: email });
    if (!candidate) {
      req.flash('loginError', 'Вы ввели неверный email или пароль');
      return res.redirect('/auth/login#login');
    }
    const checked = await candidate.validatePassword(password);
    if (!checked) {
      req.flash('loginError', 'Вы ввели неверный email или пароль');
      return res.redirect('/auth/login#login');
    }
    const token = jwt.sign({ userId: candidate._id }, config.keys.secret, {
      expiresIn: config.keys.expiresIn
    });
    req.session.isAuth = true;
    res.cookie('jwt', token, { maxAge: 900000, httpOnly: true });
    res.redirect('/');
  } catch (error) {
    req.flash('loginError', error.message || error);
    return res.redirect('/auth/login#login');
  }
});

router.get('/register', (req, res) => {
  res.render('register');
});

router.post('/register', async (req, res) => {
  try {
    const { email, password, confirm } = req.body;
    if (password !== confirm) {
      req.flash('registerError', 'Пароли не совпадают');
      return res.redirect('/auth/login#register');
    }
    const candidate = await User.findOne({ login: email });
    if (candidate) {
      req.flash('registerError', 'Такой пользователь уже существует');
      return res.redirect('/auth/login#register');
    }
    const user = new User({ login: email, password, access: [] });
    await user.save();
    res.redirect('/auth/login#login');
  } catch (error) {
    req.flash('registerError', error.message || error);
    return res.redirect('/auth/login#register');
  }
});

router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/auth/login#login');
  });
});
export default router;
