import { Router } from "express";

import { createOrder } from "../controllers/order.controller";
import { isAuthenticated } from '../middlewares/auth';

const orderRouter = Router();

orderRouter.post('/order', isAuthenticated, createOrder);

export default orderRouter;