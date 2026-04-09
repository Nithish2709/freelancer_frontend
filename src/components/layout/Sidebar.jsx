import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard, Briefcase, FileText, MessageSquare,
    User, Settings, Plus, Users, UserCheck, ChevronLeft, ChevronRight
} from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';

const FREELANCER_NAV = [
    { label: 'Dashboard',    icon: LayoutDashboard, to: '/dashboard' },
    { label: 'Find Jobs',    icon: Briefcase,       to: '/projects' },
    { label: 'Applied Jobs', icon: FileText,        to: '/dashboard?tab=applied' },
    { label: 'Messages',     icon: MessageSquare,   to: '/messages' },
    { label: 'Profile',      icon: User,            to: '/profile' },
    { label: 'Settings',     icon: Settings,        to: '/settings' },
];

const CLIENT_NAV = [
    { label: 'Dashboard',         icon: LayoutDashboard, to: '/dashboard' },
    { label: 'Post a Job',        icon: Plus,            to: '/dashboard?action=post' },
    { label: 'My Jobs',           icon: Briefcase,       to: '/dashboard?tab=myjobs' },
    { label: 'Applicants',        icon: FileText,        to: '/dashboard?tab=applicants' },
    { label: 'Messages',          icon: MessageSquare,   to: '/messages' },
    { label: 'Hired Freelancers', icon: UserCheck,       to: '/freelancers' },
    { label: 'Settings',          icon: Settings,        to: '/settings' },
];

const Sidebar = ({ collapsed, onToggle }) => {
    const { user } = useContext(AuthContext);
    const location = useLocation();
    const nav = user?.role === 'client' ? CLIENT_NAV : FREELANCER_NAV;

    const isActive = (to) => location.pathname + location.search === to || location.pathname === to.split('?')[0];

    return (
        <aside
            className="sidebar flex flex-col h-full flex-shrink-0 relative"
            style={{ width: collapsed ? '64px' : '220px' }}
        >
            {/* Toggle button */}
            <button
                onClick={onToggle}
                className="absolute -right-3 top-6 z-10 h-6 w-6 rounded-full border flex items-center justify-center shadow-sm"
                style={{ background: 'var(--surface-card)', borderColor: 'var(--surface-border)', color: 'var(--text-secondary)' }}
                aria-label="Toggle sidebar"
            >
                {collapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
            </button>

            {/* Logo area */}
            <div className="flex items-center gap-2.5 px-4 py-5 overflow-hidden">
                <div className="h-8 w-8 rounded-lg bg-sky-600 flex items-center justify-center flex-shrink-0">
                    <Users className="h-4 w-4 text-white" />
                </div>
                {!collapsed && (
                    <span className="text-sm font-bold truncate" style={{ color: 'var(--text-primary)' }}>
                        FreelanceHub
                    </span>
                )}
            </div>

            {/* Role badge */}
            {!collapsed && (
                <div className="px-4 mb-3">
                    <span className="text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-full"
                        style={{ background: 'var(--sidebar-active)', color: 'var(--sidebar-active-text)' }}>
                        {user?.role}
                    </span>
                </div>
            )}

            {/* Nav items */}
            <nav className="flex-1 px-2 space-y-0.5 overflow-hidden">
                {nav.map(({ label, icon: Icon, to }) => (
                    <Link
                        key={label}
                        to={to}
                        className={`sidebar-item ${isActive(to) ? 'active' : ''}`}
                        title={collapsed ? label : undefined}
                    >
                        <Icon className="h-4.5 w-4.5 flex-shrink-0" style={{ width: '1.125rem', height: '1.125rem' }} />
                        {!collapsed && <span className="label truncate">{label}</span>}
                    </Link>
                ))}
            </nav>

            {/* User info at bottom */}
            {!collapsed && user && (
                <div className="px-3 py-4 border-t" style={{ borderColor: 'var(--sidebar-border)' }}>
                    <div className="flex items-center gap-2.5">
                        <div className="h-8 w-8 rounded-full bg-sky-100 flex items-center justify-center flex-shrink-0">
                            <span className="text-xs font-bold text-sky-600">
                                {user.name?.charAt(0).toUpperCase()}
                            </span>
                        </div>
                        <div className="min-w-0">
                            <p className="text-xs font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{user.name}</p>
                            <p className="text-[10px] truncate" style={{ color: 'var(--text-muted)' }}>{user.email}</p>
                        </div>
                    </div>
                </div>
            )}
        </aside>
    );
};

export default Sidebar;
