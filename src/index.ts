import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.get("/", (req: Request, res: Response) => {
  res.status(200).send("Welcome to Daurin API");
});

app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});