import React, { useContext, useState } from "react";
import { Auth } from "../../Context/Auth";
import { useNavigate } from "react-router-dom";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiShoppingBag,
  FiHeart,
  FiLogOut,
  FiEdit2,
} from "react-icons/fi";

const UserProfile = () => {
  const { user, logout } = useContext(Auth);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/signin");
  };

  const avatarLetter =
    user?.name?.charAt(0)?.toUpperCase() ||
    user?.fName?.charAt(0)?.toUpperCase() ||
    "U";

  return (
    <div className="w-full min-h-screen bg-[#e8e8e8] px-6 md:px-10 pt-20 pb-10">
      <h2 className="text-2xl sm:text-3xl font-bold text-black mb-6">
        My Profile
      </h2>

      <div className="max-w-3xl mx-auto flex flex-col gap-5">
        {/* Avatar + Name card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm flex items-center gap-5">
          {/* Avatar */}
          <div className="w-20 h-20 rounded-full bg-black text-white flex items-center justify-center text-3xl font-black shrink-0">
            {avatarLetter}
          </div>

          <div className="flex-1">
            <p className="text-xl font-black text-gray-900">
              {user?.name ||
                `${user?.fName || ""} ${user?.lName || ""}`.trim() ||
                "User"}
            </p>
            <p className="text-sm text-gray-400 mt-0.5">
              @{user?.uName || "username"}
            </p>
          </div>
        </div>

        {/* Details card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-4">
            Personal Info
          </h3>

          <div className="flex flex-col gap-4">
            {[
              {
                icon: <FiUser className="text-gray-400" />,
                label: "Full Name",
                value:
                  user?.name ||
                  `${user?.fName || ""} ${user?.lName || ""}`.trim() ||
                  "—",
              },
              {
                icon: <FiMail className="text-gray-400" />,
                label: "Email",
                value: user?.email || "—",
              },
              {
                icon: <FiPhone className="text-gray-400" />,
                label: "Phone",
                value: user?.phone || "—",
              },
              {
                icon: <FiMapPin className="text-gray-400" />,
                label: "Address",
                value: user?.address || "—",
              },
            ].map((field, i) => (
              <div
                key={i}
                className="flex items-center gap-4 py-3 border-b border-gray-100 last:border-0"
              >
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                  {field.icon}
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-400 font-medium">
                    {field.label}
                  </p>
                  <p className="text-sm font-semibold text-gray-800 mt-0.5">
                    {field.value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick links */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 px-6 pt-5 pb-3">
            Quick Links
          </h3>

          {[
            {
              icon: <FiShoppingBag className="text-gray-500" />,
              label: "My Orders",
              sub: "View your order history",
              onClick: () => navigate("/order"),
            },
            {
              icon: <FiHeart className="text-gray-500" />,
              label: "Wishlist",
              sub: "Items you saved",
              onClick: () => navigate("/wishlist"),
            },
          ].map((item, i) => (
            <button
              key={i}
              onClick={item.onClick}
              className="w-full flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition border-b border-gray-100 last:border-0"
            >
              <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                {item.icon}
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-semibold text-gray-800">
                  {item.label}
                </p>
                <p className="text-xs text-gray-400">{item.sub}</p>
              </div>
              <span className="text-gray-300 text-lg">›</span>
            </button>
          ))}
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 bg-white text-red-500 border border-red-200 py-3.5 rounded-2xl font-bold text-sm hover:bg-red-50 transition shadow-sm"
        >
          <FiLogOut />
          Logout
        </button>
      </div>
    </div>
  );
};

export default UserProfile;
