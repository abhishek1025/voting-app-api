import { Router } from "express";
import { userController } from "../controllers/index.js";

const userRouter = Router();

userRouter.post('/register', userController.registerUser)
userRouter.post('/login', userController.logIn)
userRouter.post('/forgot-password', userController.forgotPassword)
userRouter.get('/get-all-users', userController.getAllUsers)

export default userRouter;