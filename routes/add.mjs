import express from 'express';
import Course from '../models/course.mjs';
import auth from '../middlewares/auth.mjs';
const router = express.Router();
router.get('/', auth, (req, res) => {
  res.render('addCourse', {
    isAdd: true,
    user: req.user,
    addError: req.flash('addError')
  });
});
router.post('/', auth, async (req, res) => {
  try {
    if (isNaN(req.body.price)) {
      req.flash('addError', 'Цена должна быть числом');
      res.redirect(`/add`);
      return;
    }
    if (req.body.img.indexOf('http://') === -1 && req.body.img.indexOf('https://') === -1) {
      req.flash('addError', 'Вы передали не корректный URL');
      res.redirect(`/add`);
      return;
    }
    const course = new Course({
      ...req.body,
      userId: req.user.id
    });
    await course.save();
    res.redirect('/courses');
  } catch (error) {
    req.flash('addError', error.message || error);
    res.redirect(`/add`);
  }
});

export default router;
