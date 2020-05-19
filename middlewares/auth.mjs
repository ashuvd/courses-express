export default function(passport) {
  return (req, res, next) => {
    return passport.authenticate("jwt", (err, user) => {
      if (err) {
        res.status(500).json({ message: "Ошибка на сервере" });
        return;
      }
      if (!user) {
        res.status(401).json({ message: "Ошибка авторизации" });
        return;
      }
      req.user = user;
      next();
    })(req, res, next);
  };
}
