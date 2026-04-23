import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Navbar from '../Componets/Navbar';
import WelcomeHeader from '../Componets/WelcomeHeader';
import CompletionProgressCard from '../Componets/CompletionProgressCard';
import RoutineList from '../Componets/RoutineList';
import CalendarWidget from '../Componets/CalendarWidget';
import StatsWidget from '../Componets/StatsWidget';
import DailyTipCard from '../Componets/DailyTipCard';
import Footer from '../Componets/Footer';
import Login from '../Componets/Login';
import Register from '../Componets/Register';
import ForgotPassword from '../Componets/ForgotPassword';
import Profile from '../Componets/Profile';

function App() {
  const [tasks, setTasks] = useState([]);
  const [currentView, setCurrentView] = useState('home'); 
  const [userData, setUserData] = useState(null); 

  const notifiedTasks = useRef(new Set());

  const fetchUserProfile = async (token) => {
    try {
      const response = await axios.get('https://routine-tracker-api-g32g.onrender.com/api/user/me/', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUserData(response.data); 
    } catch (error) {
      console.error("Failed to fetch user profile", error);
    }
  };

  const fetchTasks = async () => {
    const token = localStorage.getItem('access_token');
    
    if (!token) {
      setTasks([]);
      setUserData(null);
      return;
    }

    if (!userData) {
      fetchUserProfile(token);
    }

    try {
      const response = await axios.get('https://routine-tracker-api-g32g.onrender.com/api/tasks/', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks(response.data);
    } catch (error) {
      if (error.response?.status === 401) {
        handleLogout();
      }
    }
  };

  useEffect(() => {
    if (currentView === 'home') {
      fetchTasks();
    }
  }, [currentView]);

  useEffect(() => {
    if ("Notification" in window && Notification.permission !== "granted" && Notification.permission !== "denied") {
      Notification.requestPermission();
    }

    const checkAlarms = setInterval(() => {
      if (tasks.length === 0 || !("Notification" in window) || Notification.permission !== "granted") return;

      const now = new Date();
      const currentHours = String(now.getHours()).padStart(2, '0');
      const currentMinutes = String(now.getMinutes()).padStart(2, '0');
      const currentTime = `${currentHours}:${currentMinutes}`;

      tasks.forEach(task => {
        if (!task.is_completed && task.notification_time && !notifiedTasks.current.has(task.id)) {
          const taskTime = task.notification_time.substring(0, 5);
          
          if (taskTime === currentTime) {
            new Notification("Routine Tracker Reminder 🔔", {
              body: `It's time to crush your goal: ${task.title}!`,
              icon: '/logo.svg' 
            });
            notifiedTasks.current.add(task.id);
          }
        }
      });
    }, 30000); 

    return () => clearInterval(checkAlarms);
  }, [tasks]);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setTasks([]);
    setUserData(null); 
    notifiedTasks.current.clear(); 
    setCurrentView('home'); 
  };

  if (currentView === 'login') {
    return (
      <Login 
        onLoginSuccess={() => setCurrentView('home')} 
        onGoToRegister={() => setCurrentView('register')} 
        onGoToForgotPassword={() => setCurrentView('forgotPassword')} 
      />
    );
  }

  if (currentView === 'register') {
    return (
      <Register 
        onRegisterSuccess={() => setCurrentView('login')} 
        onGoToLogin={() => setCurrentView('login')} 
      />
    );
  }

  if (currentView === 'forgotPassword') {
    return (
      <ForgotPassword 
        onBackToLogin={() => setCurrentView('login')}
      />
    );
  }

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.is_completed).length;
  const successRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const displayUsername = userData ? (userData.full_name || userData.username) : "Guest";
  
  return (
    // --- UPDATED: Added w-full and overflow-x-hidden here ---
    <div className="min-h-screen w-full overflow-x-hidden flex flex-col bg-[#F8FAFC]">
      <Navbar 
        name={displayUsername} 
        onLogout={handleLogout} 
        onGoToProfile={() => setCurrentView('profile')} 
        onGoToHome={() => setCurrentView('home')} 
        onGoToLogin={() => setCurrentView('login')}
      />

      <main className="flex-grow max-w-[1440px] mx-auto w-full px-4 sm:px-6 py-8">
        {currentView === 'profile' ? (
          <Profile 
            userData={userData} 
            onProfileUpdate={(updatedData) => setUserData(updatedData)} 
          />
        ) : (
          <>
            <WelcomeHeader name={displayUsername} />
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-6 order-1 lg:order-2">
                <RoutineList 
                  tasks={tasks} 
                  onRefresh={fetchTasks} 
                  onRequireAuth={() => setCurrentView('login')} 
                />
              </div>

              <div className="lg:col-span-3 order-2 lg:order-3 flex flex-col gap-8">
                <CalendarWidget tasks={tasks} />
                <StatsWidget tasks={tasks} successRate={successRate} />
              </div>

              <div className="lg:col-span-3 order-3 lg:order-1 flex flex-col gap-8">
                <CompletionProgressCard completedTasks={completedTasks} totalTasks={totalTasks} />
                <DailyTipCard />
              </div>
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default App;