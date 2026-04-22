import React, { useState } from 'react';
import axios from 'axios';
import { 
  HiUserPlus, 
  HiUser, 
  HiLockClosed, 
  HiOutlineEnvelope, 
  HiOutlineKey,
  HiOutlineEye,      
  HiOutlineEyeSlash  
} from "react-icons/hi2";

const Register = ({ onRegisterSuccess, onGoToLogin }) => {
  const [step, setStep] = useState(1); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    username: "", 
    fullName: "", // <--- NEW: Replaced dob with fullName
    password: "",
    confirmPassword: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await axios.post('http://127.0.0.1:8000/api/auth/send-otp/', { 
        email: formData.email 
      });
      setStep(2); 
    } catch (err) {
      setError(err.response?.data?.error || "Failed to send verification code. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await axios.post('http://127.0.0.1:8000/api/auth/verify-otp/', { 
        email: formData.email, 
        otp_code: formData.otp 
      });
      setStep(3); 
    } catch (err) {
      setError(err.response?.data?.error || "Invalid or expired code.");
    } finally {
      setLoading(false);
    }
  };

  const handleFinalRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password.length < 8) {
      return setError("Password must be at least 8 characters long.");
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(formData.password)) {
      return setError("Password must contain at least one special character.");
    }
    if (formData.password !== formData.confirmPassword) {
      return setError("Passwords do not match.");
    }

    setLoading(true);
    try {
      await axios.post('http://127.0.0.1:8000/api/auth/register/', {
        username: formData.username, 
        email: formData.email,
        full_name: formData.fullName, // <--- UPDATED: Sending full_name instead of dob
        password: formData.password,
        confirm_password: formData.confirmPassword
      });
      onRegisterSuccess(); 
    } catch (err) {
      const data = err.response?.data;
      if (data?.username) setError(`Username: ${data.username[0]}`);
      else if (data?.email) setError(`Email: ${data.email[0]}`);
      else setError("Registration failed. Please check your details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-[40px] p-10 shadow-xl shadow-orange-100/50 border border-gray-100 transition-all duration-300">
        
        <div className="text-center mb-8">
          <div className="inline-flex p-4 bg-orange-50 rounded-3xl mb-4 transition-all">
            {step === 1 && <HiOutlineEnvelope className="text-[#FD820A] text-3xl" />}
            {step === 2 && <HiOutlineKey className="text-[#FD820A] text-3xl" />}
            {step === 3 && <HiUserPlus className="text-[#FD820A] text-3xl" />}
          </div>
          <h2 className="text-3xl font-black text-gray-800">
            {step === 1 && "Create Account"}
            {step === 2 && "Verify Email"}
            {step === 3 && "Final Details"}
          </h2>
          <p className="text-gray-400 font-medium mt-2">
            Step {step} of 3
          </p>
        </div>

        {error && <p className="text-red-500 text-sm text-center font-bold mb-6 bg-red-50 p-3 rounded-xl">{error}</p>}

        {step === 1 && (
          <form onSubmit={handleSendOTP} className="space-y-6">
            <div className="relative">
              <HiOutlineEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
              <input 
                type="email" name="email" placeholder="Enter your Email Address"
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-[#FD820A] transition-all"
                value={formData.email} onChange={handleChange} required
              />
            </div>
            <button disabled={loading} type="submit" className="w-full bg-gradient-to-r from-[#FD820A] to-[#FFB800] text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-orange-200 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-70">
              {loading ? "Sending..." : "Send Verification Code"}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerifyOTP} className="space-y-6">
            <p className="text-sm text-center text-gray-500 font-medium">We sent a 6-digit code to <br/><span className="text-gray-800 font-bold">{formData.email}</span></p>
            <div className="relative">
              <HiOutlineKey className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
              <input 
                type="text" name="otp" placeholder="Enter 6-digit OTP" maxLength="6"
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-[#FD820A] transition-all text-center tracking-[0.5em] font-bold text-lg"
                value={formData.otp} onChange={handleChange} required
              />
            </div>
            <button disabled={loading} type="submit" className="w-full bg-gradient-to-r from-[#FD820A] to-[#FFB800] text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-orange-200 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-70">
              {loading ? "Verifying..." : "Verify Code"}
            </button>
            <button type="button" onClick={() => setStep(1)} className="w-full text-gray-400 font-bold text-sm hover:text-[#FD820A]">
              Change Email Address
            </button>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleFinalRegister} className="space-y-4">
            <div className="relative">
              <HiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
              <input 
                type="text" name="username" placeholder="Choose a Username"
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-3 pl-12 pr-4 focus:outline-none focus:border-[#FD820A] transition-all"
                value={formData.username} onChange={handleChange} required
              />
            </div>

            {/* --- NEW: Full Name Input (Replaced DOB) --- */}
            <div className="relative">
              <HiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
              <input 
                type="text" name="fullName" placeholder="Enter your Full Name"
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-3 pl-12 pr-4 focus:outline-none focus:border-[#FD820A] transition-all"
                value={formData.fullName} onChange={handleChange} required
              />
            </div>

            <div className="relative">
              <HiLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
              <input 
                type={showPassword ? "text" : "password"} 
                name="password" 
                placeholder="Create Password"
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-3 pl-12 pr-12 focus:outline-none focus:border-[#FD820A] transition-all"
                value={formData.password} onChange={handleChange} required
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#FD820A] transition-colors"
              >
                {showPassword ? <HiOutlineEyeSlash className="text-xl" /> : <HiOutlineEye className="text-xl" />}
              </button>
            </div>

            <div className="relative">
              <HiLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
              <input 
                type={showConfirmPassword ? "text" : "password"} 
                name="confirmPassword" 
                placeholder="Confirm Password"
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-3 pl-12 pr-12 focus:outline-none focus:border-[#FD820A] transition-all"
                value={formData.confirmPassword} onChange={handleChange} required
              />
              <button 
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#FD820A] transition-colors"
              >
                {showConfirmPassword ? <HiOutlineEyeSlash className="text-xl" /> : <HiOutlineEye className="text-xl" />}
              </button>
            </div>

            <ul className="text-xs text-gray-400 font-medium pl-2 list-disc list-inside">
              <li>Min. 8 characters long</li>
              <li>At least 1 special character (!@#$%)</li>
            </ul>

            <button disabled={loading} type="submit" className="w-full bg-gradient-to-r from-[#FD820A] to-[#FFB800] text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-orange-200 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-70 mt-2">
              {loading ? "Creating..." : "Complete Registration"}
            </button>
          </form>
        )}

        <p className="text-center mt-6 text-gray-500 font-medium">
          Already have an account?{' '}
          <button onClick={onGoToLogin} className="text-[#2463EB] font-bold hover:underline">Log in</button>
        </p>
      </div>
    </div>
  );
};

export default Register;