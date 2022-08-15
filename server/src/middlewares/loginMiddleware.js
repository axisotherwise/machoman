import jwt from "jsonwebtoken";
import  User  from "../models/user.js";

const LoginCheck = async (req, res, next) => {
  const { authorization } = req.headers;

  // 로그인 해야 오쏘 생성됨
  if (!authorization) return res.send();

  const [tokenType, tokenValue] = authorization.split(" ");
  if (tokenType !== "Bearer") {
    
    return res.send({ msg: "로그인 해라" });
  }

  try {
    const { userId } = jwt.verify(tokenValue, 'secretkey');
    const user = await User.findByPk(userId);
    req.user = user;
    next();
  } catch (error) {
    console.log(error)
    return res.send({ msg: "로그인 해야 할수 있음" });
  }
};

export { LoginCheck };

// 이거 뭔가 이상하고 작동안되면 그냥 컨트롤러에 userid랑 comment1.userid랑 비교해서 해야댈듯?