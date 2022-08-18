import express from "express";

import * as controllertest from "../controller/comment-controller.js";

import { verifyToken } from "../middlewares/verify.js";

const router = express.Router();

router.post('/create/:postId', verifyToken, controllertest.commentCreate);
router.put('/:commentId', verifyToken, controllertest.commentUpdate);
router.delete('/:commentId', verifyToken, controllertest.commentDelete);
router.get('/:postId', controllertest.commentGet);

export default router;

