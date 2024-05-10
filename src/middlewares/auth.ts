import { Request, Response, NextFunction } from "express";
import {
  JsonWebTokenError,
  JwtPayload,
  TokenExpiredError,
  verify,
} from "jsonwebtoken";
import { RequestWithUser, Token } from "../entity/user.entity";

export const isAuthenticated = (
  req: RequestWithUser,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (req.headers.authorization) {
      const token = req.headers.authorization.split(" ")[1];
      const verifyToken = verify(
        token,
        process.env.ACCESS_TOKEN_SECRET as string,
      ) as JwtPayload;
      req.user = verifyToken;
      next();
    } else {
      res.status(401).json({ message: "Unauthorized" });
    }
  } catch (err) {
    if (err instanceof TokenExpiredError) {
      res.status(401).json({ message: "expired token" });
    } else if (err instanceof JsonWebTokenError) {
      res.status(401).json({ message: "malformed token (your token wrong)" });
    } else {
      console.log(err);
      res.status(500).json({ message: "something went wrong" });
    }
  }
};
