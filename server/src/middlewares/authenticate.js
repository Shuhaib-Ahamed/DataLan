import passport from "passport";
import codes from "../utils/httpHelper.js";

export default (req, res, next) => {
  passport.authenticate("jwt", function (err, user, info) {
    if (err) return next(err);

    if (!user) {
      return res.status(codes.UNAUTHORIZED).json({
        success: false,
        message: "Unauthorized Access - No Token Provided!",
      });
    }

    req.user = {
      _id: user._id,
    };

    next();
  })(req, res, next);
};
