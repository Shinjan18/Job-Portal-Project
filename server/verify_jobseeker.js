const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

const API_URL = 'http://localhost:5000/api';
const uniqueId = Date.now() + Math.floor(Math.random() * 1000);
const employerEmail = `emp_${uniqueId}@test.com`;
const seekerEmail = `seeker_${uniqueId}@test.com`;
const password = 'password123';

async function runTest() {
    try {
        // 1. Register Employer
        console.log('1. Registering Employer...');
        const empRes = await axios.post(`${API_URL}/auth/signup`, {
            name: 'Test Employer',
            email: employerEmail,
            password,
            role: 'employer'
        });
        const empToken = empRes.data.token;
        const empHeaders = { Authorization: `Bearer ${empToken}` };
        console.log('   Employer registered.');

        // 2. Post a Job
        console.log('2. Posting Job...');
        const jobRes = await axios.post(`${API_URL}/jobs`, {
            title: 'Test Job for Seeker',
            company: 'Test Company',
            location: 'Remote',
            description: 'Test Description',
            requirements: ['Req 1']
        }, { headers: empHeaders });
        const jobId = jobRes.data._id;
        console.log('   Job posted. ID:', jobId);

        // 3. Register Job Seeker
        console.log('3. Registering Job Seeker...');
        const seekerRes = await axios.post(`${API_URL}/auth/signup`, {
            name: 'Test Seeker',
            email: seekerEmail,
            password,
            role: 'jobseeker'
        });
        const seekerToken = seekerRes.data.token;
        const seekerHeaders = { Authorization: `Bearer ${seekerToken}` };
        console.log('   Job Seeker registered.');

        // 4. Create Dummy Resume
        const resumePath = path.join(__dirname, 'dummy_resume.pdf');
        if (!fs.existsSync(resumePath)) {
            fs.writeFileSync(resumePath, 'Dummy PDF content');
        }

        // 5. Apply for Job with File URL
        console.log('5. Applying for Job with Resume...');
        const form = new FormData();
        form.append('resume', fs.createReadStream(resumePath));
        // form-data headers need to be merged with authorization
        const formHeaders = {
            ...seekerHeaders,
            ...form.getHeaders()
        };

        const applyRes = await axios.post(`${API_URL}/jobs/${jobId}/apply`, form, { headers: formHeaders });
        console.log('   Applied successfully. Resume URL:', applyRes.data.application.resumeUrl);

        // 6. Fetch My Applications
        console.log('6. Fetching My Applications...');
        const myAppsRes = await axios.get(`${API_URL}/applications/mine`, { headers: seekerHeaders });
        console.log('   Fetched applications count:', myAppsRes.data.length);

        if (myAppsRes.data.length === 0) {
            console.error('❌ BUG STILL EXISTS: Application count is 0');
        } else {
            console.log('✅ Application found.');
            console.log('   App ID:', myAppsRes.data[0]._id);
            console.log('   Resume URL:', myAppsRes.data[0].resumeUrl);
        }

        // Cleaning up
        // fs.unlinkSync(resumePath);

    } catch (error) {
        if (error.response) {
            console.error('❌ Error response:', error.response.status, error.response.data);
        } else {
            console.error('❌ Error:', error.message);
        }
    }
}

runTest();
