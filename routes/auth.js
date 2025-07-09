const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Signup Route
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return  res.render('index', { error: 'User already exists' });

    const user = new User({ name, email, password });
    await user.save();

    req.session.user = user;
    res.redirect('/student');
  } catch (err) {
    console.error(err);
    res.render('index', { error: 'Signup failed. Please try again.' });
  }
});

// Login Route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.render('index', { error: 'Invalid email or password' });
    }

    req.session.user = user;
    res.redirect('/student');
  } catch (err) {
    console.error(err);
    res.render('index', { error: 'Login failed. Please try again.' });
  }
});

// Logout
router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/index.html');
});

module.exports = router;
