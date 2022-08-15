import jwt from"jsonwebtoken";
import Joi from "joi";
import dotenv from "dotenv";

dotenv.config();

import User from "../models/user.js";

const re_email = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/;
const re_nickname = /^[a-zA-Z0-9]{2,15}$/;  //2~15 글자
const re_password = /^[a-zA-Z0-9]{4,30}$/;  //4~30 글자

const set_email = {email: Joi.string().pattern(re_email).required()}
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
      const { email, nickname, password } = await userSchema.validateAsync(req.body);
      await User.create({ email, nickname, password });
      return res.status(200).json(
        {
          success: true,
          message: "회원가입",
          result: {}
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
    try{
      const { email, password } = await loginSchema.validateAsync(req.body);
      const existUser = await User.findOne({ where: { email, password }, raw: true });

      if(existUser === null) return res.status(400).json({
        success: false,
        message: "없는 계정입니다",
        result: {}
      });
      else{
        const refreshtoken = jwt.sign({ }, process.env.REFRESH_TOKEN, { expiresIn: '3d' });
        const accesstoken = jwt.sign({ id: existUser.id }, process.env.ACCESS_TOKEN, { expiresIn: '15m' });

        res.cookie("refreshtoken", refreshtoken);
        res.cookie("accesstoken", accesstoken);

        return res.status(200).json({
          success: true,
          message: "로그인",
          result: {accesstoken}
        });
      }
    }
    catch(err){
      return res.status(400).json({
        success: false,
        message: err,
        result: {}
      });
    }
  };

  //이메일 존재여부 확인
  check_email = async (req, res, next) => {               
    try{
      const { email } = await emailSchema.validateAsync(req.params);
      await emailSchema.validateAsync(email)
      const existemail = await User.findOne({ where: { email }, raw: true });

      if(existemail!==null) return res.status(400).json({
        success: false,
        message: "이미 존재하는 이메일입니다",
        result: {}
      });
      else return res.status(200).json({
        success: true,
        message: "사용가능한 이메일입니다",
        result: {}
      });
    }
    catch(err){
      return res.status(400).json({
        success: false,
        message: err,
        result: {}
      });
    }
  };

  //닉네임 존재여부 확인
  check_nick = async (req, res, next) => {               
    try{
      const { nickname } = await nickSchema.validateAsync(req.params);
      const existnick = await User.findOne({ where: { nickname }, raw: true });

      if(existnick!==null) return res.status(400).json({
        success: false,
        message: "이미 존재하는 닉네임입니다",
        result: {}
      });
      else return res.status(200).json({
        success: true,
        message: "사용가능한 닉네임입니다",
        result: {}
      });
    }
    catch(err){
      return res.status(400).json({
        success: false,
        message: err,
        result: {}
      });
    }
  };
}
export default new UserController;