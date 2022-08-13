import express from "express";
import Comment from "../models/comment.js";
import sequelize from "Sequelize";
// import router from "express.Router"

//  댓글생성하는 url /comment/create
//  댓글 수정 /comment/:commentId 
// 댓글 삭제 /comment/:commentId

// // {
  // success: true OR false,
  // message: “회원가입”,
  // result: {}
// // }

// 댓글 조회 ; ? ?
  const commentCreate = (async (req, res, next) => {
    const userId = req.userId;
    const postId = req.postId;
    const { comment } = req.body;
    
    console.log({comment})
    try{
      const comment1 = await Comment.create({
        UserId : userId,
        PostId : postId,
        comment,
      });
      console.log(comment1);
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
    console.log(commentId);
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
  export {commentCreate, commentUpdate, commentDelete}





