import express from "express";
import { AuthController } from "../../controller/auth_controller/authentication.js";

const authRouter = express.Router();

// Register new user
authRouter.post("/register", AuthController.register);

// Login user
authRouter.post("/login", AuthController.login);

// Get user profile by ID
authRouter.get("/profile/:userId", AuthController.getProfile);

// Update user profile by ID
authRouter.put("/profile/:userId", AuthController.updateProfile);

export default authRouter;
