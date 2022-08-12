import express from "express";

const router = express.Router();

router.post('/comment/create', '내가 지은 이름으로 컨트롤러에서 땡겨오기');
router.put('/comment/:commentId', '내가 지은 이름으로 컨트롤러에서 땡겨오기');
router.delete('/comment/:commentId', '내가 지은 이름으로 컨트롤러에서 땡겨오기');

export default router;

