const Admin = require("../models/Admin");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// ── LOGIN ─────────────────────────────────────────────────────────────────────
const adminLogin = async (req, res) => {
  try {
    const { uName, password } = req.body;
    if (!uName || !password)
      return res.status(400).json({ message: "All fields are required" });

    const admin = await Admin.findOne({ uName });
    if (!admin)
      return res.status(400).json({ message: "Invalid Username or Password" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid Username or Password" });

    const accessToken = jwt.sign(
      { id: admin._id, role: admin.role, type: "admin" },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1d" },
    );

    return res.json({
      accessToken,
      admin: {
        _id: admin._id,
        uName: admin.uName,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    console.log("ADMIN LOGIN ERROR:", error);
    return res.status(500).json({ message: "SERVER ERROR" });
  }
};

// ── GET PROFILE (self) — includes notification prefs + store settings ─────────
const getAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id).select("-password");
    if (!admin) return res.status(404).json({ message: "Admin Not Found" });
    return res.json(admin);
  } catch (error) {
    return res.status(500).json({ message: "SERVER ERROR" });
  }
};

// ── UPDATE PROFILE (self) — name, email, notificationPrefs, storeSettings ─────
const updateAdminProfile = async (req, res) => {
  try {
    const { name, email, notificationPrefs, storeSettings } = req.body;
    const admin = await Admin.findById(req.admin.id);
    if (!admin) return res.status(404).json({ message: "Admin Not Found" });

    if (name !== undefined) admin.name = name;
    if (email !== undefined) admin.email = email;

    if (notificationPrefs !== undefined) {
      admin.notificationPrefs = {
        ...admin.notificationPrefs.toObject(),
        ...notificationPrefs,
      };
    }

    if (storeSettings !== undefined) {
      admin.storeSettings = {
        ...admin.storeSettings.toObject(),
        ...storeSettings,
      };
    }

    await admin.save();

    const updated = admin.toObject();
    delete updated.password;
    return res.json({
      message: "Profile updated successfully",
      admin: updated,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "SERVER ERROR" });
  }
};

// ── CHANGE PASSWORD (self) ─────────────────────────────────────────────────────
const changeAdminPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword)
      return res.status(400).json({ message: "All fields are required" });

    const admin = await Admin.findById(req.admin.id);
    if (!admin) return res.status(404).json({ message: "Admin Not Found" });

    const isMatch = await bcrypt.compare(currentPassword, admin.password);
    if (!isMatch)
      return res.status(400).json({ message: "Current password is incorrect" });

    admin.password = await bcrypt.hash(newPassword, 10);
    await admin.save();

    return res.json({ message: "Password updated successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "SERVER ERROR" });
  }
};

// ── CREATE ADMIN ────────────────────────────────────────────────────────────────
// Protected — used by an already-logged-in admin to add more admins later.
const createAdmin = async (req, res) => {
  try {
    const { name, uName, email, password } = req.body;
    if (!name || !uName || !email || !password)
      return res.status(400).json({ message: "All Fields Are Required" });

    const duplicate = await Admin.findOne({ $or: [{ uName }, { email }] });
    if (duplicate) {
      const field = duplicate.email === email ? "Email" : "Username";
      return res.status(400).json({ message: `${field} already exists` });
    }

    const hashPass = await bcrypt.hash(password, 10);
    const admin = await Admin.create({
      name,
      uName,
      email,
      password: hashPass,
    });

    return res.status(201).json({
      message: "Admin created successfully",
      admin: { _id: admin._id, uName: admin.uName },
    });
  } catch (error) {
    console.log("CREATE ADMIN ERROR:", error);
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return res.status(400).json({ message: `${field} already exists` });
    }
    return res.status(500).json({ message: "SERVER ERROR" });
  }
};

// ── REGISTER (public, bootstrap-only) ──────────────────────────────────────────
// Public route, but only works when NO admin exists yet.
const registerAdmin = async (req, res) => {
  try {
    const existingCount = await Admin.countDocuments();
    if (existingCount > 0) {
      return res.status(403).json({
        message:
          "An admin already exists. Please log in and use an authenticated admin account to create additional admins.",
      });
    }

    const { name, uName, email, password } = req.body;
    if (!name || !uName || !email || !password)
      return res.status(400).json({ message: "All Fields Are Required" });

    const duplicate = await Admin.findOne({ $or: [{ uName }, { email }] });
    if (duplicate) {
      const field = duplicate.email === email ? "Email" : "Username";
      return res.status(400).json({ message: `${field} already exists` });
    }

    const hashPass = await bcrypt.hash(password, 10);
    const admin = await Admin.create({
      name,
      uName,
      email,
      password: hashPass,
    });

    return res.status(201).json({
      message: "First admin account created successfully. You can now log in.",
      admin: { _id: admin._id, uName: admin.uName },
    });
  } catch (error) {
    console.log("REGISTER ADMIN ERROR:", error);
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return res.status(400).json({ message: `${field} already exists` });
    }
    return res.status(500).json({ message: "SERVER ERROR" });
  }
};

// ── GET PUBLIC STORE INFO (no auth) ────────────────────────────────────────────
// Used by the customer-facing app (e.g. Checkout) to read shipping charge,
// currency, etc. Only exposes non-sensitive store-level fields — never
// admin credentials or personal info.
const getPublicStoreInfo = async (req, res) => {
  try {
    const admin = await Admin.findOne().select("storeSettings");
    if (!admin) {
      // Sensible defaults if no admin/store exists yet
      return res.status(200).json({
        storeName: "ShopEase",
        supportEmail: "",
        currency: "INR",
        shippingCharge: 50,
      });
    }
    return res.status(200).json(admin.storeSettings);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "SERVER ERROR" });
  }
};

module.exports = {
  adminLogin,
  getAdminProfile,
  updateAdminProfile,
  changeAdminPassword,
  createAdmin,
  registerAdmin,
  getPublicStoreInfo,
};
