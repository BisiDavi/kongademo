const express = require("express");
const api = express.Router();
const Product = require("../database/models/Product");

/* @GET all products
 *   @Route /api/products
 */

api.get("/products", (req, res) => {
  Product.find({}, (err, products) => {
    if (err) res.send("err", err);
    res.send({ msg: "All available Products", products });
  });
});

/* @GET a single product
 * @Route /api/products/:id
 */
api.get("/products/:id", (req, res) => {
  Product.findById(req.params.id, (err, products) => {
    if (err) res.send("err", err);
    res.send({ msg: "product available", products });
  });
});

/* 
  * @POST a product
  @Route /api/products
 */
api.post("/products", (req, res) => {
  const newProducts = new Product({
    name: req.body.name,
    price: req.body.price,
    formerPrice: req.body.formerPrice,
    brand: req.body.brand,
    img: req.body.img,
    category: req.body.category,
    subcategory: req.body.subcategory,
    description: req.body.description
  });

  newProducts.save((err, products) => {
    if (err) res.send("err", err);
    res.send({ msg: "message saved", products });
  });
});

/* 
  @PUT edit a product
  @Route /api/products/:id
*/
api.put("/products/:id", (req, res) => {
  Product.findById(req.params.id, (err, product) => {
    if (err) res.send("err", err);

    product.name = req.body.name;
    product.price = req.body.price;
    product.formPrice = req.body.formerPrice;
    product.brand = req.body.brand;
    product.img = req.body.img;
    product.category = req.body.category;
    product.description = req.body.description;

    Product.save((err, product) => {
      if (err) res.send("err", err);
      res.send(product);
    });
  });
});

/* @Router /api/products/:id */
api.delete("/products/:id", (req, res) => {
  Product.findByIdAndRemove(req.params.id, (err, product) => {
    if (err) res.send("err", err);
    res.send({ msg: "product removed", product });
  });
});

module.exports = api;
