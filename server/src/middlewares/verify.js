import jwt from "jsonwebtoken";
import User from "../models/user.js";
import dotenv from "dotenv";

dotenv.config({ path: "../.env" });

const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const result = await jwt.verify(token, process.env.TOKEN_SECRET);
    req.userId = result.userId;
    return next();
  } catch (err) {
    if (err.name = "TokenExpiredError") {
      return res.status(418).json({
        success: false,
        message: "토큰 만료",
      });
    }
    return res.status(418).json({
      success: false,
      message: "유효하지 않은 토큰입니다.",
    });
  }
};

export {
  verifyToken,
};