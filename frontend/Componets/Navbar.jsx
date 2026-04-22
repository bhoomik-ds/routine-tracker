import React, { useState } from 'react';
import { FaUserCircle } from "react-icons/fa";
import { HiOutlineArrowRightOnRectangle } from "react-icons/hi2";

const Navbar = ({ name = "Guest", onLogout, onGoToProfile, onGoToHome, onGoToLogin }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white px-6 h-20 shadow-md border-b border-gray-100">
      {/* ADDED 'relative' to the parent container to control the absolute text */}
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between relative">
        
        {/* --- BRANDING SECTION --- */}
        <div className="flex items-center flex-grow md:flex-grow-0">
          <button onClick={onGoToHome} className="flex items-center w-full group">
            
            {/* 1. LOGO: Pushed further left (-ml-4) on mobile, normal on desktop */}
            <img 
              src="/logo.svg" 
              alt="Logo" 
              className="h-[100px] md:h-[140px] w-auto object-contain -ml-4 md:ml-0 z-10 transition-transform group-hover:scale-105" 
            />
            
            {/* 2. TITLE & SLOGAN: Absolute centered on mobile, static & left-aligned on desktop */}
            <div className="absolute left-1/2 -translate-x-1/2 w-max text-center md:static md:translate-x-0 md:text-left flex flex-col justify-center z-0">
              <h1 className="text-xl md:text-2xl font-extrabold tracking-tight leading-none flex justify-center md:justify-start">
                <span className="text-[#2463EB]">Routine</span>
                <span className="ml-1 bg-gradient-to-r from-[#FD820A] to-[#FFB800] bg-clip-text text-transparent">Tracker</span>
              </h1>
              <p className="mt-1 text-[9px] sm:text-[10px] md:text-xs font-bold leading-none">
                <span className="text-[#2463EB]">Track Your Day. </span>
                <span className="text-[#FD820A]">Transform Your Life</span>
              </p>
            </div>

          </button>
        </div>

        {/* --- DESKTOP MENU --- */}
        <div className="hidden items-center gap-8 md:flex z-10">
          <ul className="flex gap-6 font-semibold text-gray-600">
            <li>
              <button onClick={onGoToHome} className="border-b-2 border-[#2463EB] pb-1 text-[#2463EB] transition-all hover:text-blue-700">
                Dashboard
              </button>
            </li>
          </ul>

          <div className="flex items-center gap-4 border-l border-gray-200 pl-6">
            {name !== "Guest" ? (
              <button 
                onClick={onGoToProfile}
                className="flex items-center gap-2 hover:bg-gray-50 p-1.5 rounded-xl transition-all border border-transparent hover:border-gray-200 max-w-[250px]"
                title="Go to Profile"
              >
                <span className="text-sm font-bold text-[#2463EB] tracking-wide flex items-center gap-1">
                  Hello, 
                  <span className="text-[#FD820A] capitalize truncate max-w-[100px] inline-block align-bottom">{name}</span>
                </span>
                <div className="flex items-center justify-center h-10 w-10 shrink-0 rounded-full border-2 border-[#FD820A] bg-gray-50 text-[#FD820A] shadow-sm">
                  <FaUserCircle size={28} /> 
                </div>
              </button>
            ) : (
              <button 
                onClick={onGoToLogin}
                className="flex items-center gap-2 hover:bg-gray-50 p-1.5 rounded-xl transition-all border border-transparent hover:border-gray-200 cursor-pointer"
                title="Log In"
              >
                <span className="text-sm font-bold text-[#2463EB] tracking-wide">Hello, <span className="text-[#FD820A] capitalize">Guest</span></span>
                <div className="flex items-center justify-center h-10 w-10 shrink-0 rounded-full border-2 border-[#FD820A] bg-gray-50 text-[#FD820A] shadow-sm">
                  <FaUserCircle size={28} /> 
                </div>
              </button>
            )}
            
            {name !== "Guest" && (
              <button 
                onClick={onLogout}
                className="flex items-center shrink-0 gap-1 text-gray-400 hover:text-red-500 transition-colors bg-gray-50 hover:bg-red-50 p-2 rounded-lg"
                title="Log out"
              >
                <HiOutlineArrowRightOnRectangle size={20} />
              </button>
            )}
          </div>
        </div>

        {/* --- MOBILE HAMBURGER ICON --- */}
        <button className="flex flex-col gap-1.5 md:hidden shrink-0 z-10" onClick={() => setIsOpen(!isOpen)}>
          <span className={`h-0.5 w-6 bg-gray-800 transition-all ${isOpen ? 'translate-y-2 rotate-45' : ''}`}></span>
          <span className={`h-0.5 w-6 bg-gray-800 transition-all ${isOpen ? 'opacity-0' : ''}`}></span>
          <span className={`h-0.5 w-6 bg-gray-800 transition-all ${isOpen ? '-translate-y-2 -rotate-45' : ''}`}></span>
        </button>
      </div>

      {/* --- MOBILE MENU DROPDOWN --- */}
      <div className={`${isOpen ? 'flex' : 'hidden'} absolute left-0 top-20 w-full flex-col items-center bg-white py-8 shadow-xl border-t border-gray-100 md:hidden`}>
        <ul className="flex flex-col gap-6 text-center text-lg font-bold text-gray-700">
          <li>
            <button onClick={() => { onGoToHome(); setIsOpen(false); }} className="hover:text-[#2463EB]">
              Dashboard
            </button>
          </li>
          
          {name !== "Guest" && (
             <li>
               <button onClick={() => { onGoToProfile(); setIsOpen(false); }} className="hover:text-[#2463EB]">
                 My Profile
               </button>
             </li>
          )}

          {name !== "Guest" && (
             <li><button onClick={() => { onLogout(); setIsOpen(false); }} className="text-red-500">Logout</button></li>
          )}
        </ul>
        <div className="mt-8 flex items-center gap-4 border-t border-gray-100 pt-6 px-6 w-full justify-center">
          <span className="text-gray-800 font-bold capitalize truncate max-w-[150px]">{name}!</span>
          <button 
            onClick={() => { 
              if(name !== "Guest") { 
                onGoToProfile(); 
              } else {
                onGoToLogin();
              }
              setIsOpen(false); 
            }}
            className="h-12 w-12 shrink-0 rounded-full border-2 border-[#FD820A] bg-gray-50 flex items-center justify-center text-[#FD820A]"
          >
             <FaUserCircle size={32} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;