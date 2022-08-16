import passport from "passport";
import jwt from"jsonwebtoken";

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
          "machoman",
          {
            expiresIn: "1h",
          },
        );
        return res.cookie("token", token).redirect("/");
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