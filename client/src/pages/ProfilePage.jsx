import React, { useContext, useState, useEffect } from "react";
import assets from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProfilePage = () => {
  const { authUser, updateProfile } = useContext(AuthContext);
  const navigate = useNavigate();

  const [selectedImg, setSelectedImg] = useState(null);
  const [bio, setBio] = useState("");
  const [username, setUsername] = useState("");
  const maxLength = 150;

  useEffect(() => {
    if (authUser) {
      setBio(authUser.bio || "");
      setUsername(authUser.username || "");
    }
  }, [authUser]);

  const handleBioChange = (e) => {
    if (e.target.value.length <= maxLength) {
      setBio(e.target.value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedImg) {
      const reader = new FileReader();
      reader.readAsDataURL(selectedImg);
      reader.onload = async () => {
        await updateProfile({
          username,          // directly using state
          bio,
          profile: reader.result, // directly updating profile pic
        });
        navigate("/");
      };
    } else {
      await updateProfile({
        username, // directly using state
        bio,
      });
      navigate("/");
    }
  };

  if (!authUser) return <div>Loading...</div>;

  return (
    <div className="flex items-center justify-center h-[100vh] w-[100vw] backdrop-blur-md border sm:px-[15%] sm:py-[5%]">
      <div className="flex flex-row items-center justify-between text-white border h-[55vh] w-[70vw] md:w-[45vw] rounded-lg gap-6">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <h3 className="font-bold text-lg">Profile details</h3>

          <input
            type="file"
            id="image"
            accept="image/png,image/jpeg"
            hidden
            onChange={(e) => setSelectedImg(e.target.files[0])}
          />
          <label
            htmlFor="image"
            className="flex md:flex-row flex-col justify-center items-center gap-4 font-bold text-md cursor-pointer"
          >
            <img
              src={selectedImg ? URL.createObjectURL(selectedImg) : authUser.profile || assets.avatar_icon}
              alt="avatar"
              className="md:h-14 h-10 rounded-full"
            />
            Upload Profile Image
          </label>

          <input
            className="bg-gray-700 bg-opacity-50 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="text"
            placeholder="Your Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <textarea
            value={bio}
            onChange={handleBioChange}
            placeholder="Bio"
            rows="4"
            className="bg-gray-700 bg-opacity-50 p-2 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>

          <div className="flex justify-between items-center text-sm text-gray-300">
            <span>{bio.length}/{maxLength} characters</span>
            <button
              type="submit"
              className="bg-gradient-to-r from-purple-800 to-purple-400 px-6 py-1 rounded-md hover:scale-105 transition-transform"
            >
              Save
            </button>
          </div>
        </form>

        <div className="hidden md:block">
          <img className="w-3/4" src={authUser?.profile ||assets.logo_icon} alt="logo" />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;


