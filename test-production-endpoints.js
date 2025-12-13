const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

const API_BASE = 'https://job-portal-backend-itvc.onrender.com/api';

// Test data
const TEST_JOB_ID = '693be725f5e8edd0c00c9233'; // Python Developer
const TEST_TRACK_TOKEN = 'test-token-123';

async function testEndpoint(name, method, url, data = null, headers = {}) {
  try {
    console.log(`\n🔍 Testing ${name} (${method} ${url})`);
    const response = await axios({
      method,
      url: `${API_BASE}${url}`,
      data,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      },
      validateStatus: () => true // Don't throw on HTTP errors
    });

    console.log(`✅ Status: ${response.status}`);
    if (response.data) {
      console.log('Response:', JSON.stringify(response.data, null, 2).substring(0, 200) + '...');
    }
    return { success: true, data: response.data };
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    if (error.response) {
      console.error('Response:', error.response.data);
    }
    return { success: false, error };
  }
}

async function testFileUpload() {
  try {
    console.log('\n📤 Testing file upload...');
    const form = new FormData();
    
    // Create a test file if it doesn't exist
    const testFilePath = path.join(__dirname, 'test-resume.txt');
    if (!fs.existsSync(testFilePath)) {
      fs.writeFileSync(testFilePath, 'Test resume content');
    }
    
    form.append('name', 'Test User');
    form.append('email', 'test@example.com');
    form.append('phone', '1234567890');
    form.append('message', 'Testing production upload');
    form.append('resume', fs.createReadStream(testFilePath));

    const response = await axios.post(
      `${API_BASE}/jobs/${TEST_JOB_ID}/quick-apply`,
      form,
      {
        headers: {
          ...form.getHeaders(),
          'Content-Length': form.getLengthSync(),
        },
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
      }
    );

    console.log('✅ File upload successful!');
    console.log('Response:', JSON.stringify(response.data, null, 2));
    return { success: true, data: response.data };
  } catch (error) {
    console.error('❌ File upload failed:', error.message);
    if (error.response) {
      console.error('Response:', error.response.data);
    }
    return { success: false, error };
  }
}

async function runTests() {
  console.log('🚀 Starting Production Endpoint Tests\n');
  
  // 1. Health Check
  await testEndpoint('Health Check', 'GET', '/health');
  
  // 2. Get Jobs List
  await testEndpoint('Get Jobs', 'GET', '/jobs?page=1&limit=10');
  
  // 3. Get Single Job
  await testEndpoint('Get Single Job', 'GET', `/jobs/${TEST_JOB_ID}`);
  
  // 4. Test File Upload (Quick Apply)
  const uploadResult = await testFileUpload();
  
  // 5. Test Track Application (if we got a token from upload)
  if (uploadResult.success && uploadResult.data?.trackToken) {
    await testEndpoint(
      'Track Application', 
      'GET', 
      `/applications/track/${uploadResult.data.trackToken}`
    );
  } else {
    // Test with a known test token if available
    await testEndpoint(
      'Track Application (Test Token)', 
      'GET', 
      `/applications/track/${TEST_TRACK_TOKEN}`
    );
  }
  
  console.log('\n✅ All tests completed!');
}

runTests().catch(console.error);
