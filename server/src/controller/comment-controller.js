import express from "express";
import Comment from "../models/comment.js";
import User from "../models/user.js";
import Post from "../models/post.js";

const commentGet = (async (req, res, next) => {
  const postId = req.params.postId;
  const userId = req.userId;
  try {
    if (!postId){
      return res.status(400).json({
        success: true,
        message : '포스트아이디 null',
        result : {}
      });
    }
    const cmtpost = await Comment.findAll({
      where: {postId : postId},
      include: [{
        model : User,
        attributes: ["id", "nickname"]
      }]
      });
    return res.status(200).json({
      success : true,
      message : '조회성공',
      result: {cmtpost}
    })
  } catch (error){
    console.error(error);
    return next(error);
  }
})

const commentCreate = (async (req, res, next) => {
  const userId = req.userId;
  // console.log(req.userId)
  const postId = req.params.postId;
  const { comment } = req.body;

    try{
      const comment1 = await Comment.create({
        UserId : userId,
        PostId : postId,
        comment,
      });
      // const formData = new FormData();
      // formData.forEach((value, key) => comment1[key] = value);
      // console.log(comment1)
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
      console.log(comment1.UserId)
      if(userId !== comment1.UserId) 
      return res.status(400).send('나의 댓글이 아닙니다.')
      const update = await Comment.update({
        comment,
      }, { where: {id : commentId} });
      // console.log(update)
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
    // console.log(userId)
    try{
      const comment1 = await Comment.findOne({ where : { id: commentId} });
      console.log(comment1)
      if(userId !== comment1.UserId){
        return res.status(400).json({
          success : false,
          message : '나의 댓글이 아닙니다',
          result : {comment1}
        })
      }     
      const destroy = await Comment.destroy({
        where: {id: commentId}
      })
      return res.status(200).json ({
        success: true,
        message: "댓글 삭제",
        result: {comment1}
      });
    } catch (error){
      console.log(error);
      next(error);
    }
  });

  export {commentCreate, commentUpdate, commentDelete, commentGet};







