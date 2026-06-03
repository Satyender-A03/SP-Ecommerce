const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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

    const duplicate = await User.findOne({
      $or: [{ uName }, { email }],
    });

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

    // 🔥 FIX (localhost cookie)
    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      sameSite: "Lax",
      secure: false,
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.json({ accessToken });
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

    const refreshToken = cookies.jwt;

    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      async (err, decoded) => {
        if (err) {
          return res.status(401).json({ message: "Unauthorized" });
        }

        const foundUser = await User.findById(decoded.id);

        const accessToken = jwt.sign(
          { id: foundUser._id },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "15m" },
        );

        // 🔥 FIX
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

    if (!user) {
      return res.status(400).json({ message: "User Not Found" });
    }

    res.json(user);
  } catch (error) {
    return res.status(500).json({ message: "SERVER ERROR" });
  }
};

const logout = (req, res) => {
  try {
    if (!req.cookies?.jwt) return res.sendStatus(204);

    res.clearCookie("jwt", {
      httpOnly: true,
      sameSite: "Lax",
      secure: false,
    });

    res.json({ message: "Cookie Cleared" });
  } catch (error) {
    return res.status(500).json({ message: "SERVER ERROR" });
  }
};

module.exports = { register, login, refresh, getUser, logout };
