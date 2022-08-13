import express from "express";
import * as controllertest from "../controller/comment-controller.js"

const router = express.Router();

router.post('/create', controllertest.commentCreate);
router.put('/:commentId', controllertest.commentUpdate);
router.delete('/:commentId', controllertest.commentDelete);

export default router;

