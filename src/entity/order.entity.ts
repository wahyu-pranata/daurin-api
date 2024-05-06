import { z } from "zod";

export type CreateOrder = {
  amount: number;
  deliveryOptions: boolean;
  customerId: number;
  itemId: number;
  agencyId: number;
}

export const orderSchema = z.object({
  amount: z.number(),
  deliveryOptions: z.boolean(),
  customerId: z.number(),
  itemId: z.number(),
  agencyId: z.number(),
});