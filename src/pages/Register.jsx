import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';
import { registerUser } from '../api';

const Register = () => {
    const [userType, setUserType] = useState('freelancer');
    const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }
        try {
            const data = await registerUser({ name: formData.name, email: formData.email, password: formData.password, role: userType });
            login(data);
            toast.success('Account created! Complete your profile to get started.');
            navigate('/complete-profile');
        } catch (err) {
            toast.error(err.message || 'Registration failed');
        }
    };

    return (
        <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8" style={{ background: 'linear-gradient(160deg, #e0f2fe 0%, #f0f9ff 50%, #ffffff 100%)' }}>
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-sky-900">Create your account</h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Already have an account?{' '}
                    <Link to="/login" className="font-medium text-sky-600 hover:text-sky-500">Sign in</Link>
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow-lg sm:rounded-2xl sm:px-10 border border-sky-100">

                    {/* Role toggle */}
                    <div className="flex justify-center space-x-4 mb-6">
                        {['freelancer', 'client'].map(type => (
                            <button key={type} type="button" onClick={() => setUserType(type)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${userType === type
                                    ? 'text-white btn-primary'
                                    : 'bg-white text-sky-700 border border-sky-200 hover:bg-sky-50'}`}>
                                {type === 'freelancer' ? "I'm a Freelancer" : "I'm a Client"}
                            </button>
                        ))}
                    </div>

                    <form className="space-y-5" onSubmit={handleSubmit}>
                        {/* Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Full Name</label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-gray-400" />
                                </div>
                                <input name="name" type="text" required
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500"
                                    placeholder="John Doe" value={formData.name} onChange={handleChange} />
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email address</label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <input name="email" type="email" autoComplete="email" required
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500"
                                    placeholder="you@example.com" value={formData.email} onChange={handleChange} />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Password</label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input name="password" type="password" required
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500"
                                    placeholder="••••••••" value={formData.password} onChange={handleChange} />
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input name="confirmPassword" type="password" required
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500"
                                    placeholder="••••••••" value={formData.confirmPassword} onChange={handleChange} />
                            </div>
                        </div>

                        <button type="submit"
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white btn-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500">
                            Create Account
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;
