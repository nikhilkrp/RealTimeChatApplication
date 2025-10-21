import React, { useState, useContext } from "react";
import assets from "../assets/assets";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";

const LoginPage = () => {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");

  // Use the login function from AuthContext
  const { login } = useContext(AuthContext);

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      if (!email || !password || (!show && !username)) {
        return toast.error("Please fill all fields!");
      }

      const state = show ? "login" : "signup";
      const credentials = show ? { email, password }
      : { username, email, password };

      await login(state, credentials);
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="backdrop-blur-md h-[100vh] w-[100vw] bg-contain border sm:px-[15%] sm:py-[5%]">
      <div className="flex flex-row items-center justify-evenly text-white my-auto">
        <div>
          <img src={assets.logo_big} alt="logo" className="w-[40%]" />
        </div>

        {/* SIGNUP FORM */}
        {!show && (
          <div className="bg-gray-700 bg-opacity-40 border p-6 h-[60vh] rounded-lg flex flex-col justify-center gap-2">
            <h2 className="mx-auto md:font-extrabold md:text-xl">
              Welcome to We Chat
            </h2>
            <h2 className="md:font-bold text-xl font-semibold mx-auto">Sign Up</h2>

            <form onSubmit={onSubmitHandler} className="flex flex-col gap-6 mt-4">
              <input
                type="text"
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Username"
                className="bg-gray-500 bg-opacity-40 rounded-md p-1 border-[1px] border-gray-300"
              />
              <input
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="bg-gray-500 bg-opacity-40 rounded-md p-1 border-[1px] border-gray-300"
              />
              <input
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="bg-gray-500 bg-opacity-40 rounded-md p-1 border-[1px] border-gray-300"
              />
              <button
                type="submit"
                className="bg-gradient-to-r from-purple-800 to-purple-400 mt-6 py-1 rounded-md"
              >
                Create Account
              </button>
            </form>

            <span className="mt-4 mx-auto text-xs md:text-sm text-gray-300 break-words">
              <input type="checkbox" className="" /> Agreed to terms and
              conditions of We Chat
            </span>

            <p className="mt-2 mx-auto text-gray-400">
              Already have an account?{" "}
              <span
                onClick={() => setShow(true)}
                className="text-purple-700 underline cursor-pointer text-lg"
              >
                Login
              </span>
            </p>
          </div>
        )}

        {/* LOGIN FORM */}
        {show && (
          <div className="bg-gray-700 bg-opacity-40 border p-6 h-[55vh] rounded-lg flex flex-col  gap-1">
            <h2 className="mx-auto font-extrabold text-xl">Welcome to We Chat</h2>
            <h2 className="md:font-bold text-xl font-semibold mx-auto">Login</h2>

            <form onSubmit={onSubmitHandler} className="flex flex-col gap-6 mt-4">
              <input
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="bg-gray-500 bg-opacity-40 rounded-md p-1 border-[1px] border-gray-300"
              />
              <input
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="bg-gray-500 bg-opacity-40 rounded-md p-1 border-[1px] border-gray-300"
              />
              <button
                type="submit"
                className="bg-gradient-to-r from-purple-800 to-purple-400 mt-6 py-1 rounded-md"
              >
                Login
              </button>
            </form>

            <span className="mt-4 mx-auto text-xs md:text-sm text-gray-300 break-words">
              <input type="checkbox" className="" /> Agreed to terms and
              conditions of We Chat
            </span>

            <p className="mt-2 mx-auto text-gray-400">
              Don't have an account?{" "}
              <span
                onClick={() => setShow(false)}
                className="text-purple-700 underline cursor-pointer text-lg"
              >
                Sign Up
              </span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
