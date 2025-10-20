import express from "express";
import { isAuth, Login, logout, signUp, userProfile } from "../controllers/userController.js";
import authUser from "../middlewares/authUser.js";

const userRouter = express.Router();

userRouter.post("/signup",signUp);
userRouter.post("/login",Login);
userRouter.get("/is-auth",authUser,isAuth);
userRouter.get("/logout",authUser,logout);
userRouter.put("/profile",authUser,userProfile);

export default userRouter;