import React, { useState } from 'react';
import { X, Building2, User, Mail, Phone, Globe, MessageSquare, Loader2, CheckCircle2 } from 'lucide-react';
import { api } from '../services/api';

interface PartnerModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const PartnerModal: React.FC<PartnerModalProps> = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState({
        organizationName: '',
        contactPerson: '',
        email: '',
        phone: '',
        website: '',
        linkedin: '',
        partnershipType: 'Sponsorship',
        message: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        try {
            await api.createPartnership(formData);
            setSuccess(true);
            setTimeout(() => {
                onClose();
                setSuccess(false);
                setFormData({
                    organizationName: '',
                    contactPerson: '',
                    email: '',
                    phone: '',
                    website: '',
                    linkedin: '',
                    partnershipType: 'Sponsorship',
                    message: ''
                });
            }, 3000);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to submit request. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={onClose}></div>

            <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden animate-scale-up border border-slate-200">
                {/* Header */}
                <div className="bg-brand-600 p-6 text-white flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold">Partner With Us</h2>
                        <p className="text-brand-100 text-sm mt-1">Let's build a sustainable future together.</p>
                    </div>
                    <button onClick={onClose} className="bg-white/20 hover:bg-white/30 p-2 rounded-full transition-colors text-white">
                        <X size={20} />
                    </button>
                </div>

                {success ? (
                    <div className="p-12 flex flex-col items-center justify-center text-center animate-fade-in">
                        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                            <CheckCircle2 size={48} />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-2">Request Submitted!</h3>
                        <p className="text-slate-500 max-w-md">
                            Thank you for your interest in partnering with JCS. Our team will review your details and get back to you shortly.
                        </p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="p-6 md:p-8 max-h-[80vh] overflow-y-auto custom-scrollbar">
                        <div className="grid md:grid-cols-2 gap-6 mb-6">
                            {/* Organization Name */}
                            <div className="col-span-2">
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Organization / Company Name</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Building2 size={18} className="text-slate-400 group-focus-within:text-brand-500 transition-colors" />
                                    </div>
                                    <input
                                        type="text"
                                        name="organizationName"
                                        value={formData.organizationName}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all text-slate-900 placeholder-slate-400"
                                        placeholder="e.g. Green Earth Foundation"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Contact Person */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Contact Person</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <User size={18} className="text-slate-400 group-focus-within:text-brand-500 transition-colors" />
                                    </div>
                                    <input
                                        type="text"
                                        name="contactPerson"
                                        value={formData.contactPerson}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all text-slate-900 placeholder-slate-400"
                                        placeholder="Full Name"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Phone */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Phone Number</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Phone size={18} className="text-slate-400 group-focus-within:text-brand-500 transition-colors" />
                                    </div>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all text-slate-900 placeholder-slate-400"
                                        placeholder="+91 98765 43210"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div className="col-span-2">
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Email Address</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail size={18} className="text-slate-400 group-focus-within:text-brand-500 transition-colors" />
                                    </div>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all text-slate-900 placeholder-slate-400"
                                        placeholder="contact@organization.com"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Website */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Website (Optional)</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Globe size={18} className="text-slate-400 group-focus-within:text-brand-500 transition-colors" />
                                    </div>
                                    <input
                                        type="url"
                                        name="website"
                                        value={formData.website}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all text-slate-900 placeholder-slate-400"
                                        placeholder="https://..."
                                    />
                                </div>
                            </div>

                            {/* LinkedIn */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">LinkedIn (Optional)</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Globe size={18} className="text-slate-400 group-focus-within:text-brand-500 transition-colors" />
                                    </div>
                                    <input
                                        type="url"
                                        name="linkedin"
                                        value={formData.linkedin}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all text-slate-900 placeholder-slate-400"
                                        placeholder="https://linkedin.com/in/..."
                                    />
                                </div>
                            </div>

                            {/* Partnership Type */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Collaboration Interest</label>
                                <div className="relative">
                                    <select
                                        name="partnershipType"
                                        value={formData.partnershipType}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all text-slate-900 cursor-pointer appearance-none"
                                    >
                                        <option value="Sponsorship">Sponsorship / Funding</option>
                                        <option value="Event">Joint Event / Seminar</option>
                                        <option value="Workshop">Technical Workshop</option>
                                        <option value="Other">Other</option>
                                    </select>
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                        <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {/* Message */}
                            <div className="col-span-2">
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Message / Proposal</label>
                                <div className="relative group">
                                    <div className="absolute top-3 left-3 flex items-start pointer-events-none">
                                        <MessageSquare size={18} className="text-slate-400 group-focus-within:text-brand-500 transition-colors" />
                                    </div>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        rows={4}
                                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all text-slate-900 placeholder-slate-400 resize-none"
                                        placeholder="Tell us briefly about how you'd like to collaborate..."
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {error && (
                            <div className="mb-6 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 animate-scale-in">
                                {error}
                            </div>
                        )}

                        <div className="flex justify-end gap-3 pt-2 border-t border-slate-100">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-6 py-2.5 text-slate-600 font-semibold hover:bg-slate-100 rounded-xl transition-colors"
                                disabled={isSubmitting}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="px-8 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl shadow-lg shadow-brand-500/30 transition-all transform active:scale-95 flex items-center gap-2"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 size={18} className="animate-spin" />
                                        Submitting...
                                    </>
                                ) : (
                                    'Submit Request'
                                )}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default PartnerModal;
