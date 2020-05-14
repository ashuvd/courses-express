import express from 'express';
import path from 'path';
import Course from '../models/course.mjs';
import User from '../models/user.mjs';
import Lesson from '../models/lesson.mjs';
import Comment from '../models/comment.mjs';
import auth from '../middlewares/auth.mjs';
import renameAsync from '../services/renameAsync.mjs';
import clearCacheAsync from '../services/clearCacheAsync.mjs';
import { v4 as uuid } from 'uuid';
const router = express.Router();

router.get('/lessons/:id', auth, async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) {
      res.json({ message: 'Такого занятия не существует' });
      return;
    }
    const course = await Course.findById(lesson.courseId);
    const access = (await User.findById(course.userId)).access;
    if (
      req.user._id.toString() !== course.userId &&
      !access.includes(req.user._id.toString())
    ) {
      res.json({ message: 'Вам запрещен доступ к этому занятию' });
      return;
    }
    let comments = await Comment.find({ lessonId: lesson._id });
    comments = await Promise.all(
      comments.map(async c => {
        c.user = await User.findById(c.userId);
        return c;
      })
    );
    res.render('lesson', {
      lesson,
      comments,
      user: req.user
    });
  } catch (error) {
    res.json({ message: error.message || error });
  }
});

router.get('/courses/:id/lessons/add', auth, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    res.render('addLesson', {
      course,
      addError: req.flash('addError')
    });
  } catch (error) {
    res.json({ message: error.message || error });
  }
});

router.post('/comments', auth, async (req, res) => {
  try {
    const comment = new Comment({
      message: req.body.message,
      userId: req.body.userId,
      lessonId: req.body.lessonId,
      date: new Date()
    });
    await comment.save();
    res.json({ ...comment._doc, user: req.user });
  } catch (error) {
    res.json({ message: error.message || error });
  }
});

router.post('/lessons/add', auth, async (req, res) => {
  try {
    if (!req.body.id) {
      res.json({ message: 'Вы не передали необходимые параметры' });
      return;
    }
    if (!req.body.title) {
      req.flash('addError', 'Вы не передали название занятия');
      res.redirect(`/courses/${req.body.id}/lessons/add`);
      return;
    }
    if (!req.body.desc) {
      req.flash('addError', 'Вы не передали описание занятия');
      res.redirect(`/courses/${req.body.id}/lessons/add`);
      return;
    }
    if (req.files.length === 0) {
      req.flash('addError', 'Вы не передали видео занятия');
      res.redirect(`/courses/${req.body.id}/lessons/add`);
      return;
    }
    const links = [];
    let count = 1;
    let linkName = `dopLink${count}`;
    while (req.body[linkName]) {
      if (
        req.body[linkName].indexOf('http://') === -1 &&
        req.body[linkName].indexOf('https://') === -1
      ) {
        await clearCacheAsync();
        req.flash(
          'addError',
          'Вы передали не корректную ссылку на дополнительный материал'
        );
        res.redirect(`/courses/${req.body.id}/lessons/add`);
        return;
      }
      links.push(req.body[linkName]);
      linkName = `dopLink${++count}`;
    }
    let files = await Promise.all(
      req.files.map(async file => {
        const fieldName = file.fieldname;
        const fileName = file.originalname;
        const fileMimeType = file.mimetype;
        const fileSizeInBytes = file.size;
        const fileSizeInMegabytes = (fileSizeInBytes / 1000000.0).toFixed(2);
        const [extension] =
          fileName.indexOf('.') !== -1 ? fileName.split('.').reverse() : [''];
        const filePath = path.join(
          'public',
          'upload',
          uuid() + '.' + extension
        );

        if (!['avi', 'mp4'].includes(extension)) {
          await clearCacheAsync();
          return Promise.reject(
            `Формат видео файла [.${extension}] не поддерживается. Поддерживаются следующие форматы: [.avi, .mp4]`
          );
        }

        await renameAsync(file.path, filePath);

        return {
          fieldName,
          fileMimeType,
          fileSizeInMegabytes,
          dir: path.normalize('/' + filePath.substr(filePath.indexOf('upload')))
        };
      })
    );

    const lesson = new Lesson({
      courseId: req.body.id,
      title: req.body.title,
      desc: req.body.desc,
      video: files.find(f => f.fieldName === 'video'),
      files: files.filter(f => f.fieldName !== 'video'),
      links
    });
    await lesson.save();

    res.redirect('/courses');
  } catch (error) {
    req.flash('addError', error.message || error);
    res.redirect(`/courses/${req.body.id}/lessons/add`);
  }
});

export default router;
