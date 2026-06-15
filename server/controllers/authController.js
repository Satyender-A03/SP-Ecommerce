const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

// 🔥 OTP store (memory me — simple approach)
const otpStore = {}; // { email: { otp, expiry } }

// ── Existing functions ──────────────────────────────────────────────────────

const register = async (req, res) => {
  try {
    const { uName, fName, lName, email, password, phone, address } = req.body;

    if (
      !uName ||
      !fName ||
      !lName ||
      !email ||
      !password ||
      !phone ||
      !address
    ) {
      return res.status(400).json({ message: "All Fields Are Required" });
    }

    const duplicate = await User.findOne({ $or: [{ uName }, { email }] });
    if (duplicate) {
      return res.status(400).json({ message: "User already Exist" });
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
    return res.status(500).json({ message: "SERVER ERROR" });
  }
};

const login = async (req, res) => {
  try {
    const { uName, password } = req.body;

    if (!uName || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ uName });
    if (!user) {
      return res.status(400).json({ message: "Invalid Username or Password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Username or Password" });
    }

    const accessToken = jwt.sign(
      { id: user._id },
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

    // 🔥 user data bhi bhejo (Navbar me naam dikhane ke liye)
    return res.json({
      accessToken,
      user: {
        _id: user._id,
        uName: user.uName,
        name: `${user.fName} ${user.lName}`,
        email: user.email,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "SERVER ERROR" });
  }
};

const refresh = async (req, res) => {
  try {
    const cookies = req.cookies;
    if (!cookies?.jwt) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    jwt.verify(
      cookies.jwt,
      process.env.REFRESH_TOKEN_SECRET,
      async (err, decoded) => {
        if (err) return res.status(401).json({ message: "Unauthorized" });

        const foundUser = await User.findById(decoded.id);
        const accessToken = jwt.sign(
          { id: foundUser._id },
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

const logout = (req, res) => {
  try {
    if (!req.cookies?.jwt) return res.sendStatus(204);
    res.clearCookie("jwt", { httpOnly: true, sameSite: "Lax", secure: false });
    res.json({ message: "Cookie Cleared" });
  } catch (error) {
    return res.status(500).json({ message: "SERVER ERROR" });
  }
};

// ── NEW: Forgot Password ────────────────────────────────────────────────────

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) return res.status(400).json({ message: "Email is required" });

    // User check
    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(400)
        .json({ message: "No account found with this email" });

    // OTP generate (6 digit)
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // 10 min expiry
    otpStore[email] = {
      otp,
      expiry: Date.now() + 10 * 60 * 1000,
    };

    // Email bhejo
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // .env me daalo
        pass: process.env.EMAIL_PASS, // Gmail App Password
      },
    });

    await transporter.sendMail({
      from: `"ShopEase" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Password Reset OTP",
      html: `
        <div style="font-family: sans-serif; padding: 20px;">
          <h2>ShopEase Password Reset</h2>
          <p>Your OTP is:</p>
          <h1 style="letter-spacing: 8px; color: #000;">${otp}</h1>
          <p>Valid for 10 minutes. Do not share this with anyone.</p>
        </div>
      `,
    });

    return res.json({ message: "OTP sent successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "SERVER ERROR" });
  }
};

// ── NEW: Verify OTP ─────────────────────────────────────────────────────────

const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    const record = otpStore[email];

    if (!record) {
      return res
        .status(400)
        .json({ message: "OTP not found. Request a new one." });
    }

    if (Date.now() > record.expiry) {
      delete otpStore[email];
      return res
        .status(400)
        .json({ message: "OTP expired. Request a new one." });
    }

    if (record.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    return res.json({ message: "OTP verified" });
  } catch (error) {
    return res.status(500).json({ message: "SERVER ERROR" });
  }
};

// ── NEW: Reset Password ─────────────────────────────────────────────────────

const resetPassword = async (req, res) => {
  try {
    const { email, otp, password } = req.body;

    if (!email || !otp || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // OTP dobara verify karo
    const record = otpStore[email];

    if (!record || record.otp !== otp || Date.now() > record.expiry) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // Password hash karke update karo
    const hashPass = await bcrypt.hash(password, 10);
    await User.findOneAndUpdate({ email }, { password: hashPass });

    // OTP delete karo
    delete otpStore[email];

    return res.json({ message: "Password reset successfully" });
  } catch (error) {
    return res.status(500).json({ message: "SERVER ERROR" });
  }
};

module.exports = {
  register,
  login,
  refresh,
  getUser,
  logout,
  forgotPassword,
  verifyOtp,
  resetPassword,
};
