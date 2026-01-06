require('dotenv').config({ path: 'server/.env' });
const mongoose = require('mongoose');
const User = require('./server/src/models/User');

const findEmployer = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const employer = await User.findOne({ role: 'employer' });
        if (employer) {
            console.log('FOUND EMPLOYER:', employer.email);
        } else {
            console.log('NO EMPLOYER FOUND');
            // Create one if needed
        }
    } catch (e) {
        console.error(e);
    } finally {
        await mongoose.disconnect();
    }
};

findEmployer();
