import React from 'react';
import { Star, MapPin, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';

const FreelancerCard = ({ freelancer }) => {
    const id = freelancer.id || freelancer._id;

    return (
        <div className="card p-5 flex flex-col">
            {/* Header */}
            <div className="flex items-start gap-3 mb-4">
                {freelancer.profileImage ? (
                    <img
                        className="h-14 w-14 rounded-2xl object-cover flex-shrink-0 ring-2 ring-sky-100"
                        src={freelancer.profileImage}
                        alt={freelancer.name}
                    />
                ) : (
                    <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-sky-400 to-sky-600 flex items-center justify-center flex-shrink-0">
                        <span className="text-xl font-bold text-white">
                            {freelancer.name?.charAt(0).toUpperCase()}
                        </span>
                    </div>
                )}
                <div className="min-w-0 flex-1">
                    <Link to={`/freelancers/${id}`}>
                        <h3 className="text-sm font-semibold text-gray-900 hover:text-sky-600 truncate transition-colors">
                            {freelancer.name}
                        </h3>
                    </Link>
                    <p className="text-xs text-gray-500 truncate mt-0.5">{freelancer.title || 'Freelancer'}</p>
                    {freelancer.location && (
                        <div className="flex items-center gap-1 mt-1 text-xs text-gray-400">
                            <MapPin className="h-3 w-3 flex-shrink-0" />
                            {freelancer.location}
                        </div>
                    )}
                </div>
                {freelancer.hourlyRate && (
                    <div className="flex-shrink-0 text-right">
                        <div className="flex items-center gap-0.5 text-sm font-bold text-gray-900">
                            <DollarSign className="h-3.5 w-3.5 text-gray-400" />
                            {freelancer.hourlyRate}
                        </div>
                        <p className="text-xs text-gray-400">/hr</p>
                    </div>
                )}
            </div>

            {/* Rating */}
            <div className="flex items-center gap-1.5 mb-3">
                {freelancer.rating > 0 ? (
                    <>
                        <div className="flex gap-0.5">
                            {[1,2,3,4,5].map(i => (
                                <Star
                                    key={i}
                                    className={`h-3.5 w-3.5 ${i <= Math.round(freelancer.rating) ? 'text-yellow-400 fill-current' : 'text-gray-200 fill-current'}`}
                                />
                            ))}
                        </div>
                        <span className="text-xs font-semibold text-gray-700">{Number(freelancer.rating).toFixed(1)}</span>
                        <span className="text-xs text-gray-400">({freelancer.jobsCompleted || 0} jobs)</span>
                    </>
                ) : (
                    <span className="text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full border border-gray-100">New freelancer</span>
                )}
            </div>

            {/* Skills */}
            {(freelancer.skills || []).length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-4">
                    {freelancer.skills.slice(0, 3).map((skill) => (
                        <span key={skill} className="badge-sky px-2 py-0.5 rounded-full text-xs font-medium">
                            {skill}
                        </span>
                    ))}
                    {freelancer.skills.length > 3 && (
                        <span className="badge-neutral px-2 py-0.5 rounded-full text-xs font-medium">
                            +{freelancer.skills.length - 3}
                        </span>
                    )}
                </div>
            )}

            {/* Actions */}
            <div className="mt-auto flex gap-2">
                <Link
                    to={`/freelancers/${id}`}
                    className="flex-1 text-center py-2 px-3 rounded-xl text-xs font-semibold text-sky-600 border border-sky-200 hover:bg-sky-50 transition-colors"
                >
                    View Profile
                </Link>
                <Link
                    to={`/freelancers/${id}`}
                    className="flex-1 text-center py-2 px-3 rounded-xl text-xs font-semibold text-white btn-primary"
                >
                    Hire Now
                </Link>
            </div>
        </div>
    );
};

export default FreelancerCard;
