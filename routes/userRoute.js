const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models//userModel");
const logger = require("../logger/logger");
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');



// User Registration
router.post('/register', async (req, res) => {
    console.log('test')
    const paylaod = req.body;
    console.log('test payload',paylaod)
    try {
        const { name, email, password , isJobProvider} = paylaod;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            logger.info(`User Registration Failed: User Already Exists- ${email}`);
            return res.status(400).json({ message: 'User already exists' }); //check for already existing user
        }
        const hashedPassword = await bcrypt.hash(password, 10); //hash password
        const newUser = new User({ name, email, password: hashedPassword, isJobProvider });
        await newUser.save(); //save new user
        logger.info(`User Registered Successfully - ${email}`);
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        logger.error(`User Registration Error: ${error.message}`);
        res.status(500).json({ message: 'Server error' });
    }
})


// User Login
router.post('/login', async (req, res) => {
    const payload = req.body;
    try {
        const { email, password } = payload;
        const user = await User.findOne({ email });
        if (!user) {
            logger.info(`User Login Failed: Invalid Credentials- ${email}`);
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            logger.info(`User Login Failed: Invalid Credentials- ${email}`);
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const token = jwt.sign({ userId: user._id }, 'your-secret-key', { expiresIn: '1h' });
        logger.info('log token', token);
        logger.info(`User logged in successfully- ${email}`);
        res.status(200).json({ token });
    } catch (error) {
        logger.error(`User Login Error: ${error.message}`);
        res.status(500).json({ message: 'Server error' });
    }
});

// Password Reset
router.post('/password-reset', async (req, res) => {
    const { email, newPassword } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            logger.info(`Password reset failed: User not found- ${email}`);
            return res.status(400).json({ message: 'User not found' });
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);


        user.password = hashedPassword;
        await user.save();
        logger.info(`Password reset successfully- ${email}`);
        res.status(200).json({ message: 'Password reset successfully' });
    } catch (error) {
        logger.error(`Password Reset Error: ${error.message}`);
        res.status(500).json({ message: 'Server error' });
    }
});



module.exports = router;