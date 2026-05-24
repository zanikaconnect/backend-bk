const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createClient } = require('@supabase/supabase-js');
const { isValidEmail, isValidPassword } = require('../utils/validators');

const router = express.Router();
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
};

router.post('/signup', async (req, res) => {
  try {
    const { email, password, name, phone } = req.body;

    // Validation
    if (!email || !password || !name) {
      return res.status(400).json({ success: false, error: 'Email, password, and name are required' });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ success: false, error: 'Invalid email format' });
    }

    if (!isValidPassword(password)) {
      return res.status(400).json({ success: false, error: 'Password must be at least 8 characters' });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user in Supabase
    const { data, error } = await supabase
      .from('users')
      .insert([{
        email,
        password_hash: passwordHash,
        name,
        phone: phone || null
      }])
      .select('id, email, name')
      .single();

    if (error) {
      if (error.code === '23505') {
        return res.status(400).json({ success: false, error: 'Email already exists' });
      }
      throw error;
    }

    // Generate JWT token
    const token = generateToken(data);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: data.id,
        email: data.email,
        name: data.name
      }
    });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password are required' });
    }

    // Find user by email
    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, name, password_hash')
      .eq('email', email)
      .single();

    if (error || !user) {
      return res.status(401).json({ success: false, error: 'Invalid email or password' });
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      return res.status(401).json({ success: false, error: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = generateToken(user);

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

module.exports = router;
