import React from 'react';

const CompletionProgressCard = ({ completedTasks = 0, totalTasks = 0 }) => {
  // Calculate percentage safely
  const percentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  // SVG Circle Logic
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="bg-[#2463EB] rounded-3xl p-8 text-white shadow-xl flex flex-col items-center justify-center transition-all hover:scale-[1.02]">
      
      {/* Circular Progress Container */}
      <div className="relative flex items-center justify-center mb-6">
        {/* SVG Circle */}
        <svg className="transform -rotate-90 w-44 h-44">
          {/* Background Circle (Static) */}
          <circle
            cx="88"
            cy="88"
            r={radius}
            stroke="rgba(255, 255, 255, 0.2)"
            strokeWidth="12"
            fill="transparent"
          />
          {/* Progress Circle (Dynamic) */}
          <circle
            cx="88"
            cy="88"
            r={radius}
            stroke="white"
            strokeWidth="12"
            fill="transparent"
            strokeDasharray={circumference}
            style={{ 
              strokeDashoffset: strokeDashoffset,
              transition: 'stroke-dashoffset 0.5s ease-out' 
            }}
            strokeLinecap="round"
          />
        </svg>
        
        {/* Percentage Text inside Circle */}
        <div className="absolute flex flex-col items-center">
          <span className="text-4xl font-black tracking-tighter">
            {percentage}%
          </span>
        </div>
      </div>

      {/* Footer Text */}
      <div className="text-center">
        <h3 className="text-xl font-bold opacity-100">Daily Progress</h3>
        <p className="text-blue-100 font-medium mt-1">
          {completedTasks} / {totalTasks} Tasks Completed
        </p>
      </div>
    </div>
  );
};

export default CompletionProgressCard;