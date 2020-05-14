import express from 'express';
import User from '../models/user.mjs';
import auth from '../middlewares/auth.mjs';

const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const users = await User.find();
    res.render('access', {
      isAccess: true,
      user: req.user,
      users,
      accessError: req.flash('accessError')
    });
  } catch (error) {
    res.json({ message: error.message || error });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const accessUsers = Object.keys(req.body).filter(
      key => key !== 'userId' && key !== '_csrf'
    );
    await req.user.update({ access: accessUsers });
    res.redirect('/access');
  } catch (error) {
    req.flash('accessError', error.message || error);
    res.redirect(`/access`);
  }
});

export default router;
