const fs = require("fs");
const pdf = require("pdf-parse");

const pdfParser = async (filePath) => {
  let dataBuffer = fs.readFileSync(filePath);
  let data = await pdf(dataBuffer);
  return data.text;
};

module.exports = pdfParser;
