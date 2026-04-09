import React, { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, Briefcase } from 'lucide-react';
import ProjectCard from '../components/common/ProjectCard';
import { getProjects } from '../api';

const CATEGORIES = ['All', 'Development', 'Design', 'Writing', 'Marketing'];
const BUDGETS = [
    { label: 'Any Budget', min: 0, max: Infinity },
    { label: 'Under $500', min: 0, max: 500 },
    { label: '$500–$2K', min: 500, max: 2000 },
    { label: '$2K–$5K', min: 2000, max: 5000 },
    { label: '$5K+', min: 5000, max: Infinity },
];

const SkeletonCard = () => (
    <div className="card p-5">
        <div className="flex justify-between mb-3">
            <div className="skeleton h-5 w-16 rounded-full" />
            <div className="skeleton h-4 w-20 rounded" />
        </div>
        <div className="skeleton h-5 w-3/4 rounded mb-2" />
        <div className="skeleton h-4 w-full rounded mb-1" />
        <div className="skeleton h-4 w-5/6 rounded mb-4" />
        <div className="flex gap-1.5 mb-4">
            <div className="skeleton h-5 w-16 rounded-full" />
            <div className="skeleton h-5 w-16 rounded-full" />
        </div>
        <div className="flex justify-between">
            <div className="skeleton h-4 w-16 rounded" />
            <div className="skeleton h-4 w-20 rounded" />
        </div>
    </div>
);

const Projects = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');
    const [activeBudget, setActiveBudget] = useState(0);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const data = await getProjects();
                setProjects(Array.isArray(data) ? data : []);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchProjects();
    }, []);

    const budget = BUDGETS[activeBudget];

    const filtered = projects.filter(p => {
        if (p.status !== 'open') return false;
        const matchesSearch = !search ||
            p.title?.toLowerCase().includes(search.toLowerCase()) ||
            p.description?.toLowerCase().includes(search.toLowerCase());
        const matchesBudget = p.budget >= budget.min && p.budget <= budget.max;
        return matchesSearch && matchesBudget;
    });

    return (
        <div className="min-h-screen py-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-extrabold text-gray-900">Browse Projects</h1>
                    <p className="mt-2 text-gray-500">Find the perfect project that matches your skills.</p>
                </div>

                {/* Search + Filters */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-8 space-y-4">
                    <div className="relative">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            className="input-base pl-10"
                            placeholder="Search projects by title or keyword…"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                        {/* Category */}
                        <div className="flex items-center gap-2 flex-wrap">
                            <SlidersHorizontal className="h-4 w-4 text-gray-400 flex-shrink-0" />
                            {CATEGORIES.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    className={`filter-pill ${activeCategory === cat ? 'active' : ''}`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>

                        {/* Budget */}
                        <div className="flex items-center gap-2 flex-wrap sm:ml-auto">
                            {BUDGETS.map((b, i) => (
                                <button
                                    key={b.label}
                                    onClick={() => setActiveBudget(i)}
                                    className={`filter-pill ${activeBudget === i ? 'active' : ''}`}
                                >
                                    {b.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Results count */}
                {!loading && !error && (
                    <p className="text-sm text-gray-500 mb-5">
                        Showing <span className="font-semibold text-gray-900">{filtered.length}</span> open project{filtered.length !== 1 ? 's' : ''}
                    </p>
                )}

                {/* Grid */}
                {loading ? (
                    <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
                        {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
                    </div>
                ) : error ? (
                    <div className="empty-state">
                        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl text-sm font-medium">
                            {error}
                        </div>
                    </div>
                ) : filtered.length > 0 ? (
                    <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
                        {filtered.map(p => (
                            <ProjectCard key={p._id || p.id} project={p} />
                        ))}
                    </div>
                ) : (
                    <div className="empty-state">
                        <Briefcase className="h-12 w-12 text-gray-300 mb-4" />
                        <p className="text-gray-500 font-medium">No projects found</p>
                        <p className="text-gray-400 text-sm mt-1">Try adjusting your search or filters</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Projects;
