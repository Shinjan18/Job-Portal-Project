const axios = require('axios').default;

async function sleep(ms){ return new Promise(r=>setTimeout(r, ms)); }

async function run() {
  const base = 'http://localhost:5000/api';
  const ts = Date.now();
  const seeker = { name: 'Seeker', email: `seeker${ts}@test.local`, password: 'Passw0rd!', role: 'jobseeker' };
  const employer = { name: 'Employer', email: `employer${ts}@test.local`, password: 'Passw0rd!', role: 'employer' };

  // Wait for server to be ready
  for (let i=0;i<20;i++) {
    try { const { data } = await axios.get(`${base}/health`); if (data.status==='ok') break; } catch {}
    await sleep(500);
  }

  // Sign up both
  await axios.post(`${base}/auth/signup`, seeker).catch(()=>{});
  await axios.post(`${base}/auth/signup`, employer).catch(()=>{});

  // Employer login and create job
  const empLogin = await axios.post(`${base}/auth/login`, { email: employer.email, password: employer.password });
  const empToken = empLogin.data.token;
  const jobRes = await axios.post(`${base}/jobs`, {
    title: 'QA Engineer', description: 'Test things', company: 'QATech', location: 'Remote', salaryRange: '6-10 LPA', skillsRequired: ['Testing','Automation']
  }, { headers: { Authorization: `Bearer ${empToken}` } });
  const jobId = jobRes.data._id;

  // Seeker login and apply
  const seekerLogin = await axios.post(`${base}/auth/login`, { email: seeker.email, password: seeker.password });
  const seekerToken = seekerLogin.data.token;
  await axios.post(`${base}/jobs/${jobId}/apply`, {}, { headers: { Authorization: `Bearer ${seekerToken}` } });

  // Employer views applications
  const apps = await axios.get(`${base}/applications/employer`, { headers: { Authorization: `Bearer ${empToken}` } });
  console.log(`[E2E] Created job ${jobId} and found ${apps.data.length} application(s).`);
}

run().catch((e)=>{
  console.error('[E2E] Failed:', e.message);
});



