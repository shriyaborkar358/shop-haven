import express, { json } from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

import { postSignup, postLogin } from "./controllers/user.js";
import { jwtVerifyMiddleware,  checkRoleMiddleware} from "./middlewares/auth.js";
import { postProducts, getProducts } from "./controllers/product.js";

const app = express();
app.use(express.json());
app.use(cors());

// connect to mongoDB
const connectDB = async () => {
  const conn = await mongoose.connect(process.env.MONGO_URI);

  if (conn) {
    console.log(`MongoDB connected successfully`);
  }
};

app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Server is running",
  });
});

// Auth API's
app.post("/signup", postSignup);
app.post("/login", postLogin);

// Product API's
app.post("/products", jwtVerifyMiddleware, checkRoleMiddleware, postProducts);
app.get("/products", getProducts)


app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "API endpoint doesn't exist",
  });
});

const PORT = process.env.PORT || 5002;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});
