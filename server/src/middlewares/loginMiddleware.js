import jwt from "jsonwebtoken";
import User from "../models/user.js";
import dotenv from "dotenv";

dotenv.config();

const LoginCheck = async (req, res, next) => {
  const tokenValue = req.headers.authorization;
  if (!tokenValue) {
    return res.status(418).json({
      success: false,
      message: "토큰 없음",
    });
  };
  const token = tokenValue.split(" ")[1];
  if (!token) return res.status(418).json({
    success: false,
    message: "토큰 없음",
  });
  try {
    const user = jwt.verify(token, "machoman");
    req.userId = user.id;
    next();
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export { LoginCheck };

// 이거 뭔가 이상하고 작동안되면 그냥 컨트롤러에 userid랑 comment1.userid랑 비교해서 해야댈듯?