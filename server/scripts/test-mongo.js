// server/scripts/test-mongo.js
const { MongoClient } = require('mongodb');

const user = process.argv[2];
const pass = process.argv[3];

if (!user || !pass) {
  console.error("USAGE: node scripts/test-mongo.js <user> <pass>");
  process.exit(1);
}

const enc = encodeURIComponent(pass);
const uri = `mongodb+srv://${user}:${enc}@cluster0.vz9bj2g.mongodb.net/JobListingPortal?retryWrites=true&w=majority`;

async function testConnection() {
  try {
    console.log("Testing MongoDB connection to:", uri.replace(/:[^:@]+@/, ':*****@'));
    const client = new MongoClient(uri, { serverSelectionTimeoutMS: 8000 });
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("CONNECT_OK");
    await client.close();
    process.exit(0);
  } catch (e) {
    console.log("CONNECT_ERR:", e.message);
    process.exit(1);
  }
}

testConnection();
