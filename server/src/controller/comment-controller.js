import express from "express";
import Comment from "../models/comment.js";
import sequelize from "Sequelize";
// import router from "express.Router"

//  댓글생성하는 url /comment/create
//  댓글 수정 /comment/:commentId 
// 댓글 삭제 /comment/:commentId


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
      return res.send ({ message : '햇나?'});
    } catch(error) {
      console.log(error);
      next(error);
    }
  });
  
  export {commentCreate}





