import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import userRouter from './routes/userRoutes.js';
import messageRouter from './routes/messageRoutes.js';
import { Server } from 'socket.io';
import http from 'http'
import cors from 'cors'
import cookieParser from 'cookie-parser';


dotenv.config();

const app = express();
app.use(cookieParser());
const server = http.createServer(app)



app.use(cors({
  origin: "http://localhost:5173",  // Vite frontend
  // origin: "https://real-time-chat-application-git-main-nikhils-projects-9dc5e1f8.vercel.app",  // Vite frontend
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true                // allow cookies/headers
}));

// initialize socket.io server

export const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",  // your React app
    methods: ["GET", "POST"],
    credentials: true,                // allow cookies or token headers
  },
});

// Store online Users
export const userSocketMap = {};
// socket.io connection handler
io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;

  if (!userId) return; // ignore invalid connections

  // Only add if not already connected
  if (!userSocketMap[userId]) {
    console.log("user Connected", userId);
    userSocketMap[userId] = socket.id;
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  }

  // Handle disconnect
  socket.on("disconnect", () => {
    if (userSocketMap[userId] === socket.id) {
      console.log("User Disconnected", userId);
      delete userSocketMap[userId];
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    }
  });
});


app.use(express.json());
const PORT = process.env.PORT;

app.get('/', (req, res) => {
  res.send("server is working fine")
})
app.use('/api/auth', userRouter);

app.use('/api/messages', messageRouter);

connectDB();

server.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
})