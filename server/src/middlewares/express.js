import morgan from "morgan";
import session from "express-session";
import passport from "passport";
import bodyParser from "body-parser";
import errorHandler from "errorhandler";
import helmet from "helmet";
import cors from "cors";
import jwtMiddleWare from "./jwt.js";

export default function attachMiddleWares(app) {
  app.set("port", process.env.PORT || 9000);
  app.use(morgan("common"));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));

  app.use(
    session({ secret: "S3cr3t", saveUninitialized: false, resave: false })
  );

  // Initialize passport Middleware
  app.use(passport.initialize());
  app.use(passport.session());
  jwtMiddleWare(passport);

  app.use(helmet());
  app.use(cors());
  app.use(errorHandler());
}
