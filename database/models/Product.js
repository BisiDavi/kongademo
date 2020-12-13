const mongoose = require("mongoose");
const Product = mongoose.Schema;

const ProductSchema = new Product({
  name: String,
  price: Number,
  formerPrice: Number,
  brand: String,
  img: String,
  category: String,
  subcategory: String,
  description: String
});

module.exports = mongoose.model("Product", ProductSchema);
