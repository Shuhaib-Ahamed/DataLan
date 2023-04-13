import User from "../api/models/user.model.js";
import passportJWT from "passport-jwt";

const JwtStrategy = passportJWT.Strategy,
  ExtractJwt = passportJWT.ExtractJwt;

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: "OauthCentral",
};

export default function (passport) {
  passport.use(
    new JwtStrategy(opts, async function (jwt_payload, done) {
      try {
        let user = await User.findById(jwt_payload.id);

        if (user) return done(null, user);

        done(null, false);
      } catch (error) {
        return done(error, false);
      }
    })
  );
}
