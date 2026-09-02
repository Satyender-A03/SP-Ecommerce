import React, { useState } from "react";
import { FaRegUser } from "react-icons/fa";
import {
  MdDriveFileRenameOutline,
  MdOutlineEmail,
  MdOutlinePassword,
} from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";

import API_URL from "../../Constent";

const Toast = ({ message, type }) => {
  if (!message) return null;
  const styles = {
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

const CreateSignin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ message: "", type: "error" });

  const [form, setForm] = useState({
    name: "",
    uName: "",
    email: "",
    password: "",
  });

  const showToast = (message, type = "error") => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: "", type: "error" }), 4000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/admin/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        navigate("/signin");
      } else {
        // Backend returns 403 here once an admin already exists —
        // this route only works for creating the very first admin.
        showToast(data.message || "Something went wrong.");
      }
    } catch (err) {
      showToast("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-center bg-[#0f1115]">
      <div className="bg-[#171a21] border border-white/5 rounded-2xl p-10 w-full max-w-sm">
        <h2 className="text-2xl font-bold text-white text-center mb-1">
          Create Admin Account
        </h2>
        <p className="text-xs text-gray-500 text-center mb-6">
          Only works if no admin account exists yet.
        </p>

        {toast.message && (
          <div className="mb-4">
            <Toast message={toast.message} type={toast.type} />
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex items-center gap-2 border border-white/10 rounded-lg px-3 bg-[#0f1115] focus-within:border-violet-500/50 transition">
            <MdDriveFileRenameOutline className="text-gray-500" />
            <input
              type="text"
              placeholder="Full Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full p-2.5 outline-none bg-transparent text-white text-sm"
            />
          </div>

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
            <MdOutlineEmail className="text-gray-500" />
            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full p-2.5 outline-none bg-transparent text-white text-sm"
            />
          </div>

          <div className="flex items-center gap-2 border border-white/10 rounded-lg px-3 bg-[#0f1115] focus-within:border-violet-500/50 transition">
            <MdOutlinePassword className="text-gray-500" />
            <input
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full p-2.5 outline-none bg-transparent text-white text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-violet-600 hover:bg-violet-500 text-white py-2.5 rounded-lg font-semibold text-sm transition disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
          >
            {loading && (
              <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            )}
            {loading ? "Creating..." : "Create Account"}
          </button>
        </form>

        <div className="text-center text-sm text-gray-500 mt-5">
          <span>Already have an account? </span>
          <Link
            to="/signin"
            className="text-violet-400 hover:text-violet-300 font-semibold"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CreateSignin;
