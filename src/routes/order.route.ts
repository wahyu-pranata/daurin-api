import * as path from "path";
import { Router } from "express";
import multer, { Options as MulterOptions } from "multer";

import {
  createOrder,
  getOrderByAgency,
  getOrderByCustomer,
  getSingleOrder,
  rateOrder,
  updateToCancel,
  updateToProcess,
  updateToSuccess,
  getLatestAddress,
} from "../controllers/order.controller";
import { isAuthenticated } from "../middlewares/auth";

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/upload");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e6);
    cb(
      null,
      `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`,
    );
  },
});
const upload = multer({
  storage: multerStorage,
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
  fileFilter(req, file, cb) {
    if (!file.mimetype.startsWith("image")) {
      cb(null, false);
    } else {
      cb(null, true);
    }
  },
});

const orderRouter = Router();
orderRouter.use(isAuthenticated);

orderRouter.get("/order/agency/:id", getOrderByAgency);
orderRouter.get("/order/customer/:id", getOrderByCustomer);
orderRouter.put("/order/process/:orderId", updateToProcess);
orderRouter.put(
  "/order/success/:orderId",
  upload.single("image"),
  updateToSuccess,
);
orderRouter.put("/order/cancel/:orderId", updateToCancel);
orderRouter.put("/order/rate/:orderId", rateOrder);
orderRouter.get("/order/addresses", getLatestAddress);
orderRouter.get("/order/:id", getSingleOrder);
orderRouter.post("/order", upload.array("image"), createOrder);

export default orderRouter;
