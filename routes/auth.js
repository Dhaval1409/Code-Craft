const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Signup route
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "User already exists" });

    const user = new User({ name, email, password });
    await user.save();

    res.status(200).json({ message: "Signup successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Signup failed", error: err.message });
  }
});

// Login route (final update)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      // ❌ Invalid credentials, render login page with error
      return res.status(400).render('login', { error: "Invalid email or password" });
    }

    // ✅ Valid login
    req.session.user = user;
res.sendFile(path.join(__dirname, 'views', 'index.html'));
// Redirect to index.html (handled in app.js)
  } catch (err) {
    console.error(err);
    res.status(500).render('login', { error: "Login failed. Please try again." });
  }
});

// Logout route
router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login.html');
});

module.exports = router;
