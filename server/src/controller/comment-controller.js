import express from "express";
import Comment from "../models/comment.js";
import sequelize from "Sequelize";
import Post from "../models/post.js";
// import router from "express.Router"

//  댓글생성하는 url /comment/create
//  댓글 수정 /comment/:commentId 
// 댓글 삭제 /comment/:commentId
// 
// // {
  // success: true OR false,
  // message: “회원가입”,
  // result: {}
// // }

// 댓글 조회 ; ? ?
// 연습용 작성일과 현재시간을 비교해서 몇 초 , 분 , 시간, 일 전인지 확인
  const commentFind = (async(req, res, next) => {
    const commentId = req.params.commentId
    try {
      const test = await Comment.findAll();
      const test1 = await Comment.findOne({where: {id : commentId}})
      const created = test1.createdAt
      let now = new Date();
      const caldate = now - created
      let timeCheckMin = parseInt(caldate/1000/60);
      // 분으로 표시
      let timeCheckHour = parseInt(caldate/1000/60/60);
      // 간으로 표시
      let timeCheckDay = parseInt(caldate/1000/60/60/24);
      // console.log(timeCheckDay)
      if(timeCheckMin > 60 && timeCheckMin < 1440){
        timeCheckMin = timeCheckHour + ' 시간 전'
      }
      else if(timeCheckMin < 60){
        // console.log(timeCheckMin)
        timeCheckMin = timeCheckMin + ' 분 전'
      } 
      else if(timeCheckMin > 1440){
        timeCheckMin = timeCheckDay + ' 일 전'
      }
      
      return res.json({time : timeCheckMin})
    } catch(error) {
      console.log(error);
      next(error);
    };
  });
// 

  const commentCreate = (async (req, res, next) => {
    const userId = req.userId;
    const postId = req.postId;
    const { comment } = req.body;
    
    // console.log({comment})
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
    // console.log(commentId);
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
  export {commentCreate, commentUpdate, commentDelete, commentFind}





