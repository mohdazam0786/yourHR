const userModel = require("../models/userModels");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
//register callback
const registerController = async (req, res) => {
  try {
    const existingUser = await userModel.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(200).send({ message: "User Already Exists", success: false });
    }

    // Log password to check its value
    const password = req.body.password;
    console.log("Password:", req.body);  // Debugging line

    // Validate the password field
    if (!password) {
      return res.status(400).send({
        success: false,
        message: 'Password is required and cannot be empty'
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    req.body.password = hashedPassword;
    const newUser = new userModel(req.body);
    await newUser.save();

    res.status(201).send({ message: "Registered Successfully", success: true });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: `Register Controller ${error.message}`,
    });
  }
};


// login callback
const loginController = async (req, res) => {
  try {
    const user = await userModel.findOne({ email: req.body.email });
    if (!user) {
      return res
        .status(200)
        .send({ message: "user not found", success: false });
    }
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res
        .status(200)
        .send({ message: "Invlid EMail or Password", success: false });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.status(200).send({ message: "Login Success", success: true, token });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: `Error in Login CTRL ${error.message}` });
  }
};

const authController = async (req, res) => {
  try {
    const user = await userModel.findById({ _id: req.body.userId });
    user.password = undefined;
    if (!user) {
      return res.status(200).send({
        message: "user not found",
        success: false,
      });
    } else {
      res.status(200).send({
        success: true,
        data: user,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "auth error",
      success: false,
      error,
    });
  }
};

const storage = multer.diskStorage({
  destination: "./uploads/resumes",
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit to 5MB
}).single("resume");

const uploadResumeController = (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(500).send({ success: false, message: err.message });
    }

    if (!req.file) {
      return res.status(400).send({ success: false, message: "No file uploaded." });
    }

    const { name, email, graduation } = req.body;

    if (!name || !email || !graduation) {
      return res.status(400).send({ success: false, message: "All fields are required." });
    }

    try {
      // Create a new user with the form data
      const newUser = new User({
        name,
        email,
        graduation,
        resume: req.file.path,
      });
      // Save the user in the database
      await newUser.save();

      res.status(200).send({ success: true, message: "Resume uploaded and user registered successfully!" });
    } catch (error) {
      console.error(error);
      res.status(500).send({ success: false, message: "An error occurred while saving the user." });
    }
  });
};

module.exports = {
  loginController,
  registerController,
  authController,
  uploadResumeController
};
