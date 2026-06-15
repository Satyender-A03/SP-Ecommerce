import React, { useState, useContext } from "react";
import { FaRegUser, FaUserCircle } from "react-icons/fa";
import { MdOutlinePassword } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff, FiMail } from "react-icons/fi";
import { Auth } from "../../Context/Auth";
import sign from "../../assets/sign.jpg";

// 🔥 Toast
const Toast = ({ message, type }) => {
  if (!message) return null;
  const styles = {
    success: "bg-green-50 border-green-400 text-green-700",
    error: "bg-red-50 border-red-400 text-red-700",
    info: "bg-blue-50 border-blue-400 text-blue-700",
  };
  return (
    <div
      className={`border rounded-xl px-4 py-3 text-sm font-medium ${styles[type]}`}
    >
      {message}
    </div>
  );
};

const Signin = () => {
  const navigate = useNavigate();
  const { login } = useContext(Auth);

  const [screen, setScreen] = useState("login"); // login | forgot | otp | reset
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ message: "", type: "info" });

  const [loginData, setLoginData] = useState({ uName: "", password: "" });
  const [forgotData, setForgotData] = useState({
    email: "",
    otp: "",
    password: "",
  });

  const showToast = (message, type = "info") => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: "", type: "info" }), 4000);
  };

  // ── LOGIN ──
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!loginData.uName || !loginData.password) {
      showToast("Please fill all fields", "error");
      return;
    }
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      });
      const data = await res.json();
      if (res.ok) {
        login(data.accessToken, data.user);
        navigate("/");
      } else {
        showToast(data.message || "Invalid username or password", "error");
      }
    } catch (err) {
      showToast("Something went wrong. Try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  // ── SEND OTP ──
  const handleSendOtp = async () => {
    if (!forgotData.email) {
      showToast("Please enter your email", "error");
      return;
    }
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotData.email }),
      });
      const data = await res.json();
      if (res.ok) {
        showToast("OTP sent to your email!", "success");
        setScreen("otp");
      } else {
        showToast(data.message || "Failed to send OTP", "error");
      }
    } catch (err) {
      showToast("Something went wrong.", "error");
    } finally {
      setLoading(false);
    }
  };

  // ── VERIFY OTP ──
  const handleVerifyOtp = async () => {
    if (!forgotData.otp) {
      showToast("Please enter the OTP", "error");
      return;
    }
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotData.email, otp: forgotData.otp }),
      });
      const data = await res.json();
      if (res.ok) {
        showToast("OTP verified!", "success");
        setScreen("reset");
      } else {
        showToast(data.message || "Invalid OTP", "error");
      }
    } catch (err) {
      showToast("Something went wrong.", "error");
    } finally {
      setLoading(false);
    }
  };

  // ── RESET PASSWORD ──
  const handleResetPassword = async () => {
    if (!forgotData.password) {
      showToast("Please enter new password", "error");
      return;
    }
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(forgotData),
      });
      const data = await res.json();
      if (res.ok) {
        showToast("Password reset successfully!", "success");
        setTimeout(() => {
          setScreen("login");
          setForgotData({ email: "", otp: "", password: "" });
        }, 1500);
      } else {
        showToast(data.message || "Failed to reset password", "error");
      }
    } catch (err) {
      showToast("Something went wrong.", "error");
    } finally {
      setLoading(false);
    }
  };

  const fieldClass =
    "flex items-center border-2 gap-2 rounded-2xl px-2 focus-within:border-gray-400 transition";

  const titles = {
    login: "Login",
    forgot: "Forgot Password",
    otp: "Verify OTP",
    reset: "Reset Password",
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
          <div className="flex flex-col gap-5">
            {/* HEADING */}
            <div className="text-center flex gap-4 items-center justify-center mb-2">
              <FaUserCircle className="text-6xl text-gray-600" />
              <h2 className="text-4xl font-bold">{titles[screen]}</h2>
            </div>

            {/* TOAST */}
            <Toast message={toast.message} type={toast.type} />

            {/* ── LOGIN SCREEN ── */}
            {screen === "login" && (
              <>
                <div className={fieldClass}>
                  <FaRegUser className="text-2xl text-gray-500" />
                  <input
                    type="text"
                    placeholder="Username"
                    value={loginData.uName}
                    onChange={(e) =>
                      setLoginData({ ...loginData, uName: e.target.value })
                    }
                    className="w-full p-2 outline-none"
                  />
                </div>

                <div className={fieldClass}>
                  <MdOutlinePassword className="text-2xl text-gray-500" />
                  <input
                    type={showPass ? "text" : "password"}
                    placeholder="Password"
                    value={loginData.password}
                    onChange={(e) =>
                      setLoginData({ ...loginData, password: e.target.value })
                    }
                    className="w-full p-2 outline-none"
                  />
                  <button
                    onClick={() => setShowPass(!showPass)}
                    className="text-gray-400 pr-1"
                  >
                    {showPass ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>

                <div className="flex justify-end -mt-2">
                  <button
                    onClick={() => {
                      setScreen("forgot");
                      setToast({ message: "", type: "info" });
                    }}
                    className="text-sm text-blue-500 hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>

                <button
                  onClick={handleLogin}
                  disabled={loading}
                  className="bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md font-semibold transition disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {loading && (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  )}
                  {loading ? "Logging in..." : "Login"}
                </button>

                <div className="text-center text-sm">
                  <span>Don't have an account? </span>
                  <Link
                    to="/create"
                    className="underline font-bold hover:text-blue-500"
                  >
                    Create one
                  </Link>
                </div>
              </>
            )}

            {/* ── FORGOT PASSWORD ── */}
            {screen === "forgot" && (
              <>
                <div className={fieldClass}>
                  <FiMail className="text-2xl text-gray-500 ml-1" />
                  <input
                    type="email"
                    placeholder="Your Email"
                    value={forgotData.email}
                    onChange={(e) =>
                      setForgotData({ ...forgotData, email: e.target.value })
                    }
                    className="w-full p-2 outline-none"
                  />
                </div>

                <button
                  onClick={handleSendOtp}
                  disabled={loading}
                  className="bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md font-semibold transition disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {loading && (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  )}
                  {loading ? "Sending OTP..." : "Send OTP"}
                </button>

                <button
                  onClick={() => setScreen("login")}
                  className="text-sm text-center text-blue-500 hover:underline"
                >
                  ← Back to Login
                </button>
              </>
            )}

            {/* ── OTP SCREEN ── */}
            {screen === "otp" && (
              <>
                <p className="text-sm text-gray-500 text-center">
                  OTP sent to{" "}
                  <span className="font-bold text-black">
                    {forgotData.email}
                  </span>
                </p>

                <div className={fieldClass}>
                  <input
                    type="text"
                    placeholder="Enter OTP"
                    maxLength={6}
                    value={forgotData.otp}
                    onChange={(e) =>
                      setForgotData({ ...forgotData, otp: e.target.value })
                    }
                    className="w-full p-2 outline-none tracking-widest font-bold text-center text-lg"
                  />
                </div>

                <button
                  onClick={handleVerifyOtp}
                  disabled={loading}
                  className="bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md font-semibold transition disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {loading && (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  )}
                  {loading ? "Verifying..." : "Verify OTP"}
                </button>

                <button
                  onClick={handleSendOtp}
                  className="text-sm text-center text-blue-500 hover:underline"
                >
                  Resend OTP
                </button>

                <button
                  onClick={() => setScreen("login")}
                  className="text-sm text-center text-gray-400 hover:underline"
                >
                  ← Back to Login
                </button>
              </>
            )}

            {/* ── RESET PASSWORD ── */}
            {screen === "reset" && (
              <>
                <div className={fieldClass}>
                  <MdOutlinePassword className="text-2xl text-gray-500" />
                  <input
                    type={showPass ? "text" : "password"}
                    placeholder="New Password"
                    value={forgotData.password}
                    onChange={(e) =>
                      setForgotData({ ...forgotData, password: e.target.value })
                    }
                    className="w-full p-2 outline-none"
                  />
                  <button
                    onClick={() => setShowPass(!showPass)}
                    className="text-gray-400 pr-1"
                  >
                    {showPass ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>

                <button
                  onClick={handleResetPassword}
                  disabled={loading}
                  className="bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md font-semibold transition disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {loading && (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  )}
                  {loading ? "Resetting..." : "Reset Password"}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signin;
