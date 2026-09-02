import React, { useState, useContext } from "react";
import { FaRegUser } from "react-icons/fa";
import { MdOutlinePassword } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { AdminAuth } from "../../Context/AdminAuth";

import API_URL from "../../Constent";

const Toast = ({ message, type }) => {
  if (!message) return null;
  const styles = {
    success: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
    error: "bg-red-500/10 border-red-500/20 text-red-400",
  };
  return (
    <div
      className={`border rounded-lg px-4 py-3 text-sm font-medium ${styles[type]}`}
    >
      {message}
    </div>
  );
};

const Signin = () => {
  const navigate = useNavigate();
  const { login } = useContext(AdminAuth);

  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ message: "", type: "info" });
  const [form, setForm] = useState({ uName: "", password: "" });

  const showToast = (message, type = "info") => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: "", type: "info" }), 4000);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!form.uName || !form.password) {
      showToast("Please fill all fields", "error");
      return;
    }
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        login(data.accessToken, data.admin);
        navigate("/admin");
      } else {
        showToast(data.message || "Invalid username or password", "error");
      }
    } catch (err) {
      showToast("Something went wrong. Try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-center bg-[#0f1115]">
      <div className="bg-[#171a21] border border-white/5 rounded-2xl p-10 w-full max-w-sm">
        <h2 className="text-2xl font-bold text-white text-center mb-6">
          Admin Login
        </h2>

        {toast.message && (
          <div className="mb-4">
            <Toast message={toast.message} type={toast.type} />
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div className="flex items-center gap-2 border border-white/10 rounded-lg px-3 bg-[#0f1115] focus-within:border-violet-500/50 transition">
            <FaRegUser className="text-gray-500" />
            <input
              type="text"
              placeholder="Username"
              value={form.uName}
              onChange={(e) => setForm({ ...form, uName: e.target.value })}
              className="w-full p-2.5 outline-none bg-transparent text-white text-sm"
            />
          </div>

          <div className="flex items-center gap-2 border border-white/10 rounded-lg px-3 bg-[#0f1115] focus-within:border-violet-500/50 transition">
            <MdOutlinePassword className="text-gray-500" />
            <input
              type={showPass ? "text" : "password"}
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full p-2.5 outline-none bg-transparent text-white text-sm"
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="text-gray-500"
            >
              {showPass ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-violet-600 hover:bg-violet-500 text-white py-2.5 rounded-lg font-semibold text-sm transition disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
          >
            {loading && (
              <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            )}
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signin;
