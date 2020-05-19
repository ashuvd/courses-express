import { Strategy } from 'passport-jwt';
import { ExtractJwt } from 'passport-jwt';

import User from '../models/user.mjs';
import config from '../config/config.mjs';

// Hooks the JWT Strategy.
function hookJWTStrategy(passport) {
  const options = {};

  options.secretOrKey = config.keys.secret;
  options.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
  options.ignoreExpiration = false;

  passport.use(
    new Strategy(options, async (JWTPayload, callback) => {
      try {
        const user = await User.findOne({_id: JWTPayload.userId});
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
