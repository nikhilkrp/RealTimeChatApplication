import React, { useContext, useEffect, useRef, useState } from "react";
import assets, { messagesDummyData } from "../assets/assets";
import { fromatMessageTime } from "../lib/utils";
import { ChatContext } from "../context/ChatContext";
import { AuthContext } from "../context/AuthContext";

const ChatContainer = () => {

  const {messages,users,selectedUser,getUsers,getMessages,setMessages,sendMessage,setSelectedUser} = useContext(ChatContext);
  const { authUser, onlineUsers } = useContext(AuthContext)
  const scrollEnd = useRef();
  const [input,setInput]=useState('')


// send a message
  const handleSendMessage = async(e)=>
{
   e.preventDefault();
   if(input.trim()==="") return null;
   await sendMessage({text:input.trim()});
   setInput("");
}

// image sending function
const handleSendImage = async(e)=>{
  const file = e.target.files[0]
  if(!file || !file.type.startsWith("image/")){
    toast.error("select an image file");
    return;
  }
  const reader = new FileReader();
  reader.onloadend = async()=>{
    await sendMessage({image:reader.result})
    e.target.value;
  }
  reader.readAsDataURL(file)
}
   useEffect(()=>{
     if(selectedUser){
      getMessages(selectedUser._id)
     }
   },[selectedUser])
  
  // Auto scroll to bottom on mount + new messages
  useEffect(() => {
    if (scrollEnd.current && messages) {
      scrollEnd.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return selectedUser ? (
    <div className="flex flex-col h-[80vh] bg-gradient-to-b from-slate-700">
      
      {/* header */}
      <div className="flex-shrink-0 py-3 mx-4 flex items-center bg-opacity-90">
        <img className="w-8 h-8 rounded-full" src={selectedUser.profile||assets.avatar_icon} alt="profile" />
        <p className="text-white text-lg flex-1 flex items-center gap-2 px-2">
          {selectedUser.username}
          {onlineUsers.includes(selectedUser._id)&&<span className="h-4 w-4 rounded-full bg-green-400"></span>}
        </p>
        <img
          onClick={() => setSelectedUser(null)}
          className="h-5 rounded-md cursor-pointer md:hidden"
          src={assets.arrow_icon}
          alt="arrow"
        />
        <img src={assets.help_icon} alt="help" className="max-md:hidden max-w-5" />
      </div>

      {/* divider */}
      <hr className="flex-shrink-0 w-[95%] border-gray-600 border-[1px] rounded-full mx-auto" />

      {/* messages container */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-2">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex items-end gap-2 justify-end ${
              msg.senderId !== authUser._id && "flex-row-reverse"
            }`}
          >
            {msg.image ? (
              <img
                src={msg.image}
                alt="chat"
                className="max-w-[230px] border border-gray-700 rounded-lg overflow-hidden mb-8"
              />
            ) : (
              <p
                className={`p-2 max-w-[200px] md:text-sm font-light rounded-lg
                mb-8 break-words bg-violet-500/30 text-white ${
                  msg.senderId === authUser._id
                    ? "rounded-br-none"
                    : "rounded-bl-none"
                }`}
              >
                {msg.text}
              </p>
            )}
            <div className="text-center text-xs">
              <img
                src={
                  msg.senderId === authUser._id ?authUser?.profile
                    || assets.avatar_icon
                    :selectedUser?.profile || assets.avatar_icon
                }
                alt="avatar"
                className="w-7 h-7 rounded-full"
              />
              <p className="text-gray-500">{fromatMessageTime(msg.createdAt)}</p>
            </div>
          </div>
        ))}
        <div ref={scrollEnd}></div>
      </div>

      {/* footer */}
      <div className="flex-shrink-0 p-2 flex justify-evenly gap-2">
        <div className="w-full flex flex-row items-center relative flex-1">
          <input
            onChange={(e)=>setInput(e.target.value)}
            value={input}
            onKeyDown={(e)=>e.key==="Enter"?handleSendMessage(e):null}
            type="text"
            placeholder="Send a message..."
            className="rounded-full h-10 w-full text-white bg-gray-600 opacity-45 pl-10 placeholder-white focus:outline-none focus:ring-2 focus:ring-gray-500"
          />
          <input
           onChange={handleSendImage}
           type="file" id="image" accept="image/png,image/jpeg" hidden />
          <label className="absolute right-2" htmlFor="image">
            <img
              className="w-5 cursor-pointer"
              src={assets.gallery_icon}
              alt="gallery"
            />
          </label>
        </div>
        <img onClick={handleSendMessage} className="w-8 cursor-pointer" src={assets.send_button} alt="send" />
      </div>
    </div>
  ) : (
    <div className="text-white flex flex-col items-center justify-center h-[80vh]">
      <img className="h-20" src={assets.logo_icon} alt="logo" />
      <p className="text-lg font-bold">Chat With Your Loved One's</p>
    </div>
  );
};

export default ChatContainer;

