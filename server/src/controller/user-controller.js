import jwt from"jsonwebtoken";
import Joi from "joi";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import passport from "passport";

dotenv.config();

import User from "../models/user.js";

import responseHandler from "../modules/hanlder.js";

const re_email = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/;
const re_nickname = /^[a-zA-Z0-9]{2,15}$/;  //2~15 글자
const re_password = /^[a-zA-Z0-9]{4,30}$/;  //4~30 글자

const set_email = {email: Joi.string().pattern(re_email).required()};
const set_nickname = {nickname: Joi.string().pattern(re_nickname).required()}
const set_password = {password: Joi.string().pattern(re_password).required()}

const userSchema = Joi.object({set_email,set_nickname,set_password,}).unknown();
const loginSchema = Joi.object({set_email,set_password,}).unknown();
const emailSchema = Joi.object({set_email,}).unknown();
const nickSchema = Joi.object({set_nickname,}).unknown();

//UserController 클래스 생성 및 방출
class UserController {

  //계정생성
  join = async (req, res, next) => {                    
    try{
      const { email, nickname, password } = req.body;
      const hash = await bcrypt.hash(password, 12); 
      const user = await User.create({
        email,
        nickname,
        password: hash,
      });
      return res.status(200).json(
        {
          success: true,
          message: "회원가입 성공",
          result: user.nickname,
        }
      );
    }
    catch(err){
      return res.status(400).json({
        success: false,
        message: err,
        result: {}
      });
    }
  };

  //로그인
  login = async (req, res, next) => {                   
    const { email, password } = req.body;
    try {
      if (!email || !password) {
        return res.status(418).json(responseHandler(false, "Request body is not found"));
      }
      const user = await User.findOne({ where: { email }});
      if (!user) {
        return res.status(418).json(responseHandler(false, "이메일을 확인해주세요.",));
      }
      const compare = await bcrypt.compare(password, user.password);
      if (!compare) {
        return res.status(418).json(responseHandler(false, "비밀번호를 확인해주세요."));
      }
      const token = jwt.sign(
        {
          userId: user.id,
        },
        process.env.TOKEN_SECRET,
        {
          expiresIn: "1s",
        }
      );
      return res.status(200).json(responseHandler(true, "로그인 성공", token));
    } catch (err) {
      console.error(err);
      next(err);
    }
  };

  //이메일 존재여부 확인
  check_email = async (req, res, next) => {               
    const  email = req.params.email;
    if (!email) {
      return res.status(418).json(responseHandler(false, "Request body is not found"));
    }
    try {
      const result = await User.findOne({ where: { email }});
      if (result) {
        return res.status(418).json(responseHandler(false, "이미 사용중인 이메일입니다."));
      }
      return res.status(200).json(responseHandler(true, "사용해도 좋은 이메일입니다."));
    } catch (err) {
      console.error(err);
      next(err);
    }
  };

  //닉네임 존재여부 확인
  check_nick = async (req, res, next) => {           
    const nickname = req.params.nickname;
    try {
      const result = await User.findOne({ where: { nickname }});
      if (result) {
        return res.status(418).json(responseHandler(false, "이미 사용중인 닉네임입니다."));
      }
      return res.status(200).json(responseHandler(true, "사용해도 좋은 닉네임입니다."));
    } catch (err) {
      console.error(err);
      next(err);
    }
  };
} 

export default new UserController;