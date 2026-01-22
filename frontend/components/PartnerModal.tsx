import React, { useState } from 'react';
import { X, Building2, User, Mail, Phone, Globe, MessageSquare, Loader2, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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

    const inputClasses = "w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#DE1819] focus:border-[#DE1819] transition-all text-slate-800 placeholder-slate-400 font-medium hover:bg-white hover:border-slate-300 hover:shadow-sm";
    const labelClasses = "block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1";

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
                        onClick={onClose}
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: "spring", duration: 0.5 }}
                        className="relative bg-white rounded-[2rem] shadow-2xl max-w-2xl w-full overflow-hidden border border-white/20"
                    >
                        {/* Elegant Header with Gradient */}
                        <div className="bg-gradient-to-br from-[#DE1819] to-[#990a0a] p-10 text-white relative overflow-hidden">
                            {/* Abstract Shapes */}
                            <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -mr-32 -mt-40 pointer-events-none"></div>
                            <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl -ml-20 -mb-32 pointer-events-none"></div>

                            <div className="relative z-10 flex justify-between items-start">
                                <div>
                                    <h2 className="text-3xl md:text-4xl font-serif font-bold tracking-tight">Partner With Us</h2>
                                    <p className="text-red-50 text-base mt-3 font-light max-w-sm leading-relaxed">Let's collaborate to build a sustainable and impactful future together.</p>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="bg-white/10 hover:bg-white/20 p-2.5 rounded-full transition-all text-white backdrop-blur-sm group"
                                >
                                    <X size={20} className="group-hover:rotate-90 transition-transform duration-300" />
                                </button>
                            </div>
                        </div>

                        {success ? (
                            <div className="p-20 flex flex-col items-center justify-center text-center">
                                <motion.div
                                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                                    className="w-24 h-24 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-8 shadow-sm"
                                >
                                    <CheckCircle2 size={48} />
                                </motion.div>
                                <h3 className="text-3xl font-serif font-bold text-slate-900 mb-4">Request Sent</h3>
                                <p className="text-slate-500 max-w-md text-lg leading-relaxed">
                                    We've received your partnership proposal. Our team will review it and connect with you shortly.
                                </p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="p-8 md:p-10 max-h-[70vh] overflow-y-auto custom-scrollbar bg-slate-50/50">
                                <div className="grid md:grid-cols-2 gap-x-8 gap-y-6 mb-8">
                                    {/* Organization Name */}
                                    <div className="col-span-2">
                                        <label className={labelClasses}>Organization / Company <span className="text-red-500">*</span></label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <Building2 size={18} className="text-slate-400 group-focus-within:text-[#DE1819] transition-colors" />
                                            </div>
                                            <input
                                                type="text"
                                                name="organizationName"
                                                value={formData.organizationName}
                                                onChange={handleChange}
                                                className={inputClasses}
                                                placeholder="e.g. Green Earth Foundation"
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Contact Person */}
                                    <div>
                                        <label className={labelClasses}>Contact Person <span className="text-red-500">*</span></label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <User size={18} className="text-slate-400 group-focus-within:text-[#DE1819] transition-colors" />
                                            </div>
                                            <input
                                                type="text"
                                                name="contactPerson"
                                                value={formData.contactPerson}
                                                onChange={handleChange}
                                                className={inputClasses}
                                                placeholder="Full Name"
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Phone */}
                                    <div>
                                        <label className={labelClasses}>Phone Number <span className="text-red-500">*</span></label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <Phone size={18} className="text-slate-400 group-focus-within:text-[#DE1819] transition-colors" />
                                            </div>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                className={inputClasses}
                                                placeholder="+91..."
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Email */}
                                    <div className="col-span-2">
                                        <label className={labelClasses}>Email Address <span className="text-red-500">*</span></label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <Mail size={18} className="text-slate-400 group-focus-within:text-[#DE1819] transition-colors" />
                                            </div>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                className={inputClasses}
                                                placeholder="contact@organization.com"
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Website */}
                                    <div>
                                        <label className={labelClasses}>Website <span className="text-red-500">*</span></label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <Globe size={18} className="text-slate-400 group-focus-within:text-[#DE1819] transition-colors" />
                                            </div>
                                            <input
                                                type="url"
                                                name="website"
                                                value={formData.website}
                                                onChange={handleChange}
                                                className={inputClasses}
                                                placeholder="https://..."
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* LinkedIn */}
                                    <div>
                                        <label className={labelClasses}>LinkedIn <span className="text-red-500">*</span></label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <Globe size={18} className="text-slate-400 group-focus-within:text-[#DE1819] transition-colors" />
                                            </div>
                                            <input
                                                type="url"
                                                name="linkedin"
                                                value={formData.linkedin}
                                                onChange={handleChange}
                                                className={inputClasses}
                                                placeholder="linkedin.com/in/..."
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Partnership Type */}
                                    <div className="col-span-2">
                                        <label className={labelClasses}>Collaboration Interest</label>
                                        <div className="relative">
                                            <select
                                                name="partnershipType"
                                                value={formData.partnershipType}
                                                onChange={handleChange}
                                                className={`${inputClasses} px-4 cursor-pointer appearance-none`}
                                            >
                                                <option value="Sponsorship">Sponsorship / Funding</option>
                                                <option value="Event">Joint Event / Seminar</option>
                                                <option value="Workshop">Technical Workshop</option>
                                                <option value="Other">Other</option>
                                            </select>
                                            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                                                <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Message */}
                                    <div className="col-span-2">
                                        <label className={labelClasses}>Proposal / Message <span className="text-red-500">*</span></label>
                                        <div className="relative group">
                                            <div className="absolute top-4 left-4 flex items-start pointer-events-none">
                                                <MessageSquare size={18} className="text-slate-400 group-focus-within:text-[#DE1819] transition-colors" />
                                            </div>
                                            <textarea
                                                name="message"
                                                value={formData.message}
                                                onChange={handleChange}
                                                rows={4}
                                                className={`${inputClasses} resize-none`}
                                                placeholder="Briefly describe how you'd like to partner with us..."
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                                        className="mb-6 p-4 bg-red-50 text-red-600 text-sm font-medium rounded-xl border border-red-100 flex items-center gap-3"
                                    >
                                        <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                                        {error}
                                    </motion.div>
                                )}

                                <div className="flex justify-end gap-4 pt-6 border-t border-slate-200/60">
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="px-8 py-3.5 text-slate-500 font-bold hover:bg-white hover:text-slate-700 rounded-xl transition-all border border-transparent hover:border-slate-200 hover:shadow-sm"
                                        disabled={isSubmitting}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="px-12 py-3.5 bg-gradient-to-r from-[#DE1819] to-[#b01314] hover:shadow-lg hover:shadow-red-500/30 text-white font-bold rounded-xl transition-all transform active:scale-95 flex items-center gap-2"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 size={20} className="animate-spin" />
                                                Processing...
                                            </>
                                        ) : (
                                            'Submit Request'
                                        )}
                                    </button>
                                </div>
                            </form>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default PartnerModal;
