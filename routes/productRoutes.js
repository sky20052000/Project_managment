const express = require("express");
const productController = require("../controller/productController");
const productRouter = express.Router();
const Authorize = require("../middleware/auth");

productRouter.post("/create",Authorize([1]), productController.createProduct);
productRouter.put("/update", Authorize([1]), productController.updateProduct);
productRouter.post("/getproductlist", Authorize([1]), productController.getProductList);
productRouter.get("/getproductdetail/:id", Authorize([1]), productController.getProductDetail);
productRouter.delete("/deleteproduct/:id", Authorize([1]), productController.deleteProduct);
module.exports  = productRouter