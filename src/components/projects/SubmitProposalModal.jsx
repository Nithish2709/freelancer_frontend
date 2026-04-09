import React, { useState, useEffect } from 'react';
import { X, Send, CheckCircle, DollarSign, FileText } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { t } from '../../i18n';
import { submitProposal } from '../../api';

const SubmitProposalModal = ({ isOpen, onClose, projectId, onProposalSubmitted }) => {
    const [formData, setFormData] = useState({ coverLetter: '', bidAmount: '' });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [visible, setVisible] = useState(false);

    // Trigger entrance animation after mount
    useEffect(() => {
        if (isOpen) {
            setSuccess(false);
            setFormData({ coverLetter: '', bidAmount: '' });
            requestAnimationFrame(() => setVisible(true));
        } else {
            setVisible(false);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = JSON.parse(localStorage.getItem('user'))?.token || '';
            const data = await submitProposal(token, projectId, formData);

            setSuccess(true);
            toast.success('Proposal submitted successfully!');
            onProposalSubmitted(data);
            setTimeout(() => onClose(), 1800);
        } catch (err) {
            toast.error(err.message);
            setLoading(false);
        }
    };

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleClose = () => {
        setVisible(false);
        onClose();
    };

    return (
        <>
            <style>{`
                @keyframes backdropIn {
                    from { opacity: 0; }
                    to   { opacity: 1; }
                }
                @keyframes modalSlideUp {
                    from { opacity: 0; transform: translateY(40px) scale(0.97); }
                    to   { opacity: 1; transform: translateY(0)   scale(1); }
                }
                @keyframes modalSlideDown {
                    from { opacity: 1; transform: translateY(0)   scale(1); }
                    to   { opacity: 0; transform: translateY(40px) scale(0.97); }
                }
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
                @keyframes successPop {
                    0%   { transform: scale(0.5); opacity: 0; }
                    60%  { transform: scale(1.15); opacity: 1; }
                    100% { transform: scale(1); opacity: 1; }
                }
                @keyframes checkDraw {
                    from { stroke-dashoffset: 60; }
                    to   { stroke-dashoffset: 0; }
                }
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(12px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                @keyframes pulse-ring {
                    0%   { transform: scale(1);    opacity: 0.6; }
                    100% { transform: scale(1.6);  opacity: 0; }
                }
                .modal-backdrop {
                    animation: backdropIn 0.2s ease forwards;
                }
                .modal-panel-in {
                    animation: modalSlideUp 0.28s cubic-bezier(0.34,1.56,0.64,1) forwards;
                }
                .modal-panel-out {
                    animation: modalSlideDown 0.2s ease forwards;
                }
                .spinner {
                    width: 16px; height: 16px;
                    border: 2px solid rgba(255,255,255,0.35);
                    border-top-color: #fff;
                    border-radius: 50%;
                    animation: spin 0.7s linear infinite;
                    display: inline-block;
                }
                .success-icon {
                    animation: successPop 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards;
                }
                .success-check {
                    stroke-dasharray: 60;
                    stroke-dashoffset: 60;
                    animation: checkDraw 0.4s 0.3s ease forwards;
                }
                .field-row {
                    animation: fadeInUp 0.3s ease forwards;
                    opacity: 0;
                }
                .field-row:nth-child(1) { animation-delay: 0.08s; }
                .field-row:nth-child(2) { animation-delay: 0.16s; }
                .field-row:nth-child(3) { animation-delay: 0.24s; }
                .pulse-ring {
                    position: absolute; inset: -6px;
                    border-radius: 50%;
                    border: 2px solid #0ea5e9;
                    animation: pulse-ring 1.2s ease-out infinite;
                }
            `}</style>

            <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                {/* Backdrop */}
                <div
                    className="modal-backdrop absolute inset-0"
                    style={{ background: 'rgba(2,132,199,0.18)', backdropFilter: 'blur(4px)' }}
                    onClick={handleClose}
                />

                {/* Panel */}
                <div
                    className={`relative w-full max-w-md ${visible ? 'modal-panel-in' : 'modal-panel-out'}`}
                    style={{
                        background: 'linear-gradient(145deg, #f0f9ff 0%, #ffffff 100%)',
                        borderRadius: '20px',
                        boxShadow: '0 24px 60px rgba(2,132,199,0.18), 0 4px 16px rgba(0,0,0,0.08)',
                        border: '1px solid #bae6fd',
                        overflow: 'hidden'
                    }}
                >
                    {/* Header stripe */}
                    <div style={{ background: 'linear-gradient(90deg, #0284c7 0%, #38bdf8 100%)', height: '4px' }} />

                    <div className="px-6 pt-5 pb-6">
                        {/* Title row */}
                        <div className="flex justify-between items-center mb-5">
                            <div className="flex items-center gap-2">
                                <div className="relative">
                                    <div className="h-9 w-9 rounded-xl flex items-center justify-center"
                                        style={{ background: 'linear-gradient(135deg, #0284c7, #38bdf8)' }}>
                                        <Send className="h-4 w-4 text-white" />
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-sky-900">Submit Proposal</h3>
                                    <p className="text-xs text-sky-400">Fill in your bid details below</p>
                                </div>
                            </div>
                            <button
                                onClick={handleClose}
                                className="h-8 w-8 rounded-full flex items-center justify-center text-sky-400 hover:text-sky-600 hover:bg-sky-100 transition-colors"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        {/* Success state */}
                        {success ? (
                            <div className="py-10 flex flex-col items-center gap-4">
                                <div className="relative success-icon">
                                    <div className="pulse-ring" />
                                    <div className="h-20 w-20 rounded-full flex items-center justify-center"
                                        style={{ background: 'linear-gradient(135deg, #0284c7, #38bdf8)' }}>
                                        <svg viewBox="0 0 40 40" className="h-10 w-10">
                                            <polyline
                                                points="8,20 17,29 32,12"
                                                fill="none"
                                                stroke="white"
                                                strokeWidth="3.5"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                className="success-check"
                                            />
                                        </svg>
                                    </div>
                                </div>
                                <p className="text-sky-900 font-bold text-lg">Proposal Sent!</p>
                                <p className="text-sky-500 text-sm text-center">Your proposal has been submitted successfully. The client will review it shortly.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* Bid Amount */}
                                <div className="field-row">
                                    <label className="block text-xs font-semibold text-sky-600 uppercase tracking-wider mb-1.5">
                                        <DollarSign className="inline h-3.5 w-3.5 mr-1 -mt-0.5" />
                                        {t('label.bidAmount')}
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sky-400 font-semibold text-sm">$</span>
                                        <input
                                            type="number"
                                            name="bidAmount"
                                            required
                                            min="1"
                                            value={formData.bidAmount}
                                            onChange={handleChange}
                                            placeholder="e.g. 500"
                                            className="block w-full pl-7 pr-3 py-2.5 border border-sky-200 rounded-xl text-sm text-sky-900 placeholder-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400 transition-all"
                                            style={{ background: 'linear-gradient(145deg, #f0f9ff, #ffffff)' }}
                                        />
                                    </div>
                                </div>

                                {/* Cover Letter */}
                                <div className="field-row">
                                    <label className="block text-xs font-semibold text-sky-600 uppercase tracking-wider mb-1.5">
                                        <FileText className="inline h-3.5 w-3.5 mr-1 -mt-0.5" />
                                        {t('label.coverLetter')}
                                    </label>
                                    <textarea
                                        name="coverLetter"
                                        required
                                        rows="5"
                                        value={formData.coverLetter}
                                        onChange={handleChange}
                                        placeholder="Describe why you are the best fit for this project..."
                                        className="block w-full border border-sky-200 rounded-xl text-sm text-sky-900 placeholder-sky-300 py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400 transition-all resize-none"
                                        style={{ background: 'linear-gradient(145deg, #f0f9ff, #ffffff)' }}
                                    />
                                    <p className="text-right text-xs text-sky-300 mt-1">{formData.coverLetter.length} chars</p>
                                </div>

                                {/* Buttons */}
                                <div className="field-row flex gap-3 pt-1">
                                    <button
                                        type="button"
                                        onClick={handleClose}
                                        className="flex-1 py-2.5 rounded-xl text-sm font-medium text-sky-600 border border-sky-200 hover:bg-sky-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 transition-all"
                                        style={{
                                            background: loading
                                                ? 'linear-gradient(135deg, #7dd3fc, #38bdf8)'
                                                : 'linear-gradient(135deg, #0284c7, #0ea5e9)',
                                            boxShadow: loading ? 'none' : '0 4px 14px rgba(2,132,199,0.35)',
                                            transform: loading ? 'scale(0.98)' : 'scale(1)'
                                        }}
                                    >
                                        {loading ? (
                                            <>
                                                <span className="spinner" />
                                                Submitting...
                                            </>
                                        ) : (
                                            <>
                                                <Send className="h-4 w-4" />
                                                Submit Proposal
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default SubmitProposalModal;
