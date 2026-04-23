const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (userId) => {
    return jwt.sign({ userId }, 'mysecretkey123', { expiresIn: '7d' });
};

// Signup
const signup = async (req, res) => {
    try {
        console.log('📝 Signup request:', req.body);
        
        const { name, email, password } = req.body;
        
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'All fields required' });
        }
        
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        
        const user = new User({ name, email, password });
        await user.save();
        
        const token = generateToken(user._id);
        
        res.status(201).json({
            success: true,
            message: 'User created successfully',
            token,
            user: { id: user._id, name: user.name, email: user.email }
        });
    } catch (error) {
        console.error('❌ Signup error:', error);
        res.status(500).json({ message: 'Server error: ' + error.message });
    }
};

// Login
const login = async (req, res) => {
    try {
        console.log('🔐 Login request:', req.body);
        
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password required' });
        }
        
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        
        const token = generateToken(user._id);
        
        res.json({
            success: true,
            message: 'Login successful',
            token,
            user: { id: user._id, name: user.name, email: user.email }
        });
    } catch (error) {
        console.error('❌ Login error:', error);
        res.status(500).json({ message: 'Server error: ' + error.message });
    }
};

module.exports = { signup, login };