
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useJCS } from '../services/JCSContext';
import { Calendar, Tag, Filter, Users, X, ExternalLink, MessageSquare, CheckCircle2, FileText, Info, Image as ImageIcon, Search } from 'lucide-react';

// Reusable Skeleton Component
const Skeleton = ({ className }: { className?: string }) => (
    <div className={`relative overflow-hidden bg-slate-200 dark:bg-slate-700/50 rounded-lg ${className}`}>
        <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/40 dark:via-white/10 to-transparent z-10"></div>
    </div>
);

const EventGallery = ({ myEventsOnly = false }) => {
    const { events, currentUser, editEvent } = useJCS();
    const [filterType, setFilterType] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedEvent, setSelectedEvent] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Edit Mode State
    const [isEditingEvent, setIsEditingEvent] = useState(false);
    const [editForm, setEditForm] = useState<any>(null);

    useEffect(() => {
        // Simulate loading
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    let displayEvents = myEventsOnly
        ? events.filter(e => e.departmentId === currentUser.departmentId)
        : events;

    if (filterType !== 'All') {
        displayEvents = displayEvents.filter(e => e.type === filterType);
    }

    if (searchQuery) {
        const query = searchQuery.toLowerCase();
        displayEvents = displayEvents.filter(e =>
            e.title.toLowerCase().includes(query) ||
            e.description.toLowerCase().includes(query) ||
            e.departmentName.toLowerCase().includes(query)
        );
    }

    // Sort by date descending
    displayEvents.sort((a, b) => new Date(b.fromDate).getTime() - new Date(a.fromDate).getTime());

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Approved': return 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800';
            case 'Rejected': return 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800';
            case 'Under Review': return 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800';
            default: return 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:border-slate-600';
        }
    };

    if (isLoading) {
        return (
            <div className="space-y-6 select-none">
                <div className="flex justify-between items-center gap-4">
                    <div className="space-y-2">
                        <Skeleton className="h-8 w-48" />
                        <Skeleton className="h-4 w-64" />
                    </div>
                    <Skeleton className="h-9 w-32 rounded-lg" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="bg-card rounded-xl overflow-hidden border border-border shadow-sm">
                            <Skeleton className="h-48 w-full rounded-none" />
                            <div className="p-5 space-y-4">
                                <div className="flex justify-between">
                                    <Skeleton className="h-5 w-20 rounded-full" />
                                    <Skeleton className="h-5 w-24 rounded-full" />
                                </div>
                                <Skeleton className="h-6 w-3/4" />
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-2/3" />
                                </div>
                                <div className="pt-4 border-t border-border flex justify-between">
                                    <Skeleton className="h-5 w-24" />
                                    <Skeleton className="h-5 w-24" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 select-none w-full max-w-[1400px] mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-xl md:text-2xl font-bold text-main">{myEventsOnly ? 'My Department Events' : 'Event Gallery'}</h2>
                    <p className="text-muted text-sm mt-1">
                        {myEventsOnly ? 'Track the status of your submissions.' : 'Showcasing sustainability efforts across campus.'}
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                    {/* Scoped Style for Search Input Override */}
                    <style>{`
                        .search-input-no-ring:focus,
                        .search-input-no-ring:focus-visible {
                            outline: none !important;
                            box-shadow: none !important;
                            border: none !important;
                            ring: 0 !important;
                        }
                    `}</style>
                    {/* Search Input */}
                    <div className="flex items-center bg-card border border-border rounded-lg px-3 py-2 shadow-sm flex-1 sm:flex-initial focus-within:ring-0 focus-within:outline-none focus-within:border-border" style={{ outline: 'none', boxShadow: 'none' }}>
                        <Search size={16} className="text-muted mr-2" />
                        <input
                            type="text"
                            placeholder="Search events..."
                            className="search-input-no-ring bg-transparent appearance-none border-none p-0 text-sm text-main focus:ring-0 focus:outline-none !outline-none !border-none !ring-0 active:outline-none focus:border-transparent focus-visible:outline-none focus-visible:ring-0 w-full sm:w-48 placeholder:text-muted/70 shadow-none focus:shadow-none"
                            style={{ outline: 'none', boxShadow: 'none', border: 'none', background: 'transparent' }}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        {searchQuery && (
                            <button onClick={() => setSearchQuery('')} className="text-muted hover:text-main">
                                <X size={14} />
                            </button>
                        )}
                    </div>

                    {/* Filter Dropdown */}
                    <div className="flex items-center bg-card border border-border rounded-lg px-2 py-1 shadow-sm sm:w-auto">
                        <Filter size={16} className="text-muted ml-2 mr-1" />
                        <select
                            className="bg-transparent border-none text-sm text-main focus:ring-0 cursor-pointer py-1 outline-none w-full sm:w-auto"
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                        >
                            <option value="All" className="bg-card">All Types</option>
                            <option value="Awareness" className="bg-card">Awareness</option>
                            <option value="Implementation" className="bg-card">Implementation</option>
                            <option value="Innovation" className="bg-card">Innovation</option>
                            <option value="Research" className="bg-card">Research</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayEvents.map((event, index) => {
                    const isApproved = event.status === 'Approved';

                    return (
                        <div
                            key={event.id}
                            onClick={() => setSelectedEvent(event)}
                            className={`
                        bg-card rounded-xl overflow-hidden flex flex-col cursor-pointer
                        transition-all duration-300 ease-in-out
                        animate-fade-in group
                        ${isApproved
                                    ? 'border-2 border-green-500/20 dark:border-green-500/30 shadow-lg shadow-green-100/50 dark:shadow-green-900/20 hover:scale-[1.02] hover:border-green-500/40'
                                    : 'border border-border shadow-sm hover:shadow-md hover:-translate-y-1'
                                }
                    `}
                            style={{ animationDelay: `${index * 50}ms` }}
                        >
                            <div className="h-48 bg-page relative overflow-hidden">
                                <img
                                    src={event.imageUrl}
                                    alt={event.title}
                                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                                />

                                {/* Status Badge */}
                                <div className="absolute top-3 right-3 z-10">
                                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider border shadow-sm bg-opacity-90 backdrop-blur-sm
                                        ${event.status === 'Rejected'
                                            ? 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/80 dark:text-red-300 dark:border-red-800'
                                            : event.credits > 0
                                                ? 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/80 dark:text-green-300 dark:border-green-800'
                                                : 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/80 dark:text-yellow-300 dark:border-yellow-800'
                                        }
                                    `}>
                                        {event.status === 'Rejected' ? 'Rejected' : event.credits > 0 ? 'Reviewed' : 'Pending'}
                                    </span>
                                </div>

                                {/* Overlay department name on hover for cleaner look */}
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                                    <p className="text-white font-bold text-sm truncate">{event.departmentName}</p>
                                </div>
                            </div>
                            <div className="p-5 flex flex-col flex-1">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-[10px] font-bold text-muted uppercase tracking-wider bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                                        {event.type}
                                    </span>
                                    <span className="text-xs text-muted flex items-center">
                                        <Calendar size={12} className="mr-1" /> {event.fromDate === event.toDate ? event.fromDate : `${event.fromDate} - ${event.toDate}`}
                                    </span>
                                </div>

                                <h3 className="text-lg font-bold text-main mb-2 leading-tight group-hover:text-brand-600 transition-colors">
                                    {event.title}
                                </h3>

                                <p className="text-sm text-muted line-clamp-2 mb-4 flex-1">
                                    {event.description}
                                </p>

                                <div className="pt-4 border-t border-border flex items-center justify-between mt-auto">
                                    <div className="flex items-center text-xs font-medium text-main">
                                        <Users size={14} className="mr-1.5 text-brand-500" />
                                        {event.participants} Participants
                                    </div>
                                    <div className="flex items-center text-xs font-medium text-main">
                                        <Tag size={14} className="mr-1.5 text-blue-500" />
                                        {event.credits || 0} Credits
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Detail Modal - Rendered via Portal to escape stacking contexts */}
            {selectedEvent && createPortal(
                <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 sm:p-6">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity"
                        onClick={() => { setSelectedEvent(null); setIsEditingEvent(false); }}
                    />

                    {/* Modal Content */}
                    <div className="bg-card rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative z-10 animate-scale-up flex flex-col [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                        <div className="relative h-64 sm:h-80 shrink-0">
                            <img src={selectedEvent.imageUrl} alt={selectedEvent.title} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                            <button
                                onClick={() => setSelectedEvent(null)}
                                className="absolute top-4 right-4 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full backdrop-blur-sm transition-all"
                            >
                                <X size={20} />
                            </button>
                            <div className="absolute bottom-0 left-0 p-6 sm:p-8">
                                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3 ${getStatusColor(selectedEvent.status)}`}>
                                    {selectedEvent.status}
                                </span>
                                <h2 className="text-2xl sm:text-4xl font-black text-white leading-tight mb-2">{selectedEvent.title}</h2>
                                <p className="text-white/90 font-medium text-lg">{selectedEvent.departmentName}</p>
                            </div>
                        </div>

                        <div className="p-6 sm:p-8 space-y-8">
                            {/* Stats Row */}
                            <div className="flex flex-wrap gap-4 sm:gap-8 pb-6 border-b border-border">
                                <div className="flex items-center">
                                    <div className="p-2 bg-brand-100 dark:bg-brand-900/30 text-brand-600 rounded-lg mr-3">
                                        <Calendar size={20} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted font-bold uppercase">Date</p>
                                        <p className="font-semibold text-main">
                                            {selectedEvent.fromDate === selectedEvent.toDate ? selectedEvent.fromDate : `${selectedEvent.fromDate} to ${selectedEvent.toDate}`}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-lg mr-3">
                                        <Users size={20} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted font-bold uppercase">Participants</p>
                                        <p className="font-semibold text-main">{selectedEvent.participants}</p>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <div className="p-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-lg mr-3">
                                        <Tag size={20} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted font-bold uppercase">Credits</p>
                                        <p className="font-semibold text-main">{selectedEvent.credits} Pts</p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                <div className="lg:col-span-2 space-y-6">
                                    {isEditingEvent && editForm ? (
                                        <div className="space-y-4 animate-fade-in">
                                            <div>
                                                <label className="block text-sm font-bold text-main mb-1">Description</label>
                                                <textarea
                                                    className="w-full p-2 rounded-lg border border-border bg-page text-main h-32"
                                                    value={editForm.description}
                                                    onChange={e => setEditForm({ ...editForm, description: e.target.value })}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-main mb-1">Actions Taken</label>
                                                <textarea
                                                    className="w-full p-2 rounded-lg border border-border bg-page text-main h-32"
                                                    value={editForm.actionsTaken || ''}
                                                    onChange={e => setEditForm({ ...editForm, actionsTaken: e.target.value })}
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-bold text-main mb-1">Participants</label>
                                                    <input
                                                        type="number"
                                                        className="w-full p-2 rounded-lg border border-border bg-page text-main"
                                                        value={editForm.participants}
                                                        onChange={e => setEditForm({ ...editForm, participants: parseInt(e.target.value) || 0 })}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-bold text-main mb-1">From Date</label>
                                                    <input
                                                        type="date"
                                                        className="w-full p-2 rounded-lg border border-border bg-page text-main"
                                                        value={editForm.fromDate}
                                                        onChange={e => setEditForm({ ...editForm, fromDate: e.target.value })}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-bold text-main mb-1">To Date</label>
                                                    <input
                                                        type="date"
                                                        className="w-full p-2 rounded-lg border border-border bg-page text-main"
                                                        value={editForm.toDate}
                                                        onChange={e => setEditForm({ ...editForm, toDate: e.target.value })}
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex justify-end gap-2 pt-4">
                                                <button
                                                    onClick={() => setIsEditingEvent(false)}
                                                    className="px-4 py-2 text-sm font-medium text-muted hover:text-main"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    onClick={async () => {
                                                        await editEvent(selectedEvent.id, editForm);
                                                        setIsEditingEvent(false);
                                                        setSelectedEvent({ ...selectedEvent, ...editForm });
                                                    }}
                                                    className="px-4 py-2 text-sm font-bold bg-brand-600 text-white rounded-lg hover:bg-brand-700"
                                                >
                                                    Save Changes
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <div>
                                                <h3 className="text-lg font-bold text-main mb-3 flex items-center"><Info size={18} className="mr-2 text-brand-500" /> Description</h3>
                                                <p className="text-muted leading-relaxed whitespace-pre-wrap">{selectedEvent.description}</p>
                                            </div>

                                            <div>
                                                <h3 className="text-lg font-bold text-main mb-3 flex items-center"><CheckCircle2 size={18} className="mr-2 text-green-500" /> Actions Taken</h3>
                                                <p className="text-muted leading-relaxed whitespace-pre-wrap">{selectedEvent.actionsTaken || "No specific actions details provided."}</p>
                                            </div>

                                            {/* Admin Feedback Section */}
                                            {selectedEvent.feedback && (
                                                <div className="bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4">
                                                    <h4 className="text-sm font-bold text-yellow-800 dark:text-yellow-400 mb-2 flex items-center">
                                                        <MessageSquare size={16} className="mr-2" /> Admin Feedback
                                                    </h4>
                                                    <p className="text-sm text-yellow-900 dark:text-yellow-200 italic">"{selectedEvent.feedback}"</p>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>

                                <div className="space-y-6">
                                    {/* SDGs */}
                                    <div className="bg-page rounded-xl p-5 border border-border">
                                        <h4 className="text-sm font-bold text-main uppercase tracking-wider mb-4">SDG Impact</h4>
                                        <div className="flex flex-col gap-2">
                                            {selectedEvent.sdgs.map((sdg: string) => (
                                                <div key={sdg} className="text-xs font-medium px-3 py-2 bg-card border border-border rounded-lg shadow-sm w-full flex items-center">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-brand-500 mr-2 shrink-0"></span>
                                                    {sdg}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Documentation / Proofs */}
                                    <div className="bg-blue-50 dark:bg-blue-900/10 rounded-xl p-5 border border-blue-100 dark:border-blue-800">
                                        <h4 className="text-sm font-bold text-blue-900 dark:text-blue-300 uppercase tracking-wider mb-4">Documentation</h4>
                                        <div className="space-y-3">
                                            {selectedEvent.reportUrl && (
                                                <a href={selectedEvent.reportUrl} target="_blank" rel="noreferrer" className="flex items-center p-3 bg-white dark:bg-slate-800 rounded-lg border border-blue-200 dark:border-blue-700 shadow-sm hover:text-blue-600 transition-colors">
                                                    <FileText size={18} className="mr-3 text-red-500" />
                                                    <div className="overflow-hidden">
                                                        <div className="text-sm font-bold truncate">Event Report</div>
                                                        <div className="text-[10px] text-muted">Click to view document</div>
                                                    </div>
                                                </a>
                                            )}
                                            {selectedEvent.imageUrl && (
                                                <a href={selectedEvent.imageUrl} target="_blank" rel="noreferrer" className="flex items-center p-3 bg-white dark:bg-slate-800 rounded-lg border border-blue-200 dark:border-blue-700 shadow-sm hover:text-blue-600 transition-colors">
                                                    <ImageIcon size={18} className="mr-3 text-brand-500" />
                                                    <div className="overflow-hidden">
                                                        <div className="text-sm font-bold truncate">Cover Photo</div>
                                                        <div className="text-[10px] text-muted">View full size image</div>
                                                    </div>
                                                </a>
                                            )}
                                            {selectedEvent.proofLink && (
                                                <a href={selectedEvent.proofLink} target="_blank" rel="noreferrer" className="flex items-center p-3 bg-white dark:bg-slate-800 rounded-lg border border-blue-200 dark:border-blue-700 shadow-sm hover:text-blue-600 transition-colors">
                                                    <ExternalLink size={18} className="mr-3 text-blue-500" />
                                                    <div className="overflow-hidden">
                                                        <div className="text-sm font-bold truncate">External Proof</div>
                                                        <div className="text-[10px] text-muted">Google Drive / Doc Link</div>
                                                    </div>
                                                </a>
                                            )}
                                            {!selectedEvent.imageUrl && !selectedEvent.proofLink && !selectedEvent.reportUrl && (
                                                <div className="text-xs text-blue-800/60 dark:text-blue-300/60 italic text-center py-2">
                                                    No documentation attached.
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Edit Button for Coordinators */}
                                    {!isEditingEvent && currentUser?.role === 'Coordinator' && currentUser.departmentId === selectedEvent.departmentId && (
                                        <button
                                            onClick={() => {
                                                setEditForm(selectedEvent);
                                                setIsEditingEvent(true);
                                            }}
                                            className="w-full mt-4 py-2 border border-brand-200 text-brand-600 font-bold rounded-lg hover:bg-brand-50 transition-colors"
                                        >
                                            Edit Event Details
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
};

export default EventGallery;