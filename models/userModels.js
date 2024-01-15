const mongoose = require("mongoose");
const Jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    username:{type:String, required:true, unique:true, trim:true},
    email:{type:String, required:true, trim:true},
    password:{type:String, required:true, unique:true, trim:true},
    role:{type:String, default:"1"},
},{
    timestamps:true
});

 //hash password 
 userSchema.pre("save", async function(next){
    if(!this.isModified("password")){
        next()
    }
    this.password = await bcrypt.hash(this.password,10)

})

///generate access token 
userSchema.methods.GenerateAccessToken = async function(){
     return Jwt.sign({
          _id:this._id,
          username:this.username,
          email:this.email,
          role:this.role
     },
     process.env.Access_Token,
     {expiresIn:"24h"}

     )
}

//compare passport
userSchema.methods.comparePassword = async function(enterPassword){
    return await bcrypt.compare(enterPassword, this.password)
}

module.exports = new mongoose.model("User", userSchema);