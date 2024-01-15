const Product = require("../models/productModels");

const createProduct = async (req, res) => {
  try {
    let { productname, description, price, inventory } = req.body;
    let userId = req.middleware._id;
    if (!(productname && description && price)) {
      return res
        .status(400)
        .json({ success: false, message: "Mandatory fields can't be empty!" });
    }
    let productCount = await Product.countDocuments({
      $or: [{ userId }, { productname }],
    });
    // console.log(usercount, "nn");
    if (productCount > 0) {
      return res.status(400).send({
        status: false,
        message: "Product name should be unique!",
      });
    }

    let saveData = {
      productname,
      description,
      price,
      inventory,
      createdBy: req.middleware._id,
      createdAt: new Date(),
    };
    await Product.create(saveData);
    return res
      .status(200)
      .json({ success: true, message: "Product created successfully!" });
  } catch (e) {
    console.log(e, "nn");
    return res
      .status(500)
      .json({ sucess: false, message: "Something went wrong!" });
  }
};

const updateProduct = async (req, res) => {
    try {
      let { productId,productname, description, price, inventory } = req.body
      if (!(productId && productname && description && price)) {
        return res
          .status(400)
          .json({ success: false, message: "Mandatory fields can't be empty!" });
      }
    
      let updateData = {
        productname,
        description,
        price,
        inventory,
        updatedAt: new Date(),
      };
      await Product.findByIdAndUpdate({_id:productId}, updateData,{new:true})
      return res
        .status(200)
        .json({ success: true, message: "Product updated successfully!" });
    } catch (e) {
      console.log(e, "nn");
      return res
        .status(500)
        .json({ sucess: false, message: "Something went wrong!" });
    }
  };

const getProductList = async (req, res) => {
  try {
    let {productname,pageNumber,pageSize} = req.body;
    pageNumber = Number(pageNumber ? parseInt(pageNumber) : 1);
    pageSize = Number(pageSize ? parseInt(pageSize) : 50);
    const offset = (pageNumber - 1) * pageSize
    let matchStage = { createdBy: req.middleware._id};


    if (productname) {
        matchStage.productname = productname;
      }
  
    const pipeLine = [
      { $match: matchStage },
      {
        $project: {
          _id: 1,
          productname: 1,
          description: 1,
          price:1,
          createdBy: 1,
          createdAt: 1
        },
      },
      {
        $sort: {
          name: 1,
        },
      },
      {$skip:offset},
      {$limit:pageSize}
    ]
    //  console.log(pipeLine,"mmm")
    const taskList = await Product.aggregate(pipeLine);
    if (taskList.length === 0) {
      return res
        .status(200)
        .json({ success: true, message: "No records found!" });
    }
    return res
      .status(200)
      .json({ success: true, dataCount: taskList.length, data: taskList });
  } catch (e) {
    console.log(e, "error");
    return res
      .status(500)
      .json({ sucess: false, message: "Something went wrong!" });
  }
};

const getProductDetail = async (req, res) => {
  try {
    const getPrductDetail = await Product.findById(req.params.id).select(
      " -updatedAt"
    );
    if (!getPrductDetail) {
      return res
        .status(200)
        .json({ success: true, message: "No records found!" });
    }

    return res.status(200).json({ success: true, data: getPrductDetail });
  } catch (e) {
    console.log(e, "nn");
    return res
      .status(500)
      .json({ sucess: false, message: "Something went wrong!" });
  }
};


const deleteProduct = async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id)
      return res.status(200).json({ success: true, message:"Product deleted successfully!" });
    } catch (e) {
      console.log(e, "nn");
      return res
        .status(500)
        .json({ sucess: false, message: "Something went wrong!" });
    }
  };

module.exports = {
     createProduct,
     updateProduct,
     getProductDetail,
     deleteProduct,
     getProductList
}
