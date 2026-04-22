import React, { useState, useEffect } from 'react';
import { HiOutlineCalendar, HiOutlineClock } from "react-icons/hi2";

const WelcomeHeader = ({ name = "Bhumik" }) => {
  const [dateTime, setDateTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setDateTime(new Date()), 1000);
    return () => clearInterval(timer); 
  }, []);

  const formattedDate = dateTime.toLocaleDateString('en-US', {
    weekday: 'long', 
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const formattedTime = dateTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });

  return (
    <div className="bg-white rounded-2xl p-5 md:p-8 mb-8 shadow-sm border border-gray-100 flex flex-col lg:flex-row lg:items-center justify-between gap-5 transition-all overflow-hidden">
      
      {/* Name Section - Added min-w-0 to allow text truncation */}
      <div className="min-w-0">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-800 tracking-tight truncate">
          Welcome, <span className="text-[#2463EB]">{name}!</span>
        </h2>
        <p className="text-gray-500 text-sm md:text-base font-medium mt-1 truncate">
          Ready to crush your goals today?
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3 md:gap-4">
        {/* Date & Day Section */}
        <div className="flex items-center gap-2 md:gap-3 px-4 py-2 md:px-5 md:py-3 bg-blue-50 rounded-xl md:rounded-2xl border border-blue-100 shadow-sm shrink-0">
          <HiOutlineCalendar className="text-[#2463EB] text-xl md:text-2xl shrink-0" />
          <div className="flex flex-col">
            <span className="text-gray-400 text-[9px] md:text-[10px] font-bold uppercase tracking-widest leading-none mb-1">Today's Date</span>
            <span className="text-gray-700 font-bold text-xs md:text-sm leading-none whitespace-nowrap">{formattedDate}</span>
          </div>
        </div>

        {/* Real-time Clock Section */}
        <div className="flex items-center gap-2 md:gap-3 px-4 py-2 md:px-5 md:py-3 bg-orange-50 rounded-xl md:rounded-2xl border border-orange-100 shadow-sm shrink-0">
          <HiOutlineClock className="text-[#FD820A] text-xl md:text-2xl shrink-0" />
          <div className="flex flex-col">
            <span className="text-gray-400 text-[9px] md:text-[10px] font-bold uppercase tracking-widest leading-none mb-1">Current Time</span>
            <span className="text-gray-700 font-mono font-bold text-xs md:text-sm leading-none min-w-[80px] md:min-w-[100px] whitespace-nowrap">
              {formattedTime}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeHeader;