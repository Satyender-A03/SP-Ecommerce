import React, { useState } from "react";
import { FaAddressCard, FaRegUser, FaUserCircle } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom"; // ✅ navigate import
import {
  MdDriveFileRenameOutline,
  MdOutlineEmail,
  MdOutlinePassword,
  MdOutlinePhone,
} from "react-icons/md";
import sign from "../../assets/sign.jpg";

const CreateSignin = () => {
  const navigate = useNavigate(); // ✅ navigate hook

  const [signin, setSignin] = useState({
    uName: "",
    fName: "",
    lName: "",
    email: "",
    password: "",
    address: "",
    phone: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://localhost:5000/auth/register", // ✅ correct API
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(signin),
        },
      );

      const data = await response.json();

      console.log("Server Response:", data);

      if (response.ok) {
        // 🔥 reset form
        setSignin({
          uName: "",
          fName: "",
          lName: "",
          email: "",
          password: "",
          address: "",
          phone: "",
        });

        navigate("/signin"); // 🔥 redirect to login
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };

  return (
    <div className="pt-20 min-h-screen flex items-center justify-center">
      <div className="grid grid-cols-1 md:grid-cols-2 w-[80%] rounded-2xl shadow-lg overflow-hidden">
        {/* LEFT IMAGE */}
        <div>
          <img src={sign} alt="signup" className="object-cover h-full w-full" />
        </div>

        {/* RIGHT FORM */}
        <div className="w-full text-black bg-white">
          <div className="flex flex-col gap-6 p-6">
            {/* HEADING */}
            <div className="text-center flex gap-4 items-center justify-center">
              <FaUserCircle className="size-15 text-gray-700" />
              <h2 className="text-4xl font-bold">Create Account</h2>
            </div>

            {/* FORM */}
            <form
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
              onSubmit={handleSubmit}
            >
              {/* First Name */}
              <div className="flex items-center border-2 rounded-2xl overflow-hidden">
                <MdDriveFileRenameOutline className="text-4xl bg-gray-300 w-12 p-2" />
                <input
                  type="text"
                  placeholder="First Name"
                  value={signin.fName}
                  onChange={(e) =>
                    setSignin({ ...signin, fName: e.target.value })
                  }
                  className="p-1 w-full outline-none"
                  required
                />
              </div>

              {/* Last Name */}
              <div className="flex items-center border-2 rounded-2xl overflow-hidden">
                <MdDriveFileRenameOutline className="text-4xl bg-gray-300 w-12 p-2" />
                <input
                  type="text"
                  placeholder="Last Name"
                  value={signin.lName}
                  onChange={(e) =>
                    setSignin({ ...signin, lName: e.target.value })
                  }
                  className="p-1 w-full outline-none"
                  required
                />
              </div>

              {/* Username */}
              <div className="flex items-center border-2 rounded-2xl overflow-hidden">
                <FaRegUser className="text-4xl bg-gray-300 w-12 p-2" />
                <input
                  type="text"
                  placeholder="Username"
                  value={signin.uName}
                  onChange={(e) =>
                    setSignin({ ...signin, uName: e.target.value })
                  }
                  className="p-1 w-full outline-none"
                  required
                />
              </div>

              {/* Email */}
              <div className="flex items-center border-2 rounded-2xl overflow-hidden">
                <MdOutlineEmail className="text-4xl bg-gray-300 w-12 p-2" />
                <input
                  type="email"
                  placeholder="Email"
                  value={signin.email}
                  onChange={(e) =>
                    setSignin({ ...signin, email: e.target.value })
                  }
                  className="p-1 w-full outline-none"
                  required
                />
              </div>

              {/* Password */}
              <div className="flex items-center border-2 rounded-2xl overflow-hidden">
                <MdOutlinePassword className="text-4xl bg-gray-300 w-12 p-2" />
                <input
                  type="password"
                  placeholder="Password"
                  value={signin.password}
                  onChange={(e) =>
                    setSignin({ ...signin, password: e.target.value })
                  }
                  className="p-1 w-full outline-none"
                  required
                />
              </div>

              {/* Phone */}
              <div className="flex items-center border-2 rounded-2xl overflow-hidden">
                <MdOutlinePhone className="text-4xl bg-gray-300 w-12 p-2" />
                <input
                  type="text"
                  placeholder="Phone"
                  value={signin.phone}
                  onChange={(e) =>
                    setSignin({ ...signin, phone: e.target.value })
                  }
                  className="p-1 w-full outline-none"
                  required
                />
              </div>

              {/* Address */}
              <div className="flex items-center border-2 rounded-2xl overflow-hidden col-span-2">
                <FaAddressCard className="text-4xl bg-gray-300 w-12 p-2" />
                <input
                  type="text"
                  placeholder="Address"
                  value={signin.address}
                  onChange={(e) =>
                    setSignin({ ...signin, address: e.target.value })
                  }
                  className="p-1 w-full outline-none"
                  required
                />
              </div>

              {/* BUTTON */}
              <div className="col-span-2">
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 cursor-pointer rounded-md font-semibold w-full"
                >
                  Create Account
                </button>
              </div>
            </form>

            {/* LOGIN LINK */}
            <div className="text-center text-sm mt-2">
              <span>Already have an account? </span>
              <Link
                to="/signin"
                className="underline cursor-pointer hover:text-blue-500 font-bold"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateSignin;
