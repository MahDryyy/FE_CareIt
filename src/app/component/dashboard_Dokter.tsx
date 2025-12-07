"use client";

import React, { useState } from "react";
import TarifRumahSakit from "./tarif-rumah-sakit";
import Image from "next/image";
import Sidebar from "./sidebar";
import TarifBPJS from "./tarif-bpjs";
import BillingPasien from "./billing-pasien";
import RiwayatBillingPasien from "./riwayat-billing-pasien";
import BukuSaku from "./buku-saku";
import Fornas from "./fornas";

interface DashboardProps {
  onLogout?: () => void;
}

const Dashboard = ({ onLogout }: DashboardProps) => {
  const [activeMenu, setActiveMenu] = useState("Home");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    // Clear authentication
    localStorage.removeItem("isAuthenticated");
    // Call parent logout handler
    if (onLogout) {
      onLogout();
    }
  };

  const menuItems = [
    { name: "Home", icon: "🏠" },
    { name: "Tarif Rumah Sakit", icon: "🏥" },
    { name: "Tarif BPJS", icon: "💳" },
    { name: "Billing Pasien", icon: "📊" },
    { name: "Riwayat Billing Pasien", icon: "🕒" },
    { name: "Buku Saku", icon: "📚" },
    { name: "FORNAS", icon: "⚙️" },
  ];

  const warningItems = [
  {
    message: "Billing mencapai 50% dari Tarif INA-CBG",
    icon: "/assets/dashboard_dokter/warning-green.svg",
  },
  {
    message: "Billing mencapai 80% dari Tarif INA-CBG",
    icon: "/assets/dashboard_dokter/warning-yellow.svg",
  },
  {
    message: "Billing melebihi dari Tarif INA-CBG",
    icon: "/assets/dashboard_dokter/warning-red.svg",
  },
];


  return (
    <div className="flex min-h-screen bg-[#F5FAFD]">
      {/* Hamburger Menu Button - Mobile Only */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden bg-[#2591D0] text-white p-2 rounded-lg shadow-lg hover:bg-[#1e7ba8] transition-colors"
        aria-label="Toggle sidebar"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {isSidebarOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>

      {/* Sidebar */}
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
        menuItems={menuItems}
      />

      {/* Main Content */}
      <div className="flex-1 w-full px-3 sm:px-4 md:px-6 py-4 sm:py-6">
        {/* Render content based on active menu */}

          {activeMenu === "Tarif Rumah Sakit" && <TarifRumahSakit />}
          {activeMenu === "Tarif BPJS" && <TarifBPJS />}
          {activeMenu === "Billing Pasien" && <BillingPasien />}
          {activeMenu === "Riwayat Billing Pasien" && <RiwayatBillingPasien />}
          {activeMenu === "Buku Saku" && <BukuSaku />}
          {activeMenu === "FORNAS" && <Fornas />}
           {activeMenu === "Home" && (
    <>
      
        {/* Top Header */}
           

            {/* Content Area */}
            <div className="flex-1 p-2 sm:p-4 md:p-6 overflow-y-auto">
              {/* Greeting Card */}
             <div className="mb-4 sm:mb-6">

 {/* DATE + LOGOUT */}
<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-2 gap-2 sm:gap-0">
  <p className="text-blue-500 text-xs sm:text-sm">
    Senin, 8 Desember 2025
  </p>
</div>

{/* Fixed Logout Button - Top Right */}
<button
  onClick={handleLogout}
  className="fixed top-4 right-4 z-50 flex items-center space-x-1 sm:space-x-2 bg-white sm:bg-transparent px-2 sm:px-0 py-2 sm:py-0 rounded-lg sm:rounded-none shadow-lg sm:shadow-none text-blue-500 hover:text-red-500 transition"
  aria-label="Logout"
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 sm:h-5 sm:w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H6a2 2 0 01-2-2V7a2 2 0 012-2h5a2 2 0 012 2v1"
    />
  </svg>
  <span className="hidden sm:inline text-xs sm:text-sm font-medium">Logout</span>
</button>


  {/* MAIN CARD */}
  <div className="relative bg-gradient-to-r from-[#7CC3EA] to-[#5BAFE2] rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-10 text-white overflow-hidden">

    {/* ORNAMENT CIRCLES */}
    <span className="absolute top-4 sm:top-6 left-1/3 w-3 h-3 sm:w-4 sm:h-4 border-2 sm:border-4 border-yellow-400 rounded-full opacity-70"></span>
    <span className="absolute bottom-6 sm:bottom-10 right-1/3 w-3 h-3 sm:w-4 sm:h-4 border-2 sm:border-4 border-yellow-400 rounded-full opacity-70"></span>

    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">

      {/* LEFT IMAGE */}
      <div className="w-24 sm:w-32 md:w-36 flex-shrink-0">
        <Image
          src="/assets/dashboard_dokter/header2.svg"
          alt="Medicine"
          width={144}
          height={144}
          className="w-full object-contain"
        />
      </div>

      {/* TEXT CENTER */}
      <div className="text-center sm:text-left max-w-lg flex-1">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold mb-2 sm:mb-3">
          Halo, Dr. Eko Sulistijono, Sp.A
        </h2>

        <p className="text-xs sm:text-sm md:text-base text-blue-50 leading-relaxed">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          Nam sapien lectus, luctus eget dui nec, porttitor congue
          libero. Cras bibendum.
        </p>
      </div>

      {/* RIGHT IMAGE */}
      <div className="w-20 sm:w-28 md:w-32 flex-shrink-0">
        <Image
          src="/assets/dashboard_dokter/header1.svg"
          alt="Clipboard"
          width={128}
          height={128}
          className="w-full object-contain"
        />
      </div>

    </div>
  </div>
</div>

              {/* Warning Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
                <div>
                  <h4 className="text-sm sm:text-base md:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">
                    Warning Billing Sign
                  </h4>
                 <div className="space-y-2 sm:space-y-3 md:space-y-4">
  {warningItems.map((warning, index) => (
    <div
      key={index}
      className="bg-[#EAF6FF] rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 flex items-center space-x-3 sm:space-x-4"
    >
      {/* ICON IMAGE */}
      <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 flex items-center justify-center flex-shrink-0">
        <Image
          src={warning.icon}
          alt="warning icon"
          width={64}
          height={64}
          className="w-full h-full object-contain"
        />
      </div>

      {/* TEXT */}
      <div className="min-w-0 flex-1">
        <p className="text-xs sm:text-sm md:text-lg font-medium text-[#1E88E5] break-words">
          {warning.message}
        </p>
      </div>
    </div>
  ))}
</div>

                </div>

                {/* Right Side - Additional Content */}
                <div className="bg-[#D8EEF9] rounded-xl p-4 sm:p-6 flex flex-col items-center justify-center min-h-[200px] sm:min-h-[280px]">
  {/* Circle / Ring */}
  <div className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 mb-4 sm:mb-6">
    {/* Background circle */}
    <svg className="w-full h-full" viewBox="0 0 100 100">
      <circle
        cx="50"
        cy="50"
        r="40"
        fill="none"
        stroke="#BEE3F8"
        strokeWidth="10"
      />
      {/* Progress circle (70%) */}
      <circle
        cx="50"
        cy="50"
        r="40"
        fill="none"
        stroke="#1E88E5"
        strokeWidth="10"
        strokeLinecap="round"
        strokeDasharray="251.2"   // 2 * π * r
        strokeDashoffset="75"    // sekitar 30% kosong → 70% terisi
        transform="rotate(-90 50 50)"
      />
    </svg>
  </div>

  {/* Text */}
  <p className="text-center text-lg sm:text-xl md:text-2xl font-semibold text-[#1E88E5]">
    <span className="text-red-500">7</span> dari 10 Pasien
    <br />
    melebihi klaim BPJS
  </p>
</div>

              </div>
            </div>
    </>
  )}

      </div>
    </div>
  );
};

export default Dashboard;
