import { Request, Response, NextFunction } from "express";
import { JsonWebTokenError, TokenExpiredError, verify } from "jsonwebtoken";

export const isAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.query.token;
    if (!token) {
      res.status(403).json({ message: "Sorry, you are not authorized..." });
      return;
    }
    console.log(token);
    verify(token as string, process.env.ACCESS_TOKEN_SECRET as string);
    next();
  } catch (err) {
    if (err instanceof TokenExpiredError) {
      res.status(403).json({ message: "expired token" });
    } else if (err instanceof JsonWebTokenError) {
      res.status(403).json({ message: "malformed token (your token wrong)" });
    } else {
      console.log(err);
      res.status(500).json({ message: "something went wrong" });
    }
  }
};
