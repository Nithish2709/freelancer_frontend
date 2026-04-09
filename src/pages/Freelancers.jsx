import React, { useState, useEffect } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import FreelancerCard from '../components/common/FreelancerCard';
import { getFreelancers } from '../api';

const SKILL_FILTERS = ['All', 'React', 'Node.js', 'Python', 'Design', 'Writing', 'Marketing'];

const SkeletonCard = () => (
    <div className="card p-5">
        <div className="flex items-start gap-3 mb-4">
            <div className="skeleton h-14 w-14 rounded-2xl flex-shrink-0" />
            <div className="flex-1 space-y-2">
                <div className="skeleton h-4 w-3/4 rounded" />
                <div className="skeleton h-3 w-1/2 rounded" />
            </div>
        </div>
        <div className="skeleton h-3 w-full rounded mb-2" />
        <div className="flex gap-1.5 mb-4">
            <div className="skeleton h-5 w-16 rounded-full" />
            <div className="skeleton h-5 w-16 rounded-full" />
            <div className="skeleton h-5 w-16 rounded-full" />
        </div>
        <div className="flex gap-2">
            <div className="skeleton h-8 flex-1 rounded-xl" />
            <div className="skeleton h-8 flex-1 rounded-xl" />
        </div>
    </div>
);

const Freelancers = () => {
    const [freelancers, setFreelancers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');
    const [activeSkill, setActiveSkill] = useState('All');

    useEffect(() => {
        const fetchFreelancers = async () => {
            try {
                const data = await getFreelancers();
                setFreelancers(Array.isArray(data) ? data : []);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchFreelancers();
    }, []);

    const filtered = freelancers.filter(f => {
        const matchesSearch = !search ||
            f.name?.toLowerCase().includes(search.toLowerCase()) ||
            f.title?.toLowerCase().includes(search.toLowerCase()) ||
            (f.skills || []).some(s => s.toLowerCase().includes(search.toLowerCase()));
        const matchesSkill = activeSkill === 'All' ||
            (f.skills || []).some(s => s.toLowerCase().includes(activeSkill.toLowerCase()));
        return matchesSearch && matchesSkill;
    });

    return (
        <div className="min-h-screen py-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-extrabold text-gray-900">Find Freelancers</h1>
                    <p className="mt-2 text-gray-500">Connect with expert professionals for your next project.</p>
                </div>

                {/* Search + Filters */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-8 space-y-4">
                    <div className="relative">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-gray-400 h-5 w-5" />
                        <input
                            type="text"
                            className="input-base pl-10"
                            placeholder="Search by name, title, or skill…"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                        <SlidersHorizontal className="h-4 w-4 text-gray-400 flex-shrink-0" />
                        {SKILL_FILTERS.map(skill => (
                            <button
                                key={skill}
                                onClick={() => setActiveSkill(skill)}
                                className={`filter-pill ${activeSkill === skill ? 'active' : ''}`}
                            >
                                {skill}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Results count */}
                {!loading && !error && (
                    <p className="text-sm text-gray-500 mb-5">
                        Showing <span className="font-semibold text-gray-900">{filtered.length}</span> freelancer{filtered.length !== 1 ? 's' : ''}
                    </p>
                )}

                {/* Grid */}
                {loading ? (
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
                    </div>
                ) : error ? (
                    <div className="empty-state">
                        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl text-sm font-medium">
                            {error}
                        </div>
                    </div>
                ) : filtered.length > 0 ? (
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {filtered.map(f => (
                            <FreelancerCard key={f._id || f.id} freelancer={f} />
                        ))}
                    </div>
                ) : (
                    <div className="empty-state">
                        <Search className="h-12 w-12 text-gray-300 mb-4" />
                        <p className="text-gray-500 font-medium">No freelancers found</p>
                        <p className="text-gray-400 text-sm mt-1">Try adjusting your search or filters</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Freelancers;
