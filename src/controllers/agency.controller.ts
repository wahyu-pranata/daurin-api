import { Request, Response } from "express";
import { RequestWithUser } from "../entity/user.entity";
import { PrismaClient } from "@prisma/client";
import { Agency } from "../entity/agency.entity";

const prisma = new PrismaClient();

export const getAllAgencies = async (req: RequestWithUser, res: Response) => {
  try {
    const result = await prisma.agency.findMany();
    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message:
        "Something went wrong. Please ask the server manager for the log",
    });
  }
};

export const activateAccount = async (req: RequestWithUser, res: Response) => {
  try {
    const files = req.files as unknown as {
      [fieldname: string]: Express.Multer.File;
    };
    if (!files) {
      res.status(400).json({ message: "file is required" });
      return;
    }
    const body = req.body;

    const agencyResult = await prisma.agency.create({
      data: {
        name: body.name,
        location: body.location,
        ktpNumber: body.ktpNumber,
        image: files.image.path,
        ktpImage: files.ktpImage.path,
        suratKepemilikanImage: files.suratKepemilikanImage.path,
      },
    });
    await prisma.user.update({
      where: {
        id: req.user!.id,
      },
      data: {
        agencyId: agencyResult.id,
      },
    });
    res.status(200).json({ message: "Success" });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message:
        "Something went wrong. Please ask the server manager for the log",
    });
  }
};
