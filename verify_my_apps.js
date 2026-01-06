require('dotenv').config({ path: 'server/.env' });
const mongoose = require('mongoose');
const path = require('path');

// Manually define models if requires fail due to internal dependencies
// OR ensure we can load them. Let's try loading them with absolute paths or correct relatives.
const Application = require('./server/src/models/Application');
const QuickApplication = require('./server/src/models/QuickApplication');
const User = require('./server/src/models/User');
// Models usually don't have relative deps other than mongoose, so this should work if paths are right.
// If models require other local files, we might need to be careful.

const verifyApps = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to DB');

        // Just find ANY 5 regular applications
        const regularApps = await Application.find().limit(5).populate('job').lean();
        console.log(`\n--- ALL REGULAR APPS SAMPLE (${regularApps.length}) ---`);
        regularApps.forEach((app, i) => {
            console.log(`[Reg ${i}] ID: ${app._id}`);
            console.log(`   jobId (calculated): ${app.job?._id}`);
            console.log(`   job populated?: ${!!app.job}`);
        });

        // Just find ANY 5 quick applications
        const quickApps = await QuickApplication.find().limit(5).lean();
        console.log(`\n--- ALL QUICK APPS SAMPLE (${quickApps.length}) ---`);
        quickApps.forEach((app, i) => {
            console.log(`[Quick ${i}] ID: ${app._id}`);
            console.log(`   jobId (field): ${app.jobId}`);
            console.log(`   trackToken: ${app.trackToken}`);
        });

        // Just dump raw QuickApps to see structure if no user matches
        const randomQuick = await QuickApplication.findOne().lean();
        if (randomQuick) {
            console.log('\nRandom QuickApp Sample:', JSON.stringify(randomQuick, null, 2));
        }

    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
    }
};

verifyApps();
