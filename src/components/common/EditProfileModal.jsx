import React, { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { t } from '../../i18n';

const EditProfileModal = ({ isOpen, onClose, user, onProfileUpdated }) => {
    const [name, setName] = useState('');
    const [title, setTitle] = useState('');
    const [bio, setBio] = useState('');
    const [skills, setSkills] = useState([]);
    const [tools, setTools] = useState([]);
    const [newSkill, setNewSkill] = useState('');
    const [newTool, setNewTool] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [experience, setExperience] = useState('');
    const [portfolio, setPortfolio] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [projectInterests, setProjectInterests] = useState('');
    const [loading, setLoading] = useState(false);

    React.useEffect(() => {
        if (isOpen && user) {
            setName(user.name || '');
            setTitle(user.title || '');
            setBio(user.bio || '');
            setSkills(user.skills || []);
            setTools(user.tools || []);
            setPhoneNumber(user.phoneNumber || '');
            setExperience(user.experience || '');
            setPortfolio(user.portfolio || '');
            setCompanyName(user.companyName || '');
            setProjectInterests(user.projectInterests || '');
            setNewSkill('');
            setNewTool('');
        }
    }, [isOpen, user]);

    if (!isOpen) return null;

    const handleAddSkill = (e) => {
        e.preventDefault();
        if (newSkill && !skills.includes(newSkill)) {
            setSkills([...skills, newSkill]);
            setNewSkill('');
        }
    };

    const handleRemoveSkill = (skillToRemove) => {
        setSkills(skills.filter(s => s !== skillToRemove));
    };

    const handleAddTool = (e) => {
        e.preventDefault();
        if (newTool && !tools.includes(newTool)) {
            setTools([...tools, newTool]);
            setNewTool('');
        }
    };

    const handleRemoveTool = (toolToRemove) => {
        setTools(tools.filter(t => t !== toolToRemove));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const storedUser = localStorage.getItem('user');
            const token = storedUser ? JSON.parse(storedUser).token : null;
            if (!token) throw new Error('Not authenticated. Please log in again.');

            const res = await fetch('/api/users/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    name, title, bio, skills, tools,
                    phoneNumber, experience, portfolio,
                    companyName, projectInterests
                })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Failed to update profile');

            toast.success('Profile updated successfully');
            onProfileUpdated(data);
            onClose();
        } catch (err) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 bg-gray-500/75" aria-hidden="true"></div>

                <div className="relative z-50 inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-medium text-gray-900">Edit Profile</h3>
                            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">{t('label.name')}</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">{t('label.professionalTitle')}</label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="e.g. Full Stack Developer"
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">{t('label.bio')}</label>
                                <textarea
                                    value={bio}
                                    onChange={(e) => setBio(e.target.value)}
                                    rows={3}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">{t('label.phoneNumber')}</label>
                                <input
                                    type="text"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                            </div>

                            {user?.role === 'freelancer' && (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">{t('label.experience')}</label>
                                        <input
                                            type="text"
                                            value={experience}
                                            onChange={(e) => setExperience(e.target.value)}
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">{t('label.portfolioUrl')}</label>
                                        <input
                                            type="text"
                                            value={portfolio}
                                            onChange={(e) => setPortfolio(e.target.value)}
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        />
                                    </div>
                                </>
                            )}

                            {user?.role === 'client' && (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">{t('label.companyName')}</label>
                                        <input
                                            type="text"
                                            value={companyName}
                                            onChange={(e) => setCompanyName(e.target.value)}
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">{t('label.projectInterests')}</label>
                                        <textarea
                                            value={projectInterests}
                                            onChange={(e) => setProjectInterests(e.target.value)}
                                            rows={2}
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        />
                                    </div>
                                </>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-700">{t('label.skills')}</label>
                                <div className="mt-1 flex space-x-2">
                                    <input
                                        type="text"
                                        value={newSkill}
                                        onChange={(e) => setNewSkill(e.target.value)}
                                        className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        placeholder="Add a skill"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleAddSkill}
                                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    >
                                        <Plus className="h-4 w-4" />
                                    </button>
                                </div>
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {skills.map((skill) => (
                                        <span key={skill} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                            {skill}
                                            <button onClick={() => handleRemoveSkill(skill)} className="ml-1 text-blue-600 hover:text-blue-800">
                                                <X className="h-3 w-3" />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">{t('label.toolsKnown')}</label>
                                <div className="mt-1 flex space-x-2">
                                    <input
                                        type="text"
                                        value={newTool}
                                        onChange={(e) => setNewTool(e.target.value)}
                                        className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        placeholder="Add a tool (e.g. VS Code, Figma)"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleAddTool}
                                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    >
                                        <Plus className="h-4 w-4" />
                                    </button>
                                </div>
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {tools.map((tool) => (
                                        <span key={tool} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                            {tool}
                                            <button onClick={() => handleRemoveTool(tool)} className="ml-1 text-green-600 hover:text-green-800">
                                                <X className="h-3 w-3" />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-5 sm:mt-6">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm disabled:opacity-50"
                                >
                                    {loading ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditProfileModal;
