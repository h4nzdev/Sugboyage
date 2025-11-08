// server.js
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import spotRouter from "./routes/spotRoutes.js";

const app = express();
const PORT = 3000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/spots", spotRouter);

// Start server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
