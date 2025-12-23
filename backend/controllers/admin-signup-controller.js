const User = require("../models/User");

const createAdmin = async (req, res) => {
  try {
    const adminExists = await User.findOne({ role: "admin" });

  if (adminExists) {
    console.log("Admin already exists");
    return;
  }

  const user = new User({
    name: "Admin User",
    email: "admin@example.com",
    password: "Admin@123",
    role: "admin",
  });

    await user.save();

    console.log("Admin created successfully");
    
    if (res) {
      return res.status(201).json({
        message: "Admin created successfully",
        success: true
      });
    }
  } catch (error) {
    console.error('Admin creation error:', error);
    if (res) {
      return res.status(500).json({
        message: "Error creating admin",
        success: false
      });
    }
  }
};


module.exports = {
  createAdmin
};