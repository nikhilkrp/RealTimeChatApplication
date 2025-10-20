import { createContext, useEffect, useState } from "react";
import axios from 'axios';
import toast from "react-hot-toast"
import { io } from "socket.io-client"



const backendUrl = import.meta.env.VITE_BACKEND_URL;
axios.defaults.baseURL = backendUrl;
axios.defaults.withCredentials = true;


export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [authUser, setAuthUser] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [socket, setSocket] = useState(null)
    const [isLoggingOut, setIsLoggingOut] = useState(false);


    // check for authentic user and connecting it to socket

    const checkAuth = async () => {
        try {
            console.log("Backend URL →", backendUrl);
            const { data } = await axios.get("/api/auth/is-auth")
            if (data.success) {
                setAuthUser(data.user)
                connectSocket(data.user)
            }
        } catch (error) {
            console.log("User Is not Authenticated", error);
            toast.error(error.message)
        }
    }

    // login
    const login = async (state, credentials) => {
        try {
            const { data } = await axios.post(`/api/auth/${state}`, credentials);

            // console.log(data);
            if (data.success) {
                setAuthUser(data.userData);
                connectSocket(data.userData);
                axios.defaults.headers.common['token'] = data.token;
                setToken(data.token);
                localStorage.setItem("token", data.token)
                toast.success(data.message)
            } else {
                toast.error(data.message);
            }

        } catch (error) {
            toast.error(error.message);
            console.log("login/signup error", error)
        }

    }

    // Logout and Socket Disconnection
    const logout = () => {
        setIsLoggingOut(true);  // prevent checkAuth during logout

        // disconnect socket
        if (socket) socket.disconnect();

        // clear state
        localStorage.removeItem("token");
        setToken(null);
        setAuthUser(null);
        setOnlineUsers([]);
        delete axios.defaults.headers.common['token'];

        toast.success("Logged Out Successfully");
        setIsLoggingOut(false); // optional
    };


    // update profile function

    const updateProfile = async (body) => {
        try {
            const { data } = await axios.put("/api/auth/profile", body)
            if (data.success) {
                setAuthUser(data.user)
                toast.success("profile Updated Successfully")
            }
        } catch (error) {
            toast.error(error.message)
            console.log("updtae profile error")
        }
    }

    // Connect Socket Function

    const connectSocket = (userData) => {
        if (!userData || socket?.connected) return;
        const newSocket = io(backendUrl, {
            query: {
                userId: userData._id,
            }
        });
        newSocket.connect();
        setSocket(newSocket);
        newSocket.on("getOnlineUsers", (userIds) => {
            setOnlineUsers(userIds);
        })
    }

    useEffect(() => {
        if (isLoggingOut) return;
        if (token) {
            axios.defaults.headers.common["token"] = token;
        }
        checkAuth()
    }, [token])

    const value = {
        axios,
        authUser,
        onlineUsers,
        socket,
        login,
        logout,
        updateProfile,
    }
    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}
