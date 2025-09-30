// controllers/productController.js
import uploadOnCloudinary from "../config/cloudinary.js";
import Product from "../model/productModel.js";

// ---------------- ADD PRODUCT ----------------
export const addProduct = async (req, res) => {
  try {
    let { name, description, price, category, subCategory, sizes, bestseller, sizeChart } = req.body;

    // Parse sizes (safe)
    let sizesArr = [];
    try {
      sizesArr = Array.isArray(sizes) ? sizes : JSON.parse(sizes || "[]");
    } catch (err) {
      sizesArr = [];
    }

    // Parse sizeChart (safe) - should be an object, not array
    let sizeChartObj = {};
    try {
      sizeChartObj = typeof sizeChart === "string" ? JSON.parse(sizeChart) : sizeChart;
    } catch (err) {
      sizeChartObj = {};
    }

    // Upload images to Cloudinary (optional safe handler)
    const handleUpload = async (file) => {
      try {
        if (!file || !file.path) return "";
        const result = await uploadOnCloudinary(file.path);
        return result?.secure_url || result?.url || result;
      } catch (err) {
        console.error("Cloudinary upload failed:", err.message);
        return "";
      }
    };

    const image1 = await handleUpload(req?.files?.image1?.[0]);
    const image2 = await handleUpload(req?.files?.image2?.[0]);
    const image3 = await handleUpload(req?.files?.image3?.[0]);
    const image4 = await handleUpload(req?.files?.image4?.[0]);

    const productData = {
      name,
      description,
      price,
      category,
      subCategory,
      sizes: sizesArr,
      sizeChart: sizeChartObj,
      bestseller: bestseller === "true" || bestseller === true,
      date: Date.now(),
      image1,
      image2,
      image3,
      image4
    };

    const product = await Product.create(productData);
    return res.status(201).json(product);
  } catch (error) {
    console.error("AddProduct error", error);
    return res.status(500).json({
      message: "AddProduct error",
      error: error.message,
      stack: error.stack
    });
  }
};

// ---------------- UPDATE PRODUCT ----------------
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };

    // Safe parse sizes
    if (updates.sizes && typeof updates.sizes === "string") {
      try { updates.sizes = JSON.parse(updates.sizes); } catch (e) { updates.sizes = []; }
    }

    // Safe parse sizeChart
    if (updates.sizeChart && typeof updates.sizeChart === "string") {
      try { updates.sizeChart = JSON.parse(updates.sizeChart); } catch (e) { updates.sizeChart = {}; }
    }

    // Handle uploads
    const handleUpload = async (file) => {
      try {
        if (!file || !file.path) return null;
        const result = await uploadOnCloudinary(file.path);
        return result?.secure_url || result?.url || result;
      } catch (err) {
        console.error("Cloudinary upload failed:", err.message);
        return null;
      }
    };

    if (req.files) {
      const i1 = await handleUpload(req.files.image1?.[0]);
      const i2 = await handleUpload(req.files.image2?.[0]);
      const i3 = await handleUpload(req.files.image3?.[0]);
      const i4 = await handleUpload(req.files.image4?.[0]);
      if (i1) updates.image1 = i1;
      if (i2) updates.image2 = i2;
      if (i3) updates.image3 = i3;
      if (i4) updates.image4 = i4;
    }

    const product = await Product.findByIdAndUpdate(id, updates, { new: true });
    return res.status(200).json(product);
  } catch (error) {
    console.error("UpdateProduct error", error);
    return res.status(500).json({
      message: "UpdateProduct error",
      error: error.message,
      stack: error.stack
    });
  }
};

// ---------------- LIST PRODUCT ----------------
export const listProduct = async (req, res) => {
  try {
    const products = await Product.find({});
    return res.status(200).json(products);
  } catch (error) {
    console.error("ListProduct error", error);
    return res.status(500).json({ message: "ListProduct error", error: error.message });
  }
};

// ---------------- GET PRODUCT BY ID ----------------
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    return res.status(200).json(product);
  } catch (error) {
    console.error("GetProduct error", error);
    return res.status(500).json({ message: "GetProduct error", error: error.message });
  }
};

// ---------------- REMOVE PRODUCT ----------------
export const removeProduct = async (req, res) => {
  try {
    let { id } = req.params;
    const product = await Product.findByIdAndDelete(id);
    return res.status(200).json(product);
  } catch (error) {
    console.error("RemoveProduct error", error);
    return res.status(500).json({ message: "RemoveProduct error", error: error.message });
  }
};
