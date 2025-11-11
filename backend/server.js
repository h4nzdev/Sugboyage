// server.js
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import spotRouter from "./routes/spotRoutes.js";
import authRouter from "./routes/authentication_routes/authRoutes.js";
import postRouter from "./routes/post_routes/postRoutes.js";
import chatRouter from "./routes/ai_routes/chatRoutes.js";
import tripPlanRouter from "./routes/tripPlanRoutes.js";

const app = express();
const PORT = 3000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/spots", spotRouter);
app.use("/api/auth", authRouter);
app.use("/api/posts", postRouter);
app.use("/api/ai", chatRouter);
app.use("/api/trip-plans", tripPlanRouter);

// Start server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
