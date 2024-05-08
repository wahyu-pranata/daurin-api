import { z } from "zod";
import { OrderStatus } from '@prisma/client';

export type CreateOrder = {
  amount: number;
  deliveryOptions: boolean;
  status: OrderStatus;
  image: string;
  customerId: number;
  itemId: number;
  agencyId: number;
}

export const orderSchema = z.object({
  amount: z.coerce.number(),
  deliveryOptions: z.coerce.boolean(),
  image: z.string(),
  customerId: z.coerce.number(),
  itemId: z.coerce.number(),
  agencyId: z.coerce.number(),
});