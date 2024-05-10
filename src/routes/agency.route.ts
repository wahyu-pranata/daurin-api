import * as path from "path";
import { Router } from "express";
import multer, { Options as MulterOptions } from "multer";
import { isAuthenticated } from "../middlewares/auth";
import {
  getAllAgencies,
  activateAccount,
} from "../controllers/agency.controller";

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

const agencyRouter = Router();

agencyRouter.post(
  "/agency/activate",
  upload.fields([
    { name: "ktpImage", maxCount: 1 },
    { name: "suratKepemilikanImage", maxCount: 1 },
    { name: "image", maxCount: 1 },
  ]),
  activateAccount,
);
agencyRouter.get("/agencies", getAllAgencies);

export default agencyRouter;
