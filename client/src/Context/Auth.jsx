import { createContext, useState } from "react";

export const Auth = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("accessToken"),
  );

  const login = (token) => {
    localStorage.setItem("accessToken", token);
    setIsLoggedIn(true); // 🔥 instant update
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    setIsLoggedIn(false);
  };

  return (
    <Auth.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </Auth.Provider>
  );
};
