import express, { json } from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

import jwt from "jsonwebtoken";

import { postSignup, postLogin } from "./controllers/user.js";

const app = express();
app.use(express.json());
app.use(cors());

// connect to mongoDB
const connectDB = async () => {
  const conn = await mongoose.connect(process.env.MONGO_URI);

  if (conn) {
    console.log(`MongoDB connected successfull`);
  }
};

app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Server is running",
  });
});

app.post("/signup", postSignup);
app.post("/login", postLogin);

app.get("/test", (req, res) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  const tokenValue = token.split(" ")[1];

  try{

  const decoded = jwt.verify(tokenValue, process.env.JWT_SECRET)
  if(decoded){
    res.json({
      success: true,
      message: "Authorized",
      data: decoded
    })
  } 
  }
  catch(error){
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }
});

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
