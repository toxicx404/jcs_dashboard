import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useJCS } from '../services/JCSContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Save, Download, FileText, CheckCircle2, Filter, X, ExternalLink, Calendar, Users, Tag, Info, MessageSquare, Image as ImageIcon } from 'lucide-react';

const Reports = () => {
  const { events, departments, updateEventStatus, currentUser } = useJCS();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempCredit, setTempCredit] = useState(0);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  // Interactive Filter State
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [deptFilter, setDeptFilter] = useState<string | null>(null);

  // --- Filter Logic Based on Role ---
  let reportEvents = events;

  if (currentUser?.role === 'Coordinator' && currentUser.departmentId) {
    // Coordinators can now see all events in reports
    reportEvents = events;
  } else if (currentUser?.role === 'Viewer') {
    // Viewers see everything now
    reportEvents = events;
  }
  // Admins see everything (default)

  // Calculate stats BEFORE interactive filtering for charts (so charts show the role's full view)
  const roleBasedEvents = [...reportEvents];

  // Apply Interactive Filters (Status/Dept clicks) to the Table View
  let tableEvents = [...roleBasedEvents];
  if (statusFilter) {
    tableEvents = tableEvents.filter(e => e.status === statusFilter);
  }
  if (deptFilter) {
    const targetDept = departments.find(d => d.code === deptFilter);
    if (targetDept) {
      tableEvents = tableEvents.filter(e => e.departmentId === targetDept.id);
    }
  }

  // --- Calculations ---
  const totalEvents = roleBasedEvents.length;
  const approvedEvents = roleBasedEvents; // Rename conceptually if needed, but for now just use all
  const totalCredits = approvedEvents.reduce((acc, curr) => acc + (curr.credits || 0), 0);
  const avgCredits = approvedEvents.length > 0 ? (totalCredits / approvedEvents.length).toFixed(1) : 0;

  // Chart Data: Status Distribution
  const statusData = [
    { name: 'Approved', value: roleBasedEvents.filter(e => e.status === 'Approved').length },
    { name: 'Pending', value: roleBasedEvents.filter(e => e.status === 'Submitted' || e.status === 'Under Review').length },
    { name: 'Rejected', value: roleBasedEvents.filter(e => e.status === 'Rejected').length },
  ].filter(d => d.value > 0);
  const COLORS = ['#10b981', '#f59e0b', '#ef4444'];

  // Chart Data: Events per Dept
  // For Coordinators, this will likely only show their own dept bar, which is correct.
  const deptData = departments
    .map(d => ({
      name: d.code,
      events: roleBasedEvents.filter(e => e.departmentId === d.id).length
    }))
    .filter(d => d.events > 0); // Only show active depts in chart

  // --- Handlers ---
  const handleEditClick = (event: any) => {
    setEditingId(event.id);
    setTempCredit(event.credits || 0);
  };

  const handleSaveCredit = (eventId: string) => {
    updateEventStatus(eventId, undefined, tempCredit, undefined);
    setEditingId(null);
  };

  const handleExport = () => {
    alert("This would trigger a CSV/PDF download in a production environment.");
  };

  const handlePieClick = (data: any) => {
    setStatusFilter(prev => prev === data.name ? null : data.name);
  };

  const handleBarClick = (data: any) => {
    setDeptFilter(prev => prev === data.name ? null : data.name);
  };

  // Shared Tooltip Styles
  const tooltipContentStyle = {
    backgroundColor: 'var(--color-bg-card)',
    borderColor: 'var(--color-border)',
    borderRadius: '12px',
    borderWidth: '1px',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    color: 'var(--color-text-main)',
    padding: '12px 16px',
  };

  const tooltipItemStyle = {
    color: 'var(--color-text-main)',
    fontSize: '13px',
    fontWeight: '600',
    paddingTop: '4px'
  };

  return (
    <div className="space-y-6 lg:space-y-8 animate-fade-in select-none w-full max-w-[1400px] mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-main">Reports & Analysis</h2>
          <p className="text-muted text-sm mt-1">
            {currentUser?.role === 'Coordinator'
              ? 'Performance overview for your department.'
              : 'Comprehensive data view and credit management.'}
          </p>
        </div>
        <button
          onClick={handleExport}
          className="flex items-center space-x-2 bg-card text-main border border-border px-4 py-2 rounded-lg hover:bg-page transition-colors shadow-sm w-full md:w-auto justify-center"
        >
          <Download size={18} />
          <span>Export Report</span>
        </button>
      </div>

      {/* Summary Stats Grid */}
      <div className={`grid grid-cols-2 ${currentUser ? 'lg:grid-cols-4' : 'lg:grid-cols-3'} gap-4`}>
        <div className="bg-card p-4 rounded-xl border border-border shadow-sm">
          <p className="text-xs text-muted font-bold uppercase">Total Events</p>
          <p className="text-xl md:text-2xl font-bold text-main mt-1">{totalEvents}</p>
        </div>
        <div className="bg-card p-4 rounded-xl border border-border shadow-sm">
          <p className="text-xs text-muted font-bold uppercase">Total Credits</p>
          <p className="text-xl md:text-2xl font-bold text-brand-600 mt-1">{totalCredits}</p>
        </div>
        <div className="bg-card p-4 rounded-xl border border-border shadow-sm">
          <p className="text-xs text-muted font-bold uppercase">Avg Credit / Event</p>
          <p className="text-xl md:text-2xl font-bold text-blue-600 mt-1">{avgCredits}</p>
        </div>
        {currentUser && (
          <div className="bg-card p-4 rounded-xl border border-border shadow-sm">
            <p className="text-xs text-muted font-bold uppercase">Pending Grading</p>
            <p className="text-xl md:text-2xl font-bold text-orange-500 mt-1">
              {roleBasedEvents.filter(e => e.credits === 0).length}
            </p>
          </div>
        )}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 gap-6">


        {/* Dept Chart - Full width for Viewers/Guests if logged out, or depending on requirements. 
            Request says "fill the spaces by adjusting the blocks size". 
            If user is logged out (guest), Status Chart is hidden, so this div is the only one in grid (col-span-1 of 1 col grid).
        */}
        <div className="bg-card p-6 rounded-xl border border-border shadow-sm w-full min-w-0">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-main">Events Breakdown</h3>
            <span className="text-[10px] text-muted bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-full border border-border">Click bar to filter table</span>
          </div>
          <div className="h-64">
            {deptData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={deptData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: 'var(--color-text-muted)' }} interval={0} />
                  <YAxis allowDecimals={false} tick={{ fill: 'var(--color-text-muted)' }} width={30} />
                  <Tooltip cursor={{ fill: 'var(--color-bg-page)', opacity: 0.5 }} contentStyle={tooltipContentStyle} itemStyle={tooltipItemStyle} />
                  <Bar
                    dataKey="events"
                    fill="#3b82f6"
                    radius={[4, 4, 0, 0]}
                    barSize={40}
                    className="cursor-pointer"
                    onClick={handleBarClick}
                  >
                    {deptData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={deptFilter === entry.name ? '#2563eb' : '#3b82f6'}
                        stroke={deptFilter === entry.name ? '#0f172a' : 'none'}
                        strokeWidth={deptFilter === entry.name ? 2 : 0}
                        className="transition-all hover:opacity-80"
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-muted text-sm">No data available</div>
            )}
          </div>
        </div>
      </div>

      {/* Main Data Table */}
      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="p-4 md:p-6 border-b border-border flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-lg text-main">Event Logs</h3>
            <p className="text-sm text-muted">
              {currentUser?.role === 'Admin' ? 'View details and manage credits.' : 'View status and feedback.'}
            </p>
          </div>

          {/* Filter Indicators */}
          <div className="flex flex-wrap gap-2">
            {statusFilter && (
              <div className="flex items-center bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-300 px-3 py-1.5 rounded-full text-sm font-medium border border-brand-100 dark:border-brand-800 animate-fade-in">
                <Filter size={14} className="mr-2" />
                Status: {statusFilter}
                <button onClick={() => setStatusFilter(null)} className="ml-2 p-0.5 hover:bg-brand-200 dark:hover:bg-brand-800 rounded-full transition-colors"><X size={14} /></button>
              </div>
            )}
            {deptFilter && (
              <div className="flex items-center bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 px-3 py-1.5 rounded-full text-sm font-medium border border-blue-100 dark:border-blue-800 animate-fade-in">
                <Filter size={14} className="mr-2" />
                Dept: {deptFilter}
                <button onClick={() => setDeptFilter(null)} className="ml-2 p-0.5 hover:bg-blue-200 dark:hover:bg-blue-800 rounded-full transition-colors"><X size={14} /></button>
              </div>
            )}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-muted min-w-[800px] cursor-default">
            <thead className="bg-page text-xs uppercase font-semibold text-muted">
              <tr>
                <th className="px-6 py-4">Event Details</th>
                <th className="px-6 py-4">Department</th>
                <th className="px-6 py-4">SDGs</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Credits</th>
                <th className="px-6 py-4">Actions/Proof</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {tableEvents.length > 0 ? (
                tableEvents.map(event => (
                  <tr key={event.id} className="hover:bg-page transition-colors cursor-pointer" onClick={() => setSelectedEvent(event)}>
                    <td className="px-6 py-4 max-w-xs">
                      <p className="font-bold text-main truncate" title={event.title}>{event.title}</p>
                      <p className="text-xs text-muted">
                        {event.fromDate === event.toDate ? event.fromDate : `${event.fromDate} - ${event.toDate}`} • {event.type}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-main">{event.departmentName}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1 w-32">
                        {event.sdgs.slice(0, 2).map((s, i) => (
                          <span key={i} className="text-[10px] bg-slate-100 dark:bg-slate-700 dark:text-slate-300 px-1.5 py-0.5 rounded border border-border whitespace-nowrap">
                            {s.split('.')[0]}
                          </span>
                        ))}
                        {event.sdgs.length > 2 && <span className="text-[10px] text-muted">+{event.sdgs.length - 2}</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium border ${event.status === 'Rejected'
                        ? 'bg-red-50 text-red-700 border-red-100 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800'
                        : event.credits > 0
                          ? 'bg-green-50 text-green-700 border-green-100 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800'
                          : 'bg-yellow-50 text-yellow-700 border-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800'
                        }`}>
                        {event.status === 'Rejected' ? 'Rejected' : event.credits > 0 ? 'Reviewed' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {/* Inline Credit Editing for Admins - All events editable */}
                      {currentUser?.role === 'Admin' ? (
                        editingId === event.id ? (
                          <div className="flex items-center space-x-2">
                            <input
                              type="number"
                              className="w-16 px-2 py-1 border border-border rounded text-main bg-page text-center"
                              value={tempCredit}
                              onChange={(e) => setTempCredit(Number(e.target.value))}
                              min="0" max="100"
                            />
                            <button onClick={() => handleSaveCredit(event.id)} className="text-green-600 hover:text-green-800">
                              <CheckCircle2 size={20} />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2 group cursor-pointer" onClick={() => handleEditClick(event)}>
                            <span className="font-bold text-main">{event.credits}</span>
                            <span className="text-slate-300 group-hover:text-brand-500 text-[10px]">(Edit)</span>
                          </div>
                        )
                      ) : (
                        <span className="font-bold text-main">{event.credits}</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        {event.proofLink && (
                          <a href={event.proofLink} target="_blank" rel="noreferrer" className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center">
                            <ExternalLink size={12} className="mr-1" /> External Proof
                          </a>
                        )}
                        {event.reportUrl && (
                          <a href={event.reportUrl} target="_blank" rel="noreferrer" className="text-xs text-red-600 dark:text-red-400 hover:underline flex items-center">
                            <FileText size={12} className="mr-1" /> Event Report
                          </a>
                        )}
                        {event.imageUrl && (
                          <a href={event.imageUrl} target="_blank" rel="noreferrer" className="text-xs text-brand-600 dark:text-brand-400 hover:underline flex items-center">
                            <Download size={12} className="mr-1" /> Image/File
                          </a>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-muted">
                    No events found matching current filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {/* Event Detail Modal */}
      {selectedEvent && createPortal(
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity" onClick={() => setSelectedEvent(null)} />
          <div className="bg-card rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative z-10 animate-scale-up flex flex-col [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">

            {/* Modal Header / Banner */}
            <div className="relative h-48 sm:h-64 shrink-0 bg-slate-100 dark:bg-slate-800">
              {selectedEvent.imageUrl ? (
                <img src={selectedEvent.imageUrl} alt={selectedEvent.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted">No Cover Image</div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              <button
                onClick={(e) => { e.stopPropagation(); setSelectedEvent(null); }}
                className="absolute top-4 right-4 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full backdrop-blur-sm transition-all"
              >
                <X size={20} />
              </button>
              <div className="absolute bottom-0 left-0 p-6 sm:p-8">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2 bg-white/20 text-white backdrop-blur-md`}>
                  {selectedEvent.status}
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight mb-1">{selectedEvent.title}</h2>
                <p className="text-white/90 font-medium text-base">{selectedEvent.departmentName}</p>
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
                  <div>
                    <h3 className="text-lg font-bold text-main mb-3 flex items-center"><Info size={18} className="mr-2 text-brand-500" /> Description</h3>
                    <p className="text-muted leading-relaxed whitespace-pre-wrap">{selectedEvent.description}</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-main mb-3 flex items-center"><CheckCircle2 size={18} className="mr-2 text-green-500" /> Actions Taken</h3>
                    <p className="text-muted leading-relaxed whitespace-pre-wrap">{selectedEvent.actionsTaken || "No specific actions details provided."}</p>
                  </div>

                  {selectedEvent.feedback && (
                    <div className="bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4">
                      <h4 className="text-sm font-bold text-yellow-800 dark:text-yellow-400 mb-2 flex items-center">
                        <MessageSquare size={16} className="mr-2" /> Admin Feedback
                      </h4>
                      <p className="text-sm text-yellow-900 dark:text-yellow-200 italic">"{selectedEvent.feedback}"</p>
                    </div>
                  )}
                </div>

                <div className="space-y-6">
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

                  <div className="bg-blue-50 dark:bg-blue-900/10 rounded-xl p-5 border border-blue-100 dark:border-blue-800">
                    <h4 className="text-sm font-bold text-blue-900 dark:text-blue-300 uppercase tracking-wider mb-4">Documentation</h4>
                    <div className="space-y-3">
                      {selectedEvent.reportUrl && (
                        <a href={selectedEvent.reportUrl} target="_blank" rel="noreferrer" className="flex items-center p-3 bg-white dark:bg-slate-800 rounded-lg border border-blue-200 dark:border-blue-700 shadow-sm hover:text-blue-600 transition-colors">
                          <FileText size={18} className="mr-3 text-red-500" />
                          <div className="overflow-hidden">
                            <div className="text-sm font-bold truncate">Event Report</div>
                            <div className="text-[10px] text-muted">View Document</div>
                          </div>
                        </a>
                      )}
                      {selectedEvent.imageUrl && (
                        <a href={selectedEvent.imageUrl} target="_blank" rel="noreferrer" className="flex items-center p-3 bg-white dark:bg-slate-800 rounded-lg border border-blue-200 dark:border-blue-700 shadow-sm hover:text-blue-600 transition-colors">
                          <ImageIcon size={18} className="mr-3 text-brand-500" />
                          <div className="overflow-hidden">
                            <div className="text-sm font-bold truncate">Cover Photo</div>
                            <div className="text-[10px] text-muted">View Full Size</div>
                          </div>
                        </a>
                      )}
                      {selectedEvent.proofLink && (
                        <a href={selectedEvent.proofLink} target="_blank" rel="noreferrer" className="flex items-center p-3 bg-white dark:bg-slate-800 rounded-lg border border-blue-200 dark:border-blue-700 shadow-sm hover:text-blue-600 transition-colors">
                          <ExternalLink size={18} className="mr-3 text-blue-500" />
                          <div className="overflow-hidden">
                            <div className="text-sm font-bold truncate">External Proof</div>
                            <div className="text-[10px] text-muted">Open Link</div>
                          </div>
                        </a>
                      )}
                    </div>
                  </div>
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

export default Reports;