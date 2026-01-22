import React, { useState } from 'react';
import { useJCS } from '../services/JCSContext';
import { useToast } from '../components/ToastContext';
import { SDG_LIST } from '../types';
import { CheckCircle2, Link as LinkIcon, Check, Loader2, Image as ImageIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

const SubmitEvent = () => {
    const { addEvent, currentUser } = useJCS();
    const navigate = useNavigate();
    const { addToast } = useToast();

    const [formData, setFormData] = useState({
        title: '',
        fromDate: '',
        toDate: '',
        type: 'Awareness',
        description: '',
        actionsTaken: '',
        participants: 0,
        sdgs: [],
        imageUrl: '',
        proofLink: ''
    });

    const [submitted, setSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [uploadingField, setUploadingField] = useState<string | null>(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const toggleSDG = (sdg) => {
        setFormData(prev => {
            const exists = prev.sdgs.includes(sdg);
            if (exists) {
                return { ...prev, sdgs: prev.sdgs.filter(s => s !== sdg) };
            } else {
                return { ...prev, sdgs: [...prev.sdgs, sdg] };
            }
        });
    };

    // Upload File via API Service
    const handleFileChange = async (e, field) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setUploadingField(field);

            try {
                const url = await api.uploadFile(file);
                setFormData(prev => ({ ...prev, [field]: url }));
                addToast("File uploaded successfully", 'success');
            } catch (error) {
                console.error("Upload failed", error);
                addToast("Failed to upload file", 'error');
            } finally {
                setUploadingField(null);
            }
        }
    };

    // Calculate Min Date (1 Month Ago)
    const today = new Date();
    const minDate = new Date(today.setMonth(today.getMonth() - 1)).toISOString().split('T')[0];

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!currentUser.departmentId) return;

        // Validation Checks
        if (!formData.imageUrl) {
            addToast("Cover Photo is required", 'error');
            return;
        }
        if (formData.sdgs.length === 0) {
            addToast("Please select at least one SDG", 'error');
            return;
        }
        if (new Date(formData.fromDate) < new Date(minDate)) {
            addToast("From Date cannot be older than 1 month", 'error');
            return;
        }
        if (new Date(formData.toDate) < new Date(formData.fromDate)) {
            addToast("To Date cannot be before From Date", 'error');
            return;
        }

        setIsSubmitting(true);

        try {
            await addEvent({
                ...formData,
                departmentId: currentUser.departmentId,
                participants: Number(formData.participants),
            });
            setSubmitted(true);
            setTimeout(() => {
                navigate('/my-events');
            }, 2000);
        } catch (error) {
            console.error("Submission error", error);
            addToast("Failed to submit event. Please try again.", 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (submitted) {
        return (
            <div className="flex flex-col items-center justify-center h-full min-h-[500px] animate-scale-up">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle2 size={40} className="text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-main">Event Submitted Successfully!</h2>
                <p className="text-muted mt-2">Your event is now under review by the JCS team.</p>
                <p className="text-sm text-slate-400 mt-1">Redirecting to My Events...</p>
            </div>
        );
    }

    const inputClass = "w-full px-4 py-2 border border-border bg-page text-main rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all placeholder-slate-400 select-text disabled:opacity-50 disabled:cursor-not-allowed";
    const labelClass = "block text-sm font-semibold text-main mb-1 select-none";

    // Helper to render upload block
    const renderUploadBlock = (label, field, icon, accept, required = false) => (
        <div className="flex-1 min-w-[280px]">
            <label className={labelClass}>{label} {required && <span className="text-red-500">*</span>}</label>
            <div className={`border-2 border-dashed border-border bg-page rounded-lg p-6 flex flex-col items-center justify-center text-muted hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer relative min-h-[140px] ${isSubmitting || uploadingField ? 'opacity-50 pointer-events-none' : ''}`}>
                {uploadingField === field ? (
                    <div className="flex flex-col items-center">
                        <Loader2 className="animate-spin text-brand-600 mb-2" size={24} />
                        <span className="text-sm font-medium">Uploading...</span>
                    </div>
                ) : (
                    <>
                        {formData[field] ? (
                            <div className="flex flex-col items-center text-green-600">
                                <CheckCircle2 size={32} className="mb-2" />
                                <span className="text-sm font-medium">Uploaded Successfully</span>
                                <span className="text-xs text-muted mt-1 break-all max-w-[200px] truncate">{formData[field].split('/').pop()}</span>
                            </div>
                        ) : (
                            <>
                                {icon}
                                <span className="text-sm font-medium mt-2">Click to upload</span>
                                <input
                                    type="file"
                                    accept={accept}
                                    disabled={isSubmitting || uploadingField !== null}
                                    onChange={(e) => handleFileChange(e, field)}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                            </>
                        )}
                    </>
                )}
            </div>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto select-none">
            <div className="mb-6 lg:mb-8">
                <h2 className="text-2xl font-bold text-main">Submit New Event</h2>
                <p className="text-muted mt-1">Fill in the details below to submit your department's sustainability event.</p>
            </div>

            <form onSubmit={handleSubmit} className="bg-card p-4 sm:p-6 lg:p-8 rounded-xl shadow-sm border border-border space-y-8 relative">
                {isSubmitting && (
                    <div className="absolute inset-0 bg-white/50 dark:bg-slate-900/50 backdrop-blur-[2px] z-10 flex items-center justify-center rounded-xl">
                        <div className="flex flex-col items-center">
                            <Loader2 className="animate-spin text-brand-600 mb-2" size={40} />
                            <span className="text-sm font-bold text-main">Submitting...</span>
                        </div>
                    </div>
                )}

                {/* Basic Info Section */}
                <div className="space-y-6">
                    <h3 className="text-lg font-bold text-main border-b border-border pb-2">Event Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className={labelClass}>Event Title <span className="text-red-500">*</span></label>
                            <input
                                required
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                className={inputClass}
                                disabled={isSubmitting}
                                placeholder="e.g. Campus Cleanliness Drive"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className={labelClass}>From Date <span className="text-red-500">*</span></label>
                                <input
                                    required
                                    type="date"
                                    name="fromDate"
                                    min={minDate}
                                    value={formData.fromDate}
                                    onChange={handleInputChange}
                                    className={inputClass}
                                    disabled={isSubmitting}
                                />
                            </div>
                            <div>
                                <label className={labelClass}>To Date <span className="text-red-500">*</span></label>
                                <input
                                    required
                                    type="date"
                                    name="toDate"
                                    min={formData.fromDate || minDate}
                                    value={formData.toDate}
                                    onChange={handleInputChange}
                                    className={inputClass}
                                    disabled={isSubmitting}
                                />
                            </div>
                            <p className="text-xs text-muted mt-1 col-span-2">Events older than 1 month cannot be submitted.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className={labelClass}>Type of Event <span className="text-red-500">*</span></label>
                            <select
                                name="type"
                                value={formData.type}
                                onChange={handleInputChange}
                                className={inputClass}
                                disabled={isSubmitting}
                            >
                                <option value="Awareness">Awareness</option>
                                <option value="Implementation">Implementation</option>
                                <option value="Innovation">Innovation</option>
                                <option value="Research">Research</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <div>
                            <label className={labelClass}>Number of Participants <span className="text-red-500">*</span></label>
                            <input
                                required
                                type="number"
                                name="participants"
                                min="0"
                                value={formData.participants}
                                onChange={handleInputChange}
                                className={inputClass}
                                disabled={isSubmitting}
                            />
                        </div>
                    </div>

                    <div>
                        <label className={labelClass}>Description & Objectives (In detail) <span className="text-red-500">*</span></label>
                        <textarea
                            required
                            name="description"
                            rows={3}
                            value={formData.description}
                            onChange={handleInputChange}
                            className={inputClass}
                            disabled={isSubmitting}
                            placeholder="Briefly describe the event and what you aimed to achieve..."
                        />
                    </div>

                    <div>
                        <label className={labelClass}>Actions Taken regarding Sustainability (In detail) <span className="text-red-500">*</span></label>
                        <textarea
                            required
                            name="actionsTaken"
                            rows={3}
                            value={formData.actionsTaken}
                            onChange={handleInputChange}
                            className={inputClass}
                            disabled={isSubmitting}
                            placeholder="List the specific steps, activities, or measures taken during the event..."
                        />
                    </div>
                </div>

                {/* SDG Section */}
                <div className="space-y-4">
                    <h3 className="text-lg font-bold text-main border-b border-border pb-2">Sustainability Impact</h3>
                    <div>
                        <label className={labelClass}>Targeted SDGs (Click to select) <span className="text-red-500">*</span></label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mt-2">
                            {SDG_LIST.map(sdg => {
                                const isSelected = formData.sdgs.includes(sdg);
                                return (
                                    <button
                                        key={sdg}
                                        type="button"
                                        disabled={isSubmitting}
                                        onClick={() => toggleSDG(sdg)}
                                        className={`
                                flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium border text-left transition-all
                                ${isSelected
                                                ? 'bg-brand-600 text-white border-brand-600 shadow-sm transform scale-[1.01]'
                                                : 'bg-page text-muted border-border hover:bg-slate-100 dark:hover:bg-slate-700'}
                                ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}
                            `}
                                    >
                                        <span className="truncate mr-2">{sdg}</span>
                                        {isSelected && <Check size={14} className="flex-shrink-0" />}
                                    </button>
                                );
                            })}
                        </div>
                        {formData.sdgs.length === 0 && (
                            <p className="text-xs text-red-500 mt-2">Please select at least one SDG.</p>
                        )}
                    </div>
                </div>

                {/* Proof Section */}
                <div className="space-y-4">
                    <h3 className="text-lg font-bold text-main border-b border-border pb-2">Proof & Documentation</h3>

                    <div className="flex flex-wrap gap-6">
                        {/* 1. Cover Page Upload */}
                        {renderUploadBlock('1. Cover Photo (For Event Card)', 'imageUrl', <ImageIcon size={32} className="mb-2 text-slate-400" />, "image/*", true)}
                    </div>

                    {/* 2. Photos Drive Link */}
                    <div>
                        <label className={labelClass}>2. Additional Photos (Drive Link) <span className="text-slate-400 font-normal">(Optional)</span></label>
                        <div className="relative">
                            <LinkIcon className="absolute left-3 top-3 text-slate-400" size={18} />
                            <input
                                type="url"
                                name="proofLink"
                                value={formData.proofLink}
                                onChange={handleInputChange}
                                className={`${inputClass} pl-10`}
                                placeholder="https://drive.google.com/..."
                                disabled={isSubmitting}
                            />
                        </div>
                        <p className="text-xs text-muted mt-1">Paste a link to a Google Drive folder containing event photos.</p>
                    </div>
                </div>

                <div className="pt-4 flex justify-end">
                    <button
                        type="submit"
                        disabled={isSubmitting || uploadingField !== null}
                        className={`
                    w-full sm:w-auto font-medium py-3 px-8 rounded-lg shadow-md transition-colors duration-200 flex items-center justify-center
                    ${isSubmitting || uploadingField !== null ? 'bg-slate-300 text-slate-500 cursor-not-allowed dark:bg-slate-700' : 'bg-brand-600 hover:bg-brand-700 text-white'}
                `}
                    >
                        {isSubmitting ? 'Submitting...' : 'Submit Event'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default SubmitEvent;