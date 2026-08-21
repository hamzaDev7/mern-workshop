const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { protect } = require("../middleware/auth");

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000, // milliseconds
};

function signToken(user) {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
}

function publicUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
}

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  if (await User.findOne({ email }))
    return res.status(400).json({ msg: "Email already registered" });
  
  const hash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hash });
  
  res.cookie("token", signToken(user), cookieOptions)
    .status(201)
    .json({ user: publicUser(user) });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select("+password");
  const ok = user && (await bcrypt.compare(password, user.password));
  
  if (!ok) return res.status(400).json({ msg: "Invalid credentials" });
  
  res.cookie("token", signToken(user), cookieOptions)
    .status(200)
    .json({ user: publicUser(user) });
});

router.get("/me", protect, async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) return res.status(401).json({ msg: "No user" });
  res.json({ user: publicUser(user) });
});

router.post("/logout", (req, res) => {
  res.clearCookie("token", cookieOptions);
  res.json({ msg: "Logged out" });
});

router.post("/forgotpassword", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(404).json({ msg: "There is no user with that email" });
  }

  // Generate token
  const resetToken = crypto.randomBytes(20).toString("hex");

  // Hash token and set to field
  user.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
  user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

  await user.save({ validateBeforeSave: false });

  const resetUrl = `${process.env.CLIENT_URL}/resetpassword/${resetToken}`;
  
  // Since we are running locally, just log it to the console instead of sending an email
  console.log(`\n\n[LOCAL EMAIL SIMULATION]\nTo reset your password, visit this link:\n${resetUrl}\n\n`);

  res.status(200).json({ msg: "Password reset link logged to server console" });
});

router.put("/resetpassword/:token", async (req, res) => {
  // Get hashed token
  const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() }
  });

  if (!user) {
    return res.status(400).json({ msg: "Invalid or expired token" });
  }

  // Set new password
  user.password = await bcrypt.hash(req.body.password, 10);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  res.cookie("token", signToken(user), cookieOptions)
    .status(200)
    .json({ user: publicUser(user) });
});

module.exports = router;
