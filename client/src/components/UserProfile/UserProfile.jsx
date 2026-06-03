import React, { useContext } from "react";
import { Auth } from "../../Context/Auth";

const UserProfile = () => {
  const { logout } = useContext(Auth);

  return (
    <div className="pt-24 text-center">
      <h1 className="text-3xl">Profile Page 👤</h1>

      <button
        onClick={() => {
          logout();
          window.location.href = "/signin";
        }}
        className="mt-5 bg-red-500 text-white px-4 py-2"
      >
        Logout
      </button>
    </div>
  );
};

export default UserProfile;
