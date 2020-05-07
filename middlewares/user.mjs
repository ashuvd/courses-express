import User from '../models/user.mjs';
export default async function(req, res, next) {
  if (!req.session.user) {
    return next();
  }
  req.user = await User.getById(req.session.user.id);
  next();
}
