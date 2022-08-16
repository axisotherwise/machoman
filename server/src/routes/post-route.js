import express from "express";
import fs from "fs";

import * as postController from "../controller/post-controller.js";

import { uploadNone, uploadImage } from "../middlewares/multer.js";

import { verifyToken} from "../middlewares/verify.js";

const router = express.Router();

try {
  fs.readdirSync("images");
} catch (err) {
  console.log("images 폴더 생성");
  fs.mkdirSync("images");
}

router.get("/", postController.getPosts);
router.get("/search", postController.searchPosts);
router.get("/:postId", postController.getPost);
router.post("/create", verifyToken, uploadImage.single("img"), postController.createPost);
router.put("/:postId", verifyToken, uploadImage.single("image"), postController.updatePost);
router.delete("/:postId", verifyToken, postController.deletePost);

export default router;