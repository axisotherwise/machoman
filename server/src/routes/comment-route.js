import express from "express";
import * as controllertest from "../controller/comment-controller.js"

const router = express.Router();

router.post('/create', controllertest.commentCreate);
// router.put('/comment/:commentId', '내가 지은 이름으로 컨트롤러에서 땡겨오기');
// router.delete('/comment/:commentId', '내가 지은 이름으로 컨트롤러에서 땡겨오기');

export default router;

