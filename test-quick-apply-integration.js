const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

async function testQuickApply() {
  try {
    const jobId = '692bf30060d87d1eb180744f'; // Replace with a valid job ID
    const url = `http://localhost:5000/api/jobs/${jobId}/quick-apply`;
    
    // Create form data
    const form = new FormData();
    form.append('name', 'Test User');
    form.append('email', 'test@example.com');
    form.append('phone', '1234567890');
    form.append('message', 'This is a test application');
    
    // Add a sample resume file
    const resumePath = path.join(__dirname, 'sample-resume.pdf');
    if (!fs.existsSync(resumePath)) {
      // Create a sample resume file if it doesn't exist
      fs.writeFileSync(resumePath, 'Sample Resume Content');
    }
    
    form.append('resume', fs.createReadStream(resumePath));

    console.log('Sending request to:', url);
    
    const response = await axios.post(url, form, {
      headers: {
        ...form.getHeaders(),
      },
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    });

    console.log('\n✅ Success! Response:');
    console.log(JSON.stringify(response.data, null, 2));
    
    if (response.data.success && response.data.trackToken) {
      await testTrackApplication(response.data.trackToken);
    }
  } catch (error) {
    console.error('\n❌ Error:');
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
    const url = `http://localhost:5000/api/applications/track/${trackToken}`;
    console.log('\nTesting track application with token:', trackToken);
    
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

// Run the test
testQuickApply();
