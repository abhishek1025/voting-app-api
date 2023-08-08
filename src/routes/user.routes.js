import { Router } from "express";
import { userController } from "../controllers/index.js";

const userRouter = Router();

userRouter.post('/register', userController.registerUser)
userRouter.post('/login', userController.logIn)

export default userRouter;