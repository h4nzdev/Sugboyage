import User from "../../model/userModel.js";
import bcrypt from "bcrypt";
import sendVerificationEmail from "../../services/emailServices.js";

const verificationCodes = {};

export class AuthController {
  // Send verification code - NEW METHOD
  static sendVerification = async (req, res) => {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({
          success: false,
          message: "Email is required.",
        });
      }

      // Check if email already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "Email already registered",
        });
      }

      const code = Math.floor(100000 + Math.random() * 900000).toString();

      // Store code with expiration (10 minutes)
      verificationCodes[email] = {
        code,
        expiresAt: Date.now() + 10 * 60 * 1000,
      };

      // Send the email
      const emailResponse = await sendVerificationEmail(email, code);

      if (emailResponse.success) {
        res.json({
          success: true,
          message: "Verification code sent successfully",
        });
      } else {
        res.status(500).json({
          success: false,
          message: emailResponse.message,
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error sending verification code",
        error: error.message,
      });
    }
  };

  // Register user - UPDATED WITH VERIFICATION
  static register = async (req, res) => {
    try {
      const { username, email, password, displayName, verificationCode } =
        req.body; // Added verificationCode

      // Check if user exists
      const existingUser = await User.findOne({
        $or: [{ email }, { username }],
      });

      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "User already exists",
        });
      }

      // ✅ VERIFY THE CODE BEFORE REGISTRATION
      const storedCode = verificationCodes[email];
      if (!storedCode) {
        return res.status(400).json({
          success: false,
          message: "No verification code found. Please request a new one.",
        });
      }

      if (storedCode.code !== verificationCode) {
        return res.status(400).json({
          success: false,
          message: "Invalid verification code",
        });
      }

      if (Date.now() > storedCode.expiresAt) {
        delete verificationCodes[email];
        return res.status(400).json({
          success: false,
          message: "Verification code has expired. Please request a new one.",
        });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12);

      // Create user
      const user = await User.create({
        username,
        email,
        password: hashedPassword,
        profile: {
          displayName: displayName || username,
          avatar: "👤",
        },
      });

      // ✅ CLEAN UP VERIFICATION CODE AFTER SUCCESSFUL REGISTRATION
      delete verificationCodes[email];

      res.status(201).json({
        success: true,
        message: "User registered successfully",
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          profile: user.profile,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Registration failed",
        error: error.message,
      });
    }
  };

  // Login user - EXISTING (NO CHANGES)
  static login = async (req, res) => {
    try {
      const { email, password } = req.body;

      // Find user
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Invalid credentials",
        });
      }

      // Check password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: "Invalid credentials",
        });
      }

      res.json({
        success: true,
        message: "Login successful",
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          profile: user.profile,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Login failed",
        error: error.message,
      });
    }
  };

  // Get user profile - EXISTING (NO CHANGES)
  static getProfile = async (req, res) => {
    try {
      const { userId } = req.params;

      // Validate userId
      if (!userId) {
        return res.status(400).json({
          success: false,
          message: "User ID is required",
        });
      }

      const user = await User.findById(userId).select("-password");
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      res.json({
        success: true,
        user,
      });
    } catch (error) {
      console.error("❌ Error fetching profile:", error.message);
      res.status(500).json({
        success: false,
        message: "Failed to get profile",
        error: error.message,
      });
    }
  };

  static getAllUsers = async (req, res) => {
    try {
      const user = await User.find().select("-password");
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
      console.error("Error:", error);
    }
  };

  // Update profile - EXISTING (NO CHANGES)
  static updateProfile = async (req, res) => {
    try {
      const { userId } = req.params;
      const { displayName, bio, location, avatar } = req.body;

      console.log("🔄 Updating profile for user:", userId);
      console.log("📝 Update data:", { displayName, bio, location, avatar });

      // Validate userId
      if (!userId) {
        return res.status(400).json({
          success: false,
          message: "User ID is required",
        });
      }

      // Check if user exists
      const existingUser = await User.findById(userId);
      if (!existingUser) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // Build update object with only provided fields
      const updateData = {};
      if (displayName !== undefined)
        updateData["profile.displayName"] = displayName;
      if (bio !== undefined) updateData["profile.bio"] = bio;
      if (location !== undefined) updateData["profile.location"] = location;
      if (avatar !== undefined) updateData["profile.avatar"] = avatar;

      console.log("📊 Update data to apply:", updateData);

      const user = await User.findByIdAndUpdate(
        userId,
        { $set: updateData },
        {
          new: true,
          runValidators: true,
        }
      ).select("-password");

      console.log("✅ Profile updated successfully:", user._id);

      res.json({
        success: true,
        message: "Profile updated successfully",
        user,
      });
    } catch (error) {
      console.error("❌ Error updating profile:", error.message);
      res.status(500).json({
        success: false,
        message: "Profile update failed",
        error: error.message,
      });
    }
  };
}
