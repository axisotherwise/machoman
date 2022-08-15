import express from "express";

import * as controllertest from "../controller/comment-controller.js";

import { LoginCheck } from "../middlewares/loginMiddleware.js";

const router = express.Router();

router.post('/create/:postId', controllertest.commentCreate);
router.put('/:commentId', LoginCheck , controllertest.commentUpdate);
router.delete('/:commentId', LoginCheck, controllertest.commentDelete);

export default router;

