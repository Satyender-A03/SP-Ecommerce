import { createContext, useState } from "react";

export const Auth = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("accessToken"),
  );

  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("user");
      return saved && saved !== "undefined" ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const login = (token, userData) => {
    localStorage.setItem("accessToken", token);
    if (userData) {
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
    }
    setIsLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    setUser(null);
    setIsLoggedIn(false);
  };

  // ── setUser bhi export karo taaki profile update ho sake ─────────────────
  return (
    <Auth.Provider value={{ isLoggedIn, user, setUser, login, logout }}>
      {children}
    </Auth.Provider>
  );
};
