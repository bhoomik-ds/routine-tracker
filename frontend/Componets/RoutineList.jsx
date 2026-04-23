import React, { useState } from 'react';
import axios from 'axios';
import { 
  HiFire, 
  HiCheckCircle, 
  HiPlus, 
  HiOutlineBell, 
  HiOutlinePencil, 
  HiOutlineTrash,
  HiCheck,
  HiXMark
} from "react-icons/hi2";
import { BsCircle } from "react-icons/bs";

const RoutineList = ({ tasks, onRefresh, onRequireAuth }) => {
  const [newTask, setNewTask] = useState("");
  const [notificationTime, setNotificationTime] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editTime, setEditTime] = useState("");

  const toggleTask = async (task) => {
    const token = localStorage.getItem('access_token'); 
    if (!token) return onRequireAuth();

    try {
      await axios.patch(`https://routine-tracker-api-g32g.onrender.com/api/tasks/${task.id}/`, 
        { is_completed: !task.is_completed },
        { headers: { Authorization: `Bearer ${token}` } } 
      );
      onRefresh(); 
    } catch (error) {
      console.error("Error toggling task:", error);
    }
  };

  const addTask = async () => {
    if (!newTask.trim()) return;
    const token = localStorage.getItem('access_token'); 
    if (!token) return onRequireAuth();

    try {
      await axios.post('https://routine-tracker-api-g32g.onrender.com/api/tasks/', 
        {
          title: newTask,
          current_goal: 1.0, 
          unit: "Session",   
          is_completed: false,
          streak: 0,
          notification_time: notificationTime || null
        },
        { headers: { Authorization: `Bearer ${token}` } } 
      );

      setNewTask(""); 
      setNotificationTime(""); 
      onRefresh(); 
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const deleteTask = async (taskId) => {
    const token = localStorage.getItem('access_token');
    if (!token) return onRequireAuth();

    try {
      await axios.delete(`https://routine-tracker-api-g32g.onrender.com/api/tasks/${taskId}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      onRefresh();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const saveEdit = async (taskId) => {
    if (!editTitle.trim()) return;
    const token = localStorage.getItem('access_token');
    if (!token) return onRequireAuth();

    try {
      await axios.patch(`https://routine-tracker-api-g32g.onrender.com/api/tasks/${taskId}/`, 
        { 
          title: editTitle,
          notification_time: editTime || null 
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setEditingId(null);
      onRefresh();
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const startEditing = (task) => {
    setEditingId(task.id);
    setEditTitle(task.title);
    setEditTime(task.notification_time ? task.notification_time.substring(0, 5) : "");
  };

  const formatTime = (timeString) => {
    if (!timeString) return "";
    const [hours, minutes] = timeString.split(':');
    const h = parseInt(hours, 10);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const formattedHours = h % 12 || 12;
    return `${formattedHours}:${minutes} ${ampm}`;
  };

  const overallStreak = tasks.reduce((max, task) => Math.max(max, task.streak), 0);

  return (
    <div className="bg-white rounded-3xl p-5 md:p-6 shadow-sm border border-gray-100 flex flex-col h-full min-h-[550px] w-full overflow-hidden">
      
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-800">Today's Routine</h3>
        <div className="flex items-center gap-1 text-xs md:text-sm font-bold text-gray-500">
          <span className="hidden sm:inline">Overall Streak:</span>
          <span className="text-[#FD820A] flex items-center">
            {overallStreak} <HiFire className="ml-0.5" /> <span className="hidden sm:inline ml-1">Days</span>
          </span>
        </div>
      </div>

      <div className="flex-grow space-y-3 overflow-y-auto pr-1 md:pr-2 custom-scrollbar">
        {tasks && tasks.length > 0 ? (
          tasks.map((task) => (
            <div 
              key={task.id}
              className={`group flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl border transition-all gap-3 ${
                task.is_completed 
                ? 'bg-blue-50/50 border-blue-100' 
                : 'bg-gray-50 border-gray-100 hover:border-blue-200'
              }`}
            >
              
              {editingId === task.id ? (
                // --- UPDATED: flex-col on mobile, flex-row on desktop ---
                <div className="flex-grow flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full min-w-0">
                  <input 
                    type="text" 
                    value={editTitle} 
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full sm:flex-grow bg-white border border-gray-300 rounded-xl py-2 px-3 focus:outline-none focus:border-[#2463EB] font-bold text-gray-700 min-w-0"
                    autoFocus
                  />
                  <div className="flex w-full sm:w-auto gap-2">
                    <input 
                      type="time" 
                      value={editTime} 
                      onChange={(e) => setEditTime(e.target.value)}
                      className="flex-1 sm:w-28 bg-white border border-gray-300 rounded-xl py-2 px-2 focus:outline-none focus:border-[#2463EB] text-sm font-medium text-gray-600 min-w-0"
                    />
                    <div className="flex gap-1 shrink-0">
                      <button 
                        onClick={() => saveEdit(task.id)} 
                        className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                        title="Save"
                      >
                        <HiCheck size={18} strokeWidth={2} />
                      </button>
                      <button 
                        onClick={() => setEditingId(null)} 
                        className="p-2 bg-gray-200 text-gray-600 rounded-lg hover:bg-gray-300 transition-colors"
                        title="Cancel"
                      >
                        <HiXMark size={18} strokeWidth={2} />
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {/* --- UPDATED: min-w-0 prevents flex blowout --- */}
                  <div className="flex items-start sm:items-center gap-3 md:gap-4 min-w-0 w-full">
                    <button onClick={() => toggleTask(task)} className="focus:outline-none mt-1 sm:mt-0 shrink-0">
                      {task.is_completed ? (
                        <HiCheckCircle className="text-[#2463EB] text-2xl shrink-0" />
                      ) : (
                        <BsCircle className="text-gray-300 text-[20px] shrink-0 hover:text-blue-400" />
                      )}
                    </button>
                    
                    {/* --- UPDATED: break-words to handle long tasks --- */}
                    <div className="flex flex-col min-w-0 flex-grow">
                      <span className={`font-bold transition-all break-words whitespace-normal ${
                        task.is_completed ? 'text-gray-400 line-through' : 'text-gray-700'
                      }`}>
                        {task.title}
                      </span>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-0.5">
                        <span className="text-[10px] md:text-[11px] font-semibold text-blue-500 uppercase tracking-wider">
                          Goal: {task.current_goal} {task.unit}
                        </span>
                        
                        {task.notification_time && (
                          <span className={`text-[10px] md:text-[11px] font-bold flex items-center gap-1 uppercase tracking-wider ${task.is_completed ? 'text-gray-400' : 'text-[#FD820A]'}`}>
                            <HiOutlineBell size={12} className="shrink-0" /> {formatTime(task.notification_time)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-2 pl-8 sm:pl-0 mt-2 sm:mt-0 shrink-0">
                    {task.streak > 0 && (
                      <div className="flex items-center gap-1 px-3 py-1 bg-white rounded-full border border-gray-100 shadow-sm">
                        <span className="text-xs font-bold text-gray-600">{task.streak}</span>
                        <HiFire className="text-[#FD820A] text-sm" />
                      </div>
                    )}
                    
                    <div className="flex items-center gap-1 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => startEditing(task)}
                        className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit Task"
                      >
                        <HiOutlinePencil size={18} />
                      </button>
                      <button 
                        onClick={() => deleteTask(task.id)}
                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Task"
                      >
                        <HiOutlineTrash size={18} />
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-10 text-gray-400">
            <p className="italic">No tasks found. Add one below!</p>
          </div>
        )}
      </div>

      <div className="mt-6 pt-6 border-t border-gray-100 w-full">
        <div className="flex flex-col gap-3 w-full">
          <input 
            type="text"
            placeholder="Enter a new task..."
            className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 px-5 focus:outline-none focus:border-[#2463EB] focus:ring-1 focus:ring-[#2463EB] transition-all font-medium text-gray-700 min-w-0"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addTask()}
          />
          {/* --- UPDATED: Stack inputs on tiny screens --- */}
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <input 
              type="time" 
              className="w-full sm:flex-1 bg-gray-50 border border-gray-200 rounded-2xl py-3 px-4 focus:outline-none focus:border-[#2463EB] text-gray-600 font-medium min-w-0"
              value={notificationTime} 
              onChange={(e) => setNotificationTime(e.target.value)}
              title="Set a reminder time"
            />
            <button 
              onClick={addTask}
              className="w-full sm:w-auto bg-gradient-to-r from-[#FD820A] to-[#FFB800] text-white px-5 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-sm shadow-orange-200 hover:scale-[1.02] transition-all active:scale-95 whitespace-nowrap shrink-0"
            >
              <HiPlus strokeWidth={2} className="shrink-0" />
              Add Task
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoutineList;