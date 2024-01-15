const dotenv = require("dotenv");
dotenv.config();
const mongoose = require("mongoose");

const Connection = async()=>{
             try{
                 const conn = await mongoose.connect(process.env.Mongo_Url);
                  if(!conn){
                     console.log("Database connection failed!");
                  }
                  console.log("Mongoose connected to database!");
             }catch(e){
                console.log(e)
             }
}

module.exports = Connection