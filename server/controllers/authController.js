const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// 🔥 OTP store (memory)
const otpStore = {};

// ── REGISTER ──────────────────────────────────────────────────────────────────
const register = async (req, res) => {
  try {
    const { uName, fName, lName, email, password, phone, address } = req.body;

    if (!uName || !fName || !lName || !email || !password || !phone || !address)
      return res.status(400).json({ message: "All Fields Are Required" });

    // 🔥 Check duplicate
    const duplicate = await User.findOne({ $or: [{ uName }, { email }] });
    if (duplicate) {
      const field = duplicate.email === email ? "Email" : "Username";
      return res.status(400).json({ message: `${field} already exists` });
    }

    const hashPass = await bcrypt.hash(password, 10);
    const user = new User({
      uName,
      fName,
      lName,
      email,
      password: hashPass,
      address,
      phone,
    });
    await user.save();

    return res.status(201).json({ message: "User Successfully Created" });
  } catch (error) {
    console.log("REGISTER ERROR:", error);
    // 🔥 MongoDB duplicate key error
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return res.status(400).json({ message: `${field} already exists` });
    }
    return res.status(500).json({ message: "SERVER ERROR" });
  }
};

// ── LOGIN ─────────────────────────────────────────────────────────────────────
const login = async (req, res) => {
  try {
    const { uName, password } = req.body;
    if (!uName || !password)
      return res.status(400).json({ message: "All fields are required" });

    const user = await User.findOne({ uName });
    if (!user)
      return res.status(400).json({ message: "Invalid Username or Password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid Username or Password" });

    const accessToken = jwt.sign(
      { id: user._id, type: "user" },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" },
    );
    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" },
    );

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      sameSite: "Lax",
      secure: false,
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.json({
      accessToken,
      user: {
        _id: user._id,
        uName: user.uName,
        fName: user.fName,
        lName: user.lName,
        name: `${user.fName} ${user.lName}`,
        email: user.email,
        phone: user.phone || "",
        address: user.address || "",
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "SERVER ERROR" });
  }
};

// ── UPDATE USER ───────────────────────────────────────────────────────────────
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { fName, lName, email, phone, address } = req.body;
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User Not Found" });
    if (fName !== undefined) user.fName = fName;
    if (lName !== undefined) user.lName = lName;
    if (email !== undefined) user.email = email;
    if (phone !== undefined) user.phone = phone;
    if (address !== undefined) user.address = address;
    await user.save();
    const updated = user.toObject();
    delete updated.password;
    return res.status(200).json({
      message: "Profile updated successfully",
      user: {
        _id: updated._id,
        uName: updated.uName,
        fName: updated.fName,
        lName: updated.lName,
        name: `${updated.fName} ${updated.lName}`.trim(),
        email: updated.email,
        phone: updated.phone || "",
        address: updated.address || "",
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "SERVER ERROR" });
  }
};

// ── REFRESH ───────────────────────────────────────────────────────────────────
const refresh = async (req, res) => {
  try {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.status(401).json({ message: "Unauthorized" });
    jwt.verify(
      cookies.jwt,
      process.env.REFRESH_TOKEN_SECRET,
      async (err, decoded) => {
        if (err) return res.status(401).json({ message: "Unauthorized" });
        const foundUser = await User.findById(decoded.id);
        const accessToken = jwt.sign(
          { id: foundUser._id, type: "user" },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "15m" },
        );
        res.json({ accessToken });
      },
    );
  } catch (error) {
    return res.status(500).json({ message: "SERVER ERROR" });
  }
};

// ── GET USER ──────────────────────────────────────────────────────────────────
const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select("-password");
    if (!user) return res.status(400).json({ message: "User Not Found" });
    res.json(user);
  } catch (error) {
    return res.status(500).json({ message: "SERVER ERROR" });
  }
};

// ── GET ALL USERS (Admin) ──────────────────────────────────────────────────────
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    return res.status(200).json(users);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "SERVER ERROR" });
  }
};

// ── GET SINGLE USER (Admin) ────────────────────────────────────────────────────
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select("-password");
    if (!user) return res.status(404).json({ message: "User Not Found" });
    return res.status(200).json(user);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "SERVER ERROR" });
  }
};

// ── DELETE USER (Admin) ────────────────────────────────────────────────────────
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user) return res.status(404).json({ message: "User Not Found" });
    return res.status(200).json({ message: "User Deleted Successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "SERVER ERROR" });
  }
};

// ── LOGOUT ────────────────────────────────────────────────────────────────────
const logout = (req, res) => {
  try {
    if (!req.cookies?.jwt) return res.sendStatus(204);
    res.clearCookie("jwt", { httpOnly: true, sameSite: "Lax", secure: false });
    res.json({ message: "Cookie Cleared" });
  } catch (error) {
    return res.status(500).json({ message: "SERVER ERROR" });
  }
};

// ── FORGOT PASSWORD ───────────────────────────────────────────────────────────
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(400)
        .json({ message: "No account found with this email" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore[email] = { otp, expiry: Date.now() + 10 * 60 * 1000 };

    // 🔥 Resend HTTP API — Gmail SMTP Render pe kaam nahi karta
    const https = require("https");
    const body = JSON.stringify({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Password Reset OTP",
      html: `<div style="font-family:sans-serif;padding:20px;"><h2>ShopEase Password Reset</h2><p>Your OTP is:</p><h1 style="letter-spacing:8px;color:#000;">${otp}</h1><p>Valid for 10 minutes.</p></div>`,
    });

    const options = {
      hostname: "api.resend.com",
      path: "/emails",
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(body),
      },
    };

    const reqHttp = https.request(options, (r) => {
      let d = "";
      r.on("data", (chunk) => (d += chunk));
      r.on("end", () => console.log("OTP email response:", r.statusCode, d));
    });
    reqHttp.on("error", (err) => console.log("OTP email error:", err.message));
    reqHttp.write(body);
    reqHttp.end();

    return res.json({ message: "OTP sent successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "SERVER ERROR" });
  }
};

// ── VERIFY OTP ────────────────────────────────────────────────────────────────
const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp)
      return res.status(400).json({ message: "Email and OTP are required" });
    const record = otpStore[email];
    if (!record)
      return res
        .status(400)
        .json({ message: "OTP not found. Request a new one." });
    if (Date.now() > record.expiry) {
      delete otpStore[email];
      return res
        .status(400)
        .json({ message: "OTP expired. Request a new one." });
    }
    if (record.otp !== otp)
      return res.status(400).json({ message: "Invalid OTP" });
    return res.json({ message: "OTP verified" });
  } catch (error) {
    return res.status(500).json({ message: "SERVER ERROR" });
  }
};

// ── RESET PASSWORD ────────────────────────────────────────────────────────────
const resetPassword = async (req, res) => {
  try {
    const { email, otp, password } = req.body;
    if (!email || !otp || !password)
      return res.status(400).json({ message: "All fields are required" });
    const record = otpStore[email];
    if (!record || record.otp !== otp || Date.now() > record.expiry)
      return res.status(400).json({ message: "Invalid or expired OTP" });
    const hashPass = await bcrypt.hash(password, 10);
    await User.findOneAndUpdate({ email }, { password: hashPass });
    delete otpStore[email];
    return res.json({ message: "Password reset successfully" });
  } catch (error) {
    return res.status(500).json({ message: "SERVER ERROR" });
  }
};

module.exports = {
  register,
  login,
  updateUser,
  refresh,
  getUser,
  getAllUsers,
  getUserById,
  deleteUser,
  logout,
  forgotPassword,
  verifyOtp,
  resetPassword,
};
