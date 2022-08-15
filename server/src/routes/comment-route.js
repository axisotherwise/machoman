import express from "express";
import * as controllertest from "../controller/comment-controller.js";

import { LoginCheck } from "../middlewares/loginMiddleware.js";

const router = express.Router();

router.post('/create', LoginCheck, controllertest.commentCreate);
router.put('/:commentId', LoginCheck , controllertest.commentUpdate);
router.delete('/:commentId', LoginCheck, controllertest.commentDelete);
router.get('/test/:commentId', LoginCheck , controllertest.commentFind);

export default router;

