# 💬 We Chat – Real-Time Chat Application

**We Chat** is a modern **real-time chat application** built with **React, Node.js, Express, Socket.io, and MongoDB**.  
It allows users to **create accounts, log in securely with a password**, and **chat in real-time** with other users.  
Users can also **update their profile**, **share images**, and **see who’s online** — all in a simple and elegant interface.

---

## 🚀 Features

- 🔐 **Password-based Authentication** (Signup & Login)
- 💬 **Real-time Messaging** with Socket.io
- 📸 **Image Upload & Sharing** via Cloudinary
- 🟢 **Online / Offline User Status**
- 👤 **User Profile Management** (Username, Bio, Profile Image)
- 🧠 **React Context API** for global state management

---

## 🧰 Tech Stack

| Category | Technologies |
|-----------|---------------|
| **Frontend** | React, Tailwind CSS, Context API |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB (Mongoose) |
| **Real-time** | Socket.io |
| **Cloud Storage** | Cloudinary |
| **Authentication** | JWT + bcrypt (Password Hashing) |

---

# 🛠️ Installation & Setup

###  Clone the repository and set up the project
```bash
# Clone the repo
git clone https://github.com/your-username/we-chat.git
cd we-chat

# Install dependencies for server
cd server
npm install

# Install dependencies for client
cd ../client
npm install

# Setup environment variables

## Server .env (create inside server folder)
# MONGO_URI=your_mongodb_connection_string
# JWT_SECRET=your_secret_key
# CLOUDINARY_CLOUD_NAME=your_cloud_name
# CLOUDINARY_API_KEY=your_api_key
# CLOUDINARY_API_SECRET=your_api_secret
# PORT=3000

## Client .env (create inside client folder)
# VITE_BACKEND_URL=http://localhost:3000

# Start backend server
cd ../server
npm run dev

# Start frontend server
cd ../client
npm run dev
