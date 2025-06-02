const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Db } = require('../config/Db');
require('dotenv').config();

const register = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'All fields are required.' });

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await Db.execute(
      'INSERT INTO users (email, password) VALUES (?, ?)',
      [email, hashedPassword]
    );
    res.status(201).json({ message: '✅ User registered successfully.' });
  } catch (err) {
    if (err.message.includes('UNIQUE')) {
      return res.status(409).json({ message: '⚠️ Email already in use.' });
    }
    console.error('Register Error:', err);
    res.status(500).json({ message: '❌ Server error during registration.' });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await Db.execute('SELECT * FROM users WHERE email = ?', [email]);
    const user = result.rows[0];

    if (!user) return res.status(401).json({ message: '❌ Invalid credentials.' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: '❌ Invalid credentials.' });

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token });
  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ message: '❌ Server error during login.' });
  }
};

const profile = async (req, res) => {
  try {
    const result = await Db.execute(
      'SELECT id, email, created_at FROM users WHERE id = ?',
      [req.user.id]
    );

    const user = result.rows[0];
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user);
  } catch (err) {
    console.error('Profile Error:', err);
    res.status(500).json({ message: '❌ Server error while fetching profile.' });
  }
};

module.exports = { register, login, profile };
