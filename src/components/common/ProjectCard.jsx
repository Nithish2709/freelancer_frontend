import React from 'react';
import { DollarSign, Calendar, Clock, User, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const STATUS_STYLES = {
    open:      'badge-success',
    assigned:  'badge-warning',
    completed: 'badge-neutral',
};

const ProjectCard = ({ project }) => {
    const id = project.id || project._id;
    const status = project.status || 'open';
    const postedAt = project.createdAt ? new Date(project.createdAt).toLocaleDateString() : null;

    return (
        <div className="card flex flex-col">
            <div className="p-5 flex-1">
                {/* Top row */}
                <div className="flex items-center justify-between gap-2 mb-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${STATUS_STYLES[status] || STATUS_STYLES.open}`}>
                        {status}
                    </span>
                    {postedAt && (
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            {postedAt}
                        </span>
                    )}
                </div>

                {/* Title */}
                <Link to={`/projects/${id}`}>
                    <h3 className="text-base font-semibold text-gray-900 hover:text-sky-600 leading-snug mb-2 transition-colors line-clamp-2">
                        {project.title}
                    </h3>
                </Link>

                {/* Description */}
                <p className="text-sm text-gray-500 line-clamp-2 mb-4 leading-relaxed">
                    {project.description}
                </p>

                {/* Skills */}
                {(project.skillsRequired || []).length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                        {project.skillsRequired.slice(0, 4).map(skill => (
                            <span key={skill} className="badge-sky px-2 py-0.5 rounded-full text-xs font-medium">
                                {skill}
                            </span>
                        ))}
                        {project.skillsRequired.length > 4 && (
                            <span className="badge-neutral px-2 py-0.5 rounded-full text-xs font-medium">
                                +{project.skillsRequired.length - 4}
                            </span>
                        )}
                    </div>
                )}

                {/* Budget + Deadline */}
                <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1 font-bold text-gray-900">
                        <DollarSign className="h-4 w-4 text-gray-400" />
                        {project.budget}
                    </div>
                    {project.deadline && (
                        <div className="flex items-center gap-1 text-gray-500 text-xs">
                            <Calendar className="h-3.5 w-3.5" />
                            {project.deadline}
                        </div>
                    )}
                </div>
            </div>

            {/* Footer */}
            <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-between bg-gray-50 rounded-b-2xl">
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <User className="h-3.5 w-3.5" />
                    {project.client?.name || 'Client'}
                </div>
                <Link
                    to={`/projects/${id}`}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-sky-600 hover:text-sky-800 transition-colors"
                >
                    Apply Now
                    <ArrowRight className="h-3.5 w-3.5" />
                </Link>
            </div>
        </div>
    );
};

export default ProjectCard;
