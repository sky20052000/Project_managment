const User = require("../models/userModels");
const Validator = require("validator");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const userRegister = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    if (!(username && email && password)) {
      return res.status(400).json({
        success: false,
        message: "Mandatory fields can not be epmty!",
      });
    }
    // validate email
    const validateEmail = Validator.isEmail(email);
    if (!validateEmail) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email!" });
    }

    let usercount = await User.countDocuments({
      $or: [{ username }, { password }],
    });
    // console.log(usercount, "nn");
    if (usercount > 0) {
      return res.status(400).send({
        status: false,
        message: "Enter unique user name and password!",
      });
    }
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        success: false,
        message: "User already exists! please try to login!",
      });
    }

    let saveData = {
      username,
      email,
      password,
      role: String(role ? role : 1),
    };
    await User.create(saveData);
    return res
      .status(200)
      .json({ success: true, message: "User regsiter successfully!" });
  } catch (e) {
    console.log(e, "n");
    return res
      .status(500)
      .json({ sucess: false, message: "Something went wrong!" });
  }
};

const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!(email && password)) {
      return res.status(400).json({
        success: false,
        message: "Mandatory fields can not be epmty!",
      });
    }
    // validate email
    const validateEmail = Validator.isEmail(email);
    if (!validateEmail) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email!" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User does not exists" });
    }
    // compare password
    const validatePassword = await user.comparePassword(password);
    if (!validatePassword) {
      return res
        .status(400)
        .json({ sucess: false, message: "Incorrct passowrd!" });
    }

    let userData = {
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    };

    const accessToken = await user.GenerateAccessToken(user?._id);
    return res.status(200).json({ sucess: true, userData, accessToken });
  } catch (e) {
    console.log(e, "nn");
    return res
      .status(500)
      .json({ sucess: false, message: "Something went wrong!" });
  }
};

module.exports = {
  userRegister,
  userLogin,
};
