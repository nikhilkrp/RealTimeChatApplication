import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from './AuthContext.jsx';
import toast from "react-hot-toast";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [unseenMessages, setUnseenMessages] = useState({});

  const { socket, axios } = useContext(AuthContext);

  // Get all users
  const getUsers = async () => {
    try {
      const { data } = await axios.get('/api/messages/users', { withCredentials: true });
      if (data.success) {
        setUsers(data.users);
        setUnseenMessages(data.unseenMessages || {});
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Get messages with selected user
  const getMessages = async (userId) => {
    try {
      const { data } = await axios.get(`/api/messages/${userId}`);
      if (data.success) {
        setMessages(data.messages);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Send message
  const sendMessage = async (messageData) => {
    if (!selectedUser) return;
    try {
      const { data } = await axios.post(`/api/messages/send/${selectedUser._id}`, messageData,{withCredentials:true});
      if (data.success) {
        setMessages((prev) => [...prev, data.newMessage]);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Subscribe to socket messages
  const subscribeToMessages = () => {
    if (!socket) return;
    socket.on("newMessage", (newMessage) => {
      if (selectedUser && newMessage.senderId === selectedUser._id) {
        newMessage.seen = true;
        setMessages((prev) => [...prev, newMessage]);
        axios.put(`/api/messages/mark/${newMessage._id}`);
      } else {
        setUnseenMessages((prev) => ({
          ...prev,
          [newMessage.senderId]: (prev[newMessage.senderId] || 0) + 1
        }));
      }
    });
  };

  const unsubscribeFromMessages = () => {
    if (socket) socket.off("newMessage");
  };

  useEffect(() => {
    getUsers();
  }, []);

  useEffect(() => {
    subscribeToMessages();
    return () => unsubscribeFromMessages();
  }, [socket, selectedUser]);

  const value = {
    messages,
    users,
    selectedUser,
    unseenMessages,
    getUsers,
    getMessages,
    setSelectedUser,
    sendMessage,
    setMessages,
    setUnseenMessages,
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};
