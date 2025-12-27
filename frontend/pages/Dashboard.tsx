
import React, { useState, useEffect } from 'react';
import { useJCS } from '../services/JCSContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, AreaChart, Area } from 'recharts';
import { Trophy, Calendar, Users, Target, Medal, ArrowRight } from 'lucide-react';
import { SDG_LIST } from '../types';
import { Link } from 'react-router-dom';

// Reusable Skeleton Component
const Skeleton = ({ className }: { className?: string }) => (
  <div className={`relative overflow-hidden bg-slate-200 dark:bg-slate-700/50 rounded-lg ${className}`}>
    <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/40 dark:via-white/10 to-transparent z-10"></div>
  </div>
);

const Dashboard = () => {
  const { departments, events, currentUser } = useJCS();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initial data loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  // Sort departments by credits for leaderboard
  const sortedDepartments = [...departments].sort((a, b) => b.totalCredits - a.totalCredits);
  const topDepartment = sortedDepartments[0];
  const approvedEvents = events.filter(e => e.status === 'Approved');
  const totalEvents = approvedEvents.length;
  const totalParticipants = approvedEvents.reduce((acc, curr) => acc + curr.participants, 0);

  // Updated colors to match Red theme
  const COLORS = ['#ef4444', '#3b82f6', '#f59e0b', '#64748b', '#8b5cf6'];

  // --- Advanced Analytics (JS Max) ---

  // 1. SDG Distribution
  const sdgCounts = approvedEvents.reduce((acc: any, event) => {
    event.sdgs.forEach(sdg => {
      const key = sdg.split('.')[0]; // Get number like "13"
      acc[key] = (acc[key] || 0) + 1;
    });
    return acc;
  }, {});

  const sdgChartData = Object.keys(sdgCounts).map(key => ({
    name: `SDG ${key}`,
    value: sdgCounts[key]
  })).sort((a, b) => b.value - a.value).slice(0, 5); // Top 5

  const mostPopularSDG = sdgChartData.length > 0 ? sdgChartData[0].name : "N/A";

  // 2. Credit Trends Analysis
  let trendData = [];
  let bestMonth = "N/A"; // Or 'Best Event' depending on view, keeping variable name simple

  if (currentUser?.role === 'Coordinator' && currentUser?.departmentId) {
    // --- Coordinator View: Event-by-Event ---
    const myEvents = approvedEvents.filter(e => e.departmentId === currentUser.departmentId);

    // Sort by date (Oldest -> Newest)
    trendData = myEvents
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map(e => ({
        name: e.title.length > 12 ? e.title.substring(0, 12) + '...' : e.title, // Truncated for Axis
        fullName: e.title,
        credits: e.credits,
        date: e.date
      }));

    // For Coordinators, "Best Month" logic might just show "Highest Credit Event"
    // But to minimize UI changes elsewhere, we'll keep the 'bestMonth' stat for now or repurpose it?
    // The previous code calculated 'bestMonth' from 'trendData'. 
    // If we change trendData structure, we need to ensure 'bestMonth' calculation below doesn't break if it expects specific format.
    // The original code used 'trendData' which had 'name' (Month) and 'credits'.
    // My new 'trendData' has 'name' (Event) and 'credits'. So Math.max still works.

  } else {
    // --- Admin/Viewer View: Monthly Aggregation ---
    const monthlyData = approvedEvents.reduce((acc: any, event) => {
      const month = new Date(event.date).toLocaleString('default', { month: 'short' });
      if (!acc[month]) acc[month] = 0;
      acc[month] += event.credits;
      return acc;
    }, {});

    const monthOrder: any = { 'Jan': 1, 'Feb': 2, 'Mar': 3, 'Apr': 4, 'May': 5, 'Jun': 6, 'Jul': 7, 'Aug': 8, 'Sep': 9, 'Oct': 10, 'Nov': 11, 'Dec': 12 };
    trendData = Object.keys(monthlyData).map(key => ({
      name: key,
      credits: monthlyData[key]
    })).sort((a, b) => monthOrder[a.name] - monthOrder[b.name]);
  }

  // Find best month using Math.max
  const maxMonthlyCredits = trendData.length > 0 ? Math.max(...trendData.map(d => d.credits)) : 0;
  // Use existing variable, no redeclaration
  bestMonth = trendData.find(d => d.credits === maxMonthlyCredits)?.name || "N/A";

  // Shared Tooltip Styles for High Visibility
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

  const tooltipLabelStyle = {
    color: 'var(--color-text-muted)',
    fontSize: '12px',
    fontWeight: '500',
    marginBottom: '4px'
  };


  if (isLoading) {
    return (
      <div className="space-y-6 lg:space-y-8 select-none">
        {/* Header Skeleton */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-96" />
          </div>
          <Skeleton className="h-4 w-32" />
        </div>

        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-card p-5 lg:p-6 rounded-xl shadow-sm border border-border">
              <div className="flex justify-between items-start">
                <div className="space-y-2 w-full">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-3 w-32" />
                </div>
                <Skeleton className="h-10 w-10 rounded-lg" />
              </div>
            </div>
          ))}
        </div>

        {/* Charts Row Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          <div className="lg:col-span-2 bg-card p-6 rounded-xl shadow-sm border border-border">
            <Skeleton className="h-6 w-48 mb-6" />
            <Skeleton className="h-[300px] w-full" />
          </div>
          <div className="bg-card p-6 rounded-xl shadow-sm border border-border">
            <div className="flex justify-between mb-6">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-8 w-8 rounded-lg" />
            </div>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="h-8 w-8 rounded-lg" />
                  <div className="flex-1 space-y-1">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                  <Skeleton className="h-6 w-12" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Analytics Row Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          <div className="bg-card p-6 rounded-xl shadow-sm border border-border">
            <Skeleton className="h-6 w-48 mb-4" />
            <Skeleton className="h-56 w-full" />
          </div>
          <div className="bg-card p-6 rounded-xl shadow-sm border border-border">
            <Skeleton className="h-6 w-48 mb-4" />
            <Skeleton className="h-56 w-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 lg:space-y-8 animate-fade-in select-none">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2">
        <div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-main">Sustainability Overview</h2>
          <p className="text-muted text-sm sm:text-base mt-1">Real-time insights into university sustainability efforts.</p>
        </div>
        <div className="text-xs sm:text-sm text-muted">
          Last updated: Today
        </div>
      </div>

      {/* Stats Cards - Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <div className="bg-card p-5 lg:p-6 rounded-xl shadow-sm border border-border">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-muted text-xs lg:text-sm font-medium">Top Performer</p>
              <h3 className="text-lg lg:text-xl font-bold text-main mt-1 truncate max-w-[150px]">{topDepartment?.code || "N/A"}</h3>
              <p className="text-xs text-brand-600 mt-1">{topDepartment?.totalCredits || 0} Credits</p>
            </div>
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 rounded-lg">
              <Trophy size={20} className="lg:w-6 lg:h-6" />
            </div>
          </div>
        </div>

        <div className="bg-card p-5 lg:p-6 rounded-xl shadow-sm border border-border">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-muted text-xs lg:text-sm font-medium">Total Approved Events</p>
              <h3 className="text-xl lg:text-2xl font-bold text-main mt-1">{totalEvents}</h3>
              <p className="text-xs text-muted mt-1">
                {currentUser?.role === 'Coordinator' ? 'High Score Event:' : 'Best Month:'} {bestMonth}
              </p>
            </div>
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-lg">
              <Calendar size={20} className="lg:w-6 lg:h-6" />
            </div>
          </div>
        </div>

        <div className="bg-card p-5 lg:p-6 rounded-xl shadow-sm border border-border">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-muted text-xs lg:text-sm font-medium">Community Impact</p>
              <h3 className="text-xl lg:text-2xl font-bold text-main mt-1">{totalParticipants}</h3>
              <p className="text-xs text-muted mt-1">Active participants</p>
            </div>
            <div className="p-2 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-lg">
              <Users size={20} className="lg:w-6 lg:h-6" />
            </div>
          </div>
        </div>

        <div className="bg-card p-5 lg:p-6 rounded-xl shadow-sm border border-border">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-muted text-xs lg:text-sm font-medium">Top Focus Area</p>
              <h3 className="text-lg lg:text-xl font-bold text-main mt-1 truncate max-w-[120px]" title={mostPopularSDG}>
                {mostPopularSDG}
              </h3>
              <p className="text-xs text-muted mt-1">Most targeted SDG</p>
            </div>
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-lg">
              <Target size={20} className="lg:w-6 lg:h-6" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-card p-5 lg:p-6 rounded-xl shadow-sm border border-border w-full min-w-0 select-none">
          <h3 className="text-base lg:text-lg font-bold text-main mb-6">Department Rankings (Total Credits)</h3>
          <div className="h-80 sm:h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sortedDepartments.slice(0, 10)} layout="vertical" margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="var(--color-border)" />
                <XAxis type="number" hide />
                <YAxis dataKey="code" type="category" tick={{ fill: 'var(--color-text-muted)', fontSize: 12 }} width={40} />
                <Tooltip
                  cursor={{ fill: 'var(--color-bg-page)', opacity: 0.5 }}
                  contentStyle={tooltipContentStyle}
                  itemStyle={tooltipItemStyle}
                  labelStyle={tooltipLabelStyle}
                />
                <Bar dataKey="totalCredits" radius={[0, 4, 4, 0]} barSize={24} className="md:barSize-32">
                  {sortedDepartments.slice(0, 10).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Leaderboard List - Top 5 Only */}
        <div className="bg-card p-5 lg:p-6 rounded-xl shadow-sm border border-border flex flex-col h-full w-full min-w-0">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base lg:text-lg font-bold text-main">Leaderboard</h3>
            <div className="bg-yellow-100 dark:bg-yellow-900/30 p-1.5 rounded-lg text-yellow-600">
              <Trophy size={18} />
            </div>
          </div>

          <div className="flex-1 flex flex-col gap-3">
            {sortedDepartments.slice(0, 5).map((dept, index) => {
              // Styling logic for top ranks
              let rankStyle = "bg-page border border-border text-muted font-bold";
              let icon = <span className="text-xs">{index + 1}</span>;

              if (index === 0) {
                rankStyle = "bg-gradient-to-br from-yellow-100 to-yellow-50 border-yellow-200 text-yellow-700 dark:from-yellow-900/40 dark:to-yellow-900/10 dark:border-yellow-800 dark:text-yellow-400";
                icon = <Trophy size={14} fill="currentColor" />;
              } else if (index === 1) {
                rankStyle = "bg-gradient-to-br from-slate-100 to-slate-50 border-slate-200 text-slate-700 dark:from-slate-800 dark:to-slate-900 dark:border-slate-700 dark:text-slate-300";
                icon = <Medal size={14} />;
              } else if (index === 2) {
                rankStyle = "bg-gradient-to-br from-orange-100 to-orange-50 border-orange-200 text-orange-800 dark:from-orange-900/40 dark:to-orange-900/10 dark:border-orange-800 dark:text-orange-400";
                icon = <Medal size={14} />;
              }

              return (
                <div key={dept.id} className="flex items-center p-3 rounded-xl hover:bg-page/50 transition-colors border border-transparent hover:border-border group">
                  {/* Rank Badge */}
                  <div className={`
                    w-8 h-8 rounded-lg flex items-center justify-center mr-4 shadow-sm flex-shrink-0 transition-transform group-hover:scale-110
                    ${rankStyle}
                  `}>
                    {icon}
                  </div>

                  {/* Dept Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className={`text-sm font-bold truncate ${index < 3 ? 'text-main' : 'text-muted group-hover:text-main'}`}>
                      {dept.name}
                    </h4>
                    <div className="flex items-center mt-0.5 space-x-2">
                      <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-page border border-border text-muted">
                        {dept.code}
                      </span>
                      <span className="text-xs text-muted">{dept.eventCount} Events</span>
                    </div>
                  </div>

                  {/* Score */}
                  <div className="text-right pl-3">
                    <div className="text-lg font-black text-main leading-none">
                      {dept.totalCredits}
                    </div>
                    <div className="text-[9px] font-bold text-muted uppercase tracking-wider mt-0.5">
                      PTS
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* View All Button */}
          <div className="mt-4 pt-4 border-t border-border">
            <Link
              to="/leaderboard"
              className="flex items-center justify-center w-full py-2 text-sm font-medium text-brand-600 hover:text-brand-700 hover:bg-brand-50 dark:hover:bg-brand-900/20 rounded-lg transition-colors group"
            >
              View Full Ranking <ArrowRight size={16} className="ml-1.5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>

      {/* Analytics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        {/* SDG Pie Chart */}
        <div className="bg-card p-5 lg:p-6 rounded-xl shadow-sm border border-border w-full min-w-0 select-none">
          <h3 className="text-base lg:text-lg font-bold text-main mb-4">SDG Impact Distribution</h3>
          <div className="h-56 sm:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sdgChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {sdgChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={tooltipContentStyle}
                  itemStyle={tooltipItemStyle}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center flex-wrap gap-2 mt-2">
            {sdgChartData.map((d, i) => (
              <div key={i} className="flex items-center text-xs text-muted">
                <span className="w-2 h-2 rounded-full mr-1" style={{ backgroundColor: COLORS[i % COLORS.length] }}></span>
                {d.name}
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Trend Area Chart */}
        <div className="bg-card p-5 lg:p-6 rounded-xl shadow-sm border border-border w-full min-w-0 select-none">
          <h3 className="text-base lg:text-lg font-bold text-main mb-4">
            {currentUser?.role === 'Coordinator' ? 'Event Credit History' : 'Monthly Credit Growth'}
          </h3>
          <div className="h-56 sm:h-64">
            <ResponsiveContainer width="100%" height="100%">
              {currentUser?.role === 'Coordinator' ? (
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="colorEventCredits" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: 'var(--color-text-muted)' }} interval={0} angle={-45} textAnchor="end" height={60} />
                  <YAxis tick={{ fontSize: 10, fill: 'var(--color-text-muted)' }} width={30} />
                  <Tooltip
                    contentStyle={tooltipContentStyle}
                    itemStyle={tooltipItemStyle}
                    labelStyle={tooltipLabelStyle}
                    cursor={{ stroke: 'var(--color-text-muted)', strokeWidth: 1, strokeDasharray: '3 3' }}
                  />
                  <Area type="monotone" dataKey="credits" stroke="#ef4444" fillOpacity={1} fill="url(#colorEventCredits)" />
                </AreaChart>
              ) : (
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="colorCredits" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: 'var(--color-text-muted)' }} interval={0} />
                  <YAxis tick={{ fontSize: 10, fill: 'var(--color-text-muted)' }} width={30} />
                  <Tooltip
                    contentStyle={tooltipContentStyle}
                    itemStyle={tooltipItemStyle}
                    labelStyle={tooltipLabelStyle}
                  />
                  <Area type="monotone" dataKey="credits" stroke="#ef4444" fillOpacity={1} fill="url(#colorCredits)" />
                </AreaChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;