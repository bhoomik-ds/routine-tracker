import React from 'react';
import { HiLightBulb } from "react-icons/hi2";

const DailyTipCard = ({ 
  quote = "Focus on the process, not the outcome.", 
  label = "Daily Motivation" 
}) => {
  return (
    <div className="group bg-gradient-to-br from-[#0A2F6B] to-[#2463EB] p-6 rounded-3xl text-white shadow-lg transition-all hover:shadow-blue-200/50 hover:-translate-y-1">
      <div className="flex items-start justify-between mb-3">
        <div className="p-2 bg-white/10 rounded-xl backdrop-blur-md">
          <HiLightBulb className="text-[#FFB800] text-xl animate-pulse" />
        </div>
        <p className="text-[10px] opacity-70 uppercase font-black tracking-widest">
          {label}
        </p>
      </div>

      <h4 className="text-lg font-bold italic leading-relaxed">
        "{quote}"
      </h4>
      
      {/* Decorative element to make it look more like a "SaaS" widget */}
      <div className="mt-4 h-1 w-12 bg-gradient-to-r from-[#FD820A] to-[#FFB800] rounded-full opacity-80" />
    </div>
  );
};

export default DailyTipCard;