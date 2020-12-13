const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  return res.send(
    "Welcome to my demo konga api. you can add products, delete product, edit product as an admin. \n You can search for product, like product and buy product"
  );
});

module.exports = router;
