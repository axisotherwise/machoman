import jwt from"jsonwebtoken";

import User from "../models/user.js";

export default async (req, res, next) => {

    try {
        const { id } = req.headers;
        const { authorization } = req.headers;
        const [Type, accesstoken] = authorization.split(" ");
        if (Type !== "Bearer") {
            return res.status(400).json({
                success: false,
                message: "로그인이 필요합니다.",
                result: {}
            });
        }

        let { refreshtoken } = await User.findOne({ where: { id }, raw: true });
        if (refreshtoken === 0) {
            return res.status(400).json({
                success: false,
                message: "로그인이 필요합니다.",
                result: {}
            });
        }

        jwt.verify(refreshtoken, "refreshtoken", function (err, decode) {                           //리프레쉬 토큰 검증
            if (err) {                                                                              // 리프레쉬 토큰이 만료 됐을 시
                refreshtoken = 0;                                                                   //리프레쉬 토큰 0으로 재설정
                await User.update({ refreshtoken }, { where: { id } });                             //user 테이블에 적용
                return res.status(400).json({
                    success: false,
                    message: "만료된 리프레쉬 토큰",
                    result: {}
                });
            }
            else if (decode) {                                                                      //리프레쉬 토큰이 유효 할 시
                jwt.verify(accesstoken, "accesstoken", function (err, decode) {                   //엑세스 토큰 검증           
                    if (err) {                                                                      // 엑세스 토큰이 만료 됐을 시
                        const accesstoken = jwt.sign({ id }, "accesstoken", { expiresIn: '15m' });  // 엑세스 토큰 재발급
                        return res.status(200).json({
                            success: true,
                            message: "엑세스 토큰 재발급",
                            result: { accesstoken, id }                                             //response result 쪽으로 토큰과 아이디 값 다시 보냄
                        });
                    }
                    else if (decode) {                                                              //엑세스 토큰이 유효 할 시
                        refreshtoken = jwt.sign({}, "refreshtoken", { expiresIn: '3d' });           //리프레쉬 토큰 재발급
                        await User.update({ refreshtoken }, { where: { id } });                     //user 테이블에 적용
                        next();
                    }
                });
            }
        });
    } 
    catch (err) {
        return res.status(400).json({
            success: false,
            message: err,
            result: {}
        });
    }
};