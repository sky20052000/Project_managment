
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    productname:{type:String, required:true, unique:true, trim:true},
    description:{type:String, required:true},
    price:{type:String, required:true},
    inventory:{type:String},
    createdBy:{type:String, required:true},
    createdAt:{type:Date},
    updatedAt:{type:Date}
},{
    timestamps:true
});

module.exports = new mongoose.model("Product", productSchema);