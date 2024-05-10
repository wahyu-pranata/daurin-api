import { z } from "zod";
import { isEmail } from "validator";
import { UserRole } from "@prisma/client";

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
};

export type LoginUser = {
  email: string;
  password: string;
};

export const userRegisterValidation = z.object({
  name: z.string(),
  email: z
    .string()
    .refine(isEmail, { message: "Pleae enter valid email address" }),
  password: z.string(),
  city: z.string(),
  province: z.string(),
});

export const userLoginValidation = z.object({
  email: z
    .string()
    .refine(isEmail, { message: "Please enter valid email address" }),
  password: z.string(),
});
