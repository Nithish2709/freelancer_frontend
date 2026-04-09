import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    Search, Briefcase, Users, Shield, Zap, Code, Palette, PenTool,
    TrendingUp, Camera, Music, ArrowRight, Star, CheckCircle,
    MessageSquare, DollarSign, Award, ChevronRight
} from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const CATEGORIES = [
    { icon: Code, label: 'Development', color: 'from-blue-500 to-cyan-500' },
    { icon: Palette, label: 'Design', color: 'from-purple-500 to-pink-500' },
    { icon: PenTool, label: 'Writing', color: 'from-amber-500 to-orange-500' },
    { icon: TrendingUp, label: 'Marketing', color: 'from-green-500 to-teal-500' },
    { icon: Camera, label: 'Photography', color: 'from-rose-500 to-red-500' },
    { icon: Music, label: 'Music', color: 'from-violet-500 to-indigo-500' },
];

const FEATURES = [
    { icon: Shield, title: 'Secure Payments', desc: 'Funds held in escrow until work is approved. 100% money-back guarantee.', color: 'from-sky-500 to-blue-600' },
    { icon: MessageSquare, title: 'Real-time Chat', desc: 'Communicate instantly with clients and freelancers through built-in messaging.', color: 'from-violet-500 to-purple-600' },
    { icon: CheckCircle, title: 'Verified Users', desc: 'Every profile is reviewed and verified for quality and authenticity.', color: 'from-emerald-500 to-teal-600' },
    { icon: Zap, title: 'Fast Hiring', desc: 'Post a project and receive qualified proposals within hours, not days.', color: 'from-amber-500 to-orange-600' },
];

const STATS = [
    { value: '10K+', label: 'Freelancers', icon: Users },
    { value: '5K+', label: 'Projects Posted', icon: Briefcase },
    { value: '98%', label: 'Satisfaction Rate', icon: Award },
    { value: '24/7', label: 'Support', icon: MessageSquare },
];

const TESTIMONIALS = [
    { name: 'Sarah M.', role: 'Startup Founder', text: 'Found an amazing developer in under 24 hours. The quality of talent here is unmatched.', rating: 5, avatar: 'SM' },
    { name: 'James K.', role: 'Freelance Designer', text: 'FreelanceHub helped me land 3 long-term clients in my first month. Total game changer.', rating: 5, avatar: 'JK' },
    { name: 'Priya L.', role: 'Marketing Manager', text: 'Clean platform, great freelancers, and payments are always on time. Highly recommend.', rating: 5, avatar: 'PL' },
];

const CLIENT_STEPS = [
    { step: '01', title: 'Post a Job', desc: 'Describe your project, set your budget, and publish in minutes.' },
    { step: '02', title: 'Review Proposals', desc: 'Receive bids from skilled freelancers and compare profiles.' },
    { step: '03', title: 'Hire & Pay Safely', desc: 'Choose the best fit and pay securely through escrow.' },
];

const FREELANCER_STEPS = [
    { step: '01', title: 'Create Profile', desc: 'Showcase your skills, portfolio, and set your hourly rate.' },
    { step: '02', title: 'Browse & Apply', desc: 'Find matching projects and submit compelling proposals.' },
    { step: '03', title: 'Work & Get Paid', desc: 'Deliver great work and receive secure, on-time payments.' },
];

const Home = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [query, setQuery] = useState('');
    const [howTab, setHowTab] = useState('client');

    const handleSearch = (e) => {
        e.preventDefault();
        navigate(query.trim() ? `/projects?q=${encodeURIComponent(query.trim())}` : '/projects');
    };

    return (
        <div className="min-h-screen" style={{ background: 'var(--gradient-main)' }}>

            {/* ── Hero ──────────────────────────────────────────────── */}
            <section className="relative overflow-hidden py-24 px-4" style={{ background: 'linear-gradient(135deg, #0369a1 0%, #0ea5e9 45%, #7c3aed 100%)' }}>
                {/* Decorative blobs */}
                <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/20 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl" />

                <div className="relative max-w-4xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 bg-white/15 text-white text-sm font-medium px-4 py-1.5 rounded-full mb-6 border border-white/20 backdrop-blur-sm">
                        <CheckCircle className="h-4 w-4 text-emerald-300" />
                        Trusted by 10,000+ professionals worldwide
                    </div>

                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight tracking-tight">
                        Hire Top Freelancers or<br />
                        <span className="bg-gradient-to-r from-sky-200 to-purple-200 bg-clip-text text-transparent">
                            Find Your Dream Projects
                        </span>
                    </h1>

                    <p className="mt-6 text-lg text-sky-100 max-w-2xl mx-auto leading-relaxed">
                        Connect with world-class talent or discover exciting projects. Simple, fast, and built for modern professionals.
                    </p>

                    {/* Search */}
                    <form onSubmit={handleSearch} className="mt-8 mx-auto search-bar max-w-2xl">
                        <Search className="h-5 w-5 text-gray-400 ml-4 flex-shrink-0" />
                        <input type="text" placeholder="Search for services, skills, or projects…"
                            value={query} onChange={e => setQuery(e.target.value)} />
                        <button type="submit" className="btn-primary rounded-xl text-sm font-semibold px-5 py-2.5 m-1.5">
                            Search
                        </button>
                    </form>

                    {/* CTA Buttons */}
                    <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
                        <Link to="/register"
                            className="inline-flex items-center justify-center gap-2 px-7 py-3.5 text-base font-semibold rounded-xl text-sky-700 bg-white hover:bg-sky-50 shadow-xl transition-all hover:-translate-y-0.5">
                            Get Started Free <ArrowRight className="h-4 w-4" />
                        </Link>
                        <Link to="/freelancers"
                            className="inline-flex items-center justify-center gap-2 px-7 py-3.5 text-base font-semibold rounded-xl text-white border-2 border-white/40 hover:bg-white/10 backdrop-blur-sm transition-all">
                            <Users className="h-4 w-4" /> Hire Talent
                        </Link>
                        <Link to="/projects"
                            className="inline-flex items-center justify-center gap-2 px-7 py-3.5 text-base font-semibold rounded-xl text-white border-2 border-white/40 hover:bg-white/10 backdrop-blur-sm transition-all">
                            <Briefcase className="h-4 w-4" /> Find Work
                        </Link>
                    </div>

                    <p className="mt-5 text-sky-200 text-sm">
                        Popular: <span className="text-white font-medium">Web Dev · UI Design · Content Writing · SEO · Mobile Apps</span>
                    </p>
                </div>
            </section>

            {/* ── Stats ─────────────────────────────────────────────── */}
            <section className="py-12 px-4" style={{ background: 'linear-gradient(90deg,#0369a1 0%,#0ea5e9 50%,#7c3aed 100%)' }}>
                <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-white">
                    {STATS.map(({ value, label, icon: Icon }) => (
                        <div key={label} className="flex flex-col items-center gap-2">
                            <div className="h-10 w-10 rounded-xl bg-white/15 flex items-center justify-center">
                                <Icon className="h-5 w-5 text-white" />
                            </div>
                            <p className="text-3xl font-extrabold">{value}</p>
                            <p className="text-sky-100 text-sm">{label}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── Categories ────────────────────────────────────────── */}
            <section className="py-16 px-4" style={{ background: 'var(--surface-card)' }}>
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-2xl font-bold text-center mb-8" style={{ color: 'var(--text-primary)' }}>Browse by Category</h2>
                    <div className="flex flex-wrap justify-center gap-3">
                        {CATEGORIES.map(({ icon: Icon, label, color }) => (
                            <Link key={label} to={`/projects?category=${label}`}
                                className="group flex items-center gap-2.5 px-5 py-2.5 rounded-full border font-medium text-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                                style={{ borderColor: 'var(--surface-border)', color: 'var(--text-secondary)', background: 'var(--surface-bg)' }}>
                                <div className={`h-6 w-6 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center`}>
                                    <Icon className="h-3.5 w-3.5 text-white" />
                                </div>
                                {label}
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Features ──────────────────────────────────────────── */}
            <section className="py-20 px-4" style={{ background: 'var(--gradient-main)' }}>
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-14">
                        <h2 className="text-3xl font-extrabold" style={{ color: 'var(--text-primary)' }}>Why choose FreelanceHub?</h2>
                        <p className="mt-3 max-w-xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
                            Everything you need to hire great talent or land your next project.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {FEATURES.map(({ icon: Icon, title, desc, color }) => (
                            <div key={title} className="card p-6 text-center group hover:shadow-lg transition-all">
                                <div className={`inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-gradient-to-br ${color} mb-4 shadow-md group-hover:scale-110 transition-transform`}>
                                    <Icon className="h-7 w-7 text-white" />
                                </div>
                                <h3 className="text-base font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>{title}</h3>
                                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── How It Works ──────────────────────────────────────── */}
            <section className="py-20 px-4" style={{ background: 'var(--surface-card)' }}>
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl font-extrabold text-center mb-4" style={{ color: 'var(--text-primary)' }}>How it works</h2>
                    <p className="text-center mb-8" style={{ color: 'var(--text-secondary)' }}>Simple steps to get started, whether you're hiring or working.</p>

                    {/* Tab toggle */}
                    <div className="flex justify-center mb-10">
                        <div className="flex p-1 rounded-xl gap-1" style={{ background: 'var(--surface-hover)' }}>
                            {['client', 'freelancer'].map(tab => (
                                <button key={tab} onClick={() => setHowTab(tab)}
                                    className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all capitalize ${
                                        howTab === tab ? 'bg-sky-600 text-white shadow-md' : ''
                                    }`}
                                    style={howTab !== tab ? { color: 'var(--text-secondary)' } : {}}>
                                    {tab === 'client' ? '🧑‍💼 For Clients' : '👤 For Freelancers'}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {(howTab === 'client' ? CLIENT_STEPS : FREELANCER_STEPS).map(({ step, title, desc }, i) => (
                            <div key={step} className="flex flex-col items-center text-center relative">
                                {i < 2 && (
                                    <div className="hidden md:block absolute top-7 left-[calc(50%+2rem)] w-[calc(100%-4rem)] h-px border-t-2 border-dashed border-sky-200" />
                                )}
                                <div className="h-14 w-14 rounded-2xl flex items-center justify-center mb-4 shadow-md"
                                    style={{ background: 'linear-gradient(135deg,#0ea5e9,#7c3aed)' }}>
                                    <span className="text-lg font-extrabold text-white">{step}</span>
                                </div>
                                <h3 className="text-base font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>{title}</h3>
                                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Testimonials ──────────────────────────────────────── */}
            <section className="py-20 px-4" style={{ background: 'var(--gradient-main)' }}>
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-3xl font-extrabold text-center mb-12" style={{ color: 'var(--text-primary)' }}>What our users say</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {TESTIMONIALS.map(({ name, role, text, rating, avatar }) => (
                            <div key={name} className="card p-6 flex flex-col gap-4">
                                <div className="flex gap-0.5">
                                    {Array.from({ length: rating }).map((_, i) => (
                                        <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                                    ))}
                                </div>
                                <p className="text-sm leading-relaxed flex-1" style={{ color: 'var(--text-secondary)' }}>"{text}"</p>
                                <div className="flex items-center gap-3">
                                    <div className="h-9 w-9 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                                        style={{ background: 'linear-gradient(135deg,#0ea5e9,#7c3aed)' }}>
                                        {avatar}
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{name}</p>
                                        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{role}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CTA ───────────────────────────────────────────────── */}
            {!user && (
                <section className="py-20 px-4 relative overflow-hidden"
                    style={{ background: 'linear-gradient(135deg,#0369a1 0%,#0ea5e9 50%,#7c3aed 100%)' }}>
                    <div className="absolute inset-0 bg-black/10" />
                    <div className="relative max-w-2xl mx-auto text-center">
                        <h2 className="text-3xl font-extrabold text-white mb-4">Ready to get started?</h2>
                        <p className="text-sky-100 mb-8 text-lg">Join thousands of freelancers and clients already using FreelanceHub.</p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link to="/register"
                                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 text-base font-semibold rounded-xl text-sky-700 bg-white hover:bg-sky-50 shadow-lg transition-all hover:-translate-y-0.5">
                                Join as Freelancer <ArrowRight className="h-4 w-4" />
                            </Link>
                            <Link to="/register"
                                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 text-base font-semibold rounded-xl text-white border-2 border-white/50 hover:bg-white/10 transition-all">
                                <Users className="h-4 w-4" /> Hire Talent
                            </Link>
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
};

export default Home;
