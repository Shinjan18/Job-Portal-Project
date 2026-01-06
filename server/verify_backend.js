const axios = require('axios');

const API_URL = 'http://localhost:5000/api';
const timestamp = Date.now();
const email = `employer_${timestamp}@test.com`;
const password = 'password123';
const name = 'Test Employer';

async function runVerification() {
    try {
        console.log(`1. Registering new employer: ${email}`);
        const regRes = await axios.post(`${API_URL}/auth/signup`, {
            name,
            email,
            password,
            role: 'employer'
        });
        console.log('   Registration successful. Status:', regRes.status);
        const token = regRes.data.token;

        const headers = { Authorization: `Bearer ${token}` };

        console.log('\n2. Testing /api/employer/overview');
        const overviewRes = await axios.get(`${API_URL}/employer/overview`, { headers });
        console.log('   Overview fetched. Data:', overviewRes.data);
        if (overviewRes.data.totalJobs === undefined) throw new Error('Missing totalJobs in overview');

        console.log('\n3. Testing POST /api/jobs (Create Job)');
        const jobData = {
            title: 'Test Job ' + timestamp,
            company: 'Test Corp',
            location: 'Remote',
            description: 'A test job description',
            requirements: ['Req 1', 'Req 2'],
            salary: '100k',
            type: 'Full-time'
        };
        const createJobRes = await axios.post(`${API_URL}/jobs`, jobData, { headers });
        console.log('   Job created. ID:', createJobRes.data._id);

        console.log('\n4. Testing GET /api/jobs/my (Jobs Posted)');
        const myJobsRes = await axios.get(`${API_URL}/jobs/my`, { headers });
        console.log('   Fetched jobs count:', myJobsRes.data.length);
        if (!myJobsRes.data.find(j => j._id === createJobRes.data._id)) throw new Error('Created job not found in /my list');

        console.log('\n5. Testing GET /api/employer/applications');
        const appsRes = await axios.get(`${API_URL}/employer/applications`, { headers });
        console.log('   Fetched applications count:', appsRes.data.length);

        console.log('\n✅ ALL BACKEND TESTS PASSED');

    } catch (error) {
        console.error('\n❌ VERIFICATION FAILED');
        if (error.response) {
            console.error('   Status:', error.response.status);
            console.error('   Data:', error.response.data);
        } else {
            console.error('   Error:', error.message);
        }
    }
}

runVerification();
