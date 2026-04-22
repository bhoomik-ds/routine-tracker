import React, { useState } from 'react';
import axios from 'axios';
import { 
  HiLockClosed, 
  HiOutlineEnvelope, 
  HiOutlineEye, 
  HiOutlineEyeSlash 
} from "react-icons/hi2";

const Login = ({ onLoginSuccess, onGoToRegister, onGoToForgotPassword }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  
  // --- NEW: State to toggle password visibility ---
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/token/', {
        username: email, 
        password
      });
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      onLoginSuccess(); 
    } catch (err) {
      setError("Invalid email or password. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] px-4">
      <div className="max-w-md w-full bg-white rounded-[40px] p-10 shadow-xl shadow-blue-100/50 border border-gray-100">
        <div className="text-center mb-10">
          <div className="inline-flex p-4 bg-blue-50 rounded-3xl mb-4">
            <HiLockClosed className="text-[#2463EB] text-3xl" />
          </div>
          <h2 className="text-3xl font-black text-gray-800">Welcome Back</h2>
          <p className="text-gray-400 font-medium mt-2">Log in to track your routine</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {error && <p className="text-red-500 text-sm text-center font-bold">{error}</p>}
          
          <div className="relative">
            <HiOutlineEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
            <input 
              type="email" 
              placeholder="Email Address"
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-[#2463EB] transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="relative">
            <HiLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
            <input 
              // --- NEW: Toggle input type ---
              type={showPassword ? "text" : "password"} 
              placeholder="Password"
              // Add pr-12 to make room for the eye icon
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 pl-12 pr-12 focus:outline-none focus:border-[#2463EB] transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {/* --- NEW: Eye Icon Toggle Button --- */}
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#2463EB] transition-colors"
            >
              {showPassword ? <HiOutlineEyeSlash className="text-xl" /> : <HiOutlineEye className="text-xl" />}
            </button>
          </div>

          <div className="flex justify-end">
            <button 
              type="button" 
              onClick={onGoToForgotPassword}
              className="text-sm font-bold text-[#2463EB] hover:underline"
            >
              Forgot Password?
            </button>
          </div>

          <button 
            type="submit"
            className="w-full bg-gradient-to-r from-[#2463EB] to-[#0A2F6B] text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-blue-200 hover:scale-[1.02] active:scale-95 transition-all"
          >
            Sign In
          </button>
        </form>

        <p className="text-center mt-6 text-gray-500 font-medium">
          Don't have an account?{' '}
          <button onClick={onGoToRegister} className="text-[#FD820A] font-bold hover:underline">
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;