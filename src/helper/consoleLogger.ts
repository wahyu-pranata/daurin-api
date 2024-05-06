import { Request, Response, NextFunction } from 'express';

const consoleLogger = (req: Request, res: Response, next: NextFunction) => {
  const method = req.method.toUpperCase();
  const path = req.path;
  const date = new Date();

  const h = date.getHours(); 
  const m = date.getMinutes();
  const s = date.getSeconds();

  console.log(`[${method} - ${path}] .................................................................................... [${h}:${m}:${s}]`);

  next();
}

export default consoleLogger;