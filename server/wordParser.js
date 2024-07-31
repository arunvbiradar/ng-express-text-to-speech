const fs = require("fs");
const mammoth = require("mammoth");

const wordParser = async (filePath) => {
  let data = await mammoth.extractRawText({ path: filePath });
  return data.value;
};

module.exports = wordParser;
