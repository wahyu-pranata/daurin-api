import { z } from "zod";
import { OrderStatus } from "@prisma/client";

// export type CreateOrder = {
//   amount: number;
//   deliveryOptions: boolean;
//   status: OrderStatus;
//   image: string;
//   customerId: number;
//   itemId: number;
//   agencyId: number;
// }

export const orderSchema = z.object({
  amount: z.coerce.number(),
  deliveryOptions: z.coerce.boolean(),
  image: z.string(),
  customerId: z.coerce.number(),
  itemId: z.coerce.number(),
  agencyId: z.coerce.number(),
});

export type CreateOrder = {
  items: {
    itemId: number;
    amount: number;
    image: string;
  }[];
  deliveryOptions: boolean;
  customerId: number;
  agencyId: number;
  address: string;
};

export type ProcessOrder = {
  shippingCost: number;
  items: {
    id: number;
    price: number;
  }[];
};

export const processOrderSchema = z.object({
  shippingCost: z.coerce.number(),
  items: z.array(
    z.object({
      id: z.coerce.number(),
      price: z.coerce.number(),
    }),
  ),
});
