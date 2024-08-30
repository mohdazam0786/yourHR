const express = require("express");
const colors = require("colors");
const dotenv = require("dotenv");
const cors = require('cors');
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const authmiddleware = require("./middlewares/authMiddleware")
//dotenv conig
dotenv.config();

//mongodb connection
connectDB();

//rest obejct
const app = express();
app.use(cors());
app.use('/files', express.static('files'));
//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./files");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    cb(null, uniqueSuffix + file.originalname);
  },
});

require("./models/pdfDetails");
const PdfSchema = mongoose.model("PdfDetails");
const upload = multer({ storage: storage });

app.post("/upload-files", authmiddleware,upload.single("file"), async (req, res) => {
  console.log(req.file);
  const title = req.body.title;
  const fileName = req.file.filename;
  try {
    await PdfSchema.create({ title: title, pdf: fileName });
    res.send({ status: "ok" });
  } catch (error) {
    res.json({ status: error });
  }
});

app.get("/get-files", async (req, res) => {
  try {
    PdfSchema.find({}).then((data) => {
      res.send({ status: "ok", data: data });
    });
  } catch (error) {}
});

//routes
app.use("/user", require("./routes/userRoutes"));

app.get("/", async (req, res) => {
  res.send("Success!!!!!!");
});
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server Started at ${PORT}`);
});

module.exports = app;

