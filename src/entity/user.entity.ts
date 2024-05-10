import { z } from "zod";
import { isEmail } from "validator";
import { UserRole } from "@prisma/client";
import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";

export type User = {
  id: string;
  email: string;
};

export type CreateUser = {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  address: string;
  city: string;
  province: string;
  agencyId: number | null;
};

export type RegisterUser = {
  name: string;
  email: string;
  password: string;
  city: string;
  province: string;
  address: string;
  role: UserRole;
};

export type LoginUser = {
  email: string;
  password: string;
};

export type ActivateAccountUser = {
  name: string;
  noKTP: string;
  ktpImage: string;
  suratKepemilikanImage: string;
  image: string;
};

export interface RequestWithUser extends Request {
  user?: JwtPayload;
}

export interface Token {
  payload: User;
  iat: number;
  exp: number;
}

export const userRegisterValidation = z.object({
  name: z.string(),
  email: z
    .string()
    .refine(isEmail, { message: "Pleae enter valid email address" }),
  password: z.string(),
  city: z.string(),
  province: z.string(),
  address: z.string(),
  role: z.enum(["Agent", "Customer"]),
});

export const userLoginValidation = z.object({
  email: z
    .string()
    .refine(isEmail, { message: "Please enter valid email address" }),
  password: z.string(),
});
