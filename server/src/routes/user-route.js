import express from "express";
const router = express.Router();

import UserController from "../controller/user-controller.js";


// 로그인
router.post("/join", UserController.join);
router.post("/login", UserController.login);
router.get("/check_email/:email", UserController.check_email);
router.get("/check_nick/:nickname", UserController.check_nick);

export default router;