const fs=require('fs'),path=require('path');
const user=process.argv[2], pass=process.argv[3];
if(!user||!pass){console.error("USAGE");process.exit(1)}
const enc=encodeURIComponent(pass);
const envPath=path.join(process.cwd(),'server','.env');
let content = fs.existsSync(envPath)?fs.readFileSync(envPath,'utf8'):'';
content = content.replace(/MONGODB_URI=.*(\r?\n|$)/,'');
content += `\nMONGODB_URI="mongodb+srv://${user}:${enc}@cluster0.vz9bj2g.mongodb.net/JobListingPortal?retryWrites=true&w=majority&appName=Cluster0"\n`;
fs.writeFileSync(envPath,content);
console.log("WROTE_OK:", ("mongodb+srv://"+user+":"+enc+"@...").replace(/:[^@]+@/,":*****@"));
