import express from 'express';
import Course from '../models/course.mjs';
import User from '../models/user.mjs';
import Lesson from '../models/lesson.mjs';
import auth from '../middlewares/auth.mjs';
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    let courses = await Course.getAll();
    res.render('courses', {
      isCourses: true,
      courses,
      user: req.user
    });
  } catch (error) {
    res.json({message: error.message || error});
  }
});

router.get('/:id/edit', auth, async (req, res) => {
  try {
    if (!req.query.allow) {
      return res.redirect('/');
    }
    const course = await Course.getById(req.params.id);
    if (req.user.id !== course.userId) {
      res.json({message: 'Вам запрещен доступ к этому курсу'});
      return
    }
    const lessons = (await Lesson.getLessonsByCourseId(course.id)) || [];

    res.render('editCourse', {
      course,
      lessons,
      editError: req.flash('editError')
    });
  } catch (error) {
    res.json({message: error.message || error});
  }
});

router.get('/:id', async (req, res) => {
  try {
    const course = await Course.getById(req.params.id);
    course.lessons = await Lesson.getLessonsByCourseId(course.id) || [];
    const access = (await User.getById(course.userId)).access;
    res.render('course', {
      course,
      user: req.user,
      access
    });
  } catch (error) {
    res.json({message: error.message || error});
  }
});

router.post('/edit', auth, async (req, res) => {
  try {
    await Course.update({
      ...req.body,
      userId: req.user.id
    });
    res.redirect('/courses');
  } catch (error) {
    req.flash('editError', error.message || error);
    res.redirect(`/courses/${req.body.id}/edit?allow=true`);
  }
})

router.post('/remove', auth, async (req, res) => {
  try {
    await Course.remove(req.body.id);
    res.redirect('/courses');
  } catch (error) {
    req.flash('editError', error.message || error);
    res.redirect(`/courses/${req.body.id}/edit?allow=true`);
  }
});

export default router;
