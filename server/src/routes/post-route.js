import express from "express";

import * as postController from "../controller/post-controller.js";

import { uploadNone, uploadImage } from "../middlewares/multer.js";

const router = express.Router();

router.get("/", postController.getPosts);
router.get("/:postId", postController.getPost);
router.post("/create", uploadImage.single("image"), postController.createPost);
router.put("/:postId", uploadImage.single("image"), postController.updatePost);
router.delete("/:postId", postController.deletePost);

export default router;