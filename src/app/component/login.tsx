"use client";
import { useState } from "react";
import Image from "next/image";

interface LoginProps {
  onLoginSuccess?: (role: string) => void;
  onBackToLanding?: () => void;
}

const Login = ({ onLoginSuccess, onBackToLanding }: LoginProps) => {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Dummy login credentials
  const DOKTER_USER_ID = "dokter123";
  const DOKTER_PASSWORD = "dokter123";
  const ADMIN_USER_ID = "admin123";
  const ADMIN_PASSWORD = "admin123";

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    let userRole = "";

    // Validate login for dokter
    if (userId === DOKTER_USER_ID && password === DOKTER_PASSWORD) {
      userRole = "dokter";
    }
    // Validate login for admin
    else if (userId === ADMIN_USER_ID && password === ADMIN_PASSWORD) {
      userRole = "admin";
    } else {
      // Login failed
      setError("User ID atau Password salah. Gunakan: dokter123/dokter123 atau admin123/admin123");
      return;
    }

    // Login successful
    if (onLoginSuccess) {
      onLoginSuccess(userRole);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row overflow-x-hidden">
      {/* Left Section - White Background */}
      <div className="flex-shrink-0 flex flex-col px-3 sm:px-4 md:px-8 lg:px-24 py-2 sm:py-3 md:py-4 lg:py-12 lg:flex-1 max-h-[45vh] lg:max-h-none">
        {/* Logo */}
        <div className="mb-1.5 sm:mb-2 md:mb-3 lg:mb-8">
          <button
            onClick={onBackToLanding}
            className="cursor-pointer"
          >
            <Image
              src="/assets/LOGO_CAREIT.svg"
              alt="CARE-IT Logo"
              width={180}
              height={90}
              className="object-contain w-16 sm:w-20 md:w-24 lg:w-48"
              priority
            />
          </button>
        </div>

        {/* 3D Medical Illustration - Reduced size on mobile */}
        <div className="flex items-center justify-center relative h-[120px] sm:h-[140px] md:h-[160px] lg:flex-1 lg:min-h-[400px] lg:h-auto flex-1">
          <Image
            src="/assets/Login/logindokterbanyak.svg"
            alt="Medical Professionals Illustration"
            width={600}
            height={500}
            className="object-contain w-full h-full max-w-[140px] sm:max-w-[180px] md:max-w-[220px] lg:max-w-md"
            priority
          />
        </div>
      </div>

      {/* Right Section - Blue Gradient Background */}
      <div className="flex-1 relative hidden lg:flex items-center justify-center overflow-hidden">
        {/* Blue Gradient Background */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #87CEEB 0%, #5BAFE2 30%, #2591D0 100%)' }}>
          {/* White Curve - Smooth diagonal curve from top-left to bottom-right */}
          <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" style={{ zIndex: 1 }}>
            <defs>
              <linearGradient id="curveGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#87CEEB" stopOpacity="0" />
                <stop offset="100%" stopColor="#87CEEB" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              d="M 0 0 L 100 0 L 100 100 C 85 85, 60 70, 40 60 C 25 55, 10 50, 0 40 L 0 0 Z"
              fill="white"
            />
          </svg>
        </div>

        {/* Login Form */}
        <div className="relative z-10 w-full max-w-md px-4 sm:px-8">
          {/* Welcome Title */}
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-8 sm:mb-12 text-center">
            Welcome
          </h2>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4 sm:space-y-6">
            {/* User ID Input */}
            <div>
              <input
                type="text"
                placeholder="Enter User ID"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className="w-full bg-[#87CEEB] text-white placeholder-white rounded-full py-3 sm:py-4 px-4 sm:px-6 text-base sm:text-lg focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-transparent"
              />
            </div>

            {/* Password Input */}
            <div>
              <input
                type="password"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#87CEEB] text-white placeholder-white rounded-full py-3 sm:py-4 px-4 sm:px-6 text-base sm:text-lg focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-transparent"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="text-red-200 text-xs sm:text-sm text-center bg-red-500/20 rounded-full py-2 px-3 sm:px-4">
                {error}
              </div>
            )}

            {/* Login Button */}
            <div className="pt-2 sm:pt-4">
              <button
                type="submit"
                className="w-full bg-[#d4a574] hover:bg-[#c49663] text-white font-bold py-3 sm:py-4 px-4 sm:px-6 rounded-full text-base sm:text-lg transition-colors shadow-lg"
              >
                Login
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Mobile Login Form */}
      <div className="lg:hidden w-full flex items-center justify-center bg-gradient-to-b from-[#1e7ba8] to-[#87CEEB] px-4 sm:px-6 md:px-8 py-4 sm:py-5 md:py-6 flex-shrink-0 min-h-[55vh]">
        <div className="w-full max-w-md">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2.5 sm:mb-3 md:mb-4 text-center">
            Welcome
          </h2>
          <form onSubmit={handleLogin} className="space-y-2 sm:space-y-2.5 md:space-y-3">
            <input
              type="text"
              placeholder="Enter User ID"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="w-full bg-[#87CEEB] text-white placeholder-white rounded-full py-2 sm:py-2.5 md:py-3 px-3 sm:px-4 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-white"
            />
            <input
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#87CEEB] text-white placeholder-white rounded-full py-2 sm:py-2.5 md:py-3 px-3 sm:px-4 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-white"
            />
            {error && (
              <div className="text-red-200 text-xs text-center bg-red-500/20 rounded-full py-1.5 px-2 sm:px-3">
                {error}
              </div>
            )}
            <div className="pt-0.5 sm:pt-1">
              <button
                type="submit"
                className="w-full bg-[#d4a574] hover:bg-[#c49663] active:bg-[#b88752] text-white font-bold py-2.5 sm:py-3 px-4 rounded-full text-sm sm:text-base transition-colors shadow-lg"
              >
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;

