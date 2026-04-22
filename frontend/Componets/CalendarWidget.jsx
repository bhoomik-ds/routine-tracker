import React, { useState } from 'react';
import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";

const CalendarWidget = ({ tasks = [] }) => {
  // --- STATE: Track which month we are looking at ---
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  // --- CALENDAR MATH ---
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-11
  
  // Find out what day of the week the 1st of the month falls on (so we can offset the grid)
  const firstDayOfMonth = new Date(year, month, 1).getDay(); 
  // Find out how many days are in this specific month
  const daysInMonth = new Date(year, month + 1, 0).getDate(); 

  // Create arrays to render the grid
  const blanks = Array(firstDayOfMonth).fill(null);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // --- NAVIGATION ---
  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  // --- REAL DATA LOGIC ---
  const getDayStatus = (day) => {
    // 1. Format the day to match Django's YYYY-MM-DD format
    const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    
    // 2. Find all tasks assigned to this specific date
    const tasksForDay = tasks.filter(t => t.date === dateString);

    // If no tasks exist for this day, return 0 (Empty)
    if (tasksForDay.length === 0) return 0;

    // 3. Check if EVERY task for this day is completed
    const allCompleted = tasksForDay.every(t => t.is_completed);
    if (allCompleted) return 1; // 1 = Green (Completed)
    
    // 4. If not completed, check if the day is in the past (so we don't mark today as failed yet)
    const checkDate = new Date(year, month, day);
    checkDate.setHours(23, 59, 59, 999); // End of the day
    const today = new Date();
    
    if (checkDate < today) return 2; // 2 = Red (Missed)
    
    return 0; // It is today or future, still pending!
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-gray-800">Monthly Overview</h3>
        <div className="flex gap-2">
          <button onClick={prevMonth} className="p-1 hover:bg-gray-100 rounded-lg transition-colors text-gray-500">
            <HiChevronLeft />
          </button>
          <button onClick={nextMonth} className="p-1 hover:bg-gray-100 rounded-lg transition-colors text-gray-500">
            <HiChevronRight />
          </button>
        </div>
      </div>

      {/* Dynamic Month/Year Header */}
      <div className="text-center mb-4 text-sm font-bold text-gray-600">
        {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
      </div>

      <div className="grid grid-cols-7 gap-y-4 text-center">
        {/* Render S M T W T F S */}
        {daysOfWeek.map((day, index) => (
          <span key={`header-${index}`} className="text-[10px] font-bold text-gray-400 uppercase">
            {day}
          </span>
        ))}
        
        {/* Render empty spaces before the 1st of the month */}
        {blanks.map((_, index) => (
          <div key={`blank-${index}`} className="py-1"></div>
        ))}

        {/* Render actual days and apply real data colors */}
        {days.map((day) => {
          const status = getDayStatus(day);
          
          return (
            <div key={`day-${day}`} className="flex justify-center items-center relative py-1">
              <span className={`text-xs font-semibold z-10 ${status !== 0 ? 'text-gray-800' : 'text-gray-400'}`}>
                {day}
              </span>
              
              {/* Dynamic Highlights based on Data */}
              {status === 1 && (
                <div className="absolute w-7 h-7 bg-green-100 border border-green-200 rounded-full animate-pulse"></div>
              )}
              {status === 2 && (
                <div className="absolute w-7 h-7 bg-red-100 border border-red-200 rounded-full"></div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-6 border-t border-gray-50 flex justify-around text-[10px] font-bold uppercase tracking-wider">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
          <span className="text-gray-500">Completed</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 bg-red-400 rounded-full"></div>
          <span className="text-gray-500">Missed</span>
        </div>
      </div>
    </div>
  );
};

export default CalendarWidget;