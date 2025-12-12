import React from 'react'
import { Link, NavLink } from 'react-router-dom'

export const Icons = {
	home: (
		<svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-slate-500">
			<path d="M3 11L12 3l9 8v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-9z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
		</svg>
	),
	dashboard: (
		<svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-slate-500">
			<path d="M3 3h8v8H3V3zm10 0h8v5h-8V3zM3 13h5v8H3v-8zm7 0h11v8H10v-8z" fill="currentColor" />
		</svg>
	),
	profile: (
		<svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-slate-500">
			<path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm8 9a8 8 0 0 0-16 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
		</svg>
	),
	jobs: (
		<svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-slate-500">
			<path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2m4 0H5a2 2 0 0 0-2 2v6a4 4 0 0 0 4 4h10a4 4 0 0 0 4-4V9a2 2 0 0 0-2-2Z" stroke="currentColor" strokeWidth="1.5" />
		</svg>
	),
	messages: (
		<svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-slate-500">
			<path d="M21 12a8.96 8.96 0 0 1-1.3 4.7A9 9 0 0 1 12 21a8.96 8.96 0 0 1-4.7-1.3L3 21l1.3-4.3A9 9 0 1 1 21 12Z" stroke="currentColor" strokeWidth="1.5" />
		</svg>
	),
	services: (
		<svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-slate-500">
			<path d="M10 4h4l1 3h3l1 4-3 2 1 3-3 2-3-2-3 2-3-2 1-3-3-2 1-4h3l1-3Z" stroke="currentColor" strokeWidth="1.5" />
		</svg>
	),
	settings: (
		<svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-slate-500">
			<path d="M12 15a3 3 0 1 0-3-3 3 3 0 0 0 3 3Zm8-3a8 8 0 1 1-8-8 8 8 0 0 1 8 8Z" stroke="currentColor" strokeWidth="1.5" />
		</svg>
	),
	logout: (
		<svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-slate-500">
			<path d="M16 17l5-5-5-5M21 12H9m4 8H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
		</svg>
	)
}

export function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
    return (
        <div className={`bg-white/90 backdrop-blur rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-slate-200/70 p-6 hover:shadow-[0_10px_40px_rgb(0,0,0,0.08)] transition ${className}`.trim()}>
            {children}
        </div>
    )
}

export function Button({ children, className = '', ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
	return (
        <button {...props} className={`px-4 py-2 rounded-lg bg-gradient-to-tr from-teal-600 to-cyan-600 text-white hover:from-teal-700 hover:to-cyan-700 transition shadow-sm ${className}`.trim()}>
			{children}
		</button>
	)
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
	return <input {...props} className={`w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 ${props.className || ''}`.trim()} />
}

export function Loader() {
	return <div className="animate-spin h-6 w-6 border-2 border-slate-300 border-t-teal-600 rounded-full" />
}

export function Modal({ open, onClose, children }: { open: boolean; onClose: () => void; children: React.ReactNode }) {
	if (!open) return null
	return (
		<div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4" onClick={onClose}>
			<div className="bg-white rounded-xl shadow p-6 max-w-2xl w-full" onClick={(e) => e.stopPropagation()}>
				{children}
			</div>
		</div>
	)
}

export function Navbar({ user, onLogout }: { user?: any; onLogout: () => void }) {
	return (
        <nav className="sticky top-0 z-10 bg-gradient-to-r from-white to-sky-50/70 backdrop-blur border-b border-slate-200">
            <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
                <Link to="/" className="font-semibold text-teal-700 text-xl">Job Portal</Link>
                <div className="hidden md:flex gap-4 text-sm items-center">
                    <Link to="/jobs" className="hover:text-teal-600 font-medium">Jobs</Link>
                    {user && (
                        <>
                            <Link to="/dashboard" className="hover:text-teal-600 font-medium">Dashboard</Link>
                            <Link to="/profile" className="hover:text-teal-600 font-medium">Profile</Link>
                        </>
                    )}
                    <Link to="/about" className="hover:text-teal-600 font-medium">About</Link>
                    <Link to="/careers" className="hover:text-teal-600 font-medium">Careers</Link>
                    <Link to="/contact" className="hover:text-teal-600 font-medium">Contact</Link>
                    {user ? (
                        <button onClick={onLogout} className="px-4 py-1.5 rounded-lg bg-teal-600 text-white hover:bg-teal-700 font-medium transition">Logout</button>
                    ) : (
                        <Link to="/login" className="px-4 py-1.5 rounded-lg bg-teal-600 text-white hover:bg-teal-700 font-medium transition">Login</Link>
                    )}
                </div>
            </div>
        </nav>
	)
}

export function Sidebar() {
	const nav = [
		{ to: '/', label: 'Home', icon: Icons.home },
		{ to: '/dashboard', label: 'Dashboard', icon: Icons.dashboard },
		{ to: '/profile', label: 'Profile', icon: Icons.profile },
		{ to: '/jobs', label: 'Jobs', icon: Icons.jobs },
		{ to: '/messages', label: 'Messages', icon: Icons.messages },
		{ to: '/services', label: 'Services', icon: Icons.services },
		{ to: '/settings', label: 'Settings', icon: Icons.settings }
	]
	return (
		<aside className="hidden md:block w-64 shrink-0">
			<div className="sticky top-20 space-y-2">
				{nav.map((n) => (
					<NavLink
						key={n.to}
						to={n.to}
						className={({ isActive }) =>
							`flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-100 ${isActive ? 'bg-slate-100 text-teal-700' : 'text-slate-700'}`
						}
					>
						<span>{n.icon}</span>
						<span>{n.label}</span>
					</NavLink>
				))}
				<div className="pt-2">
					<button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-50 text-red-600">
						<span>{Icons.logout}</span>
						<span>Logout</span>
					</button>
				</div>
			</div>
		</aside>
	)
}

export function Footer() {
	return (
		<footer className="border-t border-slate-200 mt-12">
			<div className="max-w-7xl mx-auto px-6 py-8 grid md:grid-cols-4 gap-8 text-sm text-slate-600">
				<div>
					<p className="font-semibold text-slate-800 mb-2">Job Portal</p>
					<p>Find your next opportunity with ease. Built for pros.</p>
				</div>
				<div>
					<p className="font-semibold text-slate-800 mb-2">Company</p>
					<ul className="space-y-1">
                        <li><Link className="hover:text-teal-600" to="/about">About</Link></li>
                        <li><Link className="hover:text-teal-600" to="/careers">Careers</Link></li>
                        <li><Link className="hover:text-teal-600" to="/contact">Contact</Link></li>
					</ul>
				</div>
				<div>
					<p className="font-semibold text-slate-800 mb-2">Resources</p>
					<ul className="space-y-1">
                        <li><Link className="hover:text-teal-600" to="/blog">Blog</Link></li>
                        <li><Link className="hover:text-teal-600" to="/help">Help Center</Link></li>
                        <li><Link className="hover:text-teal-600" to="/guides">Guides</Link></li>
					</ul>
				</div>
				<div className="text-slate-500">© {new Date().getFullYear()} Job Portal</div>
			</div>
		</footer>
	)
}

