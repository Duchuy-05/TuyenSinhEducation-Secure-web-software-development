import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { verifyToken, isAdmin } from '../middlewares/auth.middleware';
import { checkOrigin } from '../middlewares/checkOrigin.middleware';

const userRouter : Router = Router();

userRouter.get('/users', verifyToken, isAdmin, UserController.getAllUsers)
userRouter.get('/users/:id', verifyToken, isAdmin, UserController.getUserById)
userRouter.delete('/users/:id', verifyToken, isAdmin, UserController.deleteUser)
userRouter.put('/users/me', verifyToken, UserController.updateProfile);
userRouter.put('/users/me/password', verifyToken, checkOrigin, UserController.changePassword);

export default userRouter;
