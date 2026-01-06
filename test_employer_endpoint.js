require('dotenv').config({ path: 'server/.env' });
const axios = require('axios');
const mongoose = require('mongoose');

// Use the exact ID found or just login with the known email if password is known.
// Since I don't know the password, I will generate a token directly using the same secret as the server.
const jwt = require('jsonwebtoken');

const API_Base = 'http://localhost:5000/api';
const SECRET = process.env.JWT_SECRET || 'supersecretjwtkey'; // Fallback as seen in auth.js

const run = async () => {
    // 1. Generate Token for the employer
    // I need the ID. Let's fetch it cleanly again or use what I saw.
    // Address likely: 'test@example.com' or similar? The output was garbled.
    // Let's just find the user again cleanly.

    await mongoose.connect(process.env.MONGODB_URI);
    const userSchema = new mongoose.Schema({ name: String, email: String, role: String });
    const User = mongoose.models.User || mongoose.model('User', userSchema);
    const employer = await User.findOne({ role: 'employer' });
    await mongoose.disconnect();

    if (!employer) {
        console.error('No employer found to test with.');
        return;
    }
    console.log('Testing with employer:', employer.email);

    const token = jwt.sign({ id: employer._id }, SECRET, { expiresIn: '1h' });
    console.log('Generated Token:', token.substring(0, 20) + '...');

    // 2. Hit the failing endpoint
    try {
        console.log(`GET ${API_Base}/employer/overview`);
        const res = await axios.get(`${API_Base}/employer/overview`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('SUCCESS:', res.status, res.data);
    } catch (err) {
        console.error('FAILURE:', err.response ? err.response.status : err.message);
        if (err.response) {
            console.error('Status Text:', err.response.statusText);
            console.error('Data:', err.response.data);
        }
    }
};

run();
