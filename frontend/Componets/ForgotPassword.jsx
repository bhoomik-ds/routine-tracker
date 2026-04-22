import React, { useState } from 'react';
import axios from 'axios';
import { 
  HiOutlineEnvelope, 
  HiOutlineKey, 
  HiLockClosed,
  HiOutlineEye,      // <--- NEW
  HiOutlineEyeSlash  // <--- NEW
} from "react-icons/hi2";

const ForgotPassword = ({ onBackToLogin }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // --- NEW: States to toggle password visibility ---
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({ email: "", otp: "", password: "", confirmPassword: "" });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  // STEP 1: Request OTP
  const handleSendOTP = async (e) => {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      await axios.post('http://127.0.0.1:8000/api/auth/forgot-password/send-otp/', { email: formData.email });
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.error || "Account not found.");
    } finally { setLoading(false); }
  };

  // STEP 2: Verify OTP
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      await axios.post('http://127.0.0.1:8000/api/auth/verify-otp/', { email: formData.email, otp_code: formData.otp });
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.error || "Invalid code.");
    } finally { setLoading(false); }
  };

  // STEP 3: Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    if (formData.password.length < 8) return setError("Password must be 8+ characters.");
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(formData.password)) return setError("Needs a special character.");
    if (formData.password !== formData.confirmPassword) return setError("Passwords do not match.");

    setLoading(true);
    try {
      await axios.post('http://127.0.0.1:8000/api/auth/forgot-password/reset/', {
        email: formData.email,
        password: formData.password,
        confirm_password: formData.confirmPassword
      });
      setStep(4); // Success Step!
    } catch (err) {
      setError("Failed to reset password.");
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-[40px] p-10 shadow-xl shadow-blue-100/50 border border-gray-100">
        
        <div className="text-center mb-8">
          <div className="inline-flex p-4 bg-blue-50 rounded-3xl mb-4">
            <HiLockClosed className="text-[#2463EB] text-3xl" />
          </div>
          <h2 className="text-3xl font-black text-gray-800">Reset Password</h2>
          <p className="text-gray-400 font-medium mt-2">{step === 4 ? "Success!" : `Step ${step} of 3`}</p>
        </div>

        {error && <p className="text-red-500 text-sm text-center font-bold mb-6 bg-red-50 p-3 rounded-xl">{error}</p>}

        {/* STEP 1 */}
        {step === 1 && (
          <form onSubmit={handleSendOTP} className="space-y-6">
            <p className="text-sm text-gray-500 text-center">Enter your email and we'll send you a reset code.</p>
            <div className="relative">
              <HiOutlineEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
              <input type="email" name="email" placeholder="Email Address" className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-[#2463EB]" value={formData.email} onChange={handleChange} required />
            </div>
            <button disabled={loading} type="submit" className="w-full bg-gradient-to-r from-[#2463EB] to-[#0A2F6B] text-white py-4 rounded-2xl font-bold">{loading ? "Sending..." : "Send Code"}</button>
          </form>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <form onSubmit={handleVerifyOTP} className="space-y-6">
            <div className="relative">
              <HiOutlineKey className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
              <input type="text" name="otp" placeholder="Enter 6-digit OTP" maxLength="6" className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-[#2463EB] text-center tracking-[0.5em] font-bold text-lg" value={formData.otp} onChange={handleChange} required />
            </div>
            <button disabled={loading} type="submit" className="w-full bg-gradient-to-r from-[#2463EB] to-[#0A2F6B] text-white py-4 rounded-2xl font-bold">{loading ? "Verifying..." : "Verify Code"}</button>
          </form>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div className="relative">
              <HiLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
              <input 
                // --- NEW: Toggle input type ---
                type={showPassword ? "text" : "password"} 
                name="password" 
                placeholder="New Password" 
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-3 pl-12 pr-12 focus:outline-none focus:border-[#2463EB]" 
                value={formData.password} 
                onChange={handleChange} 
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
            
            <div className="relative">
              <HiLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
              <input 
                // --- NEW: Toggle input type ---
                type={showConfirmPassword ? "text" : "password"} 
                name="confirmPassword" 
                placeholder="Confirm New Password" 
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-3 pl-12 pr-12 focus:outline-none focus:border-[#2463EB]" 
                value={formData.confirmPassword} 
                onChange={handleChange} 
                required 
              />
              {/* --- NEW: Eye Icon Toggle Button --- */}
              <button 
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#2463EB] transition-colors"
              >
                {showConfirmPassword ? <HiOutlineEyeSlash className="text-xl" /> : <HiOutlineEye className="text-xl" />}
              </button>
            </div>
            <button disabled={loading} type="submit" className="w-full bg-gradient-to-r from-[#2463EB] to-[#0A2F6B] text-white py-4 rounded-2xl font-bold mt-2">{loading ? "Resetting..." : "Set New Password"}</button>
          </form>
        )}

        {/* STEP 4: Success */}
        {step === 4 && (
          <div className="text-center space-y-6">
            <p className="text-green-500 font-bold text-lg">Your password has been successfully reset!</p>
            <button onClick={onBackToLogin} className="w-full bg-[#2463EB] text-white py-4 rounded-2xl font-bold">Go to Login</button>
          </div>
        )}

        {step !== 4 && (
          <p className="text-center mt-6">
            <button onClick={onBackToLogin} className="text-gray-400 font-bold hover:text-[#2463EB]">Cancel & go back</button>
          </p>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;