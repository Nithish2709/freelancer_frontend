import React, { useState, useEffect, useContext } from 'react';
import { Briefcase, Plus, Bell, DollarSign, TrendingUp, CheckCircle, Clock, ArrowRight, Loader } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import CreateProjectModal from '../components/projects/CreateProjectModal';
import { toast } from 'react-hot-toast';
import { getProfile, getProjects, updateProjectStatus } from '../api';

const STATUS_TABS = ['All', 'Active', 'Completed', 'Pending'];

const StatusBadge = ({ status }) => {
    const styles = {
        open:      'badge-sky',
        assigned:  'badge-warning',
        completed: 'badge-success',
    };
    return (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${styles[status] || styles.open}`}>
            {status || 'open'}
        </span>
    );
};

const Dashboard = () => {
    const { user: authUser } = useContext(AuthContext);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [projects, setProjects] = useState([]);
    const [userStats, setUserStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('All');

    const uid = authUser?.id || authUser?._id;

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [profileData, projectsData] = await Promise.all([
                    getProfile(authUser.token),
                    getProjects(),
                ]);
                setUserStats(profileData);

                const userProjects = Array.isArray(projectsData)
                    ? projectsData.filter(p =>
                        p.client?.id === uid || p.client?._id === uid || p.client === uid ||
                        p.proposals?.some(prop =>
                            prop.freelancer?.id === uid || prop.freelancer?._id === uid || prop.freelancer === uid
                        )
                    )
                    : [];
                setProjects(userProjects);
            } catch (err) {
                console.error('Dashboard fetch error:', err);
            } finally {
                setLoading(false);
            }
        };
        if (authUser) fetchDashboardData();
    }, [authUser]);

    const handleProjectCreated = (newProject) => setProjects([newProject, ...projects]);

    // ── Status update (freelancer) ────────────────────────────
    const [updatingId, setUpdatingId] = useState(null);

    const handleStatusUpdate = async (projectId, newStatus) => {
        setUpdatingId(projectId);
        try {
            const data = await updateProjectStatus(authUser.token, projectId, newStatus);
            setProjects(prev =>
                prev.map(p => (p.id || p._id) === projectId ? { ...p, status: newStatus } : p)
            );
            toast.success(`Marked as ${newStatus}!`);
        } catch (err) {
            toast.error(err.message);
        } finally {
            setUpdatingId(null);
        }
    };

    const filteredProjects = projects.filter(p => {
        if (activeTab === 'All') return true;
        if (activeTab === 'Active') return p.status === 'assigned' || p.status === 'open';
        if (activeTab === 'Completed') return p.status === 'completed';
        if (activeTab === 'Pending') return p.status === 'open';
        return true;
    });

    const isClient = authUser?.role === 'client';

    const stats = [
        {
            label: isClient ? 'Total Spent' : 'Total Earnings',
            value: loading ? '—' : `$${isClient ? (userStats?.totalSpent || 0) : (userStats?.totalEarnings || 0)}`,
            icon: DollarSign,
            color: 'bg-emerald-500',
            trend: '+12% this month',
        },
        {
            label: isClient ? 'Projects Posted' : 'Jobs Completed',
            value: loading ? '—' : (isClient ? projects.length : (userStats?.jobsCompleted || 0)).toString(),
            icon: Briefcase,
            color: 'bg-sky-500',
            trend: `${projects.filter(p => p.status === 'open').length} active`,
        },
        {
            label: 'Notifications',
            value: loading ? '—' : (userStats?.newMessages || 0).toString(),
            icon: Bell,
            color: 'bg-violet-500',
            trend: 'Unread messages',
        },
    ];

    return (
        <div className="py-8">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>Dashboard</h1>
                        <p className="mt-1" style={{ color: 'var(--text-secondary)' }}>
                            Welcome back,{' '}
                            <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{authUser?.name}</span>
                            <span className="ml-2 text-xs bg-sky-100 text-sky-700 px-2 py-0.5 rounded-full capitalize border border-sky-200">
                                {authUser?.role}
                            </span>
                        </p>
                    </div>
                    {isClient && (
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-xl text-white btn-primary shadow-sm"
                        >
                            <Plus className="h-4 w-4" />
                            Post a Job
                        </button>
                    )}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
                    {stats.map(({ label, value, icon: Icon, color, trend }) => (
                        <div key={label} className="stat-card">
                            <div className={`p-3 rounded-xl ${color} flex-shrink-0`}>
                                <Icon className="h-5 w-5 text-white" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{label}</p>
                                <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{value}</p>
                                <p className="text-xs mt-0.5 flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
                                    <TrendingUp className="h-3 w-3" />{trend}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Project History */}
                    <div className="lg:col-span-2 rounded-2xl border shadow-sm overflow-hidden" style={{ background: 'var(--surface-card)', borderColor: 'var(--surface-border)' }}>
                        <div className="px-5 py-4 border-b flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3" style={{ borderColor: 'var(--surface-border)' }}>
                            <h3 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>Project History</h3>
                            {/* Tab Filters */}
                            <div className="flex gap-1 p-1 rounded-xl" style={{ background: 'var(--surface-hover)' }}>
                                {STATUS_TABS.map(tab => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`tab-btn text-xs px-3 py-1.5 ${activeTab === tab ? 'active' : ''}`}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="divide-y" style={{ borderColor: 'var(--surface-border)' }}>
                            {loading ? (
                                <div className="p-5 space-y-4">
                                    {[1,2,3].map(i => (
                                        <div key={i} className="flex items-center gap-3">
                                            <div className="skeleton h-4 flex-1 rounded" />
                                            <div className="skeleton h-5 w-16 rounded-full" />
                                        </div>
                                    ))}
                                </div>
                            ) : filteredProjects.length > 0 ? (
                                filteredProjects.map((project) => {
                                    const pid = project.id || project._id;
                                    const isUpdating = updatingId === pid;
                                    const isAssignedToMe = project.assignedTo === uid || project.assignedTo?.id === uid;
                                    const showStatusBtns = !isClient && isAssignedToMe;

                                    return (
                                    <div key={pid} className="px-5 py-4 transition-colors" style={{ cursor: 'default' }}
                                        onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-hover)'}
                                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <Link to={`/projects/${pid}`}
                                                        className="text-sm font-semibold hover:text-sky-600 truncate transition-colors"
                                                        style={{ color: 'var(--text-primary)' }}>
                                                        {project.title}
                                                    </Link>
                                                    {isAssignedToMe && (
                                                        <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs font-semibold rounded-full">
                                                            Assigned to You
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-3 mt-1 text-xs" style={{ color: 'var(--text-muted)' }}>
                                                    <span>{project.client?.id === uid || project.client === uid ? 'Posted by you' : 'Applied for'}</span>
                                                    <span>Budget: ${project.budget}</span>
                                                </div>

                                                {/* Status action buttons — freelancer only */}
                                                {showStatusBtns && (
                                                    <div className="flex items-center gap-2 mt-3">
                                                        <button
                                                            onClick={() => handleStatusUpdate(pid, 'completed')}
                                                            disabled={isUpdating || project.status === 'completed'}
                                                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                                                                project.status === 'completed'
                                                                    ? 'bg-emerald-100 text-emerald-600 cursor-default opacity-70'
                                                                    : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm'
                                                            } disabled:opacity-50`}
                                                        >
                                                            {isUpdating
                                                                ? <Loader className="h-3 w-3 animate-spin" />
                                                                : <CheckCircle className="h-3 w-3" />
                                                            }
                                                            {project.status === 'completed' ? 'Completed' : 'Mark Completed'}
                                                        </button>

                                                        <button
                                                            onClick={() => handleStatusUpdate(pid, 'assigned')}
                                                            disabled={isUpdating || project.status === 'assigned'}
                                                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                                                                project.status === 'assigned'
                                                                    ? 'bg-amber-100 text-amber-600 cursor-default opacity-70'
                                                                    : 'bg-amber-400 hover:bg-amber-500 text-white shadow-sm'
                                                            } disabled:opacity-50`}
                                                        >
                                                            {isUpdating
                                                                ? <Loader className="h-3 w-3 animate-spin" />
                                                                : <Clock className="h-3 w-3" />
                                                            }
                                                            {project.status === 'assigned' ? 'In Progress' : 'Mark Pending'}
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                            <StatusBadge status={project.status} />
                                        </div>
                                    </div>
                                    );
                                })
                            ) : (
                                <div className="empty-state py-12">
                                    <Briefcase className="h-10 w-10 text-gray-200 mb-3" />
                                    <p className="text-gray-400 text-sm">No projects in this category</p>
                                </div>
                            )}
                        </div>

                        <div className="px-5 py-3 border-t rounded-b-2xl" style={{ borderColor: 'var(--surface-border)', background: 'var(--surface-hover)' }}>
                            <Link
                                to="/projects"
                                className="inline-flex items-center gap-1 text-sm font-medium text-sky-600 hover:text-sky-800 transition-colors"
                            >
                                {isClient ? 'View All Projects' : 'Browse More Projects'}
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-5">

                        {/* Quick Actions */}
                        <div className="rounded-2xl border shadow-sm p-5" style={{ background: 'var(--surface-card)', borderColor: 'var(--surface-border)' }}>
                            <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Quick Actions</h3>
                            <div className="space-y-2">
                                {isClient ? (
                                    <>
                                        <button
                                            onClick={() => setIsModalOpen(true)}
                                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-white btn-primary"
                                        >
                                            <Plus className="h-4 w-4" />
                                            Post a New Job
                                        </button>
                                        <Link
                                            to="/freelancers"
                                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-sky-600 border border-sky-200 hover:bg-sky-50 transition-colors"
                                        >
                                            <CheckCircle className="h-4 w-4" />
                                            Browse Freelancers
                                        </Link>
                                    </>
                                ) : (
                                    <>
                                        <Link
                                            to="/projects"
                                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-white btn-primary"
                                        >
                                            <Briefcase className="h-4 w-4" />
                                            Browse Projects
                                        </Link>
                                        <Link
                                            to={`/freelancers/${uid}`}
                                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-sky-600 border border-sky-200 hover:bg-sky-50 transition-colors"
                                        >
                                            <CheckCircle className="h-4 w-4" />
                                            Edit My Profile
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Skills (freelancer) */}
                        {!isClient && (
                            <div className="rounded-2xl border shadow-sm p-5" style={{ background: 'var(--surface-card)', borderColor: 'var(--surface-border)' }}>
                                <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Your Skills</h3>
                                <div className="flex flex-wrap gap-2">
                                    {(userStats?.skills || []).length > 0 ? (
                                        userStats.skills.map(skill => (
                                            <span key={skill} className="badge-sky px-2.5 py-1 text-xs font-medium rounded-full">
                                                {skill}
                                            </span>
                                        ))
                                    ) : (
                                        <p className="text-sm text-gray-400">No skills added yet.</p>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Profile Info */}
                        <div className="rounded-2xl border shadow-sm p-5" style={{ background: 'var(--surface-card)', borderColor: 'var(--surface-border)' }}>
                            <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
                                {isClient ? 'Company Info' : 'Professional Info'}
                            </h3>
                            <div className="space-y-3">
                                {isClient ? (
                                    <>
                                        <div>
                                            <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Company</p>
                                            <p className="text-sm mt-0.5" style={{ color: 'var(--text-primary)' }}>{userStats?.companyName || 'Not specified'}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Project Interests</p>
                                            <p className="text-sm mt-0.5" style={{ color: 'var(--text-primary)' }}>{userStats?.projectInterests || 'Not specified'}</p>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div>
                                            <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Experience</p>
                                            <p className="text-sm mt-0.5" style={{ color: 'var(--text-primary)' }}>{userStats?.experience || 'Not specified'}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Portfolio</p>
                                            {userStats?.portfolio ? (
                                                <a href={userStats.portfolio} className="text-sm text-sky-600 hover:underline break-all">
                                                    {userStats.portfolio}
                                                </a>
                                            ) : (
                                                <p className="text-sm text-gray-400">Not specified</p>
                                            )}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div className="rounded-2xl border shadow-sm p-5" style={{ background: 'var(--surface-card)', borderColor: 'var(--surface-border)' }}>
                            <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Recent Activity</h3>
                            <div className="space-y-3">
                                {projects.slice(0, 3).map(p => (
                                    <div key={p.id || p._id} className="flex items-start gap-3">
                                        <div className="h-7 w-7 rounded-lg bg-sky-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <Clock className="h-3.5 w-3.5 text-sky-500" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-xs font-medium truncate" style={{ color: 'var(--text-primary)' }}>{p.title}</p>
                                            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{new Date(p.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                ))}
                                {projects.length === 0 && (
                                    <p className="text-sm text-gray-400">No recent activity.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <CreateProjectModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onProjectCreated={handleProjectCreated}
            />
        </div>
    );
};

export default Dashboard;
