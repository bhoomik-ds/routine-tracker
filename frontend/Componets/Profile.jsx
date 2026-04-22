import React, { useState } from 'react';
import axios from 'axios';
import { FaUserCircle } from "react-icons/fa";
import { HiUser, HiOutlineEnvelope, HiCheck } from "react-icons/hi2";

const Profile = ({ userData, onProfileUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // --- UPDATED: Match the new 'full_name' field from Django ---
  const [formData, setFormData] = useState({
    username: userData?.username || "",
    full_name: userData?.full_name || "", 
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setSuccess(false); 
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.put('http://127.0.0.1:8000/api/user/me/', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      onProfileUpdate(response.data);
      setSuccess(true);
    } catch (err) {
      setError("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 max-w-2xl mx-auto mt-10">
      
      <div className="flex items-center gap-6 mb-8 border-b border-gray-100 pb-8">
        <div className="h-24 w-24 rounded-full border-4 border-orange-50 bg-orange-100 flex items-center justify-center text-[#FD820A] shadow-sm">
          <FaUserCircle size={60} />
        </div>
        <div>
          <h2 className="text-3xl font-black text-gray-800 tracking-tight">My Profile</h2>
          <p className="text-gray-500 font-medium mt-1">Manage your personal information</p>
        </div>
      </div>

      <form onSubmit={handleUpdate} className="space-y-6">
        {error && <p className="text-red-500 text-sm font-bold bg-red-50 p-3 rounded-xl">{error}</p>}
        {success && (
          <p className="text-green-600 text-sm font-bold bg-green-50 p-3 rounded-xl flex items-center gap-2">
            <HiCheck className="text-lg" /> Profile updated successfully!
          </p>
        )}

        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-2">Email Address (Read Only)</label>
          <div className="relative">
            <HiOutlineEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
            <input 
              type="email" 
              className="w-full bg-gray-100 border border-gray-200 rounded-2xl py-4 pl-12 pr-4 text-gray-500 cursor-not-allowed"
              value={userData?.email || ""} 
              disabled 
            />
          </div>
          <p className="text-xs text-gray-400 ml-2">Contact support to change your login email.</p>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-2">Display Username</label>
          <div className="relative">
            <HiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
            <input 
              type="text" name="username" 
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-[#2463EB] transition-all font-bold text-gray-700"
              value={formData.username} onChange={handleChange} required
            />
          </div>
        </div>

        {/* --- UPDATED: Replaced Calendar input with text input for Full Name --- */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-2">Full Name</label>
          <div className="relative">
            <HiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
            <input 
              type="text" name="full_name" placeholder="Enter your full name"
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-[#2463EB] transition-all font-bold text-gray-700"
              value={formData.full_name} onChange={handleChange} required
            />
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100">
          <button 
            disabled={loading} type="submit" 
            className="w-full bg-gradient-to-r from-[#2463EB] to-[#0A2F6B] text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-blue-200 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-70"
          >
            {loading ? "Saving Changes..." : "Save Profile"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Profile;