import { Request, Response } from 'express';
import { CreateOrder, orderSchema } from '../entity/order.entity'
import { PrismaClient } from '@prisma/client';
import { ZodError } from 'zod';
import { PrismaClientKnownRequestError, PrismaClientValidationError } from '@prisma/client/runtime/library';

const prisma = new PrismaClient();

export const createOrder = async (req: Request, res: Response) => {
  try {
    const data: CreateOrder = req.body;
    const parsedData = orderSchema.parse(data);

    const result = await prisma.order.create({
      data: parsedData
    });

    res.status(201).json({ message: "Success", result });
  } catch(err: any) {
    if(err instanceof ZodError) {
      console.log(err.message);
    } else if(err instanceof PrismaClientKnownRequestError || err instanceof PrismaClientValidationError) {
      console.log(err.message);
    }
    res.status(500).json({ message: "Something went wrong.." })
  }
}