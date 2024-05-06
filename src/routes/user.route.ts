import { Request, Response, Router } from 'express';
import { userLogin, userRegister } from '../controllers/user.controller';

const userRouter = Router();

userRouter.post('/user/register', userRegister);

userRouter.post('/user/login', userLogin);


export default userRouter;