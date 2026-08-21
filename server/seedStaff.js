require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

async function seedStaff() {
  try {
    await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/meditrack");
    
    // Check if staff already exists
    const existingStaff = await User.findOne({ email: "staff@example.com" });
    if (existingStaff) {
      console.log("Staff account already exists!");
      process.exit(0);
    }

    const hash = await bcrypt.hash("password123", 10);
    
    await User.create({
      name: "Admin Staff",
      email: "staff@example.com",
      password: hash,
      role: "staff"
    });

    console.log("Success! Staff account created.");
    console.log("Email: staff@example.com");
    console.log("Password: password123");
    
    process.exit(0);
  } catch (error) {
    console.error("Error seeding staff:", error);
    process.exit(1);
  }
}

seedStaff();
