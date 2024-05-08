import { Request, Response } from 'express';
import { CreateOrder, orderSchema } from '../entity/order.entity'
import { PrismaClient } from '@prisma/client';
import { ZodError } from 'zod';
import { PrismaClientKnownRequestError, PrismaClientValidationError } from '@prisma/client/runtime/library';

const prisma = new PrismaClient();

export const getOrderByAgency = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const agencyId = parseInt(id);
    const result = await prisma.order.findMany({
      where: {
        agencyId
      }
    })
    res.status(200).json({
      message: "Success",
      data: result
    })
  } catch(err: any) {
    console.log(err);
    res.status(500).json({ message: "Something went wrong. Please ask the server manager for the log" });
  }
}

export const getOrderByCustomer = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const customerId = parseInt(id);
    const result = await prisma.order.findMany({
      where: {
        customerId
      }
    })
    res.status(200).json({
      message: "Success",
      data: result
    })
  } catch(err: any) {
    console.log(err);
    res.status(500).json({ message: "Something went wrong. Please ask the server manager for the log" });
  }
}

export const createOrder = async (req: Request, res: Response) => {
  try {
    if(!req.file) {
      res.status(400).json({ message: "Image is required" });
      return;
    }
    
    const data: CreateOrder = req.body;
    data.image = req.file.path;
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