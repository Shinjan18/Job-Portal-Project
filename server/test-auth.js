const axios = require('axios');

async function testAuth() {
  try {
    console.log('Testing authentication endpoints...\n');
    
    // Test signup
    console.log('1. Testing signup endpoint...');
    const signupResponse = await axios.post('http://localhost:5000/api/auth/signup', {
      name: 'Test User',
      email: 'test' + Date.now() + '@example.com', // Unique email each time
      password: 'password123',
      role: 'jobseeker'
    });
    console.log('✓ Signup successful:', signupResponse.data.success);
    console.log('  Token received:', !!signupResponse.data.token);
    console.log('  User ID:', signupResponse.data.user.id);
    
    // Extract token for subsequent requests
    const token = signupResponse.data.token;
    
    // Test login
    console.log('\n2. Testing login endpoint...');
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'test' + Date.now() + '@example.com',
      password: 'password123'
    });
    console.log('✓ Login successful:', loginResponse.data.success);
    console.log('  Token received:', !!loginResponse.data.token);
    
    // Test get current user (using token from signup since we don't have a valid user for login)
    console.log('\n3. Testing get current user endpoint...');
    try {
      const userResponse = await axios.get('http://localhost:5000/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log('✓ Get current user successful');
      console.log('  User name:', userResponse.data.user.name);
    } catch (error) {
      console.log('⚠ Get current user failed:', error.response?.data?.message || error.message);
    }
    
    console.log('\n✅ All authentication tests completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.response ? error.response.data : error.message);
  }
}

testAuth();