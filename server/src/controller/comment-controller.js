import express from "express";
import Comment from "../models/comment.js";
import sequelize from "Sequelize";
import Post from "../models/post.js";

  const commentCreate = (async (req, res, next) => {
    const userId = req.userId;
    const postId = req.params.postId;
    const { comment } = req.body;

    try{
      const comment1 = await Comment.create({
        UserId : userId,
        PostId : postId,
        comment,
      });
      return res.json ({ 
        success: true,
        message: "댓글 생성",
        result: {comment1}
      });
    } catch(error) {
      console.log(error);
      next(error);
    }
  });

  const commentUpdate = (async (req, res, next) => {
    const userId = req.userId;
    const commentId = req.params.commentId;
    const { comment } = req.body;

    try{
      const comment1 = await Comment.findOne({ where: {id: commentId} });
      const update = await Comment.update({
        comment,
      }, { where: {id : commentId} });
      return res.json ({
        success: true,
        message: "댓글 수정",
        result: {comment1}
      });
    } catch(error){
      console.log(error);
      next(error);
    };
  });

  const commentDelete = (async (req, res, next) => {
    const userId = req.userId;
    const commentId = req.params.commentId;
    try{
      const comment1 = await Comment.findOne({ where : { id: commentId} });
      const destroy = await Comment.destroy({
        where: {id: commentId}
      })
      return res.json ({
        success: true,
        message: "댓글 삭제",
        result: {comment1}
      });
    } catch (error){
      console.log(error);
      next(error);
    }
  });

  export {commentCreate, commentUpdate, commentDelete,};







