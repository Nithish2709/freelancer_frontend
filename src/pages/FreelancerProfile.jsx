import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MapPin, Star, Mail, Globe, Award, Briefcase, ArrowLeft, Settings, PenTool, Phone } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import EditProfileModal from '../components/common/EditProfileModal';
import HireModal from '../components/common/HireModal';

const FreelancerProfile = () => {
    const { id } = useParams();
    const { user: currentUser } = useContext(AuthContext);
    const navigate = useNavigate();
    const [freelancer, setFreelancer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isHireModalOpen, setIsHireModalOpen] = useState(false);

    useEffect(() => {
        const fetchFreelancer = async () => {
            try {
                const res = await fetch(`/api/users/${id}`);
                const data = await res.json();
                if (!res.ok) throw new Error(data.message || 'Failed to fetch profile');
                setFreelancer(data);
            } catch (err) {
                toast.error(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchFreelancer();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-2 border-sky-500 border-t-transparent"></div>
            </div>
        );
    }

    if (!freelancer) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center">
                <p className="text-lg text-gray-500 mb-4">Profile not found</p>
                <Link to="/freelancers" className="text-sky-600 hover:underline text-sm font-medium">← Back to Freelancers</Link>
            </div>
        );
    }

    const isOwner = currentUser && (currentUser?.id === freelancer.id || currentUser?._id === freelancer.id || String(currentUser?.id) === String(freelancer.id) || String(currentUser?._id) === String(freelancer.id));

    return (
        <div className="min-h-screen py-10" style={{ background: 'transparent' }}>
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <Link to={freelancer.role === 'freelancer' ? '/freelancers' : '/dashboard'} className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-6">
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Back
                </Link>

                {/* Header Card */}
                <div className="bg-white shadow-sm rounded-2xl overflow-hidden mb-6 border border-gray-100">
                    <div className="h-28 profile-banner"></div>
                    <div className="px-6 pb-6">
                        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                            <div className="flex items-end gap-4">
                                {freelancer.profileImage ? (
                                    <img
                                        className="-mt-14 h-24 w-24 rounded-full ring-4 ring-white object-cover shadow"
                                        src={freelancer.profileImage}
                                        alt={freelancer.name}
                                    />
                                ) : (
                                    <div className="-mt-14 h-24 w-24 rounded-full ring-4 ring-white shadow bg-blue-100 flex items-center justify-center">
                                        <span className="text-2xl font-bold text-blue-600">
                                            {freelancer.name?.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                )}
                                <div className="mb-1">
                                    <h1 className="text-2xl font-bold text-gray-900">{freelancer.name}</h1>
                                    <p className="text-gray-500 text-sm">{freelancer.title || (freelancer.role === 'freelancer' ? 'Freelancer' : 'Client')}</p>
                                </div>
                            </div>
                            <div className="flex gap-2 sm:mb-1">
                                {isOwner ? (
                                    <button
                                        onClick={() => setIsEditModalOpen(true)}
                                        className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50"
                                    >
                                        <Settings className="w-4 h-4 mr-2" />
                                        Edit Profile
                                    </button>
                                ) : (
                                    <>
                                        <button
                                            onClick={() => navigate(`/messages/${freelancer.id || freelancer._id}`)}
                                            className="px-4 py-2 text-sm font-semibold rounded-xl text-sky-600 border border-sky-200 hover:bg-sky-50 transition-colors"
                                        >
                                            Message
                                        </button>
                                        {currentUser?.role === 'client' && (
                                            <button
                                                onClick={() => setIsHireModalOpen(true)}
                                                className="px-4 py-2 text-sm font-semibold rounded-xl text-white btn-primary"
                                            >
                                                Hire Now
                                            </button>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-500">
                            {freelancer.location && (
                                <span className="flex items-center gap-1">
                                    <MapPin className="w-4 h-4" />
                                    {freelancer.location}
                                </span>
                            )}
                            {freelancer.rating > 0 && (
                                <span className="flex items-center gap-1">
                                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                    {Number(freelancer.rating).toFixed(1)} · {freelancer.jobsCompleted || 0} jobs completed
                                </span>
                            )}
                            {freelancer.hourlyRate && (
                                <span className="flex items-center gap-1">
                                    <Award className="w-4 h-4" />
                                    ${freelancer.hourlyRate}/hr
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Left / Main */}
                    <div className="md:col-span-2 space-y-6">

                        {/* About */}
                        {freelancer.bio && (
                            <div className="card p-6">
                                <h2 className="text-base font-bold text-gray-900 mb-3">About</h2>
                                <p className="text-gray-600 leading-relaxed text-sm">{freelancer.bio}</p>
                            </div>
                        )}

                        {/* Experience (freelancers) */}
                        {freelancer.role === 'freelancer' && freelancer.experience && (
                            <div className="card p-6">
                                <h2 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
                                    <Briefcase className="w-4 h-4 text-blue-600" />
                                    Experience
                                </h2>
                                <p className="text-gray-600 text-sm leading-relaxed">{freelancer.experience}</p>
                            </div>
                        )}

                        {/* Portfolio (freelancers) */}
                        {freelancer.role === 'freelancer' && freelancer.portfolio && (
                            <div className="card p-6">
                                <h2 className="text-base font-bold text-gray-900 mb-3">Portfolio</h2>
                                <a
                                    href={freelancer.portfolio.startsWith('http') ? freelancer.portfolio : `https://${freelancer.portfolio}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 text-blue-600 hover:underline text-sm break-all"
                                >
                                    <Globe className="w-4 h-4 flex-shrink-0" />
                                    {freelancer.portfolio}
                                </a>
                            </div>
                        )}

                        {/* Client info */}
                        {freelancer.role === 'client' && (
                            <div className="card p-6">
                                <h2 className="text-base font-bold text-gray-900 mb-4">Company Info</h2>
                                <div className="space-y-3">
                                    {freelancer.companyName && (
                                        <div>
                                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Company</p>
                                            <p className="text-sm text-gray-900 mt-0.5">{freelancer.companyName}</p>
                                        </div>
                                    )}
                                    {freelancer.projectInterests && (
                                        <div>
                                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Project Interests</p>
                                            <p className="text-sm text-gray-900 mt-0.5">{freelancer.projectInterests}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Sidebar */}
                    <div className="space-y-6">

                        {/* Skills */}
                        {(freelancer.skills || []).length > 0 && (
                            <div className="card p-6">
                                <h2 className="text-base font-bold text-gray-900 mb-3">Skills</h2>
                                <div className="flex flex-wrap gap-2">
                                    {freelancer.skills.map((skill) => (
                                        <span key={skill} className="badge-sky px-3 py-1 rounded-full text-sm font-medium">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Tools */}
                        {(freelancer.tools || []).length > 0 && (
                            <div className="card p-6">
                                <h2 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
                                    <PenTool className="w-4 h-4 text-blue-600" />
                                    Tools
                                </h2>
                                <div className="flex flex-wrap gap-2">
                                    {freelancer.tools.map((tool) => (
                                        <span key={tool} className="px-3 py-1 rounded-full text-sm font-medium bg-green-50 text-green-700 border border-green-100">
                                            {tool}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Contact */}
                        <div className="card p-6">
                            <h2 className="text-base font-bold text-gray-900 mb-3">Contact</h2>
                            <div className="space-y-2.5">
                                <div className="flex items-center text-sm text-gray-600 gap-2">
                                    <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                    {isOwner || currentUser ? (
                                        <span>{freelancer.email}</span>
                                    ) : (
                                        <span className="text-gray-400 italic">Login to view email</span>
                                    )}
                                </div>
                                {freelancer.phoneNumber && (isOwner || currentUser) && (
                                    <div className="flex items-center text-sm text-gray-600 gap-2">
                                        <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                        {freelancer.phoneNumber}
                                    </div>
                                )}
                                {freelancer.portfolio && (
                                    <div className="flex items-center text-sm gap-2">
                                        <Globe className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                        <a
                                            href={freelancer.portfolio.startsWith('http') ? freelancer.portfolio : `https://${freelancer.portfolio}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:underline truncate"
                                        >
                                            Portfolio
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Stats */}
                        {freelancer.role === 'freelancer' && (
                            <div className="card p-6">
                                <h2 className="text-base font-bold text-gray-900 mb-3">Stats</h2>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Jobs Completed</span>
                                        <span className="font-semibold text-gray-900">{freelancer.jobsCompleted || 0}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Total Earnings</span>
                                        <span className="font-semibold text-gray-900">${freelancer.totalEarnings || 0}</span>
                                    </div>
                                    {freelancer.rating > 0 && (
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500">Rating</span>
                                            <span className="font-semibold text-gray-900 flex items-center gap-1">
                                                <Star className="w-3.5 h-3.5 text-yellow-400 fill-current" />
                                                {Number(freelancer.rating).toFixed(1)}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <EditProfileModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                user={freelancer}
                onProfileUpdated={(updated) => setFreelancer(updated)}
            />

            <HireModal
                isOpen={isHireModalOpen}
                onClose={() => setIsHireModalOpen(false)}
                freelancer={freelancer}
            />
        </div>
    );
};

export default FreelancerProfile;
