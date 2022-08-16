import express from "express";
import Comment from "../models/comment.js";
import Post from "../models/post.js";

const commentCreate = (async (req, res, next) => {
  const userId = req.userId;
  console.log(req.userId)
  const postId = req.params.postId;
  const { comment } = req.body;

    try{
      const comment1 = await Comment.create({
        UserId : userId,
        PostId : postId,
        comment,
      });
      return res.status(200).json ({ 
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
    console.log(userId)
    
    try{
      const comment1 = await Comment.findOne({ where: {id: commentId} });
      // console.log(comment1)
      if(userId !== comment1.UserId) 
      return res.send('나의 댓글이 아닙니다.')
      const update = await Comment.update({
        comment,
      }, { where: {id : commentId} });
      return res.status(200).json ({
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
      if(userId !== comment1.UserId) 
      return res.status(200).send('나의 댓글이 아닙니다.')
      if(!comment1)
      return res.status(400).send('없는 댓글입니다.')
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







