import express from 'express';
import { body } from 'express-validator';
import { Request, Response } from 'express';
import {validateRequest, BadRequestError} from "@retix/common";
import {User} from "../models/user";
import { password as PasswordManager } from '../services/password';
import jwt from 'jsonwebtoken';
const router = express.Router();

router.post('/api/users/signin', [
  body('email').isEmail().withMessage('Email must be valid 123'),
  body('password').trim().notEmpty().withMessage('Password must be between 4 and 20 characters'),
],validateRequest, async (req:Request, res:Response) => {
  const {email,password} = req.body;
  const existingUser = await User.findOne({email});
  if(!existingUser){
    throw new BadRequestError('Invalid credentials');
  }
  const passwordMatch = await PasswordManager.compare(existingUser.password,password);
  if(!passwordMatch){
    throw new BadRequestError('Invalid credentials');
  }
  const userJwt = jwt.sign({id:existingUser.id,email:existingUser.email},process.env.JWT_KEY!);
  req.session = {
    jwt:userJwt
  }
  res.status(200).send(existingUser);
  
  });

export { router as signinRouter };
