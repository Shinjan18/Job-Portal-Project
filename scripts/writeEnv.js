const fs = require('fs');
const path = require('path');

function ensureDir(filePath) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function normalizeLf(content) {
  return content.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
}

function writeFileIfDifferent(filePath, expectedContent) {
  expectedContent = normalizeLf(expectedContent).trimEnd() + '\n';
  ensureDir(filePath);

  let existing = null;
  if (fs.existsSync(filePath)) {
    existing = normalizeLf(fs.readFileSync(filePath, 'utf8'));
  }

  if (existing === expectedContent) {
    return false; // no change
  }

  fs.writeFileSync(filePath, expectedContent, { encoding: 'utf8' });
  return true;
}

function main() {
  const root = process.cwd();

  // server/.env
  const serverEnvPath = path.join(root, 'server', '.env');
  const serverEnvContent = [
    'NODE_ENV=development',
    'PORT=5000',
    'MONGODB_URI=mongodb://localhost:27017/JobListingPortal',
    'JWT_SECRET=devsupersecretkey',
    'JWT_EXPIRES_IN=7d',
    'CORS_ORIGIN=http://localhost:5173',
    'MAX_FILE_SIZE=10mb',
  ].join('\n');

  const serverChanged = writeFileIfDifferent(serverEnvPath, serverEnvContent);

  // client/.env
  const clientEnvPath = path.join(root, 'client', '.env');
  const clientEnvLines = [
    // For CRA-style env usage (if any legacy code references it)
    'REACT_APP_API_URL=http://localhost:5000',
    // For Vite-based services
    'VITE_API_BASE_URL=http://localhost:5000/api',
    'VITE_API_URL=http://localhost:5000',
  ];
  const clientEnvContent = clientEnvLines.join('\n');
  const clientChanged = writeFileIfDifferent(clientEnvPath, clientEnvContent);

  const isDev =
    process.env.NODE_ENV === 'development' ||
    process.env.CI === 'true' ||
    process.env.DEBUG === 'true';

  if (isDev) {
    if (serverChanged) {
      console.log('[writeEnv] Updated server/.env');
    } else {
      console.log('[writeEnv] server/.env already up to date');
    }
    if (clientChanged) {
      console.log('[writeEnv] Updated client/.env');
    } else {
      console.log('[writeEnv] client/.env already up to date');
    }
  }
}

main();


