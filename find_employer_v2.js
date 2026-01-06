require('dotenv').config({ path: 'server/.env' });
const mongoose = require('mongoose');

// Define Schema locally to avoid require issues if that was the cause
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    role: String
});
const User = mongoose.models.User || mongoose.model('User', userSchema);

const run = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const user = await User.findOne({ role: 'employer' });
        console.log('EMPLOYER_RESULT:', user ? user.email : 'NONE');
        if (user) console.log('EMPLOYER_ID:', user._id);
    } catch (e) {
        console.error('ERROR:', e);
    } finally {
        await mongoose.disconnect();
    }
};
run();
