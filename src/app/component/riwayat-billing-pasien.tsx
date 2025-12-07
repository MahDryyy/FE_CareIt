"use client";
import { FaSearch, FaEdit } from 'react-icons/fa';

interface RiwayatBillingPasienProps {
  onLogout?: () => void;
}

const RiwayatBillingPasien = ({ onLogout }: RiwayatBillingPasienProps) => {
  // Data pasien sesuai gambar
  const patients = [
    { id: "P.0001", name: "Suryanto Bin Cahyono", status: "red" },
    { id: "P.0002", name: "Andra Wicaksono", status: "yellow" },
    { id: "P.0003", name: "Mamat Alkatiri", status: "red" },
    { id: "P.0004", name: "Alex Bin Candra", status: "green" },
    { id: "P.0005", name: "Annisa Cahyani", status: "green" },
    { id: "P.0006", name: "Karsa Putri Inara", status: "yellow" },
    { id: "P.0007", name: "Stefani Handayani", status: "yellow" },
    { id: "P.0008", name: "Maharani Putri", status: "yellow" },
    { id: "P.0009", name: "Celvin Sanjaya", status: "red" },
    { id: "P.0010", name: "Andreas Bin Stephen", status: "green" },
    { id: "P.0011", name: "Michael", status: "red" },
    { id: "P.0012", name: "Geroge Salahudin", status: "green" },
    { id: "P.0013", name: "Alexandra Johanes", status: "green" },
    { id: "P.0014", name: "Amanda Victoria", status: "yellow" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "red":
        return "bg-red-500";
      case "yellow":
        return "bg-yellow-500";
      case "green":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="p-3 sm:p-4 md:p-6 bg-white min-h-screen">
      {/* Tanggal */}
      <div className="mb-2 sm:mb-3">
        <div className="text-xs sm:text-sm text-[#2591D0]">Senin, 8 Desember 2025</div>
      </div>

      {/* Fixed Logout Button - Top Right */}
      {onLogout && (
        <button
          onClick={onLogout}
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
      )}

      {/* Search Bar */}
      <div className="mb-4 sm:mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Cari billing pasien disini"
            className="w-full border text-sm border-blue-200 rounded-full py-2 sm:py-3 pl-3 sm:pl-4 pr-10 sm:pr-12 text-[#2591D0] placeholder-blue-400 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:outline-0"
          />
          <FaSearch className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-[#2591D0] cursor-pointer text-sm sm:text-base" />
        </div>
      </div>

      {/* Table */}
      <div className="border border-blue-200 rounded-lg sm:rounded-xl overflow-hidden overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead>
            <tr className="bg-[#87CEEB]">
              <th className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 text-left text-xs sm:text-sm font-bold text-white">
                ID Pasien
              </th>
              <th className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 text-left text-xs sm:text-sm font-bold text-white">
                Nama
              </th>
              <th className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 text-left text-xs sm:text-sm font-bold text-white">
                Billing Sign
              </th>
            </tr>
          </thead>
          <tbody>
            {patients.map((patient, index) => (
              <tr
                key={patient.id}
                className={`${
                  index % 2 === 0 ? "bg-white" : "bg-gray-50"
                } hover:bg-blue-50 transition-colors`}
              >
                <td className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 text-xs sm:text-sm text-[#2591D0]">
                  {patient.id}
                </td>
                <td className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 text-xs sm:text-sm text-[#2591D0]">
                  {patient.name}
                </td>
                <td className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <span
                      className={`${getStatusColor(
                        patient.status
                      )} w-12 sm:w-16 md:w-20 h-4 sm:h-5 md:h-6 rounded-full`}
                    ></span>
                    <FaEdit className="text-[#2591D0] cursor-pointer hover:text-[#1e7ba8] text-sm sm:text-base" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RiwayatBillingPasien;
