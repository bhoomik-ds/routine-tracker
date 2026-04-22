import React from 'react';
import { FaGithub, FaLinkedin, FaTwitter, FaHeart } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="mt-auto bg-white border-t border-gray-100 pt-12 pb-8 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
          
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <img src="/logo.svg" alt="Logo" className="h-8 w-auto object-contain" />
              <h2 className="text-xl font-extrabold tracking-tight">
                <span className="text-[#2463EB]">Routine</span>
                <span className="text-[#FD820A]">Tracker</span>
              </h2>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed">
              Track your daily habits, crush your goals, and transform your life with our dynamic tracking system.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-gray-800 mb-4">Navigation</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#" className="hover:text-[#2463EB] transition-colors">Dashboard</a></li>
              <li><a href="#" className="hover:text-[#2463EB] transition-colors">Statistics</a></li>
              <li><a href="#" className="hover:text-[#2463EB] transition-colors">Habit Tips</a></li>
            </ul>
          </div>

          {/* Support Section */}
          <div>
            <h4 className="font-bold text-gray-800 mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#" className="hover:text-[#2463EB] transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-[#2463EB] transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-[#2463EB] transition-colors">Terms of Service</a></li>
            </ul>
          </div>

          {/* Social Section */}
          <div>
            <h4 className="font-bold text-gray-800 mb-4">Connect</h4>
            <div className="flex gap-4">
              <a href="#" className="p-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-blue-50 hover:text-[#2463EB] transition-all">
                <FaGithub size={20} />
              </a>
              <a href="#" className="p-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-blue-50 hover:text-[#2463EB] transition-all">
                <FaLinkedin size={20} />
              </a>
              <a href="#" className="p-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-blue-50 hover:text-[#2463EB] transition-all">
                <FaTwitter size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-50 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-400 font-medium">
            © 2026 Routine Tracker. All rights reserved.
          </p>
          <p className="text-xs text-gray-500 font-bold flex items-center gap-1">
            Made with <FaHeart className="text-red-500" /> by 
            <span className="text-[#2463EB] hover:underline cursor-pointer">Bhoomik Sorathiya</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;