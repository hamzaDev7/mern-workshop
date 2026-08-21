require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const appointmentRoutes = require("./routes/appointments");
const staffRoutes = require("./routes/staff");

const app = express();

// Middleware order (Task 1.4)
app.use(express.json()); // fills req.body
app.use(cookieParser()); // fills req.cookies
app.use(cors({
  origin: process.env.CLIENT_URL, // exact URL, never "*"
  credentials: true, // allow the cookie
}));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/staff", staffRoutes);

// Connect DB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(process.env.PORT || 5000, () => {
      console.log(`Server running on port ${process.env.PORT || 5000}`);
    });
  })
  .catch((err) => console.error("MongoDB connection error:", err));
