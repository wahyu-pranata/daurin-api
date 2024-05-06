import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors, { CorsOptions } from 'cors';


import consoleLogger from './helper/consoleLogger';

import userRouter from './routes/user.route';
import orderRouter from './routes/order.route';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;
const corsOptions: CorsOptions = {
  origin: ['http://localhost:3000']
}

app.use(express.json());
app.use(cookieParser());
app.use(consoleLogger);

app.get("/", (req: Request, res: Response) => {
  res.status(200).send("Welcome to Daurin API");
});

app.use(userRouter);
app.use(orderRouter)

app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});