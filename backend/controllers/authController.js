const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const generateAccountNumber = () => {
    return 'ACC' + Math.random().toString().slice(2, 12);
};

exports.registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Please enter all fields' });
    }

    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const profilePicInitial = name.charAt(0).toUpperCase();

        user = new User({ name, email, password: hashedPassword, profilePicInitial });
        await user.save(); // ✅ Save user first

        // ✅ Notify all managers about the new registration
        const managers = await User.find({ role: 'manager' });
        for (const manager of managers) {
            await Notification.create({
                userId: manager._id,
                message: `New user "${name}" has registered and is pending approval.`,
                link: '/admin/users'
            });
        }

        res.status(201).json({ message: 'Registration successful. Your account is pending approval by a manager.' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};


exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        if (user.status !== 'active') {
             if (user.status === 'pending') return res.status(401).json({ message: 'Account not yet approved.' });
             if (user.status === 'frozen') return res.status(401).json({ message: 'Your account has been frozen.' });
             return res.status(401).json({ message: 'Account is not active.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        if (!user.accountNumber) {
            user.accountNumber = generateAccountNumber();
            await user.save();
        }

        const payload = { id: user.id, role: user.role };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Ensure the response format is exactly as the frontend expects
        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                accountNumber: user.accountNumber
            }
        });

    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: 'Server error' });
    }
};