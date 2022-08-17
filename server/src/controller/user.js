import passport from "passport";
import jwt from"jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

import responseHandler from "../modules/hanlder.js";

const auth = async (req, res, next) => {
  try {
    passport.authenticate("kakao")(req, res, next);
  } catch (err) {
    console.error(err);
    next(err);
  }
};

const authCallback = async (req, res, next) => {
  try {
    passport.authenticate("kakao", (err, user, message) => {
      if (err) {
        return res.status(418).json(responseHandler(false, "로그인 에러", err));
      }
      req.login(user, { session: false }, (loginError) => {
        if (loginError) {
          return res.status(418).json(responseHandler(false, "로그인 에러", loginError));
        }
        const token = jwt.sign(
          {
            userId: user.id,
          },
          process.env.TOKEN_SECRET,
          {
            expiresIn: "1h",
          },
        );
        return res.status(200).redirect(`http://localhost:3000/?${token}`);
      });
    })(req, res, next);
  } catch (err) {
    console.log(err);
    next(err);
  }
};

export {
  auth,
  authCallback,
};