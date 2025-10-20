import express from "express";
// import { isAuth } from "../controllers/userController.js";
import { getAllUsers, gettAllMessages, markMessagesAsSeen, sendMessage } from "../controllers/messageController.js";
import authUser from "../middlewares/authUser.js";

const messageRouter = express.Router();


messageRouter.get("/users", authUser, getAllUsers);
messageRouter.get("/:id", authUser, gettAllMessages);
messageRouter.put("/mark/:id", authUser, markMessagesAsSeen);
messageRouter.post("/send/:receiverId",authUser, sendMessage);

export default messageRouter;