import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate, Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Toaster, toast } from 'react-hot-toast'
import './index.css'
import api from './api'
import { Navbar, Card, Button, Input, Sidebar, Footer, Modal } from './components/ui'

function Layout() {
    const navigate = useNavigate()
    const [user, setUser] = useState<any>(null)
    const [serverHealthy, setServerHealthy] = useState<boolean | null>(null)
    
    useEffect(() => {
        // Health check
        api.get('/health').then(() => setServerHealthy(true)).catch(() => setServerHealthy(false))
        // Load user profile if authenticated
        api.get('/profile').then((r) => setUser(r.data)).catch(() => setUser(null))
    }, [])
    async function logout() {
        try { await api.post('/auth/logout') } catch {}
        localStorage.removeItem('token')
        setUser(null)
        navigate('/login')
    }
	return (
		<div className="min-h-screen bg-white text-slate-800 flex flex-col">
			<Navbar user={user} onLogout={logout} />
			<div className="max-w-7xl w-full mx-auto px-6 py-8 flex gap-6 flex-1">
				<Sidebar />
                <main className="flex-1">
                    <Routes>
						<Route path="/" element={<Home />} />
                        <Route path="/login" element={<Auth type="login" onAuthed={(u)=>setUser(u)} />} />
                        <Route path="/signup" element={<Auth type="signup" onAuthed={(u)=>setUser(u)} />} />
                        <Route path="/dashboard" element={<Dashboard user={user} />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/jobs" element={<Jobs user={user} />} />
                        <Route path="/applications" element={<Applications user={user} />} />
                        <Route path="/messages" element={<Messages />} />
                        <Route path="/services" element={<Services />} />
                        <Route path="/settings" element={<Settings />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/careers" element={<Careers />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/blog" element={<Blog />} />
                        <Route path="/help" element={<HelpCenter />} />
                        <Route path="/guides" element={<Guides />} />
                        <Route path="/track" element={<TrackPage />} />
						<Route path="*" element={<Navigate to="/" replace />} />
					</Routes>
				</main>
			</div>
			<Footer />
			<Toaster position="top-right" toastOptions={{ duration: 3000, style: { background: '#0ea5a4', color: '#fff' } }} />
		</div>
	)
}

function Home() {
	return (
		<div className="grid md:grid-cols-3 gap-6">
			<Card>
				<h2 className="font-semibold mb-2">Welcome to Job Portal</h2>
				<p className="text-sm text-slate-600">Explore thousands of curated tech roles tailored for you.</p>
			</Card>
			<Card>
				<h2 className="font-semibold mb-2">Boost your profile</h2>
				<p className="text-sm text-slate-600">Add skills, certifications, and projects to stand out.</p>
			</Card>
			<Card>
				<h2 className="font-semibold mb-2">Get recommendations</h2>
				<p className="text-sm text-slate-600">We match jobs to your interests and experience.</p>
			</Card>
		</div>
	)
}

function Auth({ type, onAuthed }: { type: 'login' | 'signup'; onAuthed?: (u:any)=>void }) {
	const navigate = useNavigate()
	const [name, setName] = useState('')
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
    const [role, setRole] = useState<'jobseeker' | 'employer'>('jobseeker')
	const [error, setError] = useState('')

	async function onSubmit(e: React.FormEvent) {
		e.preventDefault()
		setError('')
        try {
            if (type === 'signup') {
                await api.post('/auth/signup', { name, email, password, role })
                toast.success('Account created successfully!')
            }
            const { data } = await api.post('/auth/login', { email, password })
			localStorage.setItem('token', data.token)
            onAuthed?.(data.user)
			toast.success(`Welcome back, ${data.user?.name || 'User'}!`)
			navigate('/dashboard')
		} catch (err: any) {
			const errorMsg = err?.response?.data?.message || 'Action failed'
			setError(errorMsg)
			toast.error(errorMsg)
		}
	}

	return (
		<div className="max-w-md mx-auto">
			<Card>
				<h1 className="text-xl font-semibold mb-4">{type === 'login' ? 'Login' : 'Create account'}</h1>
				{error && <p className="text-sm text-red-600 mb-2">{error}</p>}
                <form className="space-y-3" onSubmit={onSubmit}>
                    {type === 'signup' && <Input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />}
					<Input placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
					<Input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    {type === 'signup' && (
                        <div className="flex gap-4 text-sm">
                            <label className="flex items-center gap-2">
                                <input type="radio" checked={role==='jobseeker'} onChange={()=>setRole('jobseeker')} /> Job Seeker
                            </label>
                            <label className="flex items-center gap-2">
                                <input type="radio" checked={role==='employer'} onChange={()=>setRole('employer')} /> Employer
                            </label>
                        </div>
                    )}
					<Button type="submit">{type === 'login' ? 'Login' : 'Sign up'}</Button>
				</form>
				<div className="text-sm mt-4">
					{type === 'login' ? (
						<Link className="text-teal-600" to="/signup">Create an account</Link>
					) : (
						<Link className="text-teal-600" to="/login">Have an account? Login</Link>
					)}
				</div>
			</Card>
		</div>
	)
}

function Dashboard({ user }: { user: any }) {
    const [apps, setApps] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    
    useEffect(()=>{ 
        if (user) { 
            setLoading(true)
            api.get('/applications/mine')
                .then(r=>setApps(r.data||[]))
                .catch(()=>setApps([]))
                .finally(()=>setLoading(false))
        } 
    }, [user?.id])
    
    const appliedCount = apps.length
    const pendingCount = apps.filter((a:any) => a.status === 'Pending').length
    const acceptedCount = apps.filter((a:any) => a.status === 'Accepted' || a.status === 'Approved').length
    const rejectedCount = apps.filter((a:any) => a.status === 'Rejected').length
    
    const getStatusColor = (status: string) => {
        switch(status) {
            case 'Accepted':
            case 'Approved': return 'bg-green-100 text-green-700'
            case 'Rejected': return 'bg-red-100 text-red-700'
            case 'Pending': return 'bg-yellow-100 text-yellow-700'
            case 'Under Review': return 'bg-blue-100 text-blue-700'
            default: return 'bg-gray-100 text-gray-700'
        }
    }
    
    return (
		<div className="space-y-6">
			<div className="grid md:grid-cols-4 gap-6">
				<Card className="border-l-4 border-l-teal-500">
                    <p className="text-sm text-slate-500 mb-1">Applied</p>
                    <p className="text-3xl font-bold text-teal-600">{appliedCount}</p>
                </Card>
				<Card className="border-l-4 border-l-yellow-500">
                    <p className="text-sm text-slate-500 mb-1">Pending</p>
                    <p className="text-3xl font-bold text-yellow-600">{pendingCount}</p>
                </Card>
				<Card className="border-l-4 border-l-green-500">
                    <p className="text-sm text-slate-500 mb-1">Accepted</p>
                    <p className="text-3xl font-bold text-green-600">{acceptedCount}</p>
                </Card>
				<Card className="border-l-4 border-l-red-500">
                    <p className="text-sm text-slate-500 mb-1">Rejected</p>
                    <p className="text-3xl font-bold text-red-600">{rejectedCount}</p>
                </Card>
			</div>
            <Card>
                <h3 className="font-semibold text-xl mb-4 text-slate-900">Jobs You Applied To</h3>
                {loading ? (
                    <div className="text-center py-8 text-slate-500">Loading applications...</div>
                ) : apps.length === 0 ? (
                    <div className="text-center py-8 text-slate-500">
                        <p>You haven't applied to any jobs yet.</p>
                        <Link to="/jobs" className="text-teal-600 hover:underline mt-2 inline-block">Browse Jobs →</Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {apps.map((a:any)=> (
                            <div key={a._id} className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <h4 className="font-semibold text-lg text-slate-900">{a.job?.title || 'Job Title'}</h4>
                                        <p className="text-sm text-slate-600 mt-1">{a.job?.company || 'Company'} • {a.job?.location || 'Location'}</p>
                                        <p className="text-xs text-slate-500 mt-2">
                                            Applied on {new Date(a.createdAt || Date.now()).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                        </p>
                                    </div>
                                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${getStatusColor(a.status || 'Pending')}`}>
                                        {a.status || 'Pending'}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
			</Card>
		</div>
	)
}

function Profile() {
	const [profile, setProfile] = useState<any>({})
	const [saving, setSaving] = useState(false)
	useEffect(() => {
		api.get('/profile').then((r) => setProfile(r.data || {})).catch(() => {})
	}, [])
	async function save(e: React.FormEvent) {
		e.preventDefault()
		setSaving(true)
		try {
			await api.put('/profile', profile)
		} finally {
			setSaving(false)
		}
	}
	return (
		<div className="max-w-2xl">
            <Card>
				<h1 className="text-xl font-semibold mb-4">Profile</h1>
				<form className="grid md:grid-cols-2 gap-4" onSubmit={save}>
					<Input placeholder="Name" className="md:col-span-2" value={profile.name || ''} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
					<Input placeholder="Education" value={profile.education || ''} onChange={(e) => setProfile({ ...profile, education: e.target.value })} />
					<Input placeholder="Experience" value={profile.experience || ''} onChange={(e) => setProfile({ ...profile, experience: e.target.value })} />
					<Input placeholder="Certifications (comma-separated)" className="md:col-span-2" value={(profile.certifications || []).join(', ')} onChange={(e) => setProfile({ ...profile, certifications: e.target.value.split(',').map((s) => s.trim()) })} />
					<Input placeholder="Companies Worked With (comma-separated)" className="md:col-span-2" value={(profile.companiesWorkedWith || []).join(', ')} onChange={(e) => setProfile({ ...profile, companiesWorkedWith: e.target.value.split(',').map((s) => s.trim()) })} />
					<Input placeholder="Current CTC" type="number" value={profile.currentCTC || 0} onChange={(e) => setProfile({ ...profile, currentCTC: Number(e.target.value) })} />
					<Input placeholder="Job Interests (comma-separated)" className="md:col-span-2" value={(profile.jobInterests || []).join(', ')} onChange={(e) => setProfile({ ...profile, jobInterests: e.target.value.split(',').map((s) => s.trim()) })} />
                    <div className="md:col-span-2 flex items-center justify-between">
                        <Button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save'}</Button>
                        <label className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 cursor-pointer">
                            <input type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={async (e)=>{
                                const file = e.target.files?.[0]; if(!file) return;
                                const form = new FormData(); form.append('resume', file);
                                const { data } = await api.post('/profile/resume', form, { headers: { 'Content-Type': 'multipart/form-data' } });
                                setProfile((p:any)=>({ ...p, resumeUrl: data.resumeUrl }))
                            }} />
                            Upload Resume
                        </label>
                    </div>
                    {profile.resumeUrl && <a className="text-sm text-teal-600" href={profile.resumeUrl} target="_blank">View current resume</a>}
				</form>
			</Card>
		</div>
	)
}

function Jobs({ user }: { user: any }) {
    const [jobs, setJobs] = useState<any[]>([])
    const [appliedIds, setAppliedIds] = useState<string[]>([])
    const [loading, setLoading] = useState(true)
    const [mine, setMine] = useState<any[]>([])
    const [filter, setFilter] = useState({ q: '', location: '', type: '' })
    const [open, setOpen] = useState<any>(null)
    const [creating, setCreating] = useState(false)
    const [form, setForm] = useState<any>({ title: '', description: '', company: '', location: '', salaryRange: '', skillsRequired: '' })
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [total, setTotal] = useState(0)
    const limit = 10
    const [quickOpen, setQuickOpen] = useState<any>(null)
    const [quickForm, setQuickForm] = useState<any>({ name: '', email: '', phone: '', message: '' })
    const [quickResume, setQuickResume] = useState<File | null>(null)
    const [quickSubmitting, setQuickSubmitting] = useState(false)
    const [lastTrack, setLastTrack] = useState<{ token: string; email: string } | null>(null)
    
    async function loadWithRetry(url: string, retries = 2): Promise<any> {
        for (let i = 0; i <= retries; i++) {
            try {
                const response = await api.get(url);
                return response;
            } catch (error: any) {
                if (i === retries) {
                    throw error;
                }
                await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
            }
        }
    }
    
    async function load(pg = page) {
        const params = new URLSearchParams();
        if (filter.q) params.set('search', filter.q)
        if (filter.location) params.set('location', filter.location)
        if (filter.type) params.set('type', filter.type)
        params.set('page', pg.toString())
        params.set('limit', limit.toString())
        setLoading(true)
        try {
            const r = await loadWithRetry(`/api/jobs?${params.toString()}`)
            if (r.data && r.data.jobs) {
                setJobs(r.data.jobs || [])
                setTotalPages(r.data.totalPages || 1)
                setTotal(r.data.total || 0)
            } else if (Array.isArray(r.data)) {
                // Fallback for non-paginated array response
                setJobs(r.data)
                setTotalPages(1)
                setTotal(r.data.length)
            } else {
                setJobs([])
            }
        } catch (err: any) {
            console.error('Failed to load jobs:', err);
            setJobs([])
            const errorMsg = err?.response?.data?.message || err?.message || 'Failed to load jobs. Please try again.';
            toast.error(errorMsg)
        } finally {
            setLoading(false)
        }
        
        if (user?.role === 'employer') {
            api.get('/jobs/mine/list').then((r)=>setMine(r.data||[])).catch(()=>setMine([]))
        }
        if (user?.role === 'jobseeker') {
            api.get('/applications/mine').then((r)=>{
                const ids = (r.data||[]).map((a:any)=>a.job?._id || a.job).filter(Boolean)
                setAppliedIds(ids)
            }).catch(()=>setAppliedIds([]))
        }
    }
    
    useEffect(() => { load(1); setPage(1) }, [])
    // Debounced reload when filters change
    useEffect(() => {
        const t = setTimeout(() => { load(1); setPage(1) }, 500)
        return () => clearTimeout(t)
    }, [filter.q, filter.location, filter.type])
    
    async function apply(id: string) {
        if (!user) {
            // open quick apply modal for guests
            const job = jobs.find((j) => j._id === id)
            setQuickOpen(job || { _id: id })
            return
        }
        try {
            await api.post(`/api/jobs/${id}/apply`)
            setAppliedIds((prev)=> Array.from(new Set([...(prev||[]), id])))
            toast.success('Application submitted successfully!')
        } catch (e: any) {
            if (e?.response?.status === 401) {
                toast.error('Please login first')
            } else if (e?.response?.status === 400) {
                toast.error(e?.response?.data?.message || 'Already applied')
            } else {
                toast.error('Failed to submit application')
            }
        }
    }

    async function submitQuickApply() {
        if (!quickOpen?._id) return
        if (!quickForm.name || !quickForm.email || !quickForm.phone) {
            toast.error('Please fill all required fields')
            return
        }
        if (!quickResume) {
            toast.error('Please attach your resume')
            return
        }
        try {
            setQuickSubmitting(true)
            const formData = new FormData()
            formData.append('name', quickForm.name)
            formData.append('email', quickForm.email)
            formData.append('phone', quickForm.phone)
            formData.append('message', quickForm.message || '')
            formData.append('resume', quickResume)
            const { data } = await api.post(`/api/jobs/${quickOpen._id}/quick-apply`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })
            if (data?.application?.trackToken) {
                setLastTrack({ token: data.application.trackToken, email: quickForm.email })
            }
            setAppliedIds((prev)=> Array.from(new Set([...(prev||[]), quickOpen._id])))
            toast.success(
                `Application received — confirmation sent to ${quickForm.email}`,
                {
                    duration: 5000,
                    icon: '✉️'
                }
            )
            if (data?.previewUrl && process.env.NODE_ENV !== 'production') {
                toast((t) => (
                    <div className="space-y-2">
                        <div className="font-semibold text-slate-800">Email preview available</div>
                        <button
                          className="text-teal-600 underline"
                          onClick={() => {
                              window.open(data.previewUrl, '_blank');
                              toast.dismiss(t.id);
                          }}
                        >
                          View email preview
                        </button>
                    </div>
                ), { duration: 6000 });
            }
            setQuickOpen(null)
            setQuickResume(null)
        } catch (err: any) {
            const msg = err?.response?.data?.error || err?.response?.data?.message || 'Failed to submit application'
            toast.error(msg)
        } finally {
            setQuickSubmitting(false)
        }
    }
    
    function SkeletonLoader() {
        return (
            <div className="animate-pulse">
                <Card>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                    <div className="flex gap-2 mb-4">
                        <div className="h-6 bg-gray-200 rounded w-20"></div>
                        <div className="h-6 bg-gray-200 rounded w-20"></div>
                    </div>
                    <div className="h-3 bg-gray-200 rounded w-full"></div>
                </Card>
            </div>
        )
    }
    return (
        <div className="space-y-4 w-full">
            <div className="flex flex-wrap gap-2 items-center">
                <Input placeholder="Keyword" value={filter.q} onChange={(e) => setFilter({ ...filter, q: e.target.value })} className="max-w-[200px]" />
                <Input placeholder="Location" value={filter.location} onChange={(e) => setFilter({ ...filter, location: e.target.value })} className="max-w-[200px]" />
                <select className="px-3 py-2 rounded-lg border border-slate-300" value={filter.type} onChange={(e)=>setFilter({ ...filter, type: e.target.value })}>
                    <option value="">Any</option>
                    <option>Junior</option>
                    <option>Mid</option>
                    <option>Senior</option>
                </select>
                <Button onClick={load}>Search</Button>
            </div>
            {user?.role === 'employer' && (
                <Card>
                    <div className="flex items-center justify-between">
                        <h3 className="font-semibold">Post a job</h3>
                    </div>
                    <div className="grid md:grid-cols-2 gap-3 mt-3">
                        <Input placeholder="Title" value={form.title} onChange={(e)=>setForm({ ...form, title: e.target.value })} />
                        <Input placeholder="Company" value={form.company} onChange={(e)=>setForm({ ...form, company: e.target.value })} />
                        <Input placeholder="Location" value={form.location} onChange={(e)=>setForm({ ...form, location: e.target.value })} />
                        <Input placeholder="Salary Range" value={form.salaryRange} onChange={(e)=>setForm({ ...form, salaryRange: e.target.value })} />
                        <Input placeholder="Skills (comma-separated)" className="md:col-span-2" value={form.skillsRequired} onChange={(e)=>setForm({ ...form, skillsRequired: e.target.value })} />
                        <Input placeholder="Description" className="md:col-span-2" value={form.description} onChange={(e)=>setForm({ ...form, description: e.target.value })} />
                        <div className="md:col-span-2">
                            <Button disabled={creating} onClick={async ()=>{
                                setCreating(true)
                                try {
                                    const payload = { ...form, skillsRequired: (form.skillsRequired||'').split(',').map((s:string)=>s.trim()).filter(Boolean) }
                                    await api.post('/jobs', payload)
                                    setForm({ title:'', company:'', description:'', location:'', salaryRange:'', skillsRequired:'' })
                                    await load()
                                } finally { setCreating(false) }
                            }}>Create</Button>
                        </div>
                    </div>
                    {mine.length>0 && (
                        <div className="mt-6">
                            <h4 className="font-medium mb-2">Your postings</h4>
                            <div className="grid md:grid-cols-2 gap-3">
                                {mine.map((j:any)=>(
                                    <Card key={j._id}>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <div className="font-semibold">{j.title}</div>
                                                <div className="text-sm text-slate-600">{j.company} • {j.location}</div>
                                            </div>
                                            <Button className="bg-slate-100 text-slate-700 hover:bg-slate-200" onClick={async()=>{ await api.delete(`/jobs/${j._id}`); await load() }}>Delete</Button>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    )}
                </Card>
            )}
            {loading ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => <SkeletonLoader key={i} />)}
                </div>
            ) : (
                <>
                    {jobs.length > 0 && (
                        <div className="mb-4 text-sm text-slate-600">Showing {((page - 1) * limit) + 1} - {Math.min(page * limit, total)} of {total} jobs</div>
                    )}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {jobs.map((job) => (
                            <Card key={job._id} className="hover:shadow-lg transition-shadow border-l-4 border-l-teal-500">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-lg text-slate-900 mb-1">{job.title}</h3>
                                        <p className="text-sm text-slate-600 mb-1">{job.company}</p>
                                        <p className="text-xs text-slate-500 flex items-center gap-1">
                                            <span>📍</span> {job.location || 'Not specified'}
                                        </p>
                                    </div>
                                </div>
                                <p className="text-sm text-slate-700 mb-3 line-clamp-2">{job.description || 'No description available'}</p>
                                <div className="flex flex-wrap gap-2 mb-3">
                                    {(job.skillsRequired || []).slice(0, 4).map((t: string) => (
                                        <span key={t} className="px-2 py-1 text-xs bg-teal-50 text-teal-700 rounded-md font-medium">
                                            {t}
                                        </span>
                                    ))}
                                </div>
                                <div className="flex items-center justify-between pt-3 border-t border-slate-200">
                                    <div className="text-sm font-medium text-teal-600">💰 {job.salaryRange || 'Negotiable'}</div>
                                    <div className="flex gap-2">
                                        {user && (
                                            <Button 
                                                disabled={appliedIds.includes(job._id)} 
                                                onClick={() => apply(job._id)}
                                                className={appliedIds.includes(job._id) ? 'bg-gray-300 cursor-not-allowed' : ''}
                                            >
                                                {appliedIds.includes(job._id) ? 'Applied ✓' : 'Apply'}
                                            </Button>
                                        )}
                                        <button 
                                            className="px-3 py-1.5 text-sm text-teal-600 hover:text-teal-700 font-medium"
                                            onClick={() => setOpen(job)}
                                        >
                                            View
                                        </button>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                    {totalPages > 1 && (
                        <div className="flex items-center justify-center gap-2 mt-8">
                            <Button 
                                disabled={page === 1} 
                                onClick={() => { setPage(p => { const np = p - 1; load(np); return np }) }}
                                className="bg-teal-600 disabled:bg-gray-300"
                            >
                                Previous
                            </Button>
                            <div className="flex gap-1">
                                {[...Array(totalPages)].map((_, i) => {
                                    const p = i + 1
                                    if (p === 1 || p === totalPages || (p >= page - 2 && p <= page + 2)) {
                                        return (
                                            <button
                                                key={p}
                                                onClick={() => { setPage(p); load(p) }}
                                                className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                                                    page === p 
                                                        ? 'bg-teal-600 text-white' 
                                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                }`}
                                            >
                                                {p}
                                            </button>
                                        )
                                    } else if (p === page - 3 || p === page + 3) {
                                        return <span key={p} className="px-2 text-gray-500">...</span>
                                    }
                                    return null
                                })}
                            </div>
                            <Button 
                                disabled={page === totalPages} 
                                onClick={() => { setPage(p => { const np = p + 1; load(np); return np }) }}
                                className="bg-teal-600 disabled:bg-gray-300"
                            >
                                Next
                            </Button>
                        </div>
                    )}
                    {jobs.length === 0 && !loading && (
                        <div className="text-center py-12">
                            <p className="text-slate-600 mb-4">No jobs found. Try adjusting your search filters.</p>
                        </div>
                    )}
                </>
            )}
            <Modal open={!!open} onClose={() => setOpen(null)}>
                <h3 className="text-lg font-semibold">{open?.title}</h3>
                <p className="text-sm text-slate-600 mt-1">{open?.company} • {open?.location}</p>
                <p className="text-sm mt-4">{open?.description}</p>
                <div className="mt-4 flex gap-2 flex-wrap">
                    {(open?.skillsRequired || []).map((t: string) => (
                        <span key={t} className="px-2 py-1 text-xs bg-slate-100 rounded">{t}</span>
                    ))}
                </div>
                <div className="mt-6 flex justify-end gap-2">
                    <Button onClick={() => { setOpen(null); }}>Close</Button>
                    <Button onClick={() => { if (open?._id) apply(open._id) }}>Apply</Button>
                </div>
            </Modal>
            <Modal open={!!quickOpen} onClose={() => setQuickOpen(null)}>
                <h3 className="text-lg font-semibold mb-2">Quick Apply</h3>
                <p className="text-sm text-slate-600 mb-4">{quickOpen?.title || 'Job'}{quickOpen?.company ? ` • ${quickOpen.company}` : ''}</p>
                <div className="space-y-3">
                    <Input placeholder="Full Name" value={quickForm.name} onChange={(e)=>setQuickForm({...quickForm, name: e.target.value})} />
                    <Input placeholder="Email" type="email" value={quickForm.email} onChange={(e)=>setQuickForm({...quickForm, email: e.target.value})} />
                    <Input placeholder="Phone" value={quickForm.phone} onChange={(e)=>setQuickForm({...quickForm, phone: e.target.value})} />
                    <Input placeholder="Message (optional)" value={quickForm.message} onChange={(e)=>setQuickForm({...quickForm, message: e.target.value})} />
                    <div className="flex items-center gap-3">
                        <label className="px-3 py-2 rounded bg-slate-100 text-slate-700 cursor-pointer hover:bg-slate-200">
                            <input type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={(e)=> setQuickResume(e.target.files?.[0] || null)} />
                            Upload Resume
                        </label>
                        <span className="text-xs text-slate-600 truncate">{quickResume?.name || 'PDF/DOC up to 10MB'}</span>
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                        <Button className="bg-slate-100 text-slate-700 hover:bg-slate-200" onClick={()=>setQuickOpen(null)}>Cancel</Button>
                        <Button disabled={quickSubmitting} onClick={submitQuickApply}>{quickSubmitting ? 'Submitting...' : 'Submit'}</Button>
                    </div>
                </div>
            </Modal>
        </div>
    )
}

function Applications({ user }: { user: any }) {
    const [rows, setRows] = useState<any[]>([])
    async function load() {
        const path = user?.role === 'employer' ? '/applications/employer' : '/applications/mine'
        const { data } = await api.get(path)
        setRows(data || [])
    }
    useEffect(()=>{ load().catch(()=>setRows([])) }, [user?.role])
    async function updateStatus(id: string, status: string) {
        try {
            await api.patch(`/applications/${id}/status`, { status })
            toast.success(`Application ${status.toLowerCase()} successfully`)
            await load()
        } catch (err: any) {
            toast.error(err?.response?.data?.message || 'Failed to update status')
        }
    }
    return (
		<div className="w-full">
			<Card>
				<h1 className="text-xl font-semibold mb-4">Applications</h1>
				<div className="overflow-auto">
					<table className="min-w-full text-sm">
						<thead>
							<tr className="text-left text-slate-600">
                                {user?.role === 'employer' && <th className="py-2 pr-4">Name</th>}
                                {user?.role === 'employer' && <th className="py-2 pr-4">Email</th>}
								<th className="py-2 pr-4">Job</th>
								<th className="py-2 pr-4">Location</th>
								<th className="py-2 pr-4">Applied</th>
								<th className="py-2 pr-4">Resume</th>
								<th className="py-2 pr-4">Status</th>
                                {user?.role === 'employer' && <th className="py-2 pr-4">Actions</th>}
							</tr>
						</thead>
                        <tbody className="divide-y">
                            {rows.map((a:any) => (
                                <tr key={a._id}>
                                    {user?.role === 'employer' && <td className="py-2 pr-4">{a.applicant?.name}</td>}
                                    {user?.role === 'employer' && <td className="py-2 pr-4">{a.applicant?.email}</td>}
                                    <td className="py-2 pr-4">{a.job?.title}</td>
                                    <td className="py-2 pr-4">{a.job?.location}</td>
                                    <td className="py-2 pr-4">{new Date(a.createdAt).toLocaleDateString()}</td>
                                    <td className="py-2 pr-4">{a.resumeUrl ? <a className="text-teal-600 hover:underline" href={a.resumeUrl} target="_blank">View</a> : '—'}</td>
                                    <td className="py-2 pr-4">{a.status}</td>
                                    {user?.role === 'employer' && (
                                        <td className="py-2 pr-4 flex gap-2">
                                            <Button className="bg-slate-100 text-slate-700 hover:bg-slate-200" onClick={()=>updateStatus(a._id,'Rejected')}>Reject</Button>
                                            <Button onClick={()=>updateStatus(a._id,'Accepted')}>Accept</Button>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
					</table>
				</div>
			</Card>
		</div>
	)
}

function Messages() {
	return (
		<div className="grid md:grid-cols-3 gap-6 w-full">
			<Card>
				<h3 className="font-semibold mb-2">Chats</h3>
				<ul className="text-sm text-slate-600 space-y-2">
					<li>Recruiter • Tech Corp</li>
					<li>HR • Awesome Co</li>
				</ul>
			</Card>
			<Card className="md:col-span-2">
				<h3 className="font-semibold mb-2">Conversation</h3>
				<div className="h-64 border rounded-lg p-3 text-sm text-slate-600">Select a chat to view messages.</div>
				<div className="mt-3 flex gap-2">
					<Input placeholder="Type a message" />
					<Button>Send</Button>
				</div>
			</Card>
		</div>
	)
}

function Services() {
	return (
		<div className="grid md:grid-cols-3 gap-6 w-full">
			<Card>
				<h3 className="font-semibold mb-2">Resume Review</h3>
				<p className="text-sm text-slate-600">Get professional feedback on your resume.</p>
			</Card>
			<Card>
				<h3 className="font-semibold mb-2">Interview Prep</h3>
				<p className="text-sm text-slate-600">1:1 mock interviews with industry experts.</p>
			</Card>
			<Card>
				<h3 className="font-semibold mb-2">Career Coaching</h3>
				<p className="text-sm text-slate-600">Plan your next career move with a coach.</p>
			</Card>
		</div>
	)
}

function About() {
    return (
        <div className="max-w-3xl w-full">
            <Card>
                <h1 className="text-2xl font-semibold mb-3">About</h1>
                <p className="text-slate-600 mb-3">Our mission is to connect ambitious talent with meaningful opportunities. We bridge the gap between employers and job seekers using a clean, efficient platform inspired by industry leaders.</p>
                <p className="text-slate-600">Our vision is a world where hiring is transparent, inclusive, and fast — empowering people to do their best work.</p>
            </Card>
        </div>
    )
}

function Careers() {
    return (
        <div className="max-w-3xl w-full">
            <Card>
                <h1 className="text-2xl font-semibold mb-3">Careers</h1>
                <p className="text-slate-600 mb-3">We’re growing! Join us as a Frontend Developer, Product Designer, or Growth Marketer. Help shape a platform used by thousands of professionals.</p>
                <p className="text-slate-600">Send your portfolio or resume via the contact form. We’d love to meet you.</p>
            </Card>
        </div>
    )
}

function Contact() {
    return (
        <div className="max-w-3xl w-full">
            <Card>
                <h1 className="text-2xl font-semibold mb-3">Contact</h1>
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2 text-sm text-slate-600">
                        <div><span className="font-medium text-slate-800">Address:</span> 221B Residency Lane, Bengaluru, KA</div>
                        <div><span className="font-medium text-slate-800">Email:</span> hello@jobportal.example</div>
                        <div><span className="font-medium text-slate-800">Phone:</span> +91-98765-43210</div>
                    </div>
                    <form className="space-y-2" onSubmit={(e)=>{e.preventDefault(); alert('Thanks! We will get back to you.')}}>
                        <Input placeholder="Your Name" required />
                        <Input placeholder="Your Email" type="email" required />
                        <Input placeholder="Message" />
                        <Button type="submit">Send</Button>
                    </form>
                </div>
            </Card>
        </div>
    )
}

function Blog() {
    return (
        <div className="grid gap-6 w-full max-w-5xl">
            {[{title:'5 Interview Tips to Stand Out',body:'Research the company, practice concise stories, and ask thoughtful questions.'},{title:'Optimizing Your Resume for ATS',body:'Use role keywords, quantify impact, keep formatting clean and simple.'},{title:'Networking for Developers',body:'Share projects, contribute to OSS, and join meetups to build real connections.'}].map(p=> (
                <Card key={p.title}><h3 className="font-semibold mb-1">{p.title}</h3><p className="text-sm text-slate-600">{p.body}</p></Card>
            ))}
        </div>
    )
}

function HelpCenter() {
    return (
        <div className="max-w-4xl w-full">
            <Card>
                <h1 className="text-2xl font-semibold mb-3">Help Center</h1>
                <div className="space-y-3 text-sm text-slate-700">
                    <div>
                        <p className="font-medium">How do I login or sign up?</p>
                        <p>Use the Login or Sign up pages. Verify your email and keep your password secure.</p>
                    </div>
                    <div>
                        <p className="font-medium">How to apply for jobs?</p>
                        <p>Open a job and click Apply. You can track status under Applications.</p>
                    </div>
                    <div>
                        <p className="font-medium">How do I reset my password?</p>
                        <p>Use Forgot Password on the login page. Follow the instructions sent to your email.</p>
                    </div>
                </div>
            </Card>
        </div>
    )
}

function Guides() {
    return (
        <div className="grid gap-6 w-full max-w-5xl">
            {[{title:'Writing a Results-Driven Resume', body:'Focus on outcomes: increased performance, reduced costs, shipped features.'}, {title:'Preparing for Behavioral Rounds', body:'Use the STAR framework: Situation, Task, Action, Result.'}].map(g => (
                <Card key={g.title}><h3 className="font-semibold mb-1">{g.title}</h3><p className="text-sm text-slate-600">{g.body}</p></Card>
            ))}
        </div>
    )
}

function Settings() {
	return (
		<div className="max-w-2xl w-full">
			<Card>
				<h3 className="font-semibold mb-4">Settings</h3>
				<div className="space-y-3 text-sm">
					<label className="flex items-center gap-2"><input type="checkbox" /> Email notifications</label>
					<label className="flex items-center gap-2"><input type="checkbox" /> Job alerts</label>
					<label className="flex items-center gap-2"><input type="checkbox" /> Marketing updates</label>
				</div>
			</Card>
		</div>
	)
}

function TrackPage() {
    const [searchParams] = useSearchParams()
    const token = searchParams.get('token') || ''
    const email = searchParams.get('email') || ''
    const [data, setData] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function load() {
            if (!token || !email) {
                setError('Missing token or email')
                setLoading(false)
                return
            }
            try {
                const { data } = await api.get(`/api/applications/track?token=${encodeURIComponent(token)}&email=${encodeURIComponent(email)}`)
                setData(data?.application)
            } catch (err: any) {
                const msg = err?.response?.data?.message || 'Unable to fetch application'
                setError(msg)
            } finally {
                setLoading(false)
            }
        }
        load()
    }, [token, email])

    return (
        <div className="max-w-xl w-full mx-auto">
            <Card>
                <h1 className="text-xl font-semibold mb-4">Application Status</h1>
                {loading && <p className="text-sm text-slate-600">Loading...</p>}
                {error && <p className="text-sm text-red-600">{error}</p>}
                {data && (
                    <div className="space-y-2">
                        <p className="text-sm text-slate-700"><span className="font-semibold">Name:</span> {data.name}</p>
                        <p className="text-sm text-slate-700"><span className="font-semibold">Email:</span> {data.email}</p>
                        <p className="text-sm text-slate-700"><span className="font-semibold">Job:</span> {data.jobTitle || data.jobId}</p>
                        <p className="text-sm text-slate-700"><span className="font-semibold">Company:</span> {data.company || '—'}</p>
                        <p className="text-sm text-slate-700"><span className="font-semibold">Status:</span> {data.status}</p>
                        <p className="text-sm text-slate-700"><span className="font-semibold">Applied:</span> {new Date(data.createdAt).toLocaleString()}</p>
                        <p className="text-sm text-slate-700"><span className="font-semibold">Message:</span> {data.message || '—'}</p>
                        <p className="text-sm text-slate-700">
                            <span className="font-semibold">Resume:</span>{' '}
                            {data.resumeUrlFull ? (
                                <button
                                  className="text-teal-600 hover:underline"
                                  onClick={() => window.open(data.resumeUrlFull, '_blank')}
                                >
                                  View
                                </button>
                              ) : '—'}
                        </p>
                        <p className="text-sm text-slate-700">
                            <span className="font-semibold">Summary PDF:</span>{' '}
                            {data.pdfUrlFull ? (
                              <a className="text-teal-600 hover:underline" href={data.pdfUrlFull} download>
                                Download
                              </a>
                            ) : '—'}
                        </p>
                    </div>
                )}
            </Card>
        </div>
    )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<BrowserRouter>
			<Layout />
		</BrowserRouter>
	</React.StrictMode>
)
