const { MongoClient } = require('mongodb');
const user = process.argv[2];
const pass = process.argv[3];
if (!user || !pass) { console.error("USAGE: node test-mongo <user> <pass>"); process.exit(1); }
const enc = encodeURIComponent(pass);
const uri = `mongodb+srv://${user}:${enc}@cluster0.vz9bj2g.mongodb.net/JobListingPortal?retryWrites=true&w=majority`;
console.log("Testing:", uri.replace(/:[^@]+@/, ":*****@"));
(async()=>{ try{ const client = new MongoClient(uri,{serverSelectionTimeoutMS:8000}); await client.connect(); await client.db("admin").command({ping:1}); console.log("CONNECT_OK"); process.exit(0);}catch(e){ console.error("CONNECT_ERR:", e.message); process.exit(1);} })();
