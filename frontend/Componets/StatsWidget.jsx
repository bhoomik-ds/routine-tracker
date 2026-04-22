import React from 'react';
import { HiOutlineCheckCircle, HiArrowTrendingUp } from "react-icons/hi2";

// --- UPDATED: Pass down 'tasks' and 'successRate' from App.jsx ---
const StatsWidget = ({ tasks = [], successRate = 0 }) => {
  // --- REAL DATA CALCULATIONS ---
  
  // Helper function: Check if a task's date falls within the last X days
  const isWithinLastXDays = (dateString, days) => {
    const taskDate = new Date(dateString);
    const today = new Date();
    const pastDate = new Date();
    pastDate.setDate(today.getDate() - days);
    return taskDate >= pastDate && taskDate <= today;
  };

  // 1. Calculate Weekly Progress (Last 7 Days)
  const weeklyTasks = tasks.filter(t => isWithinLastXDays(t.date, 7));
  const completedWeeklyTasks = weeklyTasks.filter(t => t.is_completed).length;
  const totalWeeklyTasks = weeklyTasks.length;

  // 2. Calculate Consistency (Last 30 Days)
  const monthlyTasks = tasks.filter(t => isWithinLastXDays(t.date, 30));
  const completedMonthlyTasks = monthlyTasks.filter(t => t.is_completed).length;
  const consistencyRate = monthlyTasks.length > 0 
    ? Math.round((completedMonthlyTasks / monthlyTasks.length) * 100) 
    : 0;

  // --- SVG CIRCLE MATH (Overall Success Rate) ---
  const radius = 35;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (successRate / 100) * circumference;

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
      <h3 className="font-bold text-gray-800 mb-6">Stats</h3>
      
      <div className="space-y-6">
        {/* --- DYNAMIC WEEKLY PROGRESS --- */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-50 rounded-lg text-green-500"><HiOutlineCheckCircle size={20} /></div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase">Weekly Progress</p>
              <p className="text-sm font-bold text-gray-700">
                {completedWeeklyTasks} / {totalWeeklyTasks || 0} Tasks
              </p>
            </div>
          </div>
        </div>

        {/* --- DYNAMIC CONSISTENCY BAR --- */}
        <div className="space-y-2">
          <div className="flex justify-between items-end">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-lg text-[#2463EB]">
                <HiArrowTrendingUp size={20} />
              </div>
              <p className="text-[10px] font-bold text-gray-400 uppercase">30-Day Consistency</p>
            </div>
            <p className="text-xs font-bold text-gray-700">{consistencyRate}%</p>
          </div>
          <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[#2463EB] to-blue-400 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${consistencyRate}%` }} // Dynamic Width!
            ></div>
          </div>
        </div>

        {/* --- DYNAMIC OVERALL SUCCESS RATE CIRCLE --- */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-50 mt-4">
          <p className="text-[10px] font-bold text-gray-400 uppercase leading-tight mt-4">Overall<br/>Success Rate</p>
          <div className="relative flex items-center justify-center mt-4">
            <svg className="w-20 h-20 transform -rotate-90">
              <circle cx="40" cy="40" r={radius} stroke="#F3F4F6" strokeWidth="6" fill="transparent" />
              <circle 
                cx="40" cy="40" r={radius} stroke="#2463EB" strokeWidth="6" fill="transparent" 
                strokeDasharray={circumference} 
                style={{ strokeDashoffset: offset, transition: 'stroke-dashoffset 1s ease-out' }} 
                strokeLinecap="round" 
              />
            </svg>
            <span className="absolute text-xs font-black text-gray-700">{successRate || 0}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsWidget;