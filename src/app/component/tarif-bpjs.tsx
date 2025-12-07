"use client";

import React, { useState } from "react";

const dummyData = Array.from({ length: 12 }).map((_, i) => ({
  kode: `R.TO.000${i + 1}`,
  tindakan: "ABDOMEN, LAPAROTOMY, TRAUMA REOPERATION",
  tarif: "17.958.000",
}));

const categories = [
  "Operatif",
  "Non Operatif",
  "Transplantasi Ginjal",
  "Komplementer",
  "Med Check Up",
];

const TarifBPJS = () => {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("Operatif");

  const filteredData = dummyData.filter(
    (item) =>
      item.kode.toLowerCase().includes(search.toLowerCase()) ||
      item.tindakan.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-3 sm:p-4 md:p-6 bg-white min-h-screen">
      {/* Tanggal */}
      <div className="text-xs sm:text-sm text-[#2591D0] mb-2 sm:mb-3">Senin, 8 Desember 2025</div>

      {/* Search */}
      <div className="relative mb-3 sm:mb-4">
        <input
          type="text"
          placeholder="Cari tindakan disini"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border border-blue-200 rounded-lg py-2 sm:py-3 pl-3 sm:pl-4 pr-8 sm:pr-10 text-sm sm:text-base text-blue-400 focus:ring-2 focus:ring-blue-400"
        />
        <div className="absolute right-2 sm:right-3 top-2 sm:top-3.5 text-blue-400">
          <svg
            className="w-4 h-4 sm:w-5 sm:h-5"
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

      {/* Category Buttons */}
      <div className="flex gap-1 sm:gap-2 flex-wrap mb-4 sm:mb-5">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setActiveCategory(c)}
            className={`px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 rounded-full border transition text-xs sm:text-sm ${
              activeCategory === c
                ? "bg-blue-500 text-white border-blue-500"
                : "text-[#2591D0] border-blue-300 bg-white hover:bg-blue-50"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="border border-blue-200 rounded-lg sm:rounded-xl overflow-hidden shadow-sm overflow-x-auto">
        <div className="min-w-[600px]">
          {/* Header */}
          <div className="grid grid-cols-6 bg-blue-50 border-b border-blue-200 px-2 sm:px-4 py-2 sm:py-3 text-[#2591D0] font-semibold text-xs sm:text-sm">
            <div className="col-span-1">Kode</div>
            <div className="col-span-4">Tindakan</div>
            <div className="col-span-1 text-right">Tarif BPJS</div>
          </div>

          {/* Rows */}
          {filteredData.map((item, i) => (
            <div
              key={i}
              className="grid grid-cols-6 px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm border-b border-blue-100 hover:bg-blue-50"
            >
              <div className="col-span-1 text-[#2591D0] font-medium">
                {item.kode}
              </div>
              <div className="col-span-4 text-[#2591D0]">{item.tindakan}</div>
              <div className="col-span-1 text-right text-[#2591D0] font-medium">
                {item.tarif}
              </div>
            </div>
          ))}

          {filteredData.length === 0 && (
            <div className="py-4 sm:py-6 text-center text-gray-500 text-xs sm:text-sm">
              Tidak ada data ditemukan
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TarifBPJS;
