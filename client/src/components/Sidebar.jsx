import React, { useContext, useEffect, useState } from 'react'
import assets from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../context/ChatContext';


const Sidebar = () => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const {logout,onlineUsers} = useContext(AuthContext);

  const {users,selectedUser,getUsers,setSelectedUser,
     unseenMessages,setUnseenMessages} = useContext(ChatContext)

  const [input , setInput] = useState(false);
  
  const filteredUsers = input
  ? users.filter((user) => user.username.toLowerCase().includes(input.toLowerCase()))
  : users;


  useEffect(()=>{
      getUsers();
      console.log("Fetched users:", getUsers());
  },[])

//   useEffect(() => {
//   console.log("Fetched users:", users);
// }, [users]);


  return (
    <div className='bg-gray-600 w-3/2 bg-opacity-55'>
      <div className='m-4'>
        <div className='flex flex-row justify-between relative'>
          <img className='h-[40px] rounded-lg cursor-pointer' src={assets.logo} alt="logo" />

          {/* Menu Icon + Dropdown */}
          <div
            onMouseEnter={() => setShowMenu(true)}
            onMouseLeave={() => setShowMenu(false)}
            className="relative"
          >
            {/* Icon stays always */}
            <img
              className="h-8 cursor-pointer"
              src={assets.menu_icon}
              alt="menu"
            />

            {/* Dropdown menu (only visible when hovered) */}
            {showMenu && (
              <div className="absolute right-0 w-32 p-4 rounded-md opacity-75 bg-gradient-to-r from-slate-800 to-slate-600 text-white border border-gray-400 z-50">
                <p
                  className="font-medium hover:scale-105 cursor-pointer py-2"
                  onClick={() => navigate('/profile')}
                >
                  Edit Profile
                </p>
                <hr className="w-full border-gray-100" />
                <p onClick={()=>logout()} className="font-medium hover:scale-105 cursor-pointer py-2">
                  Logout
                </p>
              </div>
            )}
          </div>
        </div>


        {/* Search bar */}
        <div className="relative py-4">
          <img
            src={assets.search_icon}
            alt="Search"
            className="absolute h-8 p-2"
          />
          <input
            onChange={(e)=>setInput(e.target.value)}
            type="text"
            placeholder="Search users..."
            className="rounded-full h-8 w-full text-white bg-gray-400 bg-opacity-45 pl-10 placeholder-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* User list */}
      <div>
        {filteredUsers.map((user, index) => (
          <div onClick={() => {setSelectedUser(user);setUnseenMessages(prev=>({...prev,[user._id]:0}))}}
            key={index} className={`flex items-center gap-2 p-4  relative text-white max-sm:text-sm ${selectedUser?._id == user._id && 'bg-[#28214142]/50'}`}>
            <img
              src={user?.profile || assets.avatar_icon}
              alt=""
              className="h-10 w-10 rounded-full aspect-[1/1]"
            />
            <div className='cursor-pointer leading-5'>
              <p>{user.username}</p>
              <span className={index < 3 ? 'text-green-500' : 'text-red-500'}>
                {onlineUsers.includes(user._id) ?
                  'Online'
                  :
                  'Offline'}
              </span>
            </div>
            {unseenMessages[user._id] > 0 && <p className=' absolute top-4 right-4 text-xs h-5 w-5 flex justify-center items-center  mx-auto  rounded-full bg-violet-900/50'>{unseenMessages[user._id]}</p>}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Sidebar

