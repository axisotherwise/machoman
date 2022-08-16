import passport from "passport";
import kakao from "passport-kakao";
import dotenv from "dotenv";

dotenv.config();

import User from "../models/user.js";

const KakaoStrategy = kakao.Strategy;

const config = {
  clientID: process.env.KAKAO_ID,
  callbackURL: "/user/kakao/callback",
};

const strategy = async (accessToken, refreshToken, profile, done) => {
  const email = profile._json.kakao_account.email;
  const nickName = profile.displayName;
  try {
    const exist = await User.findOne({ where: { email }});
    if (exist) {
      return done(null, exist);
    } else {
      const user = await User.create({
        email: profile._json.kakao_account.email,
        nickname: profile.displayName,
        provider: "kakao",
      });
      return done(null, user);
    }
  } catch (err) {
    console.error(err);
    done(err);
  }
};

export default new KakaoStrategy(config, strategy);

// export default () => {
//   passport.use(new KakaoStrategy({
//     clientID: process.env.KAKAO_ID,
//     callbackURL: "/user/kakao/callback",
//   }, async (accessToken, refreshToken, profile, done) => {
//     console.log(`카카오 프로필 ${profile}`);
//     try {

//     } catch (err) {
//       console.error(err);
//       done(err);
//     }
//   }));
// };