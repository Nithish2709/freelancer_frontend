import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';
import { CheckCircle, Circle, User, Briefcase, BookOpen, Globe, Image, ChevronRight, ChevronLeft, Plus, X } from 'lucide-react';
import { updateProfile } from '../api';

// ── Section definitions ──────────────────────────────────────────────────────
const FREELANCER_SECTIONS = [
    { id: 'personal',   label: 'Personal Info',  icon: User,      weight: 25 },
    { id: 'skills',     label: 'Skills',         icon: Briefcase, weight: 25 },
    { id: 'experience', label: 'Experience',     icon: BookOpen,  weight: 25 },
    { id: 'portfolio',  label: 'Portfolio',      icon: Globe,     weight: 15 },
    { id: 'photo',      label: 'Profile Photo',  icon: Image,     weight: 10 },
];

const CLIENT_SECTIONS = [
    { id: 'personal',  label: 'Personal Info',    icon: User,      weight: 40 },
    { id: 'company',   label: 'Company Details',  icon: Briefcase, weight: 40 },
    { id: 'photo',     label: 'Profile Photo',    icon: Image,     weight: 20 },
];

// ── Completion calculator ─────────────────────────────────────────────────────
function calcProgress(role, form) {
    const sections = role === 'freelancer' ? FREELANCER_SECTIONS : CLIENT_SECTIONS;
    let earned = 0;
    sections.forEach(({ id, weight }) => {
        if (isSectionComplete(id, role, form)) earned += weight;
    });
    return earned;
}

function isSectionComplete(id, role, form) {
    switch (id) {
        case 'personal':
            return !!(form.name?.trim() && form.bio?.trim() && form.phoneNumber?.trim() && form.location?.trim() &&
                (role === 'freelancer' ? form.title?.trim() : true));
        case 'skills':
            return form.skills?.length >= 1;
        case 'experience':
            return !!(form.experience?.trim());
        case 'portfolio':
            return !!(form.portfolio?.trim());
        case 'company':
            return !!(form.companyName?.trim() && form.projectInterests?.trim());
        case 'photo':
            return !!(form.profileImage?.trim());
        default:
            return false;
    }
}

// ── Tag input helper ──────────────────────────────────────────────────────────
const TagInput = ({ tags, onAdd, onRemove, placeholder, colorClass }) => {
    const [val, setVal] = useState('');
    const add = (e) => {
        e.preventDefault();
        const trimmed = val.trim();
        if (trimmed && !tags.includes(trimmed)) { onAdd(trimmed); setVal(''); }
    };
    return (
        <div>
            <div className="flex gap-2 mt-1">
                <input
                    type="text" value={val} onChange={e => setVal(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && add(e)}
                    placeholder={placeholder}
                    className="block w-full border border-gray-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500"
                />
                <button type="button" onClick={add} className="px-3 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700">
                    <Plus className="h-4 w-4" />
                </button>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
                {tags.map(t => (
                    <span key={t} className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>
                        {t}
                        <button type="button" onClick={() => onRemove(t)}><X className="h-3 w-3" /></button>
                    </span>
                ))}
            </div>
        </div>
    );
};

// ── Main component ────────────────────────────────────────────────────────────
const ProfileCompletion = () => {
    const { user, updateUser } = useContext(AuthContext);
    const navigate = useNavigate();
    const role = user?.role || 'freelancer';
    const sections = role === 'freelancer' ? FREELANCER_SECTIONS : CLIENT_SECTIONS;

    const [step, setStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        name: user?.name || '',
        title: '', bio: '', phoneNumber: '', location: '',
        skills: [], tools: [],
        experience: '', portfolio: '',
        companyName: '', projectInterests: '',
        profileImage: '',
    });

    const progress = calcProgress(role, form);
    const currentSection = sections[step];

    const set = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

    const handleSave = async () => {
        setLoading(true);
        try {
            const token = user?.token;
            if (!token) throw new Error('Not authenticated');

            const data = await updateProfile(token, form);
            updateUser({ ...data, token });

            if (data.profileComplete) {
                toast.success('🎉 Profile completed successfully!');
                navigate('/dashboard');
            } else {
                toast.success('Progress saved!');
            }
        } catch (err) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    // ── Section renderers ─────────────────────────────────────────────────────
    const renderSection = () => {
        switch (currentSection.id) {
            case 'personal':
                return (
                    <div className="space-y-4">
                        <Field label="Full Name *" error={!form.name.trim() && 'Required'}>
                            <input type="text" value={form.name} onChange={e => set('name', e.target.value)}
                                className={input()} placeholder="John Doe" />
                        </Field>
                        {role === 'freelancer' && (
                            <Field label="Professional Title *" error={!form.title.trim() && 'Required'}>
                                <input type="text" value={form.title} onChange={e => set('title', e.target.value)}
                                    className={input()} placeholder="e.g. Full Stack Developer" />
                            </Field>
                        )}
                        <Field label="Bio *" error={!form.bio.trim() && 'Required'}>
                            <textarea value={form.bio} onChange={e => set('bio', e.target.value)}
                                rows={4} className={input()} placeholder="Tell clients about yourself..." />
                        </Field>
                        <Field label="Phone Number *" error={!form.phoneNumber.trim() && 'Required'}>
                            <input type="text" value={form.phoneNumber} onChange={e => set('phoneNumber', e.target.value)}
                                className={input()} placeholder="+1 (555) 000-0000" />
                        </Field>
                        <Field label="Location *" error={!form.location.trim() && 'Required'}>
                            <input type="text" value={form.location} onChange={e => set('location', e.target.value)}
                                className={input()} placeholder="City, Country" />
                        </Field>
                    </div>
                );

            case 'skills':
                return (
                    <div className="space-y-5">
                        <Field label="Skills * (at least 1)" error={form.skills.length === 0 && 'Add at least one skill'}>
                            <TagInput tags={form.skills} onAdd={v => set('skills', [...form.skills, v])}
                                onRemove={v => set('skills', form.skills.filter(s => s !== v))}
                                placeholder="e.g. React, Node.js" colorClass="bg-blue-100 text-blue-800" />
                        </Field>
                        <Field label="Tools (optional)">
                            <TagInput tags={form.tools} onAdd={v => set('tools', [...form.tools, v])}
                                onRemove={v => set('tools', form.tools.filter(t => t !== v))}
                                placeholder="e.g. Figma, VS Code" colorClass="bg-green-100 text-green-800" />
                        </Field>
                        <Field label="Hourly Rate (optional)">
                            <div className="relative mt-1">
                                <span className="absolute inset-y-0 left-3 flex items-center text-gray-400 text-sm">$</span>
                                <input type="number" value={form.hourlyRate || ''} onChange={e => set('hourlyRate', e.target.value)}
                                    className={input() + ' pl-7'} placeholder="50" min="0" />
                            </div>
                        </Field>
                    </div>
                );

            case 'experience':
                return (
                    <div className="space-y-4">
                        <Field label="Work Experience *" error={!form.experience.trim() && 'Required'}>
                            <textarea value={form.experience} onChange={e => set('experience', e.target.value)}
                                rows={5} className={input()}
                                placeholder="Describe your work experience, roles, companies, and duration..." />
                        </Field>
                    </div>
                );

            case 'portfolio':
                return (
                    <div className="space-y-4">
                        <Field label="Portfolio URL" hint="Link to your portfolio website or GitHub">
                            <input type="url" value={form.portfolio} onChange={e => set('portfolio', e.target.value)}
                                className={input()} placeholder="https://yourportfolio.com" />
                        </Field>
                        <p className="text-xs text-gray-400">This section is optional but recommended (+15% completion)</p>
                    </div>
                );

            case 'company':
                return (
                    <div className="space-y-4">
                        <Field label="Company Name *" error={!form.companyName.trim() && 'Required'}>
                            <input type="text" value={form.companyName} onChange={e => set('companyName', e.target.value)}
                                className={input()} placeholder="ACME Inc." />
                        </Field>
                        <Field label="Project Interests *" error={!form.projectInterests.trim() && 'Required'}>
                            <textarea value={form.projectInterests} onChange={e => set('projectInterests', e.target.value)}
                                rows={4} className={input()} placeholder="What kind of projects are you looking to post?" />
                        </Field>
                    </div>
                );

            case 'photo':
                return (
                    <div className="space-y-4">
                        <Field label="Profile Image URL" hint="Paste a direct image URL (e.g. from Imgur or Cloudinary)">
                            <input type="url" value={form.profileImage} onChange={e => set('profileImage', e.target.value)}
                                className={input()} placeholder="https://example.com/photo.jpg" />
                        </Field>
                        {form.profileImage && (
                            <div className="flex justify-center">
                                <img src={form.profileImage} alt="Preview"
                                    className="h-24 w-24 rounded-full object-cover ring-4 ring-sky-200"
                                    onError={e => { e.target.style.display = 'none'; }} />
                            </div>
                        )}
                        <p className="text-xs text-gray-400">This section is optional but recommended (+10% completion)</p>
                    </div>
                );

            default: return null;
        }
    };

    return (
        <div className="min-h-screen py-10 px-4" style={{ background: 'linear-gradient(160deg, #e0f2fe 0%, #f0f9ff 50%, #ffffff 100%)' }}>
            <div className="max-w-2xl mx-auto">

                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-sky-900">Complete Your Profile</h1>
                    <p className="text-sky-600 mt-1 text-sm">You need 100% to access the dashboard</p>
                </div>

                {/* Progress bar */}
                <div className="bg-white rounded-2xl shadow-sm border border-sky-100 p-5 mb-6">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-semibold text-sky-800">Profile Completion</span>
                        <span className={`text-sm font-bold ${progress === 100 ? 'text-green-600' : 'text-sky-600'}`}>{progress}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                        <div
                            className={`h-3 rounded-full transition-all duration-500 ${progress === 100 ? 'bg-green-500' : 'bg-sky-500'}`}
                            style={{ width: `${progress}%` }}
                        />
                    </div>

                    {/* Section checklist */}
                    <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {sections.map((s, i) => {
                            const done = isSectionComplete(s.id, role, form);
                            return (
                                <button key={s.id} onClick={() => setStep(i)}
                                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors text-left
                                        ${i === step ? 'bg-sky-100 text-sky-800 ring-1 ring-sky-300' : 'hover:bg-gray-50 text-gray-600'}`}>
                                    {done
                                        ? <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                                        : <Circle className="h-4 w-4 text-gray-300 flex-shrink-0" />}
                                    <span>{s.label}</span>
                                    <span className="ml-auto text-gray-400">{s.weight}%</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Section form */}
                <div className="bg-white rounded-2xl shadow-sm border border-sky-100 p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-sky-100 rounded-lg">
                            <currentSection.icon className="h-5 w-5 text-sky-600" />
                        </div>
                        <div>
                            <h2 className="text-base font-bold text-gray-900">{currentSection.label}</h2>
                            <p className="text-xs text-gray-400">Step {step + 1} of {sections.length}</p>
                        </div>
                        {isSectionComplete(currentSection.id, role, form) && (
                            <span className="ml-auto flex items-center gap-1 text-xs text-green-600 font-medium">
                                <CheckCircle className="h-4 w-4" /> Complete
                            </span>
                        )}
                    </div>

                    {renderSection()}

                    {/* Navigation */}
                    <div className="mt-8 flex justify-between items-center">
                        <button onClick={() => setStep(s => s - 1)} disabled={step === 0}
                            className="flex items-center gap-1 px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed">
                            <ChevronLeft className="h-4 w-4" /> Back
                        </button>

                        <div className="flex gap-3">
                            <button onClick={handleSave} disabled={loading}
                                className="px-4 py-2 text-sm border border-sky-300 text-sky-700 rounded-lg hover:bg-sky-50 disabled:opacity-50">
                                {loading ? 'Saving...' : 'Save Progress'}
                            </button>

                            {step < sections.length - 1 ? (
                                <button onClick={() => setStep(s => s + 1)}
                                    className="flex items-center gap-1 px-4 py-2 text-sm text-white bg-sky-600 rounded-lg hover:bg-sky-700">
                                    Next <ChevronRight className="h-4 w-4" />
                                </button>
                            ) : (
                                <button onClick={handleSave} disabled={loading || progress < 100}
                                    className="px-5 py-2 text-sm font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed">
                                    {progress < 100 ? `${100 - progress}% remaining` : '🎉 Complete Profile'}
                                </button>
                            )}
                        </div>
                    </div>

                    {progress < 100 && (
                        <p className="mt-4 text-center text-xs text-gray-400">
                            Complete all required sections to unlock the dashboard
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

// ── Tiny helpers ──────────────────────────────────────────────────────────────
const input = () => 'mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500';

const Field = ({ label, children, error, hint }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        {hint && <p className="text-xs text-gray-400 mb-1">{hint}</p>}
        {children}
        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
);

export default ProfileCompletion;
