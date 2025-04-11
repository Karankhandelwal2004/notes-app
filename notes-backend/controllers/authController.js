const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register user
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  console.log("📥 Register Request Body:", req.body);

  try {
    const existingUser = await User.findOne({ email });
    console.log("🔎 Existing User:", existingUser);

    if (existingUser) {
      console.log("⚠️ User already exists");
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("🔐 Hashed Password:", hashedPassword);

    const user = new User({ name, email, password: hashedPassword });
    const savedUser = await user.save();

    console.log("✅ User Registered:", savedUser);
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('❌ Register Error:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (error) {
    console.error('Login Error:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ✅ Export both functions
module.exports = {
  registerUser,
  loginUser
};
