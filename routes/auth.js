const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Signup Route
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).send('<h1>User already exists</h1><a href="/index.html">Go back</a>');

    const user = new User({ name, email, password });
    await user.save();

    req.session.user = user;
    res.redirect('/student');
  } catch (err) {
    console.error(err);
    res.status(500).send('<h1>Signup failed</h1><a href="/index.html">Try again</a>');
  }
});

// Login Route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).send('<h1>Invalid credentials</h1><a href="/login">Try again</a>');
    }

    req.session.user = user;
    res.redirect('/student');
  } catch (err) {
    console.error(err);
    res.status(500).send('<h1>Login failed</h1><a href="/login">Try again</a>');
  }
});

// Logout
router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/index.html');
});

module.exports = router;
