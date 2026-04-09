import React from 'react';
import { Link } from 'react-router-dom';
import { Code2, Github, Twitter, Linkedin } from 'lucide-react';

const LINKS = {
    Platform: [
        { label: 'Browse Projects', to: '/projects' },
        { label: 'Find Freelancers', to: '/freelancers' },
        { label: 'Post a Job', to: '/dashboard' },
    ],
    Company: [
        { label: 'About Us', to: '/about' },
        { label: 'Contact', to: '/contact' },
        { label: 'Blog', to: '#' },
    ],
    Support: [
        { label: 'Help Center', to: '#' },
        { label: 'Privacy Policy', to: '#' },
        { label: 'Terms of Service', to: '#' },
    ],
};

const SOCIALS = [
    { icon: Twitter, label: 'Twitter', href: '#' },
    { icon: Github, label: 'GitHub', href: '#' },
    { icon: Linkedin, label: 'LinkedIn', href: '#' },
];

const Footer = () => (
    <footer style={{ background: '#0f172a', color: '#94a3b8' }} className="mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
                <div className="col-span-2 md:col-span-1">
                    <Link to="/" className="inline-flex items-center gap-2 text-white font-bold text-lg mb-3">
                        <div className="h-8 w-8 rounded-lg flex items-center justify-center"
                            style={{ background: 'linear-gradient(135deg,#0ea5e9,#7c3aed)' }}>
                            <Code2 className="h-5 w-5 text-white" />
                        </div>
                        FreelanceHub
                    </Link>
                    <p className="text-sm leading-relaxed max-w-xs" style={{ color: '#64748b' }}>
                        The platform where great work gets done. Connect, collaborate, and grow.
                    </p>
                    <div className="flex gap-3 mt-4">
                        {SOCIALS.map(({ icon: Icon, label, href }) => (
                            <a key={label} href={href} aria-label={label}
                                className="h-8 w-8 rounded-lg flex items-center justify-center transition-colors hover:bg-sky-600"
                                style={{ background: '#1e293b', color: '#64748b' }}>
                                <Icon className="h-4 w-4" />
                            </a>
                        ))}
                    </div>
                </div>

                {Object.entries(LINKS).map(([group, items]) => (
                    <div key={group}>
                        <h4 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: '#cbd5e1' }}>{group}</h4>
                        <ul className="space-y-2">
                            {items.map(({ label, to }) => (
                                <li key={label}>
                                    <Link to={to} className="text-sm transition-colors hover:text-white" style={{ color: '#64748b' }}>
                                        {label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>

            <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3"
                style={{ borderTop: '1px solid #1e293b' }}>
                <p className="text-xs" style={{ color: '#475569' }}>
                    &copy; {new Date().getFullYear()} FreelanceHub, Inc. All rights reserved.
                </p>
                <p className="text-xs" style={{ color: '#475569' }}>Built with ❤️ for freelancers worldwide</p>
            </div>
        </div>
    </footer>
);

export default Footer;
