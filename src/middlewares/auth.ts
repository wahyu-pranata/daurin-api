import { Request, Response, NextFunction } from 'express';

export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if(!req.cookies.token || req.cookies.token == '') {
    res.status(403).json({ message: "Sorry, you are not authorized..." });
  } else {
    next();
  }
}