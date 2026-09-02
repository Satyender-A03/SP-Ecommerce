import { createContext, useState } from "react";

export const AdminAuth = createContext();

export const AdminAuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("adminToken"),
  );

  const [admin, setAdmin] = useState(() => {
    try {
      const saved = localStorage.getItem("adminUser");
      return saved && saved !== "undefined" ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const login = (token, adminData) => {
    localStorage.setItem("adminToken", token);
    if (adminData) {
      localStorage.setItem("adminUser", JSON.stringify(adminData));
      setAdmin(adminData);
    }
    setIsLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    setAdmin(null);
    setIsLoggedIn(false);
  };

  return (
    <AdminAuth.Provider value={{ isLoggedIn, admin, setAdmin, login, logout }}>
      {children}
    </AdminAuth.Provider>
  );
};
