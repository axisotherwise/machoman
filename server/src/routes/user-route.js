import express from "express";
import passport from "passport";

const router = express.Router();

import UserController from "../controller/user-controller.js";
import * as user from "../controller/user.js";

// 로그인
router.post("/join", UserController.join);
router.post("/login", UserController.login);
router.get("/check_email/:email", UserController.check_email);
router.get("/check_nick/:nickname", UserController.check_nick);
router.get("/kakao", user.auth);
router.get("/kakao/callback", user.authCallback);

export default router;