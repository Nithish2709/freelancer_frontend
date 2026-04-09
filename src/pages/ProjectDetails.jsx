import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Clock, DollarSign, Calendar, MapPin, CheckCircle, ArrowLeft } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import SubmitProposalModal from '../components/projects/SubmitProposalModal';
import { getProjectById, acceptProposal, assignProject } from '../api';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const ProjectDetails = () => {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const uid = user?.id || user?._id;

    useEffect(() => {
        const fetchProject = async () => {
            if (!UUID_REGEX.test(id)) {
                toast.error('Invalid project ID');
                setLoading(false);
                return;
            }
            try {
                const data = await getProjectById(id);
                setProject(data);
            } catch (err) {
                toast.error(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchProject();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500"></div>
            </div>
        );
    }

    if (!project) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center">
                <p className="text-xl text-sky-600 mb-4">Project not found</p>
                <Link to="/projects" className="text-sky-600 hover:underline">Back to Projects</Link>
            </div>
        );
    }

    const handleAcceptProposal = async (proposalId) => {
        if (!window.confirm('Accept this proposal? This will complete the project.')) return;
        if (!UUID_REGEX.test(proposalId)) { toast.error('Invalid proposal ID'); return; }
        try {
            const data = await acceptProposal(user.token, id, proposalId);
            toast.success('Proposal accepted!'); setProject(data.project);
        } catch { toast.error('An error occurred'); }
    };

    const handleAssign = async (freelancerId) => {
        if (!window.confirm('Assign this job to the freelancer?')) return;
        if (!UUID_REGEX.test(freelancerId)) { toast.error('Invalid freelancer ID'); return; }
        try {
            const data = await assignProject(user.token, id, { freelancerId });
            toast.success('Job assigned!'); setProject(data);
        } catch { toast.error('An error occurred'); }
    };

    const isFreelancer = user?.role === 'freelancer';
    const hasApplied = project.proposals?.some(p =>
        p.freelancer?.id === uid || p.freelancer?._id === uid || p.freelancer === uid
    );
    const isOwner = project.client?.id === uid || project.client?._id === uid || project.client === uid;

    const statusColors = {
        open: 'bg-sky-100 text-sky-700',
        assigned: 'bg-yellow-100 text-yellow-700',
        completed: 'bg-green-100 text-green-700',
    };

    return (
        <div className="min-h-screen py-12" style={{ background: 'transparent' }}>
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <Link to="/projects" className="inline-flex items-center text-sm text-sky-600 hover:text-sky-800 mb-6">
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Back to Projects
                </Link>

                {/* Main Card */}
                <div className="card-gradient shadow-sm rounded-2xl overflow-hidden mb-6">
                    <div className="px-6 py-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h3 className="text-2xl font-bold text-sky-900">{project.title}</h3>
                            <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-sky-500">
                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusColors[project.status || 'open']}`}>
                                    {(project.status || 'open').toUpperCase()}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Clock className="w-4 h-4" />
                                    Posted {new Date(project.createdAt).toLocaleDateString()}
                                </span>
                                {project.location && (
                                    <span className="flex items-center gap-1">
                                        <MapPin className="w-4 h-4" />
                                        {project.location}
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="flex-shrink-0">
                            {isFreelancer && !hasApplied && (
                                <button
                                    onClick={() => setIsModalOpen(true)}
                                    className="px-6 py-2.5 text-sm font-semibold rounded-xl text-white btn-primary shadow"
                                >
                                    Apply Now
                                </button>
                            )}
                            {hasApplied && (
                                <span className="px-6 py-2.5 text-sm font-medium rounded-xl text-green-700 bg-green-100">
                                    ✓ Proposal Submitted
                                </span>
                            )}
                            {isOwner && (
                                <Link to="/dashboard" className="px-6 py-2.5 text-sm font-semibold rounded-xl text-sky-700 bg-sky-100 hover:bg-sky-200 transition-colors">
                                    Manage Project
                                </Link>
                            )}
                        </div>
                    </div>

                    <div className="border-t border-sky-100 px-6 py-5">
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <div>
                                <dt className="text-xs font-semibold text-sky-400 uppercase tracking-wider flex items-center gap-1 mb-1">
                                    <DollarSign className="w-3.5 h-3.5" /> Budget
                                </dt>
                                <dd className="text-base font-bold text-sky-900">${project.budget}</dd>
                            </div>
                            <div>
                                <dt className="text-xs font-semibold text-sky-400 uppercase tracking-wider flex items-center gap-1 mb-1">
                                    <Calendar className="w-3.5 h-3.5" /> Deadline
                                </dt>
                                <dd className="text-base font-bold text-sky-900">{project.deadline || 'Not specified'}</dd>
                            </div>
                            <div className="sm:col-span-2">
                                <dt className="text-xs font-semibold text-sky-400 uppercase tracking-wider mb-2">Description</dt>
                                <dd className="text-sm text-sky-800 whitespace-pre-line leading-relaxed">{project.description}</dd>
                            </div>
                            {(project.skillsRequired || []).length > 0 && (
                                <div className="sm:col-span-2">
                                    <dt className="text-xs font-semibold text-sky-400 uppercase tracking-wider mb-2">Required Skills</dt>
                                    <dd className="flex flex-wrap gap-2">
                                        {project.skillsRequired.map(skill => (
                                            <span key={skill} className="badge-sky px-3 py-0.5 rounded-full text-sm font-medium">
                                                {skill}
                                            </span>
                                        ))}
                                    </dd>
                                </div>
                            )}
                            <div className="sm:col-span-2">
                                <dt className="text-xs font-semibold text-sky-400 uppercase tracking-wider mb-2">About the Client</dt>
                                <div className="flex items-center bg-sky-50 p-4 rounded-xl border border-sky-100">
                                    <div className="flex-1">
                                        <p className="text-sm font-semibold text-sky-900">{project.client?.name}</p>
                                        <div className="flex items-center mt-1 gap-1">
                                            <CheckCircle className="w-4 h-4 text-green-500" />
                                            <span className="text-xs text-sky-500">Verified Client</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Applicants */}
                {isOwner && project.proposals?.length > 0 && (
                    <div className="mt-6">
                        <h3 className="text-lg font-bold text-sky-900 mb-4">Applicants ({project.proposals.length})</h3>
                        <div className="space-y-4">
                            {project.proposals.map((proposal) => (
                                <div key={proposal._id} className="card-gradient shadow-sm rounded-2xl p-6">
                                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                                        <div className="flex items-start gap-4">
                                            <img
                                                src={proposal.freelancer?.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(proposal.freelancer?.name || 'F')}&background=0ea5e9&color=fff`}
                                                alt={proposal.freelancer?.name}
                                                className="h-12 w-12 rounded-full object-cover ring-2 ring-sky-100"
                                            />
                                            <div>
                                                <h4 className="text-base font-bold text-sky-900">{proposal.freelancer?.name}</h4>
                                                <p className="text-sm text-sky-500">{proposal.freelancer?.title}</p>
                                                <div className="flex items-center gap-3 mt-1">
                                                    <span className="text-sm font-semibold text-sky-600">Bid: ${proposal.bidAmount}</span>
                                                    <span className="text-xs text-sky-400">Applied {new Date(proposal.createdAt).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            <Link
                                                to={`/freelancers/${proposal.freelancer?.id || proposal.freelancer?._id}`}
                                                className="px-3 py-1.5 border border-sky-200 text-xs font-medium rounded-lg text-sky-700 bg-white hover:bg-sky-50"
                                            >
                                                View Profile
                                            </Link>
                                            {project.status === 'open' && (
                                                <button
                                                    onClick={() => handleAssign(proposal.freelancer?.id || proposal.freelancer?._id)}
                                                    className="px-3 py-1.5 text-xs font-medium rounded-lg text-white bg-emerald-500 hover:bg-emerald-600"
                                                >
                                                    Assign Job
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleAcceptProposal(proposal._id)}
                                                disabled={project.status === 'completed'}
                                                className={`px-3 py-1.5 text-xs font-medium rounded-lg text-white ${project.status === 'completed' ? 'bg-gray-300 cursor-not-allowed' : 'btn-primary'}`}
                                            >
                                                {project.status === 'completed' ? 'Completed' : 'Accept Proposal'}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="mt-4">
                                        <p className="text-xs font-semibold text-sky-400 uppercase tracking-wider mb-1">Cover Letter</p>
                                        <p className="text-sm text-sky-800 whitespace-pre-line bg-sky-50 p-3 rounded-xl border border-sky-100">
                                            {proposal.coverLetter}
                                        </p>
                                    </div>

                                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-xs font-semibold text-sky-400 uppercase tracking-wider mb-2">Skills</p>
                                            <div className="flex flex-wrap gap-1">
                                                {(proposal.freelancer?.skills || []).length > 0
                                                    ? proposal.freelancer.skills.map(s => (
                                                        <span key={s} className="badge-sky px-2 py-0.5 rounded-full text-xs font-medium">{s}</span>
                                                    ))
                                                    : <span className="text-xs text-sky-300 italic">No skills listed</span>
                                                }
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-xs font-semibold text-sky-400 uppercase tracking-wider mb-2">Tools</p>
                                            <div className="flex flex-wrap gap-1">
                                                {(proposal.freelancer?.tools || []).length > 0
                                                    ? proposal.freelancer.tools.map(t => (
                                                        <span key={t} className="px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">{t}</span>
                                                    ))
                                                    : <span className="text-xs text-sky-300 italic">No tools listed</span>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {isOwner && project.proposals?.length === 0 && (
                    <div className="mt-6 card-gradient rounded-2xl p-10 text-center border-2 border-dashed border-sky-200">
                        <p className="text-sky-400">No applicants yet for this project.</p>
                    </div>
                )}
            </div>

            <SubmitProposalModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                projectId={id}
                onProposalSubmitted={(updatedProject) => setProject(updatedProject)}
            />
        </div>
    );
};

export default ProjectDetails;
