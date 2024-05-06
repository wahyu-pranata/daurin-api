import { Request, Response, Router } from 'express';
import { userLogin, userRegister, getUser } from '../controllers/user.controller';
import { isAuthenticated } from '../middlewares/auth';

const userRouter = Router();

userRouter.post('/user/register', userRegister);

userRouter.post('/user/login', userLogin);

userRouter.get('/user', isAuthenticated, getUser)


export default userRouter;