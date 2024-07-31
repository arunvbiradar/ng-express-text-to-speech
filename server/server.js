// server.js
const express = require("express");
const fileUpload = require("express-fileupload");
const path = require("path");
const cors = require("cors");
const fs = require("fs");
const pdfParser = require("./pdfParser");
const wordParser = require("./wordParser");
const convertTextToSpeech = require("./textToSpeech");

const app = express();
app.use(cors()); // Enable CORS
app.use(fileUpload());

function getTimestamp() {
  const now = new Date();
  return now.toISOString().replace(/[:.]/g, "-");
}

// upload file route
app.post("/upload", async (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send("No files were uploaded.");
  }

  let uploadedFile = req.files.file;
  let uploadPath = path.join(__dirname, "uploads", uploadedFile.name);
  let fileName = `output-${getTimestamp()}.wav`;
  let outputPath = path.join(__dirname, "output", fileName);

  try {
    await uploadedFile.mv(uploadPath);
    let text;
    if (uploadedFile.mimetype === "application/pdf") {
      text = await pdfParser(uploadPath);
      await convertTextToSpeech(text, outputPath, -5);
    } else if (
      uploadedFile.mimetype === "application/msword" ||
      uploadedFile.mimetype ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      text = await wordParser(uploadPath);
      await convertTextToSpeech(text, outputPath);
    } else {
      return res.status(400).send("Unsupported file type.");
    }

    res.send({ url: fileName.split(".")[0], text });
  } catch (err) {
    res.status(500).send(err);
  }
});

// api route
app.get("/", (req, res) => {
  res.send("Server is running on port 3000");
});
app.use("/audio", express.static(path.join(__dirname, "output")));

// start server
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
