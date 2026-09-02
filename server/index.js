const express = require("express");
const dotenv = require("dotenv");
dotenv.config("./.env");
const cors = require("cors");
require("./config/connection");
const bodyParser = require("body-parser");
const path = require("path");
const fs = require("fs");

const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const brandRoutes = require("./routes/brandRoutes");
const orderRoutes = require("./routes/orderRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();
app.use(express.json());
app.use(bodyParser.json());
app.use(cors());

// 🔥 Auto create public/review folder
const reviewDir = path.join(__dirname, "public", "review");
if (!fs.existsSync(reviewDir)) {
  fs.mkdirSync(reviewDir, { recursive: true });
  console.log("Created public/review folder");
}

app.get("/", (req, res) => {
  res.send("SERVER HOME");
});

// Static folders
app.use(
  express.static(path.join(__dirname, process.env.UPLOADS_FOLDER || "uploads")),
);
app.use(
  `/${process.env.REVIEW_FOLDER || "review"}`,
  express.static(
    path.join(__dirname, "public", process.env.REVIEW_FOLDER || "review"),
  ),
);

app.use("/auth", authRoutes);
app.use("/products", productRoutes);
app.use("/brands", brandRoutes);
app.use("/order", orderRoutes);
app.use("/review", reviewRoutes);
app.use("/payment", paymentRoutes);
app.use("/admin", adminRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
