import { Request, Response } from 'express';
import * as bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

import { RegisterUser, LoginUser, CreateUser, userRegisterValidation } from '../entity/user.entity';
import  { generateAccessToken, decodeToken } from '../helper/jwt';
import { ZodError } from 'zod';

const prisma = new PrismaClient();

export  const userRegister = async (req: Request, res: Response) => {
  try {
    const data: RegisterUser = req.body;
    const parsedData = userRegisterValidation.parse(data);

    const salt = await bcrypt.genSalt(10);
    parsedData.password = await bcrypt.hash(parsedData.password, salt);

    const userData: CreateUser = {
      ...parsedData,
      role: 'Customer',
      address: '-',
      agencyId: null
    };

    const user = await prisma.user.create({
      data: userData
    });

    if(user) {
      return res.status(201).json({ message: 'User successfully created' });
    }
    
  } catch(err: any) {
    if(err.name == 'ZodError') {
      res.status(400).json(err.issues);
    }
  }
}

export const userLogin = async (req: Request, res: Response) => {
  try {
    const data: LoginUser = req.body;

    const user = await prisma.user.findFirst({
      where: {
        email: data.email
      }
    })

    if(!user) {
      return res.status(404).json({ message: 'The credentials you provided doesn\'t match our records. Please try again' });
    }
    
    const isPasswordMatch = await bcrypt.compare(data.password, user.password);
    
    if(!isPasswordMatch) {
      return res.status(404).json({ message: 'The credentials you provided doesn\'t match our records. Please try again' });
    }

    const tokens = generateAccessToken(user);
    res
      .status(200)
      .cookie('token', tokens.accessToken, { httpOnly: true })
      .json({ message: "Login success", accessToken: tokens.accessToken, refreshToken: tokens.refreshToken });

  } catch (err: any) {
    if(err instanceof ZodError) {
      console.log(err.message);
    } else if(err instanceof Error) {
      console.log(err.message);
    }
    res.status(500).json({ message: "Something went wrong in server..." });
  }
}

export const getUser = (req: Request, res: Response) => {
  const { token } = req.body;

  const userData = decodeToken(token);
  return res.status(200).json({ user: userData });
} 