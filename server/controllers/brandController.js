const Brand = require("../models/Brand");

const createBrand = async (req, res) => {
  try {
    console.log(req.body);
    const { title, desc } = req.body;

    if (!title || !desc) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const duplicate = await Brand.findOne({ title });
    if (duplicate) {
      return res.status(400).json({ message: "Brand Already Exists" });
    }

    const brand = await Brand.create({
      title,
      desc,
      image: req.file ? req.file.filename : null,
    });

    return res.status(201).json({ message: "Brand Added" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "SERVER ERROR" });
  }
};

const getAllBrands = async (req, res) => {
  try {
    const data = await Brand.find({});
    if (!data?.length) {
      return res.status(400).json({ message: "No Brands Found" });
    }
    return res.json(data);
  } catch (error) {
    return res.status(500).json({ message: "SERVER ERROR" });
  }
};

const getSingleBrand = async (req, res) => {
  try {
    const { id } = req.params;
    const brand = await Brand.findById({ _id: id });

    if (!brand) {
      return res.status(400).json({ message: "Brand Not Found" });
    }
    return res.json(brand);
  } catch (error) {
    return res.status(500).json({ message: "SERVER ERROR" });
  }
};

const updateBrand = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, desc, products } = req.body;
    const brand = await Brand.findById({ _id: id });
    if (!brand) {
      return res.status(400).json({ message: "Brand Not Found" });
    }

    const duplicate = await Brand.findOne({ title });
    if (duplicate && duplicate._id.toString() != id) {
      return res
        .status(400)
        .json({ message: "Brand With The Same Name Already Exist" });
    }

    brand.title = title;
    brand.desc = desc;
    brand.products = products;
    await brand.save();
    return res.status(200).json({ message: "Brand Update Successfully" });
  } catch (error) {
    return res.status(500).json({ message: "SERVER ERROR" });
  }
};

const deleteBrand = async (req, res) => {
  try {
    const { id } = req.params;
    const del = await Brand.findOneAndDelete({ _id: id });

    return res.status(200).json({ message: "Brand Deleted Successfully" });
  } catch (error) {
    return res.status(500).json({ meesage: "SERVER ERROR" });
  }
};

module.exports = {
  createBrand,
  getAllBrands,
  getSingleBrand,
  updateBrand,
  deleteBrand,
};
