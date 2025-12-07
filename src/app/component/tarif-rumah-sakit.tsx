"use client";

import React, { useState, useEffect } from "react";
import { getTarifRumahSakit, TarifData } from "@/lib/api";

const TarifRumahSakit = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("Semua");
  const [tarifData, setTarifData] = useState<TarifData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const filterButtons = [
    "Semua",
    "RAWAT DARURAT",
    "RAWAT JALAN",
    "RAWAT INAP",
    "OPERASI",
    "RADIOLOGI",
    "PEMULASARAAN JENAZAH",
  ];

  const [allData, setAllData] = useState<TarifData[]>([]);
  const [dataFetched, setDataFetched] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<
    "online" | "offline" | "checking"
  >("checking");

  // Fetch data from API only once
  useEffect(() => {
    const fetchTarifData = async () => {
      if (dataFetched) return; // Prevent multiple calls

      try {
        setLoading(true);
        const response = await getTarifRumahSakit({});

        if (response.error) {
          throw new Error(response.error);
        }

        setAllData(response.data || []);
        setDataFetched(true);
        setConnectionStatus("online");
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Terjadi kesalahan saat mengambil data"
        );
        console.error("Error fetching tarif data:", err);
        setConnectionStatus("offline");
      } finally {
        setLoading(false);
      }
    };

    fetchTarifData();
  }, []); // Empty dependency array - only run once

  // Filter data locally when search or filter changes
  useEffect(() => {
    if (!dataFetched) return;

    let filtered = [...allData];

    // Apply search filter
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.KodeRS.toLowerCase().includes(searchLower) ||
          item.Deskripsi.toLowerCase().includes(searchLower)
      );
    }

    // Apply category filter
    if (activeFilter && activeFilter !== "Semua") {
      filtered = filtered.filter((item) => item.Kategori === activeFilter);
    }

    setTarifData(filtered);
  }, [allData, searchTerm, activeFilter, dataFetched]);

  // Data sudah difilter di API, jadi langsung gunakan tarifData
  const filteredData = tarifData;

  return (
    <div className="p-3 sm:p-4 md:p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 -mx-3 sm:-mx-4 md:-mx-6 -mt-3 sm:-mt-4 md:-mt-6 px-3 sm:px-4 md:px-6 py-3 sm:py-4 mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0">
          <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800">
            Tarif Rumah Sakit
          </h2>
          <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-3 md:space-x-4">
            {/* Simple Connection Status */}
            <div className="flex items-center space-x-1 sm:space-x-2">
              <div
                className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${
                  connectionStatus === "online"
                    ? "bg-green-500"
                    : connectionStatus === "offline"
                    ? "bg-red-500"
                    : "bg-yellow-500 animate-pulse"
                }`}
              />
              <span className="text-xs sm:text-sm text-gray-600">
                Backend:{" "}
                {connectionStatus === "online"
                  ? "Online"
                  : connectionStatus === "offline"
                  ? "Offline"
                  : "Checking"}
              </span>
            </div>
            <div className="text-xs sm:text-sm text-blue-500">
              Senin, 8 Desember 2025
              <span className="ml-1 sm:ml-2">📅</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-4 sm:mb-6">
        <div className="relative w-full sm:max-w-md">
          <input
            type="text"
            placeholder="Cari tindakan disini"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-3 sm:pl-4 pr-8 sm:pr-10 py-2 sm:py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs sm:text-sm md:text-base text-[#2591D0]"
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:pr-3">
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5 text-[#2591D0]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-1.5 sm:gap-2 md:gap-3 mb-4 sm:mb-6">
        {filterButtons.map((filter, index) => (
          <button
            key={index}
            onClick={() => setActiveFilter(filter)}
            className={`px-2 sm:px-3 md:px-6 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${
              activeFilter === filter
                ? "bg-blue-500 text-white shadow-md"
                : "bg-white text-blue-500 border border-blue-200 hover:bg-blue-50"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-blue-500 mx-auto mb-3 sm:mb-4"></div>
          <p className="text-sm sm:text-base text-[#2591D0]">Memuat data...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
          <div className="flex items-center">
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 mr-2 sm:mr-3 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-xs sm:text-sm text-red-700">Error: {error}</p>
          </div>
        </div>
      )}

      {/* Table */}
      {!loading && !error && (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Desktop Table Header */}
          <div className="hidden sm:grid sm:grid-cols-4 gap-2 sm:gap-4 p-3 sm:p-4 bg-gray-50 border-b border-gray-200">
            <div className="font-semibold text-gray-700 text-xs sm:text-sm">Kode RS</div>
            <div className="font-semibold text-gray-700 text-xs sm:text-sm col-span-2">
              Deskripsi
            </div>
            <div className="font-semibold text-gray-700 text-xs sm:text-sm text-right">
              Harga (Rp)
            </div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-gray-200">
            {filteredData.map((item, index) => (
              <div key={index}>
                {/* Desktop Row */}
                <div className="hidden sm:grid sm:grid-cols-4 gap-2 sm:gap-4 p-3 sm:p-4 hover:bg-gray-50 transition-colors">
                  <div className="text-blue-600 font-medium text-xs sm:text-sm">
                    {item.KodeRS}
                  </div>
                  <div className="text-blue-600 text-xs sm:text-sm col-span-2">
                    {item.Deskripsi}
                  </div>
                  <div className="text-gray-900 font-medium text-xs sm:text-sm text-right">
                    {new Intl.NumberFormat("id-ID").format(item.Harga)}
                  </div>
                </div>

                {/* Mobile Card */}
                <div className="sm:hidden p-3 sm:p-4 hover:bg-gray-50 transition-colors">
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Kode RS
                      </span>
                      <span className="text-blue-600 font-medium text-xs sm:text-sm">
                        {item.KodeRS}
                      </span>
                    </div>
                    <div>
                      <span className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-1">
                        Deskripsi
                      </span>
                      <span className="text-blue-600 text-xs sm:text-sm">
                        {item.Deskripsi}
                      </span>
                    </div>
                    <div>
                      <span className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-1">
                        Kategori
                      </span>
                      <span className="text-gray-600 text-xs px-2 py-1 bg-gray-100 rounded">
                        {item.Kategori}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                      <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Harga
                      </span>
                      <span className="text-gray-900 font-semibold text-xs sm:text-sm">
                        Rp {new Intl.NumberFormat("id-ID").format(item.Harga)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && filteredData.length === 0 && (
        <div className="text-center py-6 sm:py-8 text-gray-500">
          <svg
            className="w-8 h-8 sm:w-12 sm:h-12 text-gray-300 mx-auto mb-3 sm:mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <p className="text-sm sm:text-base">Tidak ada data yang ditemukan</p>
        </div>
      )}
    </div>
  );
};

export default TarifRumahSakit;
