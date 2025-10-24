import React, { useContext, useState,useEffect } from 'react'
import assets, { imagesDummyData } from '../assets/assets'
import { ChatContext } from '../context/ChatContext'
import { AuthContext } from '../context/AuthContext'


const RightSideBar = () => {
  const {selectedUser,messages}=useContext(ChatContext);
  const {logout,onlineUsers} = useContext(AuthContext);
  const [msgImages,setMsgImages] = useState([])
  // Get all the images from the messages and set them to state
  useEffect(()=>{
    setMsgImages(
      messages.filter(msg =>msg.image).map(msg=>msg.image)
    )
  },[messages])
  return selectedUser && (
    <div className={`bg-[#8185B2]/10 text-white w-full relative overflow-y-scroll ${selectedUser ? "max-md:hidden": ""}`}>
      <div className='pt-16 flex flex-col items-center gap-2 text-xs font-light mx-auto'>
        <img className='w-20 h-20 aspect[1/1] rounded-full' src={selectedUser?.profile || assets.avatar_icon} alt="logo" />
        <h1 className='px-10 text-xl font-medium mx-auto flex flex-col items-center gap-2 py-2'>
          <p className='w-2 h-2 rounded-full bg-green-500'></p>
          {selectedUser?.fullName}
        </h1>
        {onlineUsers.includes(selectedUser._id) && <p className='px-10 mx-auto'>{selectedUser?.bio}</p>  }     
      </div>
      <hr className='border-[#ffffff50] my-6 '/>

      <p className='px-2 text-xs md:text-lg flex justify-center'>Media</p>
      <div className='mt-2 max-h-[200px] overflow-y-scroll grid grid-cols-2 gap-2 opacity-80'>
      {msgImages.map((img,index)=>
      (
        <div key={index} onClick={()=>window.open(img)} className='cursor-pointer rounded-full'> 
          <img src={img} alt='images' className='h-full rounded-full'/>
        </div>
      )
      )}

      </div>

      <button onClick={()=>logout()} className=' absolute  bg-gradient-to-r from-purple-800 to-purple-400 px-20 py-1 bottom-3 left-6 cursor-pointer  rounded-full '>Logout</button>
    </div>
  )
}

export default RightSideBar
