import Message from "../models/Message.model.js";
import User from "../models/User.model.js";
import { userSocketMap } from "../server.js";
import mongoose from "mongoose";
import { io } from "../server.js";

export const getAllUsers = async (req, res) => {
    console.log("getAllUsers route hit");
  try {
    console.log("Logged in userId:", req.userId);
    console.log("req.userId type:", typeof req.userId);

    const userId = new mongoose.Types.ObjectId(req.userId);

    // Log all users in DB for debugging
    const allUsers = await User.find().select('username');
    console.log("All users in DB:", allUsers);

    // Exclude the logged-in user
    const filteredUsers = await User.find({ _id: { $ne: userId } }).select('-password');
    console.log("Filtered users (without logged-in user):", filteredUsers);

    // Count number of unseen messages for each user
    const unseenMessages = {};
    const promises = filteredUsers.map(async (user) => {
      const messages = await Message.find({
        senderId: user._id,
        receiverId: userId,
        seen: false
      });
      if (messages.length > 0) {
        unseenMessages[user._id] = messages.length;
      }
    });
    await Promise.all(promises);

    res.json({ success: true, users: filteredUsers, unseenMessages });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};


// Get All messages for Selected users

export const gettAllMessages = async (req, res) => {
    try {
        const { id: selectedUserId } = req.params;
        const myId = req.userId;
        const messages = await Message.find({
            $or: [
                {
                    senderId: myId,
                    receiverId: selectedUserId
                },
                {
                    senderId: selectedUserId,
                    receiverId: myId,
                }
            ]
        }).sort({ createdAt: 1 });
        await Message.updateMany({ senderId: selectedUserId, receiverId: myId }, { seen: true })

        res.json({ success: true, messages })

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message })
    }
}

// api to mark messages as seen using message id
export const markMessagesAsSeen = async (req, res) => {
    try {
        const { id } = req.params;
        await Message.findByIdAndUpdate(id, { seen: true });
        res.json({ success: true })

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message })
    }
}

// send message to selected user
export const sendMessage = async (req, res) => {
    try {
        const senderId = req.userId;
        const receiverId = req.params.receiverId;
        const { text, image } = req.body;
     
 if (!senderId || !receiverId) {
  return res.status(400).json({ success: false, message: "Sender and receiver are required" });
}

if (!text && !image) {
  return res.status(400).json({ success: false, message: "Message or image is required" });
}

        let imageUrl;
        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }
        const newMessage = await Message.create({
            senderId,
            receiverId,
            text,
            image: imageUrl,
        })
        // emit the new message to the recievers socket

        const receiverSocketId = userSocketMap[receiverId]
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage)
        }

        res.json({ success: true, newMessage });

    } catch (error) {
        console.log("hii",error.message);
        res.json({ success: false, message: error.message })
    }
}