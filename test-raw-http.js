const http = require('http');
const https = require('https');

function testEndpoint(method, path, headers = {}) {
  return new Promise((resolve) => {
    const options = {
      hostname: 'job-portal-backend-itvc.onrender.com',
      port: 443,
      path: `/api${path}`,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    };

    console.log(`\n🔍 Testing ${method} ${options.path}`);
    
    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        console.log(`✅ Status: ${res.statusCode}`);
        console.log('Headers:', JSON.stringify(res.headers, null, 2));
        
        try {
          const json = JSON.parse(data);
          console.log('Response:', JSON.stringify(json, null, 2));
        } catch (e) {
          console.log('Raw Response:', data);
        }
        
        resolve();
      });
    });

    req.on('error', (error) => {
      console.error('❌ Error:', error);
      resolve();
    });

    req.end();
  });
}

async function runTests() {
  console.log('🚀 Starting Raw HTTP Tests\n');
  
  // Test health endpoint
  await testEndpoint('GET', '/health');
  
  // Test jobs endpoint
  await testEndpoint('GET', '/jobs?page=1&limit=1');
  
  // Test single job
  await testEndpoint('GET', '/jobs/693be725f5e8edd0c00c9233');
  
  console.log('\n✅ All tests completed!');
}

runTests().catch(console.error);
