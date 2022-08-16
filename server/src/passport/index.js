import passport from "passport";
import KakaoStrategy from "./kakaoStrategy.js";

export default () => {
  passport.use("kakao", KakaoStrategy);
};
