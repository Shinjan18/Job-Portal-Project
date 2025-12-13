const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

const API_BASE = 'https://job-portal-backend-itvc.onrender.com/api';

async function testQuickApply() {
  try {
    // Use the first job ID from the jobs list
    const jobId = '693be725f5e8edd0c00c9244'; // Backend Architect position
    const url = `${API_BASE}/jobs/${jobId}/quick-apply`;
    
    // Create a sample resume file if it doesn't exist
    const resumePath = path.join(__dirname, 'sample-resume.pdf');
    if (!fs.existsSync(resumePath)) {
      fs.writeFileSync(resumePath, 'Sample Resume Content');
    }

    // Create form data
    const form = new FormData();
    form.append('name', 'Test User');
    form.append('email', 'test@example.com');
    form.append('phone', '1234567890');
    form.append('message', 'Testing Quick Apply from production');
    form.append('resume', fs.createReadStream(resumePath));

    console.log('Sending Quick Apply request to:', url);
    
    const response = await axios.post(url, form, {
      headers: {
        ...form.getHeaders(),
      },
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    });

    console.log('\n✅ Quick Apply Success! Response:');
    console.log(JSON.stringify(response.data, null, 2));
    
    if (response.data.success && response.data.trackToken) {
      await testTrackApplication(response.data.trackToken);
    }
  } catch (error) {
    console.error('\n❌ Quick Apply Error:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error(error.message);
    }
  }
}

async function testTrackApplication(trackToken) {
  try {
    const url = `${API_BASE}/applications/track/${trackToken}`;
    console.log('\nTesting Track Application with token:', trackToken);
    
    const response = await axios.get(url);
    
    console.log('\n📋 Track Application Response:');
    console.log(JSON.stringify(response.data, null, 2));
    
    // Verify required fields
    const requiredFields = ['name', 'email', 'jobTitle', 'company', 'status', 'appliedAt', 'resumeUrl', 'pdfUrl'];
    const missingFields = requiredFields.filter(field => !(field in response.data));
    
    if (missingFields.length > 0) {
      console.error('\n❌ Missing required fields in track response:', missingFields);
    } else {
      console.log('\n✅ All required fields present in track response');
    }
    
    // Test file URLs if available
    if (response.data.resumeUrl) {
      console.log('\n🔗 Testing Resume URL:', response.data.resumeUrl);
      await testFileUrl(response.data.resumeUrl);
    }
    
    if (response.data.pdfUrl) {
      console.log('\n📄 Testing PDF URL:', response.data.pdfUrl);
      await testFileUrl(response.data.pdfUrl);
    }
    
  } catch (error) {
    console.error('\n❌ Error tracking application:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error(error.message);
    }
  }
}

async function testFileUrl(url) {
  try {
    const response = await axios.head(url);
    console.log(`✅ File accessible (${response.status} ${response.statusText})`);
    console.log('Content-Type:', response.headers['content-type']);
    return true;
  } catch (error) {
    console.error('❌ File not accessible:', error.message);
    return false;
  }
}

// Run the test
testQuickApply();
