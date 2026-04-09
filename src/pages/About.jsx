import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Target, Heart, Zap, Award, Globe, ArrowRight, CheckCircle, Star } from 'lucide-react';

const STATS = [
    { value: '10K+', label: 'Registered Users' },
    { value: '5K+', label: 'Projects Completed' },
    { value: '98%', label: 'Client Satisfaction' },
    { value: '50+', label: 'Countries Served' },
];

const VALUES = [
    { icon: Target, title: 'Our Mission', desc: 'To democratize access to quality work by connecting talented freelancers with clients who need them — anywhere in the world.', color: 'from-sky-500 to-blue-600' },
    { icon: Heart, title: 'Our Vision', desc: 'A world where anyone can build a fulfilling career on their own terms, free from geographic and institutional barriers.', color: 'from-violet-500 to-purple-600' },
    { icon: Globe, title: 'Our Reach', desc: 'Operating across 50+ countries, we\'re building the most trusted global marketplace for professional services.', color: 'from-emerald-500 to-teal-600' },
    { icon: Zap, title: 'Our Promise', desc: 'Fast, secure, and transparent. We guarantee timely payments, verified profiles, and world-class support.', color: 'from-amber-500 to-orange-600' },
];

const TEAM = [
    { name: 'Alex Chen', role: 'CEO & Co-Founder', avatar: 'AC', bg: 'from-sky-500 to-blue-600' },
    { name: 'Maya Patel', role: 'CTO & Co-Founder', avatar: 'MP', bg: 'from-violet-500 to-purple-600' },
    { name: 'Jordan Lee', role: 'Head of Design', avatar: 'JL', bg: 'from-emerald-500 to-teal-600' },
    { name: 'Sam Rivera', role: 'Head of Growth', avatar: 'SR', bg: 'from-amber-500 to-orange-600' },
];

const About = () => (
    <div className="min-h-screen" style={{ background: 'var(--gradient-main)' }}>

        {/* Hero */}
        <section className="relative py-24 px-4 overflow-hidden"
            style={{ background: 'linear-gradient(135deg,#0369a1 0%,#0ea5e9 45%,#7c3aed 100%)' }}>
            <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/20 rounded-full translate-x-1/2 -translate-y-1/2 blur-3xl" />
            <div className="relative max-w-3xl mx-auto text-center">
                <div className="inline-flex items-center gap-2 bg-white/15 text-white text-sm font-medium px-4 py-1.5 rounded-full mb-6 border border-white/20">
                    <Star className="h-4 w-4 text-yellow-300" /> Our Story
                </div>
                <h1 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight mb-6">
                    Building the Future of<br />
                    <span className="bg-gradient-to-r from-sky-200 to-purple-200 bg-clip-text text-transparent">
                        Freelance Work
                    </span>
                </h1>
                <p className="text-lg text-sky-100 max-w-2xl mx-auto leading-relaxed">
                    FreelanceHub was founded in 2022 with a simple belief: great work should know no borders.
                    We built a platform where talent meets opportunity — transparently, securely, and at scale.
                </p>
            </div>
        </section>

        {/* Stats */}
        <section className="py-12 px-4" style={{ background: 'linear-gradient(90deg,#0369a1 0%,#0ea5e9 50%,#7c3aed 100%)' }}>
            <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-white">
                {STATS.map(({ value, label }) => (
                    <div key={label}>
                        <p className="text-3xl font-extrabold">{value}</p>
                        <p className="mt-1 text-sky-100 text-sm">{label}</p>
                    </div>
                ))}
            </div>
        </section>

        {/* Values */}
        <section className="py-20 px-4" style={{ background: 'var(--gradient-main)' }}>
            <div className="max-w-6xl mx-auto">
                <h2 className="text-3xl font-extrabold text-center mb-4" style={{ color: 'var(--text-primary)' }}>What drives us</h2>
                <p className="text-center mb-12 max-w-xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
                    Our core values shape every decision we make and every feature we build.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {VALUES.map(({ icon: Icon, title, desc, color }) => (
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

        {/* Story */}
        <section className="py-20 px-4" style={{ background: 'var(--surface-card)' }}>
            <div className="max-w-4xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="text-3xl font-extrabold mb-6" style={{ color: 'var(--text-primary)' }}>Our Story</h2>
                        <div className="space-y-4 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                            <p>FreelanceHub started as a small side project by two developers frustrated with the complexity and high fees of existing freelance platforms. They wanted something simpler, faster, and fairer.</p>
                            <p>Within six months of launch, over 1,000 freelancers had joined and completed their first projects. The community grew organically through word of mouth — a testament to the platform's quality.</p>
                            <p>Today, FreelanceHub serves tens of thousands of users across 50+ countries, with a team of 30+ dedicated to making freelance work better for everyone.</p>
                        </div>
                        <div className="mt-6 space-y-2">
                            {['Zero hidden fees', 'Instant payouts', 'Dedicated support', 'Verified profiles'].map(item => (
                                <div key={item} className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                                    <CheckCircle className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                                    {item}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        {[
                            { label: 'Founded', value: '2022', color: 'from-sky-500 to-blue-600' },
                            { label: 'Team Size', value: '30+', color: 'from-violet-500 to-purple-600' },
                            { label: 'Countries', value: '50+', color: 'from-emerald-500 to-teal-600' },
                            { label: 'Projects', value: '5K+', color: 'from-amber-500 to-orange-600' },
                        ].map(({ label, value, color }) => (
                            <div key={label} className={`rounded-2xl p-6 text-center bg-gradient-to-br ${color} text-white shadow-md`}>
                                <p className="text-3xl font-extrabold">{value}</p>
                                <p className="text-sm mt-1 opacity-90">{label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>

        {/* Team */}
        <section className="py-20 px-4" style={{ background: 'var(--gradient-main)' }}>
            <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl font-extrabold text-center mb-4" style={{ color: 'var(--text-primary)' }}>Meet the Team</h2>
                <p className="text-center mb-12" style={{ color: 'var(--text-secondary)' }}>The people behind FreelanceHub.</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {TEAM.map(({ name, role, avatar, bg }) => (
                        <div key={name} className="card p-6 text-center">
                            <div className={`h-16 w-16 rounded-2xl bg-gradient-to-br ${bg} flex items-center justify-center text-white text-xl font-bold mx-auto mb-3 shadow-md`}>
                                {avatar}
                            </div>
                            <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{name}</p>
                            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{role}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        {/* CTA */}
        <section className="py-16 px-4" style={{ background: 'linear-gradient(135deg,#0369a1 0%,#0ea5e9 50%,#7c3aed 100%)' }}>
            <div className="max-w-xl mx-auto text-center">
                <h2 className="text-2xl font-extrabold text-white mb-3">Join our growing community</h2>
                <p className="text-sky-100 mb-6">Start your journey with FreelanceHub today.</p>
                <Link to="/register"
                    className="inline-flex items-center gap-2 px-8 py-3.5 text-base font-semibold rounded-xl text-sky-700 bg-white hover:bg-sky-50 shadow-lg transition-all hover:-translate-y-0.5">
                    Get Started Free <ArrowRight className="h-4 w-4" />
                </Link>
            </div>
        </section>
    </div>
);

export default About;
