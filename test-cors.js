const https = require('https');

const testUrl = 'https://job-portal-backend-itvc.onrender.com/api/jobs?page=1&limit=6';

console.log(`Testing CORS for URL: ${testUrl}`);
console.log('Origin: https://job-portal-project-in8xmxtwx-shinjan-vermas-projects.vercel.app\n');

const options = {
  method: 'GET',
  headers: {
    'Origin': 'https://job-portal-project-in8xmxtwx-shinjan-vermas-projects.vercel.app',
    'Accept': 'application/json'
  }
};

const req = https.get(testUrl, options, (res) => {
  console.log(`Status Code: ${res.statusCode}`);
  console.log('Response Headers:');
  console.log(`- Access-Control-Allow-Origin: ${res.headers['access-control-allow-origin']}`);
  console.log(`- Access-Control-Allow-Methods: ${res.headers['access-control-allow-methods']}`);
  console.log(`- Access-Control-Allow-Headers: ${res.headers['access-control-allow-headers']}`);
  console.log(`- Access-Control-Allow-Credentials: ${res.headers['access-control-allow-credentials']}`);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      console.log('\nResponse Data:');
      console.log(`- Total Jobs: ${json.data?.jobs?.length || 0}`);
      console.log('- First job title:', json.data?.jobs?.[0]?.title || 'N/A');
      console.log('\n✅ CORS test completed successfully');
    } catch (e) {
      console.error('Error parsing response:', e);
    }
  });
});

req.on('error', (error) => {
  console.error('Request error:', error);
});

req.end();
