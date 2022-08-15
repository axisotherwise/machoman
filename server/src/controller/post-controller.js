import { Op } from "sequelize"; 

import { sequelize } from "../models/sequelize.js";

import User from "../models/user.js";
import Post from "../models/post.js";
import Comment from "../models/comment.js";

import responseHandler from "../modules/hanlder.js";

const getPosts = async (req, res, next) => {
  try {
    const [ result ] = await sequelize.query(`
      SELECT 
        P.title, P.image,
        U.nickname
      FROM post P
      JOIN user U
        ON U.id = P.UserId
      LEFT JOIN comment C
        ON P.id = C.PostId
    `);
    if (!result) {
      return res.status(418).json(responseHandler(false, "게시글 없음"));
    }
    return res.status(200).json(responseHandler(true, "조회 성공", result));
  } catch (err) {
    console.error(err);
    return next(err);
  }
};

const getPost = async (req, res, next) => {
  const postId = req.params.postId;
  try {
    if (!postId) {
      return res.status(418).json(responseHandler(false, "존재하지않는 게시물입니다."));
    }
    const posts = await Post.findOne({
      include: [{
        model: User,
        attributes: ["nickname"],
      }, {
        model: Comment,
        attributes: ["comment"],
        include: {
          model: User,
          attributes: ["nickname"],
        }
      }],
      where: { id: postId },
      attributes: ["id", "title", "image"],
    });
    if (!posts) {
      return res.status(418).json(responseHandler(false, "존재하지않는 게시물입니다."));
    }
    return res.status(200).json(responseHandler(true, "조회 성공", posts));
  } catch (err) {
    console.error(err);
    return next(err);
  }
}; 

const createPost = async (req, res, next) => {
  const userId = req.user ? req.user.id : 1;
  const { title, content } = req.body;
  const path = req.file ? `/images/${req.file.filename}` : null;
  try {
    const post = await Post.create({
      title,
      content,
      image: path,
      UserId: userId,
    });
    if (!post) {
      return res.status(418).json(responseHandler(false, "작성 실패"));
    }
    return res.status(201).json(responseHandler(true, "작성 성공", post));
  } catch (err) {
    console.error(err);
    return next(err);
  }
};

const searchPosts = async (req, res, next) => {
  try {
    if (!req.query.writer && !req.query.title) {
      return res.status(418).json(responseHandler(false, "올바른 검색어를 입력해주세요."));
    }
    if (req.query.writer) {
      const posts = await User.findOne({
        include: {
          model: Post,
          attributes: ["title", "image"],
        },
        attributes: ["nickname"],
        where: { nickname: req.query.writer },
      });
      return res.status(200).json(responseHandler(true, "작성자로 검색 성공", posts));
    }
    if (req.query.title) {
      const posts = await Post.findAll({
        where: {
          title: { [Op.like]: "%" + req.query.title + "%" },
        },
        attributes: ["title", "image"],
        include: {
          model: User,
          attributes: ["nickname"],
        },
      });
      return res.status(200).json(responseHandler(true, "제목으로 검색 성공", posts));
    }
  } catch (err) {
    console.error(err);
    return next(err);
  }
};

const updatePost = async (req, res, next) => {
  const t = await sequelize.transaction();
  const userId = req.user ? req.user.id : 1;
  const postId = req.params.postId;
  const { title, content } = req.body;
  const path = req.file ? `/images/${req.file.filename}` : null;
  try {
    const post = await Post.findOne({
      where: { id: postId },
      attributes: ["UserId"],
    }, { transaction: t });
    if (!post) {
      return res.status(418).json(responseHandler(false, "게시글이 존재하지 않습니다."));
    }
    if (userId !== post.UserId) {
      return res.status(418).json(responseHandler(false, "내 게시글이 아닙니다."));
    }
    const update = await Post.update({
      title,
      content,
      image: path,
    }, {
      where: { id:  postId },
    });
    if (!update) {
      return res.status(418).json(responseHandler(false, "업데이트 실패"));
    }
    t.commit();
    return res.status(200).json(responseHandler(true, "업데이트 성공", update));
  } catch (err) {
    t.rollback();
    console.error(err);
    return next(err);
  }
};

const deletePost = async (req, res, next) => {
  const t = await sequelize.transaction();
  const userId = req.user ? req.user.id : 1;
  const postId = req.params.postId;
  try {
    const post = await Post.findOne({
      where: { id: postId },
      attributes: ["UserId"],
    }, { transaction: t });
    if (!post) {
      return res.status(418).json(responseHandler(false, "게시글이 존재하지 않습니다."));
    }
    if (userId !== post.UserId) {
      return res.status(418).json(responseHandler(false, "내 게시글이 아닙니다."));
    }
    const remove = await Post.destroy({
      where: { id: postId },
    });
    t.commit();
    return res.status(200).json(responseHandler(true, "삭제 성공", remove));
  } catch (err) {
    t.rollback();
    console.error(err);
    return next(err);
  }
};

export {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  searchPosts,
};