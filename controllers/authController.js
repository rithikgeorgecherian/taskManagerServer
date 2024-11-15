const jwt = require('jsonwebtoken');
const users = require('../models/User');

exports.registerUser = async (req, res) => {
  const { username, email,  password } = req.body;

  try {
    const userExists = await users.findOne({ email });
    if (userExists) return res.status(400).json({ msg: 'User already exists' });

    const user = new users({ username, password });
    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.status(201).json({ token, username: user.username });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await users.findOne({ username });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.json({ token, username: user.username });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
