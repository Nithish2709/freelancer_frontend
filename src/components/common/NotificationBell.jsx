import React, { useState, useEffect, useRef, useContext } from 'react';
import { Bell, Briefcase, MessageSquare, UserCheck, X } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

const TYPE_ICON = {
    job:        { icon: Briefcase,    color: 'bg-sky-100 text-sky-600' },
    proposal:   { icon: UserCheck,   color: 'bg-violet-100 text-violet-600' },
    message:    { icon: MessageSquare, color: 'bg-emerald-100 text-emerald-600' },
    hired:      { icon: UserCheck,   color: 'bg-amber-100 text-amber-600' },
};

const NotificationBell = () => {
    const { user } = useContext(AuthContext);
    const [open, setOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const ref = useRef(null);

    const unread = notifications.filter(n => !n.read).length;

    // Build notifications from projects data (polling every 30s)
    useEffect(() => {
        if (!user) return;
        const fetch_ = async () => {
            try {
                const [projRes, profileRes] = await Promise.all([
                    fetch('/api/projects', { headers: { Authorization: `Bearer ${user.token}` } }),
                    fetch('/api/users/profile', { headers: { Authorization: `Bearer ${user.token}` } }),
                ]);
                const projects = projRes.ok ? await projRes.json() : [];
                const profile  = profileRes.ok ? await profileRes.json() : {};
                const uid = user._id || user.id;

                const notifs = [];

                if (user.role === 'freelancer') {
                    // New job postings
                    (Array.isArray(projects) ? projects : [])
                        .filter(p => p.status === 'open')
                        .slice(0, 5)
                        .forEach(p => notifs.push({
                            id: `job-${p.id}`,
                            type: 'job',
                            title: 'New job posted',
                            body: p.title,
                            link: `/projects/${p.id}`,
                            time: p.createdAt,
                            read: false,
                        }));
                    // Hired notification
                    (Array.isArray(projects) ? projects : [])
                        .filter(p => p.assignedTo === uid)
                        .forEach(p => notifs.push({
                            id: `hired-${p.id}`,
                            type: 'hired',
                            title: 'You were hired!',
                            body: p.title,
                            link: `/projects/${p.id}`,
                            time: p.updatedAt,
                            read: false,
                        }));
                } else {
                    // Proposals received
                    (Array.isArray(projects) ? projects : [])
                        .filter(p => (p.client?.id === uid || p.client === uid) && p.proposals?.length > 0)
                        .forEach(p => notifs.push({
                            id: `proposal-${p.id}`,
                            type: 'proposal',
                            title: `${p.proposals.length} proposal${p.proposals.length > 1 ? 's' : ''} received`,
                            body: p.title,
                            link: `/projects/${p.id}`,
                            time: p.updatedAt,
                            read: false,
                        }));
                }

                // Messages
                if (profile.newMessages > 0) {
                    notifs.unshift({
                        id: 'messages',
                        type: 'message',
                        title: `${profile.newMessages} new message${profile.newMessages > 1 ? 's' : ''}`,
                        body: 'You have unread messages',
                        link: '/messages',
                        time: new Date().toISOString(),
                        read: false,
                    });
                }

                // Merge with existing read state
                setNotifications(prev => {
                    const readIds = new Set(prev.filter(n => n.read).map(n => n.id));
                    return notifs.map(n => ({ ...n, read: readIds.has(n.id) })).slice(0, 10);
                });
            } catch (_) {}
        };

        fetch_();
        const interval = setInterval(fetch_, 30000);
        return () => clearInterval(interval);
    }, [user]);

    // Close on outside click
    useEffect(() => {
        const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const markAllRead = () => setNotifications(n => n.map(x => ({ ...x, read: true })));
    const dismiss = (id) => setNotifications(n => n.filter(x => x.id !== id));

    const timeAgo = (iso) => {
        if (!iso) return '';
        const diff = Date.now() - new Date(iso).getTime();
        const m = Math.floor(diff / 60000);
        if (m < 1) return 'just now';
        if (m < 60) return `${m}m ago`;
        const h = Math.floor(m / 60);
        if (h < 24) return `${h}h ago`;
        return `${Math.floor(h / 24)}d ago`;
    };

    return (
        <div className="relative" ref={ref}>
            <button
                onClick={() => setOpen(o => !o)}
                className="relative p-2 rounded-lg text-sky-100 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Notifications"
            >
                <Bell className="h-5 w-5" />
                {unread > 0 && (
                    <span className="notif-badge absolute -top-0.5 -right-0.5 h-4 w-4 flex items-center justify-center rounded-full bg-red-500 text-white text-[10px] font-bold leading-none">
                        {unread > 9 ? '9+' : unread}
                    </span>
                )}
            </button>

            {open && (
                <div className="notif-dropdown absolute right-0 mt-2 w-80 rounded-2xl border shadow-xl z-50 overflow-hidden"
                    style={{ background: 'var(--surface-card)', borderColor: 'var(--surface-border)' }}>

                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b"
                        style={{ borderColor: 'var(--surface-border)' }}>
                        <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                            Notifications {unread > 0 && <span className="ml-1 text-xs text-sky-500">({unread} new)</span>}
                        </span>
                        {unread > 0 && (
                            <button onClick={markAllRead} className="text-xs text-sky-500 hover:text-sky-700 font-medium">
                                Mark all read
                            </button>
                        )}
                    </div>

                    {/* List */}
                    <div className="max-h-80 overflow-y-auto divide-y" style={{ divideColor: 'var(--surface-border)' }}>
                        {notifications.length === 0 ? (
                            <div className="py-10 text-center text-sm" style={{ color: 'var(--text-muted)' }}>
                                No notifications yet
                            </div>
                        ) : notifications.map(n => {
                            const { icon: Icon, color } = TYPE_ICON[n.type] || TYPE_ICON.job;
                            return (
                                <div key={n.id}
                                    className="flex items-start gap-3 px-4 py-3 hover:opacity-90 transition-opacity"
                                    style={{ background: n.read ? 'transparent' : 'rgba(14,165,233,0.06)' }}>
                                    <div className={`h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${color}`}>
                                        <Icon className="h-4 w-4" />
                                    </div>
                                    <Link to={n.link} onClick={() => { setNotifications(prev => prev.map(x => x.id === n.id ? { ...x, read: true } : x)); setOpen(false); }}
                                        className="flex-1 min-w-0">
                                        <p className="text-xs font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{n.title}</p>
                                        <p className="text-xs truncate mt-0.5" style={{ color: 'var(--text-secondary)' }}>{n.body}</p>
                                        <p className="text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>{timeAgo(n.time)}</p>
                                    </Link>
                                    <button onClick={() => dismiss(n.id)} className="flex-shrink-0 mt-0.5 opacity-40 hover:opacity-80">
                                        <X className="h-3.5 w-3.5" style={{ color: 'var(--text-secondary)' }} />
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationBell;
