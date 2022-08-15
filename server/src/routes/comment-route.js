import express from "express";
<<<<<<< HEAD
import * as controllertest from "../controller/comment-controller.js";

=======
import * as controllertest from "../controller/comment-controller.js"
>>>>>>> 468a19a4090d0ee5f16dd20d1bddecb448c8d436
import { LoginCheck } from "../middlewares/loginMiddleware.js";

const router = express.Router();

router.post('/create', LoginCheck, controllertest.commentCreate);
router.put('/:commentId', LoginCheck , controllertest.commentUpdate);
router.delete('/:commentId', LoginCheck, controllertest.commentDelete);
router.get('/test/:commentId', LoginCheck , controllertest.commentFind);
<<<<<<< HEAD

=======
// 얘는 내가 테스트하려고 만든 곳
// 
>>>>>>> 468a19a4090d0ee5f16dd20d1bddecb448c8d436
export default router;

