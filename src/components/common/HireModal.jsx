import React, { useState, useEffect, useContext } from 'react';
import { X, Briefcase, CheckCircle, Loader } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';

const HireModal = ({ isOpen, onClose, freelancer }) => {
    const { user: authUser } = useContext(AuthContext);
    const [projects, setProjects]   = useState([]);
    const [selected, setSelected]   = useState('');
    const [loading, setLoading]     = useState(false);
    const [fetching, setFetching]   = useState(true);
    const [success, setSuccess]     = useState(false);

    const uid = authUser?.id || authUser?._id;

    useEffect(() => {
        if (!isOpen) { setSelected(''); setSuccess(false); return; }
        const fetchProjects = async () => {
            setFetching(true);
            try {
                const res  = await fetch('/api/projects');
                const data = await res.json();
                if (!res.ok) throw new Error(data.message);
                // Only show client's own open projects
                const mine = (Array.isArray(data) ? data : []).filter(p =>
                    (p.client?.id === uid || p.client?._id === uid || p.client === uid) &&
                    p.status === 'open'
                );
                setProjects(mine);
            } catch (err) {
                toast.error('Could not load your projects: ' + err.message);
            } finally {
                setFetching(false);
            }
        };
        fetchProjects();
    }, [isOpen, uid]);

    if (!isOpen) return null;

    const handleHire = async () => {
        if (!selected) { toast.error('Please select a project first'); return; }
        setLoading(true);
        try {
            const res  = await fetch(`/api/projects/${selected}/assign`, {
                method:  'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization:  `Bearer ${authUser.token}`
                },
                body: JSON.stringify({ freelancerId: freelancer.id || freelancer._id })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Failed to hire freelancer');
            setSuccess(true);
            toast.success(`${freelancer.name} has been hired successfully!`);
            setTimeout(onClose, 1800);
        } catch (err) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

            {/* Panel */}
            <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                {/* Top stripe */}
                <div className="h-1 w-full bg-gradient-to-r from-sky-500 to-emerald-400" />

                <div className="px-6 py-5">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-5">
                        <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                                <Briefcase className="h-5 w-5 text-emerald-600" />
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-gray-900">Hire Freelancer</h3>
                                <p className="text-xs text-gray-400">Assign {freelancer?.name} to a project</p>
                            </div>
                        </div>
                        <button onClick={onClose}
                            className="h-8 w-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
                            <X className="h-4 w-4" />
                        </button>
                    </div>

                    {success ? (
                        <div className="py-8 flex flex-col items-center gap-3 text-center">
                            <div className="h-16 w-16 rounded-full bg-emerald-50 flex items-center justify-center">
                                <CheckCircle className="h-8 w-8 text-emerald-500" />
                            </div>
                            <p className="text-base font-semibold text-gray-900">Hired Successfully!</p>
                            <p className="text-sm text-gray-500">{freelancer?.name} has been assigned to your project.</p>
                        </div>
                    ) : fetching ? (
                        <div className="py-8 flex items-center justify-center">
                            <Loader className="h-6 w-6 text-sky-500 animate-spin" />
                        </div>
                    ) : projects.length === 0 ? (
                        <div className="py-8 text-center">
                            <Briefcase className="h-10 w-10 text-gray-200 mx-auto mb-3" />
                            <p className="text-sm font-medium text-gray-500">No open projects found</p>
                            <p className="text-xs text-gray-400 mt-1">Post a job first, then hire a freelancer.</p>
                        </div>
                    ) : (
                        <>
                            <p className="text-sm text-gray-600 mb-3">Select which project to assign this freelancer to:</p>
                            <div className="space-y-2 max-h-52 overflow-y-auto mb-5">
                                {projects.map(p => (
                                    <label key={p.id || p._id}
                                        className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                                            selected === (p.id || p._id)
                                                ? 'border-sky-400 bg-sky-50'
                                                : 'border-gray-200 hover:border-sky-200 hover:bg-gray-50'
                                        }`}>
                                        <input
                                            type="radio"
                                            name="project"
                                            value={p.id || p._id}
                                            checked={selected === (p.id || p._id)}
                                            onChange={e => setSelected(e.target.value)}
                                            className="accent-sky-500"
                                        />
                                        <div className="min-w-0">
                                            <p className="text-sm font-medium text-gray-800 truncate">{p.title}</p>
                                            <p className="text-xs text-gray-400">Budget: ${p.budget}</p>
                                        </div>
                                    </label>
                                ))}
                            </div>

                            <div className="flex gap-3">
                                <button onClick={onClose}
                                    className="flex-1 py-2.5 rounded-xl text-sm font-medium text-gray-600 border border-gray-200 hover:bg-gray-50 transition-colors">
                                    Cancel
                                </button>
                                <button
                                    onClick={handleHire}
                                    disabled={loading || !selected}
                                    className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading
                                        ? <><div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Hiring…</>
                                        : 'Confirm Hire'
                                    }
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default HireModal;
