import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import path from "path";

dotenv.config();

import postRoutes from "./routes/post-route.js";
import userRoutes from "./routes/user-route.js";

import { sequelize } from "./models/index.js";

const app = express();
const __dirname = path.resolve();

app.set("port", process.env.PORT || 1000);
sequelize
  .sync()
  // .sync({ force: true })
  .then(() => console.log("db connect"))
  .catch(err => console.error(err));

app.use(cors({
  credentials: true,
}));
app.use(morgan("dev"));
app.use("/image", express.static(path.join(__dirname, "images")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/post", postRoutes);
app.use("/user", userRoutes);

app.use((req, res, next) => {
  const error = new Error(`메서드 ${req.method} 경로 ${req.url} 존재하지 않습니다.`);
  error.status = 404;
  next(error);
});

app.use((err, req, res, next) => {
  return res.json({
    success: false,
    message: err.message,
    result: err,
  });
});

app.listen(app.get("port"), () => console.log(1000));
