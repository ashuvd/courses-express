import { default as JWT } from 'passport-jwt';

import User from '../models/user.mjs';
import config from '../config/config.mjs';

const cookieExtractor = function(req) {
  let token = null;
  if (req && req.cookies)
  {
    token = req.cookies['jwt'];
  }
  return token;
};

// Hooks the JWT Strategy.
function hookJWTStrategy(passport) {
  const options = {};

  options.secretOrKey = config.keys.secret;
  options.jwtFromRequest = JWT.ExtractJwt.fromExtractors([cookieExtractor]);
  options.ignoreExpiration = false;

  passport.use(
    new JWT.Strategy(options, async (JWTPayload, callback) => {
      try {
        const user = await User.findOne({ _id: JWTPayload.userId });
        if (!user) {
          callback(null, false);
          return;
        }
        callback(null, user);
      } catch (err) {
        callback(err, false);
      }
    })
  );
}

export default hookJWTStrategy;
