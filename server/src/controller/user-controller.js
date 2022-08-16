import jwt from"jsonwebtoken";
import Joi from "joi";
import dotenv from "dotenv";
import bcrypt from "bcrypt";

dotenv.config();

import User from "../models/user.js";

import responseHandler from "../modules/hanlder.js";

const re_email = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/;
const re_nickname = /^[0-9a-zA-Z]{2,15}$/;  //2~15 글자
const re_password = /^[0-9a-zA-Z]{4,30}$/;  //4~30 글자

const set_email = Joi.string().pattern(re_email).required();
const set_nickname = Joi.string().pattern(re_nickname).required();
const set_password = Joi.string().pattern(re_password).required();

const userSchema = Joi.object({email:set_email,nickname:set_nickname,password:set_password}).unknown();
const emailSchema = Joi.object({email:set_email}).unknown();
const nickSchema = Joi.object({nickname:set_nickname}).unknown();

//UserController 클래스 생성 및 방출
class UserController {

  //계정생성
  join = async (req, res, next) => {                    
    try{
      const { email, nickname, password } = await userSchema.validateAsync(req.body); 
      const encryptedPW = bcrypt.hashSync(password, 10);
      await User.create({ email, nickname, password:encryptedPW });
      return res.status(200).json(responseHandler(true, "회원가입 성공"));
    }
    catch(err){
      return res.status(400).json(responseHandler(false, err));
    }
  };

  //로그인
  login = async (req, res, next) => {                   
    const { email, password } = req.body;
    try {
      if (!email || !password) {
        return res.status(418).json(responseHandler(false, "Request body is not found"));
      }
      const user = await User.findOne({ where: { email }, raw:true});
      console.log(user);
      const token = jwt.sign(
        {
          userId: user.id,
        },
        "machoman",
        {
          expiresIn: "10m",
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
    try{
      const { email } = req.params
      const existemail = await User.findOne({ where: { email }, raw: true });

      if(existemail!==null) return res.status(400).json(responseHandler(false, "사용불가능한 이메일입니다"));
      else return res.status(200).json(responseHandler(true, "사용가능한 이메일입니다"));
    }
    catch(err){
      return res.status(400).json(responseHandler(false, err));
    }
  };

  //닉네임 존재여부 확인
  check_nick = async (req, res, next) => {               
    try{
      const { nickname } = req.params
      const existnick = await User.findOne({ where: { nickname }, raw: true });

      if(existnick!==null) return res.status(400).json(responseHandler(false, "사용불가능한 닉네임입니다"));
      else return res.status(200).json(responseHandler(false, "사용가능한 닉네임입니다"));
    }
    catch(err){
      return res.status(400).json(responseHandler(false, err));
    }
  };
}
export default new UserController;