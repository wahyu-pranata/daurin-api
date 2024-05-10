import { Request, Response, Router } from "express";
import {
  userLogin,
  userRegister,
  getUser,
  activateAccount,
} from "../controllers/user.controller";
import { isAuthenticated } from "../middlewares/auth";
import multer, { Options as MulterOptions } from "multer";
import path from "path";

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
    fileSize: 20 * 1024 * 1024,
  },
  fileFilter(req, file, cb) {
    if (!file.mimetype.startsWith("image")) {
      cb(null, false);
    } else {
      cb(null, true);
    }
  },
});

const userRouter = Router();

userRouter.post("/user/register", userRegister);
userRouter.post("/user/login", userLogin);
userRouter.get("/user", isAuthenticated, getUser);
userRouter.post(
  "/user/activate",
  upload.fields([
    {
      name: "ktpImage",
      maxCount: 1,
    },
    {
      name: "suratKepemilikanImage",
      maxCount: 1,
    },
    {
      name: "image",
      maxCount: 1,
    },
  ]),
  activateAccount,
);

export default userRouter;
