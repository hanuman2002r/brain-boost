
import React, { useState, useEffect } from 'react';
import { getBrainBoostFact } from '../services/geminiService';
import { UserStats, Achievement } from '../types';

const Dashboard: React.FC = () => {
  const [boost, setBoost] = useState<string>('Loading your daily brain boost...');
  const [stats] = useState<UserStats>({
    points: 1250,
    streak: 7,
    quizzesCompleted: 14,
    cardsMastered: 48,
    rank: 'Scholar'
  });

  const achievements: Achievement[] = [
    { id: '1', title: 'Early Bird', description: 'Study 3 days before 8 AM', icon: '🌅', unlocked: true },
    { id: '2', title: 'Quiz Master', description: 'Get 100% on 5 quizzes', icon: '🏆', unlocked: true },
    { id: '3', title: 'Memory Legend', description: 'Master 100 flashcards', icon: '🧠', unlocked: false },
    { id: '4', title: 'Speed Demon', description: 'Complete quiz in < 1 min', icon: '⚡', unlocked: false },
  ];

  useEffect(() => {
    const fetchBoost = async () => {
      try {
        const fact = await getBrainBoostFact();
        setBoost(fact);
      } catch (e) {
        setBoost("Your brain is 75% water! Stay hydrated for better focus.");
      }
    };
    fetchBoost();
  }, []);

  return (
    <div className="space-y-6 md:pl-20">
      {/* Daily Boost */}
      <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4 inline-block">Daily Brain Boost</span>
          <h2 className="text-2xl md:text-3xl font-bold mb-4 leading-tight">{boost}</h2>
          <button className="bg-white text-indigo-600 px-6 py-2 rounded-full font-bold hover:bg-opacity-90 transition-all shadow-md">
            Got it! +10 XP
          </button>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total XP', value: stats.points, color: 'bg-blue-50 text-blue-600', icon: '💎' },
          { label: 'Rank', value: stats.rank, color: 'bg-amber-50 text-amber-600', icon: '👑' },
          { label: 'Mastered', value: stats.cardsMastered, color: 'bg-emerald-50 text-emerald-600', icon: '🧠' },
          { label: 'Quizzes', value: stats.quizzesCompleted, color: 'bg-rose-50 text-rose-600', icon: '📝' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center">
            <span className="text-2xl mb-1">{stat.icon}</span>
            <span className="text-2xl font-bold text-slate-800">{stat.value}</span>
            <span className="text-xs text-slate-400 font-medium uppercase tracking-tighter">{stat.label}</span>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Achievements */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <span>Achievements</span>
            <span className="text-sm font-normal text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">2/4 Unlocked</span>
          </h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {achievements.map((ach) => (
              <div key={ach.id} className={`p-4 rounded-2xl border transition-all flex items-start gap-4 ${ach.unlocked ? 'bg-white border-slate-100 shadow-sm' : 'bg-slate-100/50 border-transparent grayscale'}`}>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${ach.unlocked ? 'bg-indigo-50' : 'bg-slate-200'}`}>
                  {ach.icon}
                </div>
                <div>
                  <h4 className="font-bold text-slate-800">{ach.title}</h4>
                  <p className="text-sm text-slate-500">{ach.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Leaderboard Snippet */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <span>Top Scholars</span>
            <span className="text-sm font-normal text-slate-400">Global</span>
          </h3>
          <div className="space-y-4">
            {[
              { name: 'Alex M.', points: 2840, rank: 1, avatar: 'https://picsum.photos/seed/alex/100' },
              { name: 'Sarah K.', points: 2610, rank: 2, avatar: 'https://picsum.photos/seed/sarah/100' },
              { name: 'David L.', points: 2350, rank: 3, avatar: 'https://picsum.photos/seed/david/100' },
              { name: 'You', points: 1250, rank: 42, avatar: 'https://picsum.photos/seed/you/100', isSelf: true },
            ].map((user, i) => (
              <div key={i} className={`flex items-center gap-3 p-2 rounded-xl ${user.isSelf ? 'bg-indigo-50 ring-1 ring-indigo-200' : ''}`}>
                <span className={`w-6 text-sm font-bold ${user.rank <= 3 ? 'text-amber-500' : 'text-slate-400'}`}>#{user.rank}</span>
                <img src={user.avatar} className="w-10 h-10 rounded-full border-2 border-white" alt="" />
                <div className="flex-1">
                  <div className="text-sm font-bold text-slate-700">{user.name}</div>
                  <div className="text-xs text-slate-400">{user.points} XP</div>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 py-2 text-indigo-600 text-sm font-bold hover:bg-indigo-50 rounded-xl transition-colors">
            View Full Leaderboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
