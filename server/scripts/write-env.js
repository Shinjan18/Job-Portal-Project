const fs = require('fs').promises;
const path = require('path');

async function updateEnvFile(username, password) {
  const envPath = path.join(__dirname, '..', '.env');
  const backupPath = envPath + '.bak';
  const encodedPass = encodeURIComponent(password);
  const maskedPass = password.length > 2 
    ? `${password[0]}${'*'.repeat(password.length - 2)}${password.slice(-1)}`
    : '****';
  
  const newMongoUri = `MONGODB_URI="mongodb+srv://${username}:${encodedPass}@cluster0.vz9bj2g.mongodb.net/JobListingPortal?retryWrites=true&w=majority&appName=Cluster0"`;
  const maskedUri = `MONGODB_URI="mongodb+srv://${username}:${maskedPass}@cluster0.vz9bj2g.mongodb.net/JobListingPortal?retryWrites=true&w=majority&appName=Cluster0"`;

  try {
    // Read existing .env file if it exists
    let envContent = '';
    try {
      envContent = await fs.readFile(envPath, 'utf8');
      // Create backup
      await fs.writeFile(backupPath, envContent, 'utf8');
    } catch (err) {
      if (err.code !== 'ENOENT') throw err;
      // File doesn't exist, that's fine
    }

    // Update or add MONGODB_URI
    let lines = envContent ? envContent.split('\n') : [];
    let found = false;
    
    lines = lines.map(line => {
      if (line.startsWith('MONGODB_URI=')) {
        found = true;
        return newMongoUri;
      }
      return line;
    });

    if (!found) {
      lines.push(newMongoUri);
    }

    // Write the updated content back to .env
    await fs.writeFile(envPath, lines.join('\n'), 'utf8');
    console.log(maskedUri);
  } catch (error) {
    console.error(`ERROR: ${error.message}`);
    process.exit(1);
  }
}

const [,, username, password] = process.argv;
if (!username || !password) {
  console.error('ERROR: Please provide username and password as command line arguments');
  process.exit(1);
}

updateEnvFile(username, password).catch(console.error);
