import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const app = express();
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

app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "API endpoint doesn't exist",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});
