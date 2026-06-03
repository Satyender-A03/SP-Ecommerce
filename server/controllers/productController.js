const Brand = require("../models/Brand");
const Product = require("../models/Product");

const createProduct = async (req, res) => {
  try {
    const {
      title,
      desc,
      price,
      discount,
      color,
      size,
      category,
      gender,
      qty,
      brand,
    } = req.body;

    if (
      !title ||
      !desc ||
      !price ||
      !color ||
      !size ||
      !category ||
      !gender ||
      !qty ||
      !brand
    ) {
      return res.status(400).json({ message: "All Fields Are Required" });
    }

    const duplicate = await Product.findOne({ title });
    if (duplicate) {
      return res.status(400).json({ message: "Product Already Exists" });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No images uploaded" });
    }

    const images = req.files.map((file) => file.filename);

    const parsedSize = Array.isArray(size) ? size : JSON.parse(size);

    const product = await Product.create({
      image: images,
      title,
      desc,
      price,
      discount,
      color,
      size: parsedSize,
      category,
      gender,
      qty,
      brand,
    });

    const brandObj = await Brand.findById(brand);
    if (!brandObj) {
      return res.status(404).json({ message: "Brand not found" });
    }

    brandObj.products.push(product._id);
    await brandObj.save();

    return res.status(201).json({
      message: "Product Added Successfully",
      product,
    });
  } catch (error) {
    console.error("CREATE PRODUCT ERROR", error);
    return res.status(500).json({
      message: "SERVER ERROR",
      error: error.message,
    });
  }
};

const getSingleProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id).populate("brand");

    if (!product) {
      return res.status(400).json({ message: "Product Not Found" });
    }

    res.json(product);
  } catch (error) {
    return res.status(500).json({ message: "SERVER Error" });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const data = await Product.find({}).populate("brand");

    if (!data.length) {
      return res.status(400).json({ message: "Product Not Found" });
    }

    res.json(data);
  } catch (error) {
    return res.status(500).json({ message: "SERVER ERROR" });
  }
};

const updateProduct = async (req, res) => {
  try {
    const {
      title,
      desc,
      price,
      discount,
      color,
      size,
      category,
      gender,
      qty,
      brand,
    } = req.body;

    const id = req.params.id;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(400).json({ message: "Product Not Found" });
    }

    const duplicate = await Product.findOne({ title });
    if (duplicate && duplicate._id.toString() !== id) {
      return res.status(400).json({ message: "Product with same name exists" });
    }

    let images = product.image;
    if (req.files && req.files.length > 0) {
      images = req.files.map((file) => file.filename);
    }

    const parsedSize = Array.isArray(size) ? size : JSON.parse(size);

    product.image = images;
    product.title = title;
    product.desc = desc;
    product.price = price;
    product.discount = discount;
    product.color = color;
    product.size = parsedSize;
    product.category = category;
    product.gender = gender;
    product.qty = qty;
    product.brand = brand;

    await product.save();

    return res.status(200).json({
      message: "Product Updated Successfully",
      product,
    });
  } catch (error) {
    return res.status(500).json({ message: "SERVER ERROR" });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    await Product.findByIdAndDelete(id);

    return res.status(200).json({
      message: "Product Deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({ message: "SERVER ERROR" });
  }
};

module.exports = {
  createProduct,
  getSingleProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
};
