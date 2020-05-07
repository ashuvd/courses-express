import express from 'express';
const router = express.Router();
router.get('/', (req, res) => {
  res.render('index', {
    isHome: true,
    user: req.user
  });
});
export default router;
