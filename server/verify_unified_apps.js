const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

const API_URL = 'http://localhost:5000/api';
const uniqueId = Date.now() + Math.floor(Math.random() * 1000);

// Users
const employerEmail = `emp_unified_${uniqueId}@test.com`;
const seekerEmail = `seeker_unified_${uniqueId}@test.com`;
const differentEmail = `diff_email_${uniqueId}@other.com`;
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

        // 2. Post 2 Jobs
        console.log('2. Posting 2 Jobs...');
        const job1Res = await axios.post(`${API_URL}/jobs`, {
            title: 'Job 1 (Normal Apply)',
            company: 'Unified Corp',
            location: 'Remote',
            description: 'Desc 1',
            requirements: ['Req 1']
        }, { headers: empHeaders });
        const job1Id = job1Res.data._id;

        const job2Res = await axios.post(`${API_URL}/jobs`, {
            title: 'Job 2 (Quick Apply Diff Email)',
            company: 'Unified Corp',
            location: 'Remote',
            description: 'Desc 2',
            requirements: ['Req 2']
        }, { headers: empHeaders });
        const job2Id = job2Res.data._id;
        console.log('   Jobs posted:', job1Id, job2Id);

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

        // Create Dummy Resume
        const resumePath = path.join(__dirname, 'dummy_resume.pdf');
        if (!fs.existsSync(resumePath)) {
            fs.writeFileSync(resumePath, 'Dummy PDF content');
        }

        // 4. Apply for Job 1 (Normal)
        console.log('4. Applying for Job 1 (Normal)...');
        const form1 = new FormData();
        form1.append('resume', fs.createReadStream(resumePath));
        const form1Headers = { ...seekerHeaders, ...form1.getHeaders() };
        await axios.post(`${API_URL}/jobs/${job1Id}/apply`, form1, { headers: form1Headers });
        console.log('   Applied for Job 1.');

        // 5. Apply for Job 2 (Quick Apply - Different Email)
        console.log(`5. Quick Applying for Job 2 as ${differentEmail}...`);
        const form2 = new FormData();
        form2.append('name', 'Seeker Alias');
        form2.append('email', differentEmail); // DIFFERENT EMAIL
        form2.append('phone', '1234567890');
        form2.append('resume', fs.createReadStream(resumePath));
        // Header MUST include seeker token for soft-auth to work
        const form2Headers = { ...seekerHeaders, ...form2.getHeaders() };

        const qRes = await axios.post(`${API_URL}/jobs/${job2Id}/quick-apply`, form2, { headers: form2Headers });
        console.log('   Quick Applied for Job 2. Msg:', qRes.data.message);
        if (qRes.data.debug) {
            fs.writeFileSync('debug_softauth.json', JSON.stringify(qRes.data.debug, null, 2));
        } else {
            console.log('   WARNING: Debug info missing from response');
        }

        // 6. Verify "My Applications"
        console.log('6. Verifying "My Applications" for Job Seeker...');
        const myAppsRes = await axios.get(`${API_URL}/applications/mine`, { headers: seekerHeaders });
        const myApps = myAppsRes.data;
        console.log('   Fetched applications count:', myApps.length);

        const foundJob1 = myApps.find(a => a.jobId === job1Id || a.job?._id === job1Id);
        const foundJob2 = myApps.find(a => a.jobId === job2Id || a.job?._id === job2Id);

        if (foundJob1) console.log('   ✅ Job 1 found (Normal)');
        else console.error('   ❌ Job 1 NOT found');

        if (foundJob2) {
            console.log('   ✅ Job 2 found (Quick - Different Email)');
            if (foundJob2.displayEmail === differentEmail) console.log('      (Display email matches form email)');
        }
        else console.error('   ❌ Job 2 NOT found (Linkage failed)');

        // 7. Verify Employer Dashboard
        console.log('7. Verifying Employer Dashboard...');
        const overviewRes = await axios.get(`${API_URL}/employer/overview`, { headers: empHeaders });
        console.log('   Total Applications:', overviewRes.data.totalApplications);

        if (overviewRes.data.totalApplications >= 2) {
            console.log('   ✅ Employer sees at least 2 applications');
        } else {
            console.error('   ❌ Employer missing applications');
        }

    } catch (error) {
        if (error.response) {
            console.error('❌ Error response:', error.response.status);
            fs.writeFileSync('last_error.json', JSON.stringify(error.response.data, null, 2));
            console.log('Error details saved to last_error.json');
        } else {
            console.error('❌ Error:', error.message);
        }
    }
}

runTest();

