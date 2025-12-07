"use client";
import { useState } from "react";
import Image from "next/image";
import { FaSearch, FaExternalLinkAlt, FaEdit } from 'react-icons/fa';
import RiwayatBillingPasien from "./riwayat-billing-pasien";

interface DashboardAdminProps {
  onLogout?: () => void;
}

const DashboardAdmin = ({ onLogout }: DashboardAdminProps) => {
  const [activeRuangan, setActiveRuangan] = useState("Ruangan 1");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const ruanganItems = [
    "Ruangan 1",
    "Ruangan 2",
    "Ruangan 3",
    "Ruangan 4",
    "Ruangan 5",
    "Ruangan 6",
    "Ruangan 7",
  ];

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userRole");
    if (onLogout) {
      onLogout();
    }
  };

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

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Left Sidebar */}
      <div
        className={`
          fixed top-0 left-0
          w-56 sm:w-64 h-screen
          bg-[#ECF6FB] rounded-r-2xl sm:rounded-r-3xl shadow-lg
          transition-transform duration-300 z-50
          overflow-y-auto

          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:relative lg:rounded-r-none lg:rounded-l-3xl
        `}
      >
        {/* Logo */}
        <div className="p-3 sm:p-5 flex justify-center border-b border-blue-100">
          <Image
            src="/assets/LOGO_CAREIT.svg"
            alt="CARE-IT Logo"
            width={140}
            height={70}
            className="object-contain w-24 sm:w-32 md:w-36"
          />
        </div>

        {/* Navigation Menu */}
        <nav className="mt-4 sm:mt-6 space-y-1 px-2 sm:px-4">
          {ruanganItems.map((ruangan, index) => {
            const isActive = activeRuangan === ruangan;

            return (
              <button
                key={index}
                onClick={() => {
                  setActiveRuangan(ruangan);
                  setIsSidebarOpen(false);
                }}
                className={`
                  w-full flex items-center py-2 sm:py-3 px-2 sm:px-4
                  rounded-lg text-left transition-all
                  ${
                    isActive
                      ? "bg-white text-[#2591D0] border-l-4 border-[#2591D0] font-medium"
                      : "text-gray-400 hover:bg-white hover:text-gray-600"
                  }
                `}
              >
                <span className="text-xs sm:text-sm">{ruangan}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 w-full lg:w-auto lg:ml-0">
        <RiwayatBillingPasien onLogout={handleLogout} />
      </div>
    </div>
  );
};

export default DashboardAdmin;

