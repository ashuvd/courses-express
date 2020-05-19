import express from 'express';
import Course from '../models/course.mjs';
import User from '../models/user.mjs';
import Lesson from '../models/lesson.mjs';
import auth from '../middlewares/auth.mjs';

export default function APIRoutes(passport) {
  const router = express.Router();

  router.get('/', async (req, res) => {
    try {
      let courses = await Course.find();
      res.render('courses', {
        isCourses: true,
        courses,
        user: req.user
      });
    } catch (error) {
      res.json({ message: error.message || error });
    }
  });

  router.get('/:id/edit', auth(passport), async (req, res) => {
    try {
      if (!req.query.allow) {
        return res.redirect('/');
      }
      const course = await Course.findById(req.params.id);
      if (req.user._id.toString() !== course.userId) {
        res.json({ message: 'Вам запрещен доступ к этому курсу' });
        return;
      }
      const lessons = (await Lesson.find({ courseId: course._id })) || [];

      res.render('editCourse', {
        course,
        lessons,
        editError: req.flash('editError')
      });
    } catch (error) {
      res.json({ message: error.message || error });
    }
  });

  router.get('/:id', async (req, res) => {
    try {
      const course = await Course.findById(req.params.id);
      course.lessons = (await Lesson.find({ courseId: course._id })) || [];
      const access = (await User.findById(course.userId)).access;
      res.render('course', {
        course,
        user: req.user,
        access
      });
    } catch (error) {
      res.json({ message: error.message || error });
    }
  });

  router.post('/edit', auth(passport), async (req, res) => {
    try {
      await Course.update({
        ...req.body,
        userId: req.user._id
      });
      res.redirect('/courses');
    } catch (error) {
      req.flash('editError', error.message || error);
      res.redirect(`/courses/${req.body.id}/edit?allow=true`);
    }
  });

  router.post('/remove', auth(passport), async (req, res) => {
    try {
      await Course.deleteOne({ _id: req.body.id });
      res.redirect('/courses');
    } catch (error) {
      req.flash('editError', error.message || error);
      res.redirect(`/courses/${req.body.id}/edit?allow=true`);
    }
  });
  return router;
}
