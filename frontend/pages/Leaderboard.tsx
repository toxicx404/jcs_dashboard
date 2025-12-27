import React from 'react';
import { useJCS } from '../services/JCSContext';
import { Trophy, Medal, Award, TrendingUp } from 'lucide-react';

const Leaderboard = () => {
  const { departments } = useJCS();

  // Sort departments by credits descending
  const sortedDepartments = [...departments].sort((a, b) => b.totalCredits - a.totalCredits);

  return (
    <div className="space-y-6 lg:space-y-8 animate-fade-in select-none max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-border pb-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-main flex items-center">
             <Trophy className="mr-3 text-yellow-500" size={32} />
             University Leaderboard
          </h2>
          <p className="text-muted mt-2">
            Comprehensive ranking of all schools based on sustainability credits and event impact.
          </p>
        </div>
        <div className="bg-card px-4 py-2 rounded-lg border border-border shadow-sm">
            <span className="text-xs text-muted uppercase font-bold tracking-wider">Total Schools</span>
            <p className="text-xl font-bold text-main">{departments.length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {/* Top 3 Podium (Visual Treatment) */}
        {sortedDepartments.length >= 3 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                {/* 2nd Place */}
                <div className="bg-gradient-to-b from-slate-50 to-white dark:from-slate-800/50 dark:to-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 flex flex-col items-center justify-end shadow-md order-2 md:order-1 transform md:scale-95">
                    <div className="text-slate-400 font-bold text-sm uppercase tracking-widest mb-2">2nd Place</div>
                    <div className="w-16 h-16 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center font-bold text-2xl mb-3 shadow-inner">2</div>
                    <h3 className="font-bold text-center text-main mb-1">{sortedDepartments[1].name}</h3>
                    <p className="text-2xl font-black text-slate-600 dark:text-slate-400">{sortedDepartments[1].totalCredits} <span className="text-xs font-medium">pts</span></p>
                </div>
                
                {/* 1st Place */}
                <div className="bg-gradient-to-b from-yellow-50 to-white dark:from-yellow-900/20 dark:to-slate-900 border border-yellow-200 dark:border-yellow-700 rounded-2xl p-8 flex flex-col items-center shadow-xl shadow-yellow-100 dark:shadow-none order-1 md:order-2 z-10">
                     <Trophy className="text-yellow-500 mb-2 drop-shadow-sm" size={40} />
                     <div className="text-yellow-600 font-bold text-sm uppercase tracking-widest mb-2">Champion</div>
                     <h3 className="text-xl font-black text-center text-main mb-2">{sortedDepartments[0].name}</h3>
                     <p className="text-4xl font-black text-yellow-600">{sortedDepartments[0].totalCredits} <span className="text-sm font-bold text-muted">pts</span></p>
                     <div className="mt-4 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-bold">
                        {sortedDepartments[0].eventCount} Events
                     </div>
                </div>

                {/* 3rd Place */}
                <div className="bg-gradient-to-b from-orange-50 to-white dark:from-orange-900/20 dark:to-slate-900 border border-orange-200 dark:border-orange-800 rounded-2xl p-6 flex flex-col items-center justify-end shadow-md order-3 transform md:scale-95">
                    <div className="text-orange-400 font-bold text-sm uppercase tracking-widest mb-2">3rd Place</div>
                    <div className="w-16 h-16 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-2xl mb-3 shadow-inner">3</div>
                    <h3 className="font-bold text-center text-main mb-1">{sortedDepartments[2].name}</h3>
                    <p className="text-2xl font-black text-orange-600 dark:text-orange-400">{sortedDepartments[2].totalCredits} <span className="text-xs font-medium">pts</span></p>
                </div>
            </div>
        )}

        {/* Full List */}
        <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
             <div className="p-4 bg-page border-b border-border flex justify-between items-center">
                 <h3 className="font-bold text-muted uppercase text-xs tracking-wider">Full Ranking</h3>
             </div>
             <div className="divide-y divide-border">
                {sortedDepartments.map((dept, index) => {
                    let rankIcon = <span className="text-sm font-bold text-muted w-6 text-center">{index + 1}</span>;
                    let rankClass = "";

                    if (index === 0) {
                        rankIcon = <Trophy size={20} className="text-yellow-500" />;
                        rankClass = "bg-yellow-50/50 dark:bg-yellow-900/10";
                    } else if (index === 1) {
                        rankIcon = <Medal size={20} className="text-slate-400" />;
                        rankClass = "bg-slate-50/50 dark:bg-slate-900/10";
                    } else if (index === 2) {
                        rankIcon = <Medal size={20} className="text-orange-400" />;
                        rankClass = "bg-orange-50/50 dark:bg-orange-900/10";
                    }

                    return (
                        <div key={dept.id} className={`flex items-center p-4 hover:bg-page transition-colors ${rankClass}`}>
                            <div className="w-12 flex justify-center shrink-0">
                                {rankIcon}
                            </div>
                            <div className="flex-1 min-w-0 px-4">
                                <div className="flex items-center justify-between md:justify-start gap-4">
                                    <h4 className="font-bold text-main truncate text-base md:text-lg">{dept.name}</h4>
                                    <span className="hidden md:inline-flex text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-muted border border-border">
                                        {dept.code}
                                    </span>
                                </div>
                                <div className="flex items-center mt-1 text-xs text-muted">
                                    <span className="flex items-center mr-4"><Award size={12} className="mr-1"/> {dept.coordinatorName}</span>
                                    <span className="flex items-center"><TrendingUp size={12} className="mr-1"/> {dept.eventCount} Events</span>
                                </div>
                            </div>
                            <div className="text-right px-4 shrink-0">
                                <span className="block text-2xl font-black text-main">{dept.totalCredits}</span>
                                <span className="text-[10px] uppercase font-bold text-muted">Credits</span>
                            </div>
                        </div>
                    );
                })}
             </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;