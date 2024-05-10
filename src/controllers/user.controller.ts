import { Request, Response } from "express";
import * as bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

import {
  RegisterUser,
  LoginUser,
  CreateUser,
  userRegisterValidation,
  ActivateAccountUser,
  RequestWithUser,
} from "../entity/user.entity";
import { generateAccessToken, decodeToken } from "../helper/jwt";
import { ZodError } from "zod";

const prisma = new PrismaClient();

export const userRegister = async (req: Request, res: Response) => {
  try {
    const data: RegisterUser = req.body;
    const parsedData = userRegisterValidation.parse(data);

    const salt = await bcrypt.genSalt(10);
    parsedData.password = await bcrypt.hash(parsedData.password, salt);

    const userData: CreateUser = {
      ...parsedData,
      agencyId: null,
    };

    console.log("user data: ", userData);
    const result = await prisma.user.create({
      data: {
        name: userData.name,
        email: userData.email,
        password: userData.password,
        role: userData.role,
        city: userData.city,
        province: userData.province,
        address: userData.address,
      },
    });
    return res
      .status(201)
      .json({ message: "User successfully created", data: result });
  } catch (err: any) {
    if (err.name == "ZodError") {
      res.status(400).json(err.issues);
      return;
    }
    console.log(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const userLogin = async (req: Request, res: Response) => {
  try {
    const data: LoginUser = req.body;

    const user = await prisma.user.findFirst({
      where: {
        email: data.email,
      },
    });

    if (!user) {
      return res.status(404).json({
        message:
          "The credentials you provided doesn't match our records. Please try again",
      });
    }

    const isPasswordMatch = await bcrypt.compare(data.password, user.password);

    if (!isPasswordMatch) {
      return res.status(404).json({
        message:
          "The credentials you provided doesn't match our records. Please try again",
      });
    }

    const tokens = generateAccessToken({ id: user.id, name: user.name });
    res
      .status(200)
      .cookie("token", tokens.accessToken, { httpOnly: true })
      .json({
        message: "Login success",
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      });
  } catch (err: any) {
    if (err instanceof ZodError) {
      console.log(err.message);
    } else if (err instanceof Error) {
      console.log(err.message);
    }
    res.status(500).json({ message: "Something went wrong in server..." });
  }
};

export const getUser = async (req: RequestWithUser, res: Response) => {
  if (!req.user) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  const id = req.user.id;

  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  });
  return res.status(200).json(user);
};
