import React, { useState } from "react";
import { FaRegUser, FaUserCircle } from "react-icons/fa";
import { MdOutlinePassword } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import sign from "../../assets/sign.jpg";

const Signin = () => {
  const navigate = useNavigate();

  const [login, setLogin] = useState({
    uName: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(login),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("accessToken", data.accessToken);

        navigate("/"); // redirect
      } else {
        alert(data.message || "Invalid username or password");
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <div className="h-[90vh] flex items-center justify-center">
      <div className="grid grid-cols-1 md:grid-cols-2 w-[70%] rounded-2xl shadow-lg overflow-hidden">
        {/* LEFT IMAGE */}
        <div className="hidden md:block">
          <img src={sign} alt="login" className="object-cover h-full w-full" />
        </div>

        {/* RIGHT FORM */}
        <div className="bg-white text-black p-10 flex flex-col justify-center">
          <div className="flex flex-col gap-6">
            <div className="text-center flex gap-4 items-center justify-center">
              <FaUserCircle className="text-6xl text-gray-600" />
              <h2 className="text-4xl font-bold">Login</h2>
            </div>

            {/* USERNAME */}
            <div className="flex items-center border-2 gap-2 rounded-2xl px-2">
              <FaRegUser className="text-2xl text-gray-500" />
              <input
                type="text"
                placeholder="Username"
                value={login.uName}
                onChange={(e) => setLogin({ ...login, uName: e.target.value })}
                className="w-full p-2 outline-none"
              />
            </div>

            {/* PASSWORD */}
            <div className="flex items-center border-2 gap-2 rounded-2xl px-2">
              <MdOutlinePassword className="text-2xl text-gray-500" />
              <input
                type="password"
                placeholder="Password"
                value={login.password}
                onChange={(e) =>
                  setLogin({ ...login, password: e.target.value })
                }
                className="w-full p-2 outline-none"
              />
            </div>

            <button
              className="bg-blue-500 hover:bg-blue-600 cursor-pointer text-white py-2 rounded-md font-semibold"
              onClick={handleSubmit}
            >
              Login
            </button>

            <div className="text-center text-sm mt-2">
              <span>Don’t have an account? </span>
              <Link
                to="/create"
                className="underline cursor-pointer hover:text-blue-500 font-bold"
              >
                Create one
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signin;
