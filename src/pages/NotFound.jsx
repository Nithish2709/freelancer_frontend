import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, SearchX } from 'lucide-react';

const NotFound = () => {
    const navigate = useNavigate();
    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
            <div className="h-20 w-20 rounded-2xl bg-sky-50 border border-sky-100 flex items-center justify-center mb-6">
                <SearchX className="h-10 w-10 text-sky-400" />
            </div>
            <h1 className="text-6xl font-extrabold text-sky-500 mb-2">404</h1>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Page Not Found</h2>
            <p className="text-gray-500 text-sm max-w-sm mb-8">
                The page you're looking for doesn't exist or has been moved.
            </p>
            <div className="flex gap-3">
                <button
                    onClick={() => navigate(-1)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-xl text-gray-700 border border-gray-200 hover:bg-gray-50 transition-colors">
                    <ArrowLeft className="h-4 w-4" />
                    Go Back
                </button>
                <Link to="/"
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-xl text-white btn-primary">
                    <Home className="h-4 w-4" />
                    Home
                </Link>
            </div>
        </div>
    );
};

export default NotFound;
