import { Request, Response } from "express";
import { ProcessOrder, processOrderSchema } from "../entity/order.entity";
import { PrismaClient } from "@prisma/client";
import { ZodError } from "zod";
import { RequestWithUser } from "../entity/user.entity";

const prisma = new PrismaClient();

export const createOrder = async (req: RequestWithUser, res: Response) => {
  try {
    if (!req.files) {
      res.status(400).json({ message: "Image is required" });
      return;
    }
    const { address, agencyId, deliveryOptions, items } = req.body;
    const orderResult = await prisma.order.create({
      data: {
        address,
        deliveryOptions,
        agencyId: parseInt(agencyId),
        customerId: parseInt(req.user!.id),
      },
    });

    const filesAmount = req.files.length as number;
    let parsedItems: { itemId: any; amount: any }[] = JSON.parse(items);
    parsedItems = parsedItems.map((val) => {
      return {
        itemId: parseInt(val.itemId),
        amount: parseInt(val.amount),
      };
    });

    for (let i = 0; i < filesAmount; i++) {
      const file = req.files as Express.Multer.File[];
      const itemsOnOrdersResult = await prisma.itemsOnOrders.create({
        data: {
          amount: parsedItems[i].amount,
          image: file[i].path,
          price: 0,
          orderId: orderResult.id,
          itemId: parsedItems[i].itemId,
        },
      });
    }

    res.status(201).json({ message: "success" });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message:
        "Something went wrong on the server, please ask the server manager...",
    });
  }
};

export const getOrderByAgency = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const agencyId = parseInt(id);
    const result = await prisma.order.findMany({
      where: {
        agencyId,
      },
      include: {
        ItemsOnOrders: {
          include: {
            items: true,
          },
        },
      },
    });

    const mappedResult = result.map((val) => {
      return {
        items: val.ItemsOnOrders.map((itemsorders) => {
          return {
            id: itemsorders.itemId,
            name: itemsorders.items.name,
            unit: itemsorders.items.unit,
            estimatedPrice: itemsorders.items.estimatedPrice,
            image: itemsorders.image,
          };
        }),
        type: val.deliveryOptions,
        status: val.status,
        addres: val.address,
        shippingCost: val.shippingCost,
      };
    });
    res.status(200).json({
      message: "Success",
      data: mappedResult,
    });
  } catch (err: any) {
    console.log(err);
    res.status(500).json({
      message:
        "Something went wrong. Please ask the server manager for the log",
    });
  }
};

export const getOrderByCustomer = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const customerId = parseInt(id);
    const result = await prisma.order.findMany({
      where: {
        customerId,
      },
      include: {
        ItemsOnOrders: {
          include: {
            items: true,
          },
        },
      },
    });

    const mappedResult = result.map((val) => {
      return {
        items: val.ItemsOnOrders.map((itemsorders) => {
          return {
            id: itemsorders.itemId,
            name: itemsorders.items.name,
            unit: itemsorders.items.unit,
            estimatedPrice: itemsorders.items.estimatedPrice,
            image: itemsorders.image,
          };
        }),
        type: val.deliveryOptions,
        status: val.status,
        address: val.address,
        shippingCost: val.shippingCost,
      };
    });
    res.status(200).json({
      message: "Success",
      data: mappedResult,
    });
  } catch (err: any) {
    console.log(err);
    res.status(500).json({
      message:
        "Something went wrong. Please ask the server manager for the log",
    });
  }
};

export const getSingleOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const orderResult = await prisma.order.findUnique({
      where: {
        id: parseInt(id),
      },
      include: {
        agency: true,
        customer: true,
        ItemsOnOrders: {
          include: {
            items: true,
          },
        },
      },
    });
    if (!orderResult) {
      res.status(404).json({ message: "Not found" });
      return;
    }
    const mappedResult = {
      items: orderResult.ItemsOnOrders.map((item) => {
        return {
          id: item.itemId,
          name: item.items.name,
          unit: item.items.unit,
          estimatedPrice: item.items.estimatedPrice,
          image: item.image,
          amount: item.amount,
        };
      }),
      agency: {
        id: orderResult.agency.id,
        name: orderResult.agency.id,
        location: orderResult.agency.location,
      },
      customer: {
        id: orderResult.customer.id,
        name: orderResult.customer.name,
        email: orderResult.customer.email,
        image: orderResult.customer.image,
        address: orderResult.customer.address,
        city: orderResult.customer.city,
        province: orderResult.customer.province,
      },
      type: orderResult.deliveryOptions,
      status: orderResult.status,
      shippingCost: orderResult.shippingCost,
      address: orderResult.address,
    };

    res.status(200).json({ data: mappedResult });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message:
        "Something went wrong. Please ask the server manager for the log",
    });
  }
};

export const updateToProcess = async (req: Request, res: Response) => {
  try {
    const data: ProcessOrder = req.body;
    const { orderId } = req.params;
    const parsedData = processOrderSchema.parse(data);

    const orderResult = await prisma.order.update({
      where: {
        id: parseInt(orderId),
      },
      data: {
        shippingCost: parsedData.shippingCost,
        status: "OnProgress",
      },
    });

    data.items.forEach(async (item) => {
      await prisma.itemsOnOrders.update({
        where: {
          orderId_itemId: {
            itemId: item.id,
            orderId: parseInt(orderId),
          },
        },
        data: {
          price: item.price,
        },
      });
    });

    res.status(200).json({ message: "success" });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message:
        "Something went wrong. Please ask the server manager for the log",
    });
  }
};

export const updateToSuccess = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const image = req.file;
    console.log(image);
    if (!image) {
      res.status(400).json({ message: "image is required" });
      return;
    }
    const result = await prisma.order.update({
      where: {
        id: parseInt(orderId),
      },
      data: {
        transactionProof: image.path,
        status: "Success",
      },
    });
    res.status(200).json({ message: "success" });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message:
        "Something went wrong. Please ask the server manager for the log",
    });
  }
};

export const updateToCancel = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    await prisma.order.update({
      where: {
        id: parseInt(orderId),
      },
      data: {
        status: "Pending",
      },
    });
    res.status(200).json({ message: "success" });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message:
        "Something went wrong. Please ask the server manager for the log",
    });
  }
};

export const rateOrder = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const { rate } = req.body;

    const rateOrderResult = await prisma.order.update({
      where: {
        id: parseInt(orderId),
      },
      data: {
        rate: parseInt(rate),
      },
    });

    const getAgencySuccessOrder = await prisma.agency.count({
      where: {
        orders: {
          some: {
            status: "Success",
          },
        },
      },
    });

    const getAgencySuccessOrderRate = await prisma.order.aggregate({
      _sum: {
        rate: true,
      },
      where: {
        agencyId: rateOrderResult.agencyId,
      },
    });

    let agencySumRate = getAgencySuccessOrderRate._sum.rate;
    if (agencySumRate == null) {
      agencySumRate = 0;
    }
    console.log(getAgencySuccessOrder);

    const updateAgencyRate = await prisma.agency.update({
      where: {
        id: rateOrderResult.agencyId,
      },
      data: {
        rate: agencySumRate / getAgencySuccessOrder,
      },
    });

    res.status(200).json({ message: "success" });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message:
        "Something went wrong. Please ask the server manager for the log",
    });
  }
};

export const getLatestAddress = async (req: RequestWithUser, res: Response) => {
  try {
    const userId = req.user!.id;
    console.log(userId);

    const result = await prisma.order.findMany({
      where: {
        customerId: userId,
      },
      select: {
        address: true,
      },
      distinct: ["address"],
    });

    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Something went wrong. Please ask server manager for the log",
    });
  }
};
