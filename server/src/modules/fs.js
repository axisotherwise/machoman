import fs from "fs";

const mkdirImages = async (req, res, next) => {
  try {
    fs.readdirSync("images");
    next();
  } catch (err) {
    console.log("images 폴더 생성");
    fs.mkdirSync("images");
    next();
  }
};

export default mkdirImages;