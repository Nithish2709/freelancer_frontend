import React, { useState, useContext } from 'react';
import { User, Bell, Lock, Palette, Save, Eye, EyeOff, Sun, Moon } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { useDarkMode } from '../context/DarkModeContext';
import { toast } from 'react-hot-toast';

const Section = ({ title, icon: Icon, children }) => (
    <div className="rounded-2xl border shadow-sm overflow-hidden"
        style={{ background: 'var(--surface-card)', borderColor: 'var(--surface-border)' }}>
        <div className="px-6 py-4 border-b flex items-center gap-2.5"
            style={{ borderColor: 'var(--surface-border)' }}>
            <div className="h-8 w-8 rounded-lg bg-sky-50 flex items-center justify-center">
                <Icon className="h-4 w-4 text-sky-600" />
            </div>
            <h2 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{title}</h2>
        </div>
        <div className="px-6 py-5">{children}</div>
    </div>
);

const Field = ({ label, children }) => (
    <div>
        <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5"
            style={{ color: 'var(--text-muted)' }}>{label}</label>
        {children}
    </div>
);

const Settings = () => {
    const { user: authUser, updateUser } = useContext(AuthContext);
    const { dark, toggle } = useDarkMode();

    const [profile, setProfile] = useState({
        name:  authUser?.name  || '',
        email: authUser?.email || '',
        title: authUser?.title || '',
        bio:   authUser?.bio   || '',
    });
    const [passwords, setPasswords] = useState({ current: '', newPwd: '', confirm: '' });
    const [showPwd, setShowPwd]     = useState({ current: false, newPwd: false, confirm: false });
    const [notifications, setNotifications] = useState({
        emailMessages:  true,
        emailProposals: true,
        emailHires:     true,
        browserPush:    false,
    });
    const [savingProfile,  setSavingProfile]  = useState(false);
    const [savingPassword, setSavingPassword] = useState(false);

    const handleProfileSave = async (e) => {
        e.preventDefault();
        setSavingProfile(true);
        try {
            const res  = await fetch('/api/users/profile', {
                method:  'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization:  `Bearer ${authUser.token}`,
                },
                body: JSON.stringify(profile),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Failed to update profile');
            updateUser({ ...data, token: authUser.token });
            toast.success('Profile updated successfully!');
        } catch (err) {
            toast.error(err.message);
        } finally {
            setSavingProfile(false);
        }
    };

    const handlePasswordSave = async (e) => {
        e.preventDefault();
        if (passwords.newPwd !== passwords.confirm) {
            toast.error('New passwords do not match');
            return;
        }
        if (passwords.newPwd.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }
        setSavingPassword(true);
        try {
            const res  = await fetch('/api/users/profile', {
                method:  'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization:  `Bearer ${authUser.token}`,
                },
                body: JSON.stringify({ password: passwords.newPwd }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Failed to update password');
            setPasswords({ current: '', newPwd: '', confirm: '' });
            toast.success('Password updated successfully!');
        } catch (err) {
            toast.error(err.message);
        } finally {
            setSavingPassword(false);
        }
    };

    const inputClass = "w-full px-3 py-2.5 text-sm rounded-xl border focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400 transition-all";
    const inputStyle = { background: 'var(--surface-input)', borderColor: 'var(--surface-border)', color: 'var(--text-primary)' };

    return (
        <div className="py-8">
            <div className="max-w-2xl mx-auto px-4 sm:px-6 space-y-6">

                {/* Page header */}
                <div>
                    <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Settings</h1>
                    <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                        Manage your account preferences and profile
                    </p>
                </div>

                {/* ── Profile ─────────────────────────────── */}
                <Section title="Profile Information" icon={User}>
                    <form onSubmit={handleProfileSave} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Field label="Full Name">
                                <input
                                    type="text"
                                    value={profile.name}
                                    onChange={e => setProfile(p => ({ ...p, name: e.target.value }))}
                                    className={inputClass}
                                    style={inputStyle}
                                    required
                                />
                            </Field>
                            <Field label="Email Address">
                                <input
                                    type="email"
                                    value={profile.email}
                                    onChange={e => setProfile(p => ({ ...p, email: e.target.value }))}
                                    className={inputClass}
                                    style={inputStyle}
                                    required
                                />
                            </Field>
                        </div>
                        <Field label="Professional Title">
                            <input
                                type="text"
                                value={profile.title}
                                onChange={e => setProfile(p => ({ ...p, title: e.target.value }))}
                                placeholder="e.g. Full Stack Developer"
                                className={inputClass}
                                style={inputStyle}
                            />
                        </Field>
                        <Field label="Bio">
                            <textarea
                                value={profile.bio}
                                onChange={e => setProfile(p => ({ ...p, bio: e.target.value }))}
                                rows={3}
                                placeholder="Tell clients about yourself..."
                                className={inputClass}
                                style={{ ...inputStyle, resize: 'none' }}
                            />
                        </Field>
                        <div className="flex justify-end">
                            <button type="submit" disabled={savingProfile}
                                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-xl text-white btn-primary disabled:opacity-60">
                                {savingProfile
                                    ? <><div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Saving…</>
                                    : <><Save className="h-4 w-4" />Save Profile</>
                                }
                            </button>
                        </div>
                    </form>
                </Section>

                {/* ── Password ─────────────────────────────── */}
                <Section title="Change Password" icon={Lock}>
                    <form onSubmit={handlePasswordSave} className="space-y-4">
                        {[
                            { key: 'current', label: 'Current Password' },
                            { key: 'newPwd',  label: 'New Password' },
                            { key: 'confirm', label: 'Confirm New Password' },
                        ].map(({ key, label }) => (
                            <Field key={key} label={label}>
                                <div className="relative">
                                    <input
                                        type={showPwd[key] ? 'text' : 'password'}
                                        value={passwords[key]}
                                        onChange={e => setPasswords(p => ({ ...p, [key]: e.target.value }))}
                                        className={inputClass + ' pr-10'}
                                        style={inputStyle}
                                        placeholder="••••••••"
                                    />
                                    <button type="button"
                                        onClick={() => setShowPwd(s => ({ ...s, [key]: !s[key] }))}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                        {showPwd[key] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                            </Field>
                        ))}
                        <div className="flex justify-end">
                            <button type="submit" disabled={savingPassword}
                                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-xl text-white btn-primary disabled:opacity-60">
                                {savingPassword
                                    ? <><div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Updating…</>
                                    : <><Lock className="h-4 w-4" />Update Password</>
                                }
                            </button>
                        </div>
                    </form>
                </Section>

                {/* ── Notifications ─────────────────────────── */}
                <Section title="Notifications" icon={Bell}>
                    <div className="space-y-4">
                        {[
                            { key: 'emailMessages',  label: 'New messages',          desc: 'Get notified when you receive a message' },
                            { key: 'emailProposals', label: 'Proposal updates',       desc: 'Get notified when a proposal is submitted or accepted' },
                            { key: 'emailHires',     label: 'Hire notifications',     desc: 'Get notified when you are hired for a project' },
                            { key: 'browserPush',    label: 'Browser notifications',  desc: 'Receive push notifications in your browser' },
                        ].map(({ key, label, desc }) => (
                            <div key={key} className="flex items-center justify-between gap-4">
                                <div>
                                    <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{label}</p>
                                    <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{desc}</p>
                                </div>
                                <button
                                    onClick={() => setNotifications(n => ({ ...n, [key]: !n[key] }))}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors flex-shrink-0 ${
                                        notifications[key] ? 'bg-sky-500' : 'bg-gray-300'
                                    }`}
                                    role="switch"
                                    aria-checked={notifications[key]}
                                >
                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                                        notifications[key] ? 'translate-x-6' : 'translate-x-1'
                                    }`} />
                                </button>
                            </div>
                        ))}
                    </div>
                </Section>

                {/* ── Appearance ─────────────────────────────── */}
                <Section title="Appearance" icon={Palette}>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                                {dark ? 'Dark Mode' : 'Light Mode'}
                            </p>
                            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                                Switch between light and dark theme
                            </p>
                        </div>
                        <button onClick={toggle}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all hover:bg-sky-50"
                            style={{ borderColor: 'var(--surface-border)', color: 'var(--text-primary)' }}>
                            {dark ? <><Sun className="h-4 w-4 text-yellow-500" />Light Mode</> : <><Moon className="h-4 w-4 text-sky-500" />Dark Mode</>}
                        </button>
                    </div>
                </Section>

                {/* ── Danger Zone ─────────────────────────────── */}
                <div className="rounded-2xl border border-red-200 overflow-hidden bg-red-50">
                    <div className="px-6 py-4 border-b border-red-200">
                        <h2 className="text-sm font-semibold text-red-700">Danger Zone</h2>
                    </div>
                    <div className="px-6 py-5 flex items-center justify-between gap-4">
                        <div>
                            <p className="text-sm font-medium text-red-800">Delete Account</p>
                            <p className="text-xs text-red-500 mt-0.5">Permanently delete your account and all data. This cannot be undone.</p>
                        </div>
                        <button
                            onClick={() => toast.error('Please contact support to delete your account.')}
                            className="px-4 py-2 text-sm font-semibold rounded-xl text-white bg-red-500 hover:bg-red-600 transition-colors flex-shrink-0">
                            Delete Account
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Settings;
