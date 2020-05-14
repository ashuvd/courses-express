import express from 'express';
import User from '../models/user.mjs';

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
    req.session.user = candidate;
    req.session.isAuth = true;
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
    req.session.user = user;
    req.session.isAuth = true;
    res.redirect('/');
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
