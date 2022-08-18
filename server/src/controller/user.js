import passport from "passport";
import jwt from"jsonwebtoken";
import dotenv from "dotenv";

import User from "../models/user.js";
import Post from "../models/post.js";

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
        return res.status(200).redirect(`http://localhost:3000/?token=${token}`);
      });
    })(req, res, next);
  } catch (err) {
    console.log(err);
    next(err);
  }
};

const findEmail = async (req, res, next) => {
  try {
    const result = await User.getUserPosts(5);
    res.json(result);
  } catch (err) {
    console.log(err);
    next(err);
  }
};

export {
  auth,
  authCallback,
  findEmail,
};