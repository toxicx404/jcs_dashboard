
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useJCS } from '../services/JCSContext';
import { useToast } from '../components/ToastContext';
import { Check, X, AlertCircle, FileText, Calendar, Trash2, Plus, Building2, Square, CheckSquare, Layers, Activity, Clock, Users, BarChart3, AlertTriangle, TrendingUp, CheckCircle, ExternalLink, Download, Search, Filter, Mail, Phone, Globe } from 'lucide-react';
import { Event } from '../types';

const AdminPanel = () => {
    const { getPendingEvents, updateEventStatus, bulkUpdateEventStatus, departments, addDepartment, removeDepartment, events, currentUser } = useJCS();

    // We now use all events for grading, filtered by those needing attention (credits === 0).
    // Sorting by date descending by default
    const allEventsSorted = events.filter(e => e.credits === 0).sort((a, b) => new Date(b.fromDate).getTime() - new Date(a.fromDate).getTime());

    // Pending for grading is aligned with credit-based filter to avoid status mismatches
    const pendingCount = allEventsSorted.length;

    // Tabs state - Default to Monitor for overview
    const [activeTab, setActiveTab] = useState('monitor');

    // Selection State
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [actionMessage, setActionMessage] = useState<string | null>(null);

    // Review Event / Bulk Review State
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null); // Single event object or null
    const [isBulkAction, setIsBulkAction] = useState(false);  // Flag for bulk mode
    const [credits, setCredits] = useState(10);
    const [feedback, setFeedback] = useState('');

    // Add Department State
    const [showAddDeptModal, setShowAddDeptModal] = useState(false);
    const [newDept, setNewDept] = useState({ name: '', coordinatorName: '' });

    // Clear summary message after 3 seconds
    useEffect(() => {
        if (actionMessage) {
            const timer = setTimeout(() => setActionMessage(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [actionMessage]);

    // Partnerships State
    const [partnerships, setPartnerships] = useState<any[]>([]);
    const [viewPartnership, setViewPartnership] = useState<any | null>(null);

    useEffect(() => {
        if (activeTab === 'partnerships') {
            const fetchPartnerships = async () => {
                try {
                    const data = await import('../services/api').then(m => m.api.getPartnerships());
                    setPartnerships(data);
                } catch (error) {
                    console.error("Failed to fetch partnerships", error);
                }
            };
            fetchPartnerships();
        }
    }, [activeTab]);

    // --- Monitor Calculations ---
    const totalSchools = departments.length;
    const activeSchools = departments.filter(d => d.eventCount > 0).length;
    const inactiveSchoolsList = departments.filter(d => d.eventCount === 0);
    const totalParticipants = events.filter(e => e.status === 'Approved').reduce((acc, e) => acc + e.participants, 0);
    const systemCredits = departments.reduce((acc, d) => acc + d.totalCredits, 0);

    // Get 5 most recent events
    const recentActivity = [...events].sort((a, b) => new Date(b.submissionDate).getTime() - new Date(a.submissionDate).getTime()).slice(0, 5);


    // --- Selection Handlers ---
    const toggleSelectAll = () => {
        if (selectedIds.length === allEventsSorted.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(allEventsSorted.map(e => e.id));
        }
    };

    const toggleSelectOne = (id: string) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter(sId => sId !== id));
        } else {
            setSelectedIds([...selectedIds, id]);
        }
    };

    // --- Event Approval Handlers ---
    const handleSingleReview = (event: Event) => {
        setSelectedEvent(event);
        setIsBulkAction(false);
        setCredits(event.credits > 0 ? event.credits : 20); // Default credit suggestion
        setFeedback(event.feedback || '');
    };

    const handleBulkReview = () => {
        if (selectedIds.length === 0) return;
        setSelectedEvent(null);
        setIsBulkAction(true);
        setCredits(10);
        setFeedback('');
    };

    const handleUpdateCredits = () => {
        if (isBulkAction) {
            // Bulk update credits only (status remains Approved)
            bulkUpdateEventStatus(selectedIds, 'Approved', credits, feedback);
            setActionMessage(`Updated credits for ${selectedIds.length} events.`);
            setSelectedIds([]);
            setIsBulkAction(false);
        } else if (selectedEvent) {
            updateEventStatus(selectedEvent.id, 'Approved', credits, feedback);
            setActionMessage(`Updated credits for: ${selectedEvent.title}`);
            setSelectedEvent(null);
        }
    };

    // --- Department Management Handlers ---
    const handleAddDeptSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newDept.name) {
            // Auto-generate code from name (First letter of each word)
            const generatedCode = newDept.name.match(/\b(\w)/g)?.join('').toUpperCase() || 'NA';

            addDepartment({
                ...newDept,
                code: generatedCode
            });
            setNewDept({ name: '', coordinatorName: '' });
            setShowAddDeptModal(false);
        }
    };

    // Enforce credit limits
    const handleCreditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = parseInt(e.target.value) || 0;
        setCredits(Math.min(100, Math.max(0, val)));
    };

    const isAllSelected = allEventsSorted.length > 0 && selectedIds.length === allEventsSorted.length;

    return (
        <div className="space-y-6 animate-fade-in relative select-none w-full max-w-[1400px] mx-auto">
            {/* Action Toast */}
            {actionMessage && (
                <div className="fixed top-20 right-4 z-[110] bg-slate-900 text-white px-4 py-3 md:px-6 md:py-3 rounded-lg shadow-xl animate-fade-in flex items-center text-sm md:text-base max-w-[90vw]">
                    <Check className="mr-2 text-green-400 flex-shrink-0" size={18} />
                    {actionMessage}
                </div>
            )}

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl md:text-2xl font-bold text-main">Admin Control Panel</h2>
                    <p className="text-muted text-sm mt-1">Monitor system health, review events, and manage schools.</p>
                </div>

                {/* Tab Navigation */}
                <div className="flex bg-slate-100 dark:bg-slate-700 p-1 rounded-lg self-start md:self-auto overflow-x-auto max-w-full">
                    <button
                        onClick={() => setActiveTab('monitor')}
                        className={`px-3 md:px-4 py-2 rounded-md text-sm font-medium transition-all whitespace-nowrap flex items-center ${activeTab === 'monitor' ? 'bg-card text-brand-700 shadow-sm' : 'text-muted hover:text-main'}`}
                    >
                        <Activity size={16} className="mr-2" />
                        System Monitor
                    </button>
                    <button
                        onClick={() => setActiveTab('manage')}
                        className={`px-3 md:px-4 py-2 rounded-md text-sm font-medium transition-all whitespace-nowrap flex items-center ${activeTab === 'manage' ? 'bg-card text-brand-700 shadow-sm' : 'text-muted hover:text-main'}`}
                    >
                        <Layers size={16} className="mr-2" />
                        Manage Events
                    </button>
                    <button
                        onClick={() => setActiveTab('approvals')}
                        className={`px-3 md:px-4 py-2 rounded-md text-sm font-medium transition-all whitespace-nowrap flex items-center relative ${activeTab === 'approvals' ? 'bg-card text-brand-700 shadow-sm' : 'text-muted hover:text-main'}`}
                    >
                        <CheckSquare size={16} className="mr-2" />
                        Event Grading
                        {pendingCount > 0 && (
                            <span className="ml-2 inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold rounded-full bg-red-500 text-white">
                                {pendingCount}
                            </span>
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab('schools')}
                        className={`px-3 md:px-4 py-2 rounded-md text-sm font-medium transition-all whitespace-nowrap flex items-center ${activeTab === 'schools' ? 'bg-card text-brand-700 shadow-sm' : 'text-muted hover:text-main'}`}
                    >
                        <Building2 size={16} className="mr-2" />
                        Manage Schools
                    </button>
                    <button
                        onClick={() => setActiveTab('users')}
                        className={`px-3 md:px-4 py-2 rounded-md text-sm font-medium transition-all whitespace-nowrap flex items-center ${activeTab === 'users' ? 'bg-card text-brand-700 shadow-sm' : 'text-muted hover:text-main'}`}
                    >
                        <Users size={16} className="mr-2" />
                        Users
                    </button>
                    <button
                        onClick={() => setActiveTab('partnerships')}
                        className={`px-3 md:px-4 py-2 rounded-md text-sm font-medium transition-all whitespace-nowrap flex items-center ${activeTab === 'partnerships' ? 'bg-card text-brand-700 shadow-sm' : 'text-muted hover:text-main'}`}
                    >
                        <Building2 size={16} className="mr-2" />
                        Partnerships
                    </button>
                </div>
            </div>

            {activeTab === 'monitor' && (
                <div className="space-y-6 animate-fade-in">
                    {/* KPI Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-card p-5 rounded-xl border border-border shadow-sm flex items-start justify-between">
                            <div>
                                <p className="text-xs font-bold text-muted uppercase tracking-wider">Total Schools</p>
                                <h3 className="text-2xl font-black text-main mt-1">{totalSchools}</h3>
                                <p className="text-xs text-green-600 mt-1 flex items-center"><CheckCircle size={10} className="mr-1" /> {activeSchools} Active</p>
                            </div>
                            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-lg">
                                <Building2 size={20} />
                            </div>
                        </div>

                        <div className="bg-card p-5 rounded-xl border border-border shadow-sm flex items-start justify-between">
                            <div>
                                <p className="text-xs font-bold text-muted uppercase tracking-wider">Pending Grading</p>
                                <h3 className="text-2xl font-black text-main mt-1">{events.filter(e => e.credits === 0).length}</h3>
                                {events.some(e => e.credits === 0) ? (
                                    <p className="text-xs text-orange-500 mt-1 flex items-center"><Clock size={10} className="mr-1" /> Needs Attention</p>
                                ) : (
                                    <p className="text-xs text-green-600 mt-1 flex items-center"><CheckCircle size={10} className="mr-1" /> All Caught Up</p>
                                )}
                            </div>
                            <div className={`p-2 rounded-lg ${events.some(e => e.credits === 0) ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-600' : 'bg-green-100 dark:bg-green-900/30 text-green-600'}`}>
                                {events.some(e => e.credits === 0) ? <AlertCircle size={20} /> : <CheckCircle size={20} />}
                            </div>
                        </div>

                        <div className="bg-card p-5 rounded-xl border border-border shadow-sm flex items-start justify-between">
                            <div>
                                <p className="text-xs font-bold text-muted uppercase tracking-wider">Total Impact</p>
                                <h3 className="text-2xl font-black text-main mt-1">{totalParticipants}</h3>
                                <p className="text-xs text-muted mt-1">Students Engaged</p>
                            </div>
                            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-lg">
                                <Users size={20} />
                            </div>
                        </div>

                        <div className="bg-card p-5 rounded-xl border border-border shadow-sm flex items-start justify-between">
                            <div>
                                <p className="text-xs font-bold text-muted uppercase tracking-wider">System Credits</p>
                                <h3 className="text-2xl font-black text-main mt-1">{systemCredits}</h3>
                                <p className="text-xs text-green-600 mt-1 flex items-center"><TrendingUp size={10} className="mr-1" /> All Time</p>
                            </div>
                            <div className="p-2 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-lg">
                                <BarChart3 size={20} />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Recent Activity Feed */}
                        <div className="lg:col-span-2 bg-card rounded-xl border border-border shadow-sm overflow-hidden">
                            <div className="p-4 border-b border-border flex justify-between items-center">
                                <h3 className="font-bold text-main flex items-center"><Activity size={18} className="mr-2 text-brand-600" /> Live Activity Feed</h3>
                                <span className="text-xs text-muted">Latest Updates</span>
                            </div>
                            <div className="divide-y divide-border">
                                {recentActivity.map(event => (
                                    <div key={event.id} className="p-4 flex items-start gap-4 hover:bg-page transition-colors">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${event.status === 'Approved' ? 'bg-green-100 text-green-600 dark:bg-green-900/20' :
                                            event.status === 'Rejected' ? 'bg-red-100 text-red-600 dark:bg-red-900/20' :
                                                'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20'
                                            }`}>
                                            {event.status === 'Approved' ? <Check size={14} /> :
                                                event.status === 'Rejected' ? <X size={14} /> : <Clock size={14} />}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm text-main font-medium">
                                                <span className="font-bold">{event.departmentName}</span> submitted <span className="font-bold">"{event.title}"</span>
                                            </p>
                                            <p className="text-xs text-muted mt-0.5 flex items-center">
                                                {event.submissionDate} • {event.type} •
                                                <span className={`ml-1 font-bold ${event.status === 'Approved' ? 'text-green-600' :
                                                    event.status === 'Rejected' ? 'text-red-500' : 'text-yellow-600'
                                                    }`}>{event.status}</span>
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => handleSingleReview(event)}
                                            className="text-xs bg-page hover:bg-slate-200 dark:hover:bg-slate-700 px-2 py-1 rounded border border-border text-main transition-colors"
                                        >
                                            Review
                                        </button>
                                    </div>
                                ))}
                                {recentActivity.length === 0 && (
                                    <div className="p-8 text-center text-muted">No recent activity found.</div>
                                )}
                            </div>
                        </div>

                        {/* Compliance Watchlist */}
                        <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden flex flex-col">
                            <div className="p-4 border-b border-border bg-red-50 dark:bg-red-900/10">
                                <h3 className="font-bold text-red-800 dark:text-red-300 flex items-center">
                                    <AlertTriangle size={18} className="mr-2" /> Compliance Watch
                                </h3>
                            </div>
                            <div className="p-4 flex-1">
                                <p className="text-xs text-muted mb-3 font-medium uppercase tracking-wide">Inactive Schools (0 Events)</p>
                                {inactiveSchoolsList.length > 0 ? (
                                    <div className="space-y-2">
                                        {inactiveSchoolsList.slice(0, 5).map(dept => (
                                            <div key={dept.id} className="flex items-center justify-between p-2 rounded bg-page border border-border">
                                                <span className="text-sm font-medium text-main truncate max-w-[150px]" title={dept.name}>{dept.name}</span>
                                                <span className="text-[10px] px-2 py-0.5 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded-full font-bold">Action Needed</span>
                                            </div>
                                        ))}
                                        {inactiveSchoolsList.length > 5 && (
                                            <p className="text-xs text-center text-muted mt-2">+{inactiveSchoolsList.length - 5} more inactive schools</p>
                                        )}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-32 text-green-600">
                                        <CheckSquare size={32} className="mb-2 opacity-50" />
                                        <p className="text-sm font-bold">All Schools Active!</p>
                                    </div>
                                )}
                            </div>
                            <div className="p-4 border-t border-border bg-page/50">
                                <button
                                    onClick={() => setActiveTab('schools')}
                                    className="w-full py-2 text-xs font-bold text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-900/20 rounded border border-transparent hover:border-brand-200 transition-colors"
                                >
                                    Manage Schools
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'manage' && <ManageEventsTab />}

            {activeTab === 'approvals' && (
                <div className="animate-fade-in space-y-4">
                    {/* Bulk Action Bar - Only shows when items are selected */}
                    {selectedIds.length > 0 && (
                        <div className="sticky top-0 z-20 bg-brand-50 dark:bg-brand-900/20 border border-brand-200 dark:border-brand-800 p-3 rounded-lg flex items-center justify-between shadow-sm animate-fade-in">
                            <div className="flex items-center text-brand-800 dark:text-brand-300 font-medium px-2">
                                <Layers size={18} className="mr-2 flex-shrink-0" />
                                <span className="text-xs sm:text-sm whitespace-nowrap">{selectedIds.length} Selected</span>
                            </div>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => setSelectedIds([])}
                                    className="px-3 py-1.5 text-xs font-medium text-muted hover:text-main hover:bg-white/50 rounded transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleBulkReview}
                                    className="px-4 py-1.5 text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 rounded shadow-sm transition-colors flex items-center"
                                >
                                    Bulk Action
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
                        {allEventsSorted.length === 0 ? (
                            <div className="p-8 md:p-12 text-center text-muted">
                                <div className="w-12 h-12 md:w-16 md:h-16 bg-page rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Check size={24} className="md:w-8 md:h-8 text-green-500" />
                                </div>
                                <h3 className="text-lg font-bold text-main mb-2">All Caught Up!</h3>
                                <p className="text-sm">There are no new events pending grading.</p>
                            </div>
                        ) : (
                            <div>
                                {/* List Header with Select All */}
                                <div className="bg-page border-b border-border px-4 md:px-6 py-3 flex items-center">
                                    <button
                                        onClick={toggleSelectAll}
                                        className="flex items-center text-muted hover:text-brand-600 transition-colors mr-4 select-none"
                                        title="Select All"
                                    >
                                        {isAllSelected ? (
                                            <CheckSquare size={20} className="text-brand-600" />
                                        ) : (
                                            <Square size={20} />
                                        )}
                                        <span className="ml-2 text-xs font-bold uppercase tracking-wider">Select All</span>
                                    </button>
                                </div>

                                <div className="divide-y divide-border">
                                    {allEventsSorted.map(event => {
                                        const isSelected = selectedIds.includes(event.id);
                                        return (
                                            <div key={event.id} className={`p-4 md:p-6 transition-colors ${isSelected ? 'bg-brand-50/50 dark:bg-brand-900/10' : 'hover:bg-page'}`}>
                                                <div className="flex flex-row items-start gap-4">
                                                    {/* Checkbox */}
                                                    <button
                                                        onClick={() => toggleSelectOne(event.id)}
                                                        className="mt-1 text-muted hover:text-brand-600 transition-colors flex-shrink-0"
                                                    >
                                                        {isSelected ? (
                                                            <CheckSquare size={20} className="text-brand-600" />
                                                        ) : (
                                                            <Square size={20} />
                                                        )}
                                                    </button>

                                                    {/* Content - Stack vertically on small screens */}
                                                    <div className="flex-1 flex flex-col md:flex-row justify-between items-start gap-4 w-full min-w-0">
                                                        <div className="flex-1 w-full min-w-0">
                                                            <div className="flex flex-wrap items-center gap-2 mb-2">
                                                                <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-700 uppercase dark:bg-blue-900/40 dark:text-blue-300">{event.type}</span>
                                                                <span className="text-xs text-muted flex items-center"><Calendar size={12} className="mr-1" /> {event.fromDate}</span>
                                                            </div>
                                                            <h3 className="text-lg font-bold text-main truncate">{event.title}</h3>
                                                            <p className="text-sm text-brand-600 font-medium mb-2 truncate">{event.departmentName}</p>

                                                            {/* Mini Stats for quick view */}
                                                            <div className="flex items-center gap-3 text-xs text-muted mb-2">
                                                                <span className="flex items-center"><Users size={12} className="mr-1" /> {event.participants} ppl</span>
                                                                <span className="flex items-center"><Layers size={12} className="mr-1" /> {event.sdgs.length} SDGs</span>
                                                            </div>

                                                            <div className="flex flex-wrap items-center gap-4 text-xs font-medium mt-2">
                                                                {event.proofLink && (
                                                                    <span className="flex items-center text-blue-600 dark:text-blue-400">
                                                                        <ExternalLink size={12} className="mr-1" /> Proof Link Attached
                                                                    </span>
                                                                )}
                                                                {event.imageUrl && (
                                                                    <span className="flex items-center text-blue-600 dark:text-blue-400">
                                                                        <FileText size={12} className="mr-1" /> File Uploaded
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center w-full md:w-auto mt-2 md:mt-0">
                                                            <button
                                                                onClick={() => handleSingleReview(event)}
                                                                className="w-full md:w-auto bg-slate-900 dark:bg-slate-700 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 dark:hover:bg-slate-600 transition-colors shadow-sm"
                                                            >
                                                                Review & Grade
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {activeTab === 'schools' && (
                <div className="space-y-4 animate-fade-in">
                    <div className="flex justify-end">
                        <button
                            onClick={() => setShowAddDeptModal(true)}
                            className="bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center hover:bg-brand-700 shadow-sm"
                        >
                            <Plus size={18} className="mr-2" /> Add School
                        </button>
                    </div>

                    <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm text-muted min-w-[600px] cursor-default">
                                <thead className="bg-page border-b border-border font-semibold text-main uppercase tracking-wider text-xs">
                                    <tr>
                                        <th className="px-6 py-4">School Name</th>
                                        <th className="px-6 py-4">Organizer</th>
                                        <th className="px-6 py-4">Stats</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {departments.map(dept => (
                                        <tr key={dept.id} className="hover:bg-page transition-colors">
                                            <td className="px-6 py-4 font-medium text-main">{dept.name}</td>
                                            <td className="px-6 py-4 text-muted">
                                                <div className="flex items-center">
                                                    <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-xs font-bold text-muted mr-2">
                                                        {dept.coordinatorName.charAt(0)}
                                                    </div>
                                                    {dept.coordinatorName}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col gap-1 items-start">
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                                                        {dept.totalCredits} Credits
                                                    </span>
                                                    <span className="text-[10px] text-muted">{dept.eventCount} Events</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => removeDepartment(dept.id)}
                                                    title="Remove School"
                                                    className="text-slate-400 hover:text-red-600 p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {departments.length === 0 && (
                            <div className="p-8 text-center text-muted">
                                <Building2 size={32} className="mx-auto mb-2 text-slate-300" />
                                <p>No schools added yet.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {activeTab === 'users' && <UsersTab />}

            {activeTab === 'partnerships' && (
                <div className="space-y-4 animate-fade-in">
                    <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm text-muted min-w-[800px] cursor-default">
                                <thead className="bg-page border-b border-border font-semibold text-main uppercase tracking-wider text-xs">
                                    <tr>
                                        <th className="px-6 py-4">Organization</th>
                                        <th className="px-6 py-4">Contact</th>
                                        <th className="px-6 py-4">Type</th>
                                        <th className="px-6 py-4 max-w-xs">Message</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4 text-right">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {partnerships.map(p => (
                                        <tr key={p.id} className="hover:bg-page transition-colors">
                                            <td className="px-6 py-4 font-medium text-main">
                                                {p.organizationName}
                                                {p.website && (
                                                    <a href={p.website} target="_blank" rel="noreferrer" className="block text-xs text-brand-600 hover:underline font-normal mt-0.5">
                                                        Visit Website
                                                    </a>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="text-main font-medium">{p.contactPerson}</span>
                                                    <span className="text-xs">{p.email}</span>
                                                    <span className="text-xs">{p.phone}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                                                    {p.partnershipType}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 max-w-xs truncate" title={p.message}>
                                                {p.message}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${p.status === 'Approved' ? 'bg-green-100 text-green-800' :
                                                    p.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                                                        'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                    {p.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right text-xs">
                                                <div className="flex items-center justify-end space-x-2">
                                                    {p.status === 'Pending' && (
                                                        <>
                                                            <button
                                                                onClick={async () => {
                                                                    try {
                                                                        await import('../services/api').then(m => m.api.updatePartnershipStatus(p.id, 'Approved'));
                                                                        setPartnerships(prev => prev.map(item => item.id === p.id ? { ...item, status: 'Approved' } : item));
                                                                        setActionMessage('Partnership Approved');
                                                                    } catch (e) { console.error(e); }
                                                                }}
                                                                className="p-1 text-green-600 hover:bg-green-50 rounded"
                                                                title="Approve"
                                                            >
                                                                <Check size={16} />
                                                            </button>
                                                            <button
                                                                onClick={async () => {
                                                                    try {
                                                                        await import('../services/api').then(m => m.api.updatePartnershipStatus(p.id, 'Rejected'));
                                                                        setPartnerships(prev => prev.map(item => item.id === p.id ? { ...item, status: 'Rejected' } : item));
                                                                        setActionMessage('Partnership Rejected');
                                                                    } catch (e) { console.error(e); }
                                                                }}
                                                                className="p-1 text-red-600 hover:bg-red-50 rounded"
                                                                title="Reject"
                                                            >
                                                                <X size={16} />
                                                            </button>
                                                        </>
                                                    )}
                                                    <button
                                                        onClick={() => setViewPartnership(p)}
                                                        className="p-1 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded ml-2"
                                                        title="View Details"
                                                    >
                                                        <ExternalLink size={16} />
                                                    </button>
                                                    <button
                                                        onClick={async () => {
                                                            if (confirm('Are you sure you want to delete this request?')) {
                                                                try {
                                                                    await import('../services/api').then(m => m.api.deletePartnership(p.id));
                                                                    setPartnerships(prev => prev.filter(item => item.id !== p.id));
                                                                    setActionMessage('Partnership Deleted');
                                                                } catch (e) { console.error(e); }
                                                            }
                                                        }}
                                                        className="p-1 text-slate-400 hover:text-red-600 hover:bg-slate-100 rounded ml-2"
                                                        title="Delete"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {partnerships.length === 0 && (
                            <div className="p-12 text-center text-muted">
                                <Building2 size={32} className="mx-auto mb-4 text-slate-300" />
                                <p className="text-lg font-medium">No partnership requests yet.</p>
                                <p className="text-sm">Requests submitted via the main page will appear here.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Partnership Details Modal */}
            {viewPartnership && createPortal(
                <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 sm:p-6">
                    <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-md transition-opacity" onClick={() => setViewPartnership(null)} />
                    <div className="relative z-10 bg-card rounded-xl shadow-2xl max-w-2xl w-full flex flex-col max-h-[90vh] overflow-hidden animate-scale-up border border-border">
                        <div className="p-6 border-b border-border bg-page flex justify-between items-start">
                            <div>
                                <h2 className="text-xl font-bold text-main">Partnership Request</h2>
                                <p className="text-sm text-muted mt-1">Submitted on {new Date(viewPartnership.createdAt).toLocaleDateString()}</p>
                            </div>
                            <button onClick={() => setViewPartnership(null)} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors">
                                <X size={20} className="text-muted" />
                            </button>
                        </div>
                        <div className="overflow-y-auto p-6 space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <h4 className="text-xs font-bold text-muted uppercase tracking-wider mb-2">Organization</h4>
                                    <p className="font-medium text-main">{viewPartnership.organizationName}</p>
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold text-muted uppercase tracking-wider mb-2">Type</h4>
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                                        {viewPartnership.partnershipType}
                                    </span>
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold text-muted uppercase tracking-wider mb-2">Contact Person</h4>
                                    <p className="font-medium text-main">{viewPartnership.contactPerson}</p>
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold text-muted uppercase tracking-wider mb-2">Status</h4>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${viewPartnership.status === 'Approved' ? 'bg-green-100 text-green-800' :
                                        viewPartnership.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                                            'bg-yellow-100 text-yellow-800'
                                        }`}>
                                        {viewPartnership.status}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-4 pt-4 border-t border-border">
                                <h4 className="text-xs font-bold text-muted uppercase tracking-wider">Contact Information</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <a href={`mailto:${viewPartnership.email}`} className="flex items-center p-3 rounded-lg border border-border hover:bg-page transition-colors group">
                                        <Mail size={18} className="text-slate-400 group-hover:text-brand-500 mr-3" />
                                        <span className="text-sm text-main truncate">{viewPartnership.email}</span>
                                    </a>
                                    <a href={`tel:${viewPartnership.phone}`} className="flex items-center p-3 rounded-lg border border-border hover:bg-page transition-colors group">
                                        <Phone size={18} className="text-slate-400 group-hover:text-brand-500 mr-3" />
                                        <span className="text-sm text-main truncate">{viewPartnership.phone}</span>
                                    </a>
                                    {viewPartnership.website && (
                                        <a href={viewPartnership.website} target="_blank" rel="noreferrer" className="flex items-center p-3 rounded-lg border border-border hover:bg-page transition-colors group">
                                            <Globe size={18} className="text-slate-400 group-hover:text-brand-500 mr-3" />
                                            <span className="text-sm text-main truncate">Website</span>
                                            <ExternalLink size={14} className="ml-auto text-muted group-hover:text-brand-500" />
                                        </a>
                                    )}
                                    {viewPartnership.linkedin && (
                                        <a href={viewPartnership.linkedin} target="_blank" rel="noreferrer" className="flex items-center p-3 rounded-lg border border-border hover:bg-page transition-colors group">
                                            <div className="w-4 h-4 mr-3 flex items-center justify-center rounded bg-[#0077b5] text-white">
                                                <span className="font-bold text-[10px]">in</span>
                                            </div>
                                            <span className="text-sm text-main truncate">LinkedIn Profile</span>
                                            <ExternalLink size={14} className="ml-auto text-muted group-hover:text-brand-500" />
                                        </a>
                                    )}
                                </div>
                            </div>

                            <div className="pt-4 border-t border-border">
                                <h4 className="text-xs font-bold text-muted uppercase tracking-wider mb-2">Message</h4>
                                <div className="bg-page/50 p-4 rounded-xl border border-border text-sm leading-relaxed text-main whitespace-pre-wrap">
                                    {viewPartnership.message}
                                </div>
                            </div>
                        </div>
                        <div className="p-4 border-t border-border bg-page flex justify-end">
                            <button
                                onClick={() => setViewPartnership(null)}
                                className="px-4 py-2 bg-slate-900 text-white hover:bg-slate-800 rounded-lg text-sm font-bold transition-colors dark:bg-slate-700 dark:hover:bg-slate-600"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}

            {/* Partnership Details Modal */}
            {viewPartnership && createPortal(
                <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 sm:p-6">
                    <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-md transition-opacity" onClick={() => setViewPartnership(null)} />
                    <div className="relative z-10 bg-card rounded-xl shadow-2xl max-w-2xl w-full flex flex-col max-h-[90vh] overflow-hidden animate-scale-up border border-border">
                        <div className="p-6 border-b border-border bg-page flex justify-between items-start">
                            <div>
                                <h2 className="text-xl font-bold text-main">Partnership Request</h2>
                                <p className="text-sm text-muted mt-1">Submitted on {new Date(viewPartnership.createdAt).toLocaleDateString()}</p>
                            </div>
                            <button onClick={() => setViewPartnership(null)} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors">
                                <X size={20} className="text-muted" />
                            </button>
                        </div>
                        <div className="overflow-y-auto p-6 space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <h4 className="text-xs font-bold text-muted uppercase tracking-wider mb-2">Organization</h4>
                                    <p className="font-medium text-main">{viewPartnership.organizationName}</p>
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold text-muted uppercase tracking-wider mb-2">Type</h4>
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                                        {viewPartnership.partnershipType}
                                    </span>
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold text-muted uppercase tracking-wider mb-2">Contact Person</h4>
                                    <p className="font-medium text-main">{viewPartnership.contactPerson}</p>
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold text-muted uppercase tracking-wider mb-2">Status</h4>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${viewPartnership.status === 'Approved' ? 'bg-green-100 text-green-800' :
                                        viewPartnership.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                                            'bg-yellow-100 text-yellow-800'
                                        }`}>
                                        {viewPartnership.status}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-4 pt-4 border-t border-border">
                                <h4 className="text-xs font-bold text-muted uppercase tracking-wider">Contact Information</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <a href={`mailto:${viewPartnership.email}`} className="flex items-center p-3 rounded-lg border border-border hover:bg-page transition-colors group">
                                        <Mail size={18} className="text-slate-400 group-hover:text-brand-500 mr-3" />
                                        <span className="text-sm text-main truncate">{viewPartnership.email}</span>
                                    </a>
                                    <a href={`tel:${viewPartnership.phone}`} className="flex items-center p-3 rounded-lg border border-border hover:bg-page transition-colors group">
                                        <Phone size={18} className="text-slate-400 group-hover:text-brand-500 mr-3" />
                                        <span className="text-sm text-main truncate">{viewPartnership.phone}</span>
                                    </a>
                                    {viewPartnership.website && (
                                        <a href={viewPartnership.website} target="_blank" rel="noreferrer" className="flex items-center p-3 rounded-lg border border-border hover:bg-page transition-colors group">
                                            <Globe size={18} className="text-slate-400 group-hover:text-brand-500 mr-3" />
                                            <span className="text-sm text-main truncate">Website</span>
                                            <ExternalLink size={14} className="ml-auto text-muted group-hover:text-brand-500" />
                                        </a>
                                    )}
                                    {viewPartnership.linkedin && (
                                        <a href={viewPartnership.linkedin} target="_blank" rel="noreferrer" className="flex items-center p-3 rounded-lg border border-border hover:bg-page transition-colors group">
                                            <div className="w-4 h-4 mr-3 flex items-center justify-center rounded bg-[#0077b5] text-white">
                                                <span className="font-bold text-[10px]">in</span>
                                            </div>
                                            <span className="text-sm text-main truncate">LinkedIn Profile</span>
                                            <ExternalLink size={14} className="ml-auto text-muted group-hover:text-brand-500" />
                                        </a>
                                    )}
                                </div>
                            </div>

                            <div className="pt-4 border-t border-border">
                                <h4 className="text-xs font-bold text-muted uppercase tracking-wider mb-2">Message</h4>
                                <div className="bg-page/50 p-4 rounded-xl border border-border text-sm leading-relaxed text-main whitespace-pre-wrap">
                                    {viewPartnership.message}
                                </div>
                            </div>
                        </div>
                        <div className="p-4 border-t border-border bg-page flex justify-end">
                            <button
                                onClick={() => setViewPartnership(null)}
                                className="px-4 py-2 bg-slate-900 text-white hover:bg-slate-800 rounded-lg text-sm font-bold transition-colors dark:bg-slate-700 dark:hover:bg-slate-600"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
            {(selectedEvent || isBulkAction) && createPortal(
                <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 sm:p-6">
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity" onClick={() => { setSelectedEvent(null); setIsBulkAction(false); }} />

                    {/* Modal Content */}
                    <div className={`relative z-10 bg-card rounded-xl shadow-2xl w-full ${isBulkAction ? 'max-w-lg' : 'max-w-6xl'} flex flex-col max-h-[90vh] overflow-hidden animate-scale-up`}>

                        {/* Modal Header */}
                        <div className="p-6 border-b border-border flex justify-between items-start bg-page">
                            <div>
                                <h3 className="text-xl font-bold text-main">
                                    {isBulkAction ? 'Bulk Action' : 'Review Submission'}
                                </h3>
                                <p className="text-sm text-muted">
                                    {isBulkAction
                                        ? `Applying changes to ${selectedIds.length} selected events.`
                                        : `${selectedEvent?.departmentName} • ${selectedEvent?.submissionDate}`
                                    }
                                </p>
                            </div>
                            <button
                                onClick={() => { setSelectedEvent(null); setIsBulkAction(false); }}
                                className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors"
                            >
                                <X size={20} className="text-muted" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="overflow-y-auto p-0 flex-1">
                            {isBulkAction ? (
                                <div className="p-6">
                                    <p className="text-sm text-muted mb-6">
                                        You are about to assign the same status, credits, and feedback to all selected items.
                                    </p>
                                </div>
                            ) : (
                                // SPLIT VIEW FOR SINGLE REVIEW
                                <div className="flex flex-col lg:flex-row h-full">
                                    {/* LEFT: Full Event Dossier */}
                                    <div className="flex-1 p-6 lg:p-8 space-y-8 bg-page/30 lg:overflow-y-auto lg:border-r border-border">

                                        {/* Header Info */}
                                        <div>
                                            <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider mb-2 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300`}>
                                                {selectedEvent?.type}
                                            </span>
                                            <h2 className="text-2xl font-bold text-main leading-tight">{selectedEvent?.title}</h2>
                                        </div>

                                        {/* Attachments & Proof - Highlighted Section */}
                                        <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800 rounded-xl p-5">
                                            <h4 className="text-sm font-bold text-blue-800 dark:text-blue-300 uppercase tracking-wide mb-3 flex items-center">
                                                <FileText size={16} className="mr-2" /> Submitted Documentation
                                            </h4>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                {/* Uploaded File */}
                                                {selectedEvent?.imageUrl ? (
                                                    <a href={selectedEvent.imageUrl} target="_blank" rel="noreferrer" className="flex items-center p-3 bg-white dark:bg-slate-800 rounded-lg border border-blue-200 dark:border-blue-700 shadow-sm hover:shadow-md transition-all group">
                                                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 mr-3 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                                            <Download size={20} />
                                                        </div>
                                                        <div className="overflow-hidden">
                                                            <p className="font-bold text-sm text-main">Uploaded File</p>
                                                            <p className="text-xs text-muted">Click to download</p>
                                                        </div>
                                                    </a>
                                                ) : (
                                                    <div className="p-3 border border-dashed border-slate-300 rounded-lg text-center text-xs text-muted flex items-center justify-center h-full">No file uploaded</div>
                                                )}

                                                {/* Event Report */}
                                                {selectedEvent?.reportUrl ? (
                                                    <a href={selectedEvent.reportUrl} target="_blank" rel="noreferrer" className="flex items-center p-3 bg-white dark:bg-slate-800 rounded-lg border border-blue-200 dark:border-blue-700 shadow-sm hover:shadow-md transition-all group">
                                                        <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg text-red-600 mr-3 group-hover:bg-red-600 group-hover:text-white transition-colors">
                                                            <FileText size={20} />
                                                        </div>
                                                        <div className="overflow-hidden">
                                                            <p className="font-bold text-sm text-main">Event Report</p>
                                                            <p className="text-xs text-muted">Click to view PDF</p>
                                                        </div>
                                                    </a>
                                                ) : (
                                                    <div className="p-3 border border-dashed border-slate-300 rounded-lg text-center text-xs text-muted flex items-center justify-center h-full">No event report</div>
                                                )}

                                                {/* Proof Link */}
                                                {selectedEvent?.proofLink ? (
                                                    <a href={selectedEvent.proofLink} target="_blank" rel="noreferrer" className="flex items-center p-3 bg-white dark:bg-slate-800 rounded-lg border border-blue-200 dark:border-blue-700 shadow-sm hover:shadow-md transition-all group">
                                                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 mr-3 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                                            <ExternalLink size={20} />
                                                        </div>
                                                        <div className="overflow-hidden">
                                                            <p className="font-bold text-sm text-main">External Proof</p>
                                                            <p className="text-xs text-muted">Click to open link</p>
                                                        </div>
                                                    </a>
                                                ) : (
                                                    <div className="p-3 border border-dashed border-slate-300 rounded-lg text-center text-xs text-muted flex items-center justify-center h-full">No external link</div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Details Grid */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <h4 className="text-xs font-bold text-muted uppercase tracking-wider mb-2">Description</h4>
                                                <p className="text-sm leading-relaxed text-main whitespace-pre-wrap">{selectedEvent?.description}</p>
                                            </div>
                                            <div>
                                                <h4 className="text-xs font-bold text-muted uppercase tracking-wider mb-2">Actions Taken</h4>
                                                <p className="text-sm leading-relaxed text-main whitespace-pre-wrap">{selectedEvent?.actionsTaken || "No specific actions listed."}</p>
                                            </div>
                                        </div>

                                        <div className="border-t border-border pt-6">
                                            <div className="grid grid-cols-2 gap-6">
                                                <div>
                                                    <h4 className="text-xs font-bold text-muted uppercase tracking-wider mb-2">Stats</h4>
                                                    <ul className="text-sm space-y-1">
                                                        <li className="flex justify-between"><span className="text-muted">Date:</span> <span className="font-medium">{selectedEvent?.date}</span></li>
                                                        <li className="flex justify-between"><span className="text-muted">Participants:</span> <span className="font-medium">{selectedEvent?.participants}</span></li>
                                                    </ul>
                                                </div>
                                                <div>
                                                    <h4 className="text-xs font-bold text-muted uppercase tracking-wider mb-2">SDGs Targeted</h4>
                                                    <div className="flex flex-col gap-2">
                                                        {selectedEvent?.sdgs.map(sdg => (
                                                            <span key={sdg} className="text-xs bg-slate-100 dark:bg-slate-700 px-2 py-1.5 rounded-md border border-border font-medium text-main flex items-center">
                                                                <span className="w-1.5 h-1.5 rounded-full bg-brand-500 mr-2 shrink-0"></span>
                                                                {sdg}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Modal Footer (Grading Form) */}
                        <div className="bg-card border-t border-border p-6 lg:flex lg:items-end lg:justify-between lg:space-x-6">
                            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 lg:mb-0">
                                <div>
                                    <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-1.5">Assign Credits</label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            value={credits}
                                            onChange={handleCreditChange}
                                            className="w-full pl-3 pr-10 py-2 border border-border rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none bg-page text-main font-bold"
                                            min="0"
                                            max="100"
                                        />
                                        <span className="absolute right-3 top-2.5 text-xs text-muted font-bold">PTS</span>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-1.5">Admin Feedback</label>
                                    <textarea
                                        value={feedback}
                                        onChange={(e) => setFeedback(e.target.value)}
                                        className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none bg-page text-main text-sm resize-none"
                                        rows={1}
                                        placeholder="This is a placeholder. I need to read the rest of the file first..."
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end shrink-0">
                                <button
                                    onClick={handleUpdateCredits}
                                    className="w-full sm:w-auto px-6 py-2.5 bg-brand-600 text-white font-bold hover:bg-brand-700 rounded-lg flex items-center justify-center shadow-lg shadow-brand-200 dark:shadow-none transition-colors text-sm"
                                >
                                    <Check size={18} className="mr-2" /> {isBulkAction ? 'Update All Credits' : 'Save Grading'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>,
                document.body
            )}

            {/* Modal for Add Department - Rendered via Portal */}
            {showAddDeptModal && createPortal(
                <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 sm:p-6">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity" onClick={() => setShowAddDeptModal(false)} />

                    <div className="relative z-10 bg-card rounded-xl shadow-2xl max-w-md w-full p-6 animate-scale-in overflow-y-auto max-h-[90vh]">
                        <h3 className="text-xl font-bold text-main mb-1">Add New School</h3>
                        <p className="text-sm text-muted mb-6">Enter the details for the new school.</p>

                        <form onSubmit={handleAddDeptSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-main mb-1">School Name</label>
                                <input
                                    required
                                    type="text"
                                    value={newDept.name}
                                    onChange={(e) => setNewDept({ ...newDept, name: e.target.value })}
                                    className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none bg-page text-main"
                                    placeholder="e.g. School of Design"
                                />
                            </div>
                            {/* Code input removed - auto generated */}

                            <div>
                                <label className="block text-sm font-medium text-main mb-1">Organizer Name</label>
                                <input
                                    type="text"
                                    value={newDept.coordinatorName}
                                    onChange={(e) => setNewDept({ ...newDept, coordinatorName: e.target.value })}
                                    className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none bg-page text-main"
                                    placeholder="e.g. Dr. Jane Doe"
                                />
                            </div>

                            <div className="flex flex-col-reverse sm:flex-row space-y-2 space-y-reverse sm:space-y-0 sm:space-x-3 mt-8 justify-end">
                                <button
                                    type="button"
                                    onClick={() => setShowAddDeptModal(false)}
                                    className="w-full sm:w-auto px-4 py-2 text-muted font-medium hover:bg-page rounded-lg transition-colors text-center"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="w-full sm:w-auto px-4 py-2 bg-brand-600 text-white font-medium hover:bg-brand-700 rounded-lg flex items-center justify-center shadow-lg shadow-brand-200 dark:shadow-none transition-colors"
                                >
                                    <Plus size={18} className="mr-1" /> Add School
                                </button>
                            </div>
                        </form>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
};

// Manage Events Tab Component
function ManageEventsTab() {
    const { events, departments, deleteEvent } = useJCS();
    const [searchTerm, setSearchTerm] = useState('');
    const [deptFilter, setDeptFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);
    const [viewEvent, setViewEvent] = useState<Event | null>(null);

    // Filter Events
    const filteredEvents = events.filter(e => {
        const matchesSearch = e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            e.departmentName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesDept = deptFilter ? e.departmentName === deptFilter : true;
        const matchesStatus = statusFilter ? e.status === statusFilter : true;
        return matchesSearch && matchesDept && matchesStatus;
    });

    // Sort by newest submission date
    const sortedEvents = [...filteredEvents].sort((a, b) => new Date(b.submissionDate).getTime() - new Date(a.submissionDate).getTime());

    const handleDelete = async () => {
        if (showDeleteModal) {
            try {
                await deleteEvent(showDeleteModal);
                setShowDeleteModal(null);
                setViewEvent(null);
            } catch (error) {
                console.error("Failed to delete event:", error);
                alert("Failed to delete event. Please try again.");
            }
        }
    };

    return (
        <div className="space-y-4 animate-fade-in text-main">
            {/* Toolbar */}
            <div className="flex flex-col md:flex-row gap-4 justify-between bg-card p-4 rounded-xl border border-border shadow-sm">
                <div className="relative flex-1">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                    <input
                        type="text"
                        placeholder="Search events by title or department..."
                        className="w-full pl-10 pr-4 py-2 bg-page border border-border rounded-lg text-sm text-main focus:ring-2 focus:ring-brand-500 outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-2 text-sm">
                    <div className="relative">
                        <select
                            className="appearance-none pl-3 pr-8 py-2 bg-page border border-border rounded-lg text-main focus:ring-2 focus:ring-brand-500 outline-none cursor-pointer"
                            value={deptFilter}
                            onChange={(e) => setDeptFilter(e.target.value)}
                        >
                            <option value="">All Departments</option>
                            {departments.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
                        </select>
                        <Filter size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
                    </div>
                    <div className="relative">
                        <select
                            className="appearance-none pl-3 pr-8 py-2 bg-page border border-border rounded-lg text-main focus:ring-2 focus:ring-brand-500 outline-none cursor-pointer"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="">All Statuses</option>
                            <option value="Approved">Approved</option>
                            <option value="Rejected">Rejected</option>
                            <option value="Submitted">Submitted</option>
                            <option value="Under Review">Under Review</option>
                        </select>
                        <Filter size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-muted min-w-[900px]">
                        <thead className="bg-page border-b border-border font-semibold text-main uppercase tracking-wider text-xs">
                            <tr>
                                <th className="px-6 py-4">Event</th>
                                <th className="px-6 py-4">Date & Dept</th>
                                <th className="px-6 py-4">Stats</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {sortedEvents.map(event => (
                                <tr key={event.id} className="hover:bg-page transition-colors">
                                    <td className="px-6 py-4 max-w-xs">
                                        <p className="font-bold text-main truncate cursor-pointer hover:text-brand-600" onClick={() => setViewEvent(event)} title={event.title}>{event.title}</p>
                                        <p className="text-xs text-muted truncate">{event.type}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="font-medium text-main">{event.departmentName}</span>
                                            <span className="text-xs text-muted">{event.date}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-xs">
                                        <div className="flex flex-col gap-1">
                                            <span>{event.participants} Participants</span>
                                            <span>{event.credits} Credits</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase border ${event.status === 'Approved' ? 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800' :
                                            event.status === 'Rejected' ? 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800' :
                                                'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800'
                                            }`}>
                                            {event.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => setViewEvent(event)}
                                                className="p-2 text-slate-400 hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-900/20 rounded-lg transition-colors"
                                                title="View Details"
                                            >
                                                <ExternalLink size={18} />
                                            </button>
                                            <button
                                                onClick={() => setShowDeleteModal(event.id)}
                                                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                title="Delete Event"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredEvents.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-muted">
                                        No events found matching your filters.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Deep Analysis / View Modal */}
            {viewEvent && createPortal(
                <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 sm:p-6">
                    <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-md transition-opacity" onClick={() => setViewEvent(null)} />
                    <div className="relative z-10 bg-card rounded-xl shadow-2xl max-w-4xl w-full flex flex-col max-h-[90vh] overflow-hidden animate-scale-up border border-border">

                        {/* Header */}
                        <div className="p-6 border-b border-border bg-page flex justify-between items-start">
                            <div className="pr-4">
                                <span className="inline-block px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider mb-2 bg-brand-100 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300">
                                    Deep Analysis
                                </span>
                                <h2 className="text-2xl font-bold text-main leading-tight">{viewEvent.title}</h2>
                                <p className="text-sm text-muted mt-1">{viewEvent.departmentName} • {viewEvent.date}</p>
                            </div>
                            <button onClick={() => setViewEvent(null)} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors shrink-0">
                                <X size={20} className="text-muted" />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="overflow-y-auto p-6 lg:p-8 space-y-8">
                            {/* Stats Row */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="p-4 bg-page rounded-xl border border-border">
                                    <p className="text-xs text-muted uppercase font-bold">Status</p>
                                    <p className={`font-bold mt-1 ${viewEvent.status === 'Approved' ? 'text-green-600' :
                                        viewEvent.status === 'Rejected' ? 'text-red-600' : 'text-yellow-600'
                                        }`}>{viewEvent.status}</p>
                                </div>
                                <div className="p-4 bg-page rounded-xl border border-border">
                                    <p className="text-xs text-muted uppercase font-bold">Credits</p>
                                    <p className="font-bold text-main mt-1">{viewEvent.credits}</p>
                                </div>
                                <div className="p-4 bg-page rounded-xl border border-border">
                                    <p className="text-xs text-muted uppercase font-bold">Participants</p>
                                    <p className="font-bold text-main mt-1">{viewEvent.participants}</p>
                                </div>
                                <div className="p-4 bg-page rounded-xl border border-border">
                                    <p className="text-xs text-muted uppercase font-bold">Type</p>
                                    <p className="font-bold text-main mt-1">{viewEvent.type}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <div>
                                        <h4 className="text-sm font-bold text-main uppercase tracking-wide mb-2">Description</h4>
                                        <div className="text-muted leading-relaxed whitespace-pre-wrap text-sm border-l-2 border-brand-200 pl-4">{viewEvent.description}</div>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-main uppercase tracking-wide mb-2">Actions Taken</h4>
                                        <div className="text-muted leading-relaxed whitespace-pre-wrap text-sm border-l-2 border-brand-200 pl-4">{viewEvent.actionsTaken || "N/A"}</div>
                                    </div>
                                    {viewEvent.feedback && (
                                        <div>
                                            <h4 className="text-sm font-bold text-main uppercase tracking-wide mb-2">Admin Feedback</h4>
                                            <div className="text-muted leading-relaxed whitespace-pre-wrap text-sm border-l-2 border-orange-200 pl-4">{viewEvent.feedback}</div>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <h4 className="text-sm font-bold text-main uppercase tracking-wide mb-3">Evidence & Documentation</h4>
                                        <div className="space-y-3">
                                            {viewEvent.imageUrl ? (
                                                <a href={viewEvent.imageUrl} target="_blank" rel="noreferrer" className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-page transition-colors group">
                                                    <span className="flex items-center text-sm font-medium text-main"><FileText size={16} className="mr-2 text-blue-500" /> Uploaded File</span>
                                                    <ExternalLink size={14} className="text-muted group-hover:text-blue-500" />
                                                </a>
                                            ) : (
                                                <div className="p-3 rounded-lg border border-border bg-page/50 text-sm text-muted italic">No file uploaded</div>
                                            )}

                                            {viewEvent.reportUrl ? (
                                                <a href={viewEvent.reportUrl} target="_blank" rel="noreferrer" className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-page transition-colors group">
                                                    <span className="flex items-center text-sm font-medium text-main"><FileText size={16} className="mr-2 text-red-500" /> Event Report</span>
                                                    <ExternalLink size={14} className="text-muted group-hover:text-red-500" />
                                                </a>
                                            ) : (
                                                <div className="p-3 rounded-lg border border-border bg-page/50 text-sm text-muted italic">No report available</div>
                                            )}

                                            {viewEvent.proofLink ? (
                                                <a href={viewEvent.proofLink} target="_blank" rel="noreferrer" className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-page transition-colors group">
                                                    <span className="flex items-center text-sm font-medium text-main"><ExternalLink size={16} className="mr-2 text-green-500" /> External Proof</span>
                                                    <ExternalLink size={14} className="text-muted group-hover:text-green-500" />
                                                </a>
                                            ) : (
                                                <div className="p-3 rounded-lg border border-border bg-page/50 text-sm text-muted italic">No proof link</div>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="text-sm font-bold text-main uppercase tracking-wide mb-3">Targeted SDGs</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {viewEvent.sdgs && viewEvent.sdgs.length > 0 ? viewEvent.sdgs.map(sdg => (
                                                <span key={sdg} className="text-xs bg-slate-100 dark:bg-slate-800 border border-border px-2 py-1 rounded-md text-main">
                                                    {sdg}
                                                </span>
                                            )) : (
                                                <span className="text-sm text-muted italic">No SDGs listed</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="p-4 bg-page border-t border-border flex justify-end gap-3">
                            <button
                                onClick={() => { setShowDeleteModal(viewEvent.id); }}
                                className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-sm font-bold flex items-center transition-colors border border-red-200 dark:border-red-900/30 dark:bg-red-900/20"
                            >
                                <Trash2 size={16} className="mr-2" /> Delete Event
                            </button>
                            <button
                                onClick={() => setViewEvent(null)}
                                className="px-4 py-2 bg-slate-900 text-white hover:bg-slate-800 rounded-lg text-sm font-bold transition-colors dark:bg-slate-700 dark:hover:bg-slate-600"
                            >
                                Close Analysis
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && createPortal(
                <div className="fixed inset-0 z-[1100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowDeleteModal(null)} />
                    <div className="relative bg-card rounded-xl shadow-2xl p-6 max-w-sm w-full animate-scale-in border border-red-100 dark:border-red-900/30">
                        <div className="flex flex-col items-center text-center mb-6">
                            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4">
                                <AlertTriangle size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-main">Delete Event?</h3>
                            <p className="text-sm text-muted mt-2">
                                This action cannot be undone. This event will be permanently removed from the system.
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowDeleteModal(null)}
                                className="flex-1 py-2.5 rounded-lg border border-border text-main font-medium hover:bg-page transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                className="flex-1 py-2.5 rounded-lg bg-red-600 text-white font-bold hover:bg-red-700 transition-colors shadow-lg shadow-red-200 dark:shadow-none"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
}

// Users Tab Component
function UsersTab() {
    const { users, addUser, updateUser, removeUser, departments } = useJCS();
    const { addToast } = useToast(); // Use Toast for feedback

    const [showUserModal, setShowUserModal] = useState(false);
    const [editingUser, setEditingUser] = useState<any | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: 'Viewer',
        departmentId: '',
        password: '' // Only for create or change
    });
    const [error, setError] = useState('');

    // Custom Modal States
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

    useEffect(() => {
        if (editingUser) {
            setFormData({
                name: editingUser.name,
                email: editingUser.email,
                role: editingUser.role,
                departmentId: editingUser.departmentId ? String(editingUser.departmentId) : '',
                password: ''
            });
        } else {
            setFormData({ name: '', email: '', role: 'Viewer', departmentId: '', password: '' });
        }
    }, [editingUser]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            const payload: any = { ...formData };
            if (!payload.password && !editingUser) return setError("Password required for new user");
            if (!payload.password) delete payload.password; // Don't send empty password if editing
            if (!payload.departmentId) payload.departmentId = null;

            // Validation: Coordinator MUST have a department
            if (payload.role === 'Coordinator' && !payload.departmentId) {
                setError("Coordinators must be assigned to a department.");
                return;
            }

            if (editingUser) {
                await updateUser(editingUser.id, payload);
                addToast('User updated successfully', 'success');
                setShowUserModal(false);
                setEditingUser(null);
            } else {
                await addUser(payload);
                // On Create Success: Close Form -> Show Success Modal
                setShowUserModal(false);
                setEditingUser(null);
                setShowSuccessModal(true);
            }
        } catch (err: any) {
            setError(err.message || "Operation failed");
            addToast('Operation failed', 'error');
        }
    };

    const initiateDelete = (userId: string) => {
        setShowDeleteConfirm(userId);
    };

    const confirmDelete = async () => {
        if (!showDeleteConfirm) return;
        try {
            await removeUser(showDeleteConfirm);
            addToast('User deleted successfully', 'success');
            setShowDeleteConfirm(null);
        } catch (err) {
            console.error(err);
            addToast('Failed to delete user', 'error');
        }
    };

    return (
        <div className="space-y-4 animate-fade-in">
            <div className="flex justify-end">
                <button
                    onClick={() => { setEditingUser(null); setShowUserModal(true); }}
                    className="bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center hover:bg-brand-700 shadow-sm"
                >
                    <Plus size={18} className="mr-2" /> Add User
                </button>
            </div>

            <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-muted min-w-[700px]">
                        <thead className="bg-page border-b border-border font-semibold text-main uppercase tracking-wider text-xs">
                            <tr>
                                <th className="px-6 py-4">Name</th>
                                <th className="px-6 py-4">Email</th>
                                <th className="px-6 py-4">Role</th>
                                <th className="px-6 py-4">Department</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {users.map(user => (
                                <tr key={user.id} className="hover:bg-page transition-colors">
                                    <td className="px-6 py-4 font-medium text-main">{user.name}</td>
                                    <td className="px-6 py-4 text-muted">{user.email}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex px-2 py-0.5 rounded text-xs font-bold uppercase
                                              ${user.role === 'Admin' ? 'bg-purple-100 text-purple-700' :
                                                user.role === 'Coordinator' ? 'bg-blue-100 text-blue-700' :
                                                    'bg-slate-100 text-slate-700'}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-muted">
                                        {user.departmentId
                                            ? departments.find(d => d.id === user.departmentId)?.name || 'Unknown'
                                            : 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => { setEditingUser(user); setShowUserModal(true); }}
                                            className="text-blue-500 hover:text-blue-700 p-2 mr-1 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                            title="Edit"
                                        >
                                            <FileText size={18} />
                                        </button>
                                        <button
                                            onClick={() => initiateDelete(user.id)}
                                            className="text-slate-400 hover:text-red-600 p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                            title="Delete"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* USER FORM MODAL */}
            {showUserModal && createPortal(
                <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 sm:p-6">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity" onClick={() => setShowUserModal(false)} />
                    <div className="relative z-10 bg-card rounded-xl shadow-2xl max-w-md w-full p-6 animate-scale-in">
                        <h3 className="text-xl font-bold text-main mb-4">{editingUser ? 'Edit User' : 'Add User'}</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-main mb-1">Name</label>
                                <input required type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-2 border border-border rounded-lg bg-page text-main" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-main mb-1">Email</label>
                                <input required type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-4 py-2 border border-border rounded-lg bg-page text-main" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-main mb-1">Role</label>
                                <select value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })}
                                    className="w-full px-4 py-2 border border-border rounded-lg bg-page text-main">
                                    <option value="Viewer">Viewer</option>
                                    <option value="Coordinator">Coordinator</option>
                                    <option value="Admin">Admin</option>
                                </select>
                            </div>
                            {formData.role === 'Coordinator' && (
                                <div>
                                    <label className="block text-sm font-medium text-main mb-1">Department</label>
                                    <select value={formData.departmentId} onChange={e => setFormData({ ...formData, departmentId: e.target.value })}
                                        className="w-full px-4 py-2 border border-border rounded-lg bg-page text-main">
                                        <option value="">Select Department</option>
                                        {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                                    </select>
                                </div>
                            )}
                            <div>
                                <label className="block text-sm font-medium text-main mb-1">{editingUser ? 'New Password (Optional)' : 'Password'}</label>
                                <input type="password" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full px-4 py-2 border border-border rounded-lg bg-page text-main" placeholder={editingUser ? "Leave blank to keep current" : ""} />
                            </div>

                            {error && <p className="text-red-500 text-sm">{error}</p>}

                            <div className="flex justify-end gap-3 mt-6">
                                <button type="button" onClick={() => setShowUserModal(false)} className="px-4 py-2 text-muted hover:bg-page rounded-lg">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700">Save User</button>
                            </div>
                        </form>
                    </div>
                </div>,
                document.body
            )}

            {/* SUCCESS MODAL */}
            {showSuccessModal && createPortal(
                <div className="fixed inset-0 z-[1100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowSuccessModal(false)} />
                    <div className="relative bg-card rounded-xl shadow-2xl p-8 max-w-sm w-full animate-scale-in text-center">
                        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Check size={32} />
                        </div>
                        <h3 className="text-2xl font-bold text-main mb-2">User Created!</h3>
                        <p className="text-muted mb-6">The new user has been successfully added to the system.</p>
                        <button
                            onClick={() => setShowSuccessModal(false)}
                            className="w-full py-3 bg-brand-600 text-white font-bold rounded-xl hover:bg-brand-700 transition-colors shadow-lg shadow-brand-200 dark:shadow-none"
                        >
                            Awesome!
                        </button>
                    </div>
                </div>,
                document.body
            )}

            {/* DELETE CONFIRMATION MODAL */}
            {showDeleteConfirm && createPortal(
                <div className="fixed inset-0 z-[1100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowDeleteConfirm(null)} />
                    <div className="relative bg-card rounded-xl shadow-2xl p-6 max-w-sm w-full animate-scale-in border border-red-100 dark:border-red-900/30">
                        <div className="flex flex-col items-center text-center mb-6">
                            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4">
                                <AlertTriangle size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-main">Delete User?</h3>
                            <p className="text-sm text-muted mt-2">
                                Are you sure you want to remove this user? This action cannot be undone.
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowDeleteConfirm(null)}
                                className="flex-1 py-2.5 rounded-lg border border-border text-main font-medium hover:bg-page transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="flex-1 py-2.5 rounded-lg bg-red-600 text-white font-bold hover:bg-red-700 transition-colors shadow-lg shadow-red-200 dark:shadow-none"
                            >
                                Delete User
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
};

export default AdminPanel;