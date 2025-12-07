"use client";
import { useState,useRef } from 'react';
import { FaCalendarAlt, FaPlus, FaExternalLinkAlt } from 'react-icons/fa';
const BillingPasien = () => {
  const [gender, setGender] = useState('Pria');
  const dateMasukRef = useRef<HTMLInputElement>(null);
  const dateKeluarRef = useRef<HTMLInputElement>(null);

  return (
   <div className="p-3 sm:p-4 md:p-6 bg-white min-h-screen">
      {/* Tanggal dan Icon */}
      <div className="flex justify-between items-center mb-2 sm:mb-3">
        <div className="text-xs sm:text-sm text-[#2591D0]">Senin, 8 Desember 2025</div>
        <FaExternalLinkAlt className="text-[#2591D0] cursor-pointer hover:text-[#1e7ba8] text-sm sm:text-base" />
      </div>
      <div className="text-lg sm:text-xl text-[#2591D0] mb-3 sm:mb-4 font-bold">Data Pasien</div>
      {/* Data Pasien */}
      <div className="">
        {/* Nama */}
       <div className="ml-0 sm:ml-4 text-sm sm:text-md text-[#2591D0] mb-2 sm:mb-3 font-bold">
        <p className="mb-2">Nama Lengkap</p>
          <div className="relative mb-3 sm:mb-4">
        <input
          type="text"
          placeholder="Masukkan nama lengkap"
          className="w-full border text-sm focus:outline-0 border-blue-200 rounded-full py-2 sm:py-3 pl-3 sm:pl-4 pr-8 sm:pr-10 text-[#2591D0] focus:ring-2 focus:ring-blue-400"
        />
      </div>
       </div>
        {/* ID, Usia, Jenis kelamin */}
       <div className="ml-0 sm:ml-4 mt-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-x-6 sm:gap-y-6">
      {/* ID Pasien */}
      <div>
        <label className="block text-sm sm:text-md text-[#2591D0] mb-1 sm:mb-2 font-bold">ID Pasien</label>
        <input
          type="text"
          placeholder="Masukkan ID pasien"
          className="w-full border text-sm border-blue-200 rounded-full py-2 sm:py-3 pl-3 sm:pl-4 pr-8 sm:pr-10 text-[#2591D0] placeholder-blue-400 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:outline-0"
        />
      </div>

      {/* Usia */}
      <div>
        <label className="block text-sm sm:text-md text-[#2591D0] mb-1 sm:mb-2 font-bold">Usia</label>
        <input
          type="number"
          placeholder="Masukkan usia"
          className="w-full border text-sm border-blue-200 rounded-full py-2 sm:py-3 pl-3 sm:pl-4 pr-8 sm:pr-10 text-[#2591D0] placeholder-blue-400 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:outline-0"
        />
      </div>

      {/* Jenis Kelamin */}
      <div>
        <label className="block text-sm sm:text-md text-[#2591D0] mb-1 sm:mb-2 font-bold">Jenis Kelamin</label>
        <div className="flex items-center space-x-4 sm:space-x-6 h-10 sm:h-12"> 
          <div className="flex items-center">
            <input
              id="radio-pria"
              type="radio"
              value="Pria"
              name="jenis_kelamin"
             
                           checked={gender === 'Pria'}
              onChange={(e) => setGender(e.target.value)}
    className="w-4 h-4 
               text-care-blue 
               bg-gray-100 border-gray-300 
               accent-[#2591D0]"
  />
            <label htmlFor="radio-pria" className="ml-2 text-sm font-medium text-[#2591D0]">Pria</label>
          </div>
          
          <div className="flex items-center">
            <input
              id="radio-wanita"
              type="radio"
              value="Wanita"
              checked={gender === 'Wanita'}
              onChange={(e) => setGender(e.target.value)}
    className="w-4 h-4 
               text-care-blue 
               bg-gray-100 border-gray-300 
               accent-[#2591D0]"
  />
             
            <label htmlFor="radio-wanita" className="ml-2 text-sm font-medium text-[#2591D0]">Wanita</label>
          </div>
        </div>
      </div>
      
    </div>

        {/* Ruang, Kelas */}
<div className="ml-0 sm:ml-4 mt-2 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-x-6 md:gap-x-12 sm:gap-y-6">

        {/* Ruang */}
        <div>
          <label className="block text-sm sm:text-md text-[#2591D0] mb-1 sm:mb-2 font-bold">Ruang</label>
          <div className="relative">
            <select
              className="w-full border text-sm border-blue-200 rounded-full py-2 sm:py-3 pl-3 sm:pl-4 pr-8 sm:pr-10 text-[#2591D0] placeholder-blue-400 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:outline-0"
            >
              <option value="" disabled>Pilih ruang</option>
              <option className="text-gray-700">ICU</option>
              <option className="text-gray-700">Kelas 1</option>
            </select>
            {/* Ikon panah ke bawah (opsional, karena select sudah memilikinya) */}
          </div>
        </div>

        {/* Kelas */}
        <div>
          <label className="block text-sm sm:text-md text-[#2591D0] mb-1 sm:mb-2 font-bold" >Kelas</label>
          <div className="relative">
            <select
              className="w-full border text-sm border-blue-200 rounded-full py-2 sm:py-3 pl-3 sm:pl-4 pr-8 sm:pr-10 text-[#2591D0] placeholder-blue-400 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:outline-0" 
            >
              <option value="" disabled>Pilih kelas</option>
              <option className="text-gray-700">Kelas A</option>
              <option className="text-gray-700">Kelas B</option>
            </select>
            {/* Ikon panah ke bawah (opsional) */}
          </div>
        </div>
      </div>



      {/* Tanggal Masuk */}
      <div className="ml-0 sm:ml-4 mt-2 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-x-6 md:gap-x-12 sm:gap-y-6">
<div>
  <label className="block text-sm sm:text-md text-[#2591D0] mb-1 sm:mb-2 font-bold">
    Tanggal Masuk
  </label>

  <div className="relative">
    <input
      ref={dateMasukRef}
      type="text"
      onFocus={(e) => (e.currentTarget.type = "date")}
      onBlur={(e) => {
        if (!e.currentTarget.value) e.currentTarget.type = "text"
      }}
      placeholder="Pilih tanggal"
      className="
        relative w-full 
        border text-sm border-blue-200 
        rounded-full py-2 sm:py-3 pl-3 sm:pl-4 pr-8 sm:pr-10 
        text-[#2591D0] placeholder-blue-400 
        focus:ring-2 focus:ring-blue-400 
        focus:border-blue-400 focus:outline-0

        [&::-webkit-calendar-picker-indicator]:opacity-0
        [&::-webkit-calendar-picker-indicator]:hidden
      "
    />

    {/* ICON BISA DIKLIK */}
    <FaCalendarAlt
      onClick={() => {
        if (dateMasukRef.current) {
          dateMasukRef.current.showPicker?.()
          dateMasukRef.current.focus()
        }
      }}
      className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-blue-400 cursor-pointer hover:text-blue-600 text-sm sm:text-base"
    />
  </div>
</div>


        {/* Tanggal Keluar */}
       <div>
  <label className="block text-sm sm:text-md text-[#2591D0] mb-1 sm:mb-2 font-bold">
    Tanggal Keluar
  </label>

  <div className="relative">
    <input
      ref={dateKeluarRef}
      type="text"
      onFocus={(e) => (e.currentTarget.type = "date")}
      onBlur={(e) => {
        if (!e.currentTarget.value) e.currentTarget.type = "text"
      }}
      placeholder="Pilih tanggal"
      className="
        relative w-full 
        border text-sm border-blue-200 
        rounded-full py-2 sm:py-3 pl-3 sm:pl-4 pr-8 sm:pr-10 
        text-[#2591D0] placeholder-blue-400 
        focus:ring-2 focus:ring-blue-400 
        focus:border-blue-400 focus:outline-0

        [&::-webkit-calendar-picker-indicator]:opacity-0
        [&::-webkit-calendar-picker-indicator]:hidden
      "
    />

    {/* ICON BISA DIKLIK */}
    <FaCalendarAlt
      onClick={() => {
        if (dateKeluarRef.current) {
          dateKeluarRef.current.showPicker?.()
          dateKeluarRef.current.focus()
        }
      }}
      className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-blue-400 cursor-pointer hover:text-blue-600 text-sm sm:text-base"
    />
  </div>
</div>

        
      </div>

      {/* DPJP */}
      <div className="ml-0 sm:ml-4 mt-2">
        <label className="block text-sm sm:text-md text-[#2591D0] mb-1 sm:mb-2 font-bold">DPJP</label>
        <div className="relative">
          <select
            className="w-full border text-sm border-blue-200 rounded-full py-2 sm:py-3 pl-3 sm:pl-4 pr-8 sm:pr-10 text-[#2591D0] placeholder-blue-400 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:outline-0"
          >
            <option value="" disabled>Pilih dokter penanggungjawab</option>
            <option className="text-gray-700">Dr. Ahmad Fauzi</option>
            <option className="text-gray-700">Dr. Siti Nurhaliza</option>
            <option className="text-gray-700">Dr. Budi Santoso</option>
          </select>
        </div>
      </div>

      {/* Tindakan dan Total Tarif RS - Baris 1 */}
      <div className="ml-0 sm:ml-4 mt-2 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-x-6 md:gap-x-12 sm:gap-y-6">
        {/* Tindakan dan Pemeriksaan Penunjang */}
        <div>
          <label className="block text-sm sm:text-md text-[#2591D0] mb-1 sm:mb-2 font-bold">Tindakan dan Pemeriksaan Penunjang</label>
          <div className="flex items-center gap-2 sm:gap-3">
            <select
              className="flex-1 border text-sm border-blue-200 rounded-full py-2 sm:py-3 pl-3 sm:pl-4 pr-8 sm:pr-10 text-[#2591D0] placeholder-blue-400 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:outline-0"
            >
              <option value="" disabled>Masukkan tindakan</option>
              <option className="text-gray-700">Operasi</option>
              <option className="text-gray-700">Pemeriksaan Lab</option>
              <option className="text-gray-700">Rontgen</option>
            </select>
            <button
              type="button"
              className="w-7 h-7 sm:w-8 sm:h-8 bg-[#2591D0] rounded-full flex items-center justify-center text-white hover:bg-[#1e7ba8] transition-colors flex-shrink-0"
            >
              <FaPlus className="text-xs sm:text-sm" />
            </button>
          </div>
        </div>

        {/* Total Tarif RS */}
        <div>
          <label className="block text-sm sm:text-md text-[#2591D0] mb-1 sm:mb-2 font-bold">Total Tarif RS</label>
          <input
            type="text"
            placeholder=""
            className="w-full border text-sm border-blue-200 rounded-full py-2 sm:py-3 pl-3 sm:pl-4 pr-8 sm:pr-10 text-[#2591D0] bg-blue-50 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:outline-0"
          />
        </div>
      </div>

      {/* ICD 9 dan ICD 10 - Baris 2 */}
      <div className="ml-0 sm:ml-4 mt-2 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-x-6 md:gap-x-12 sm:gap-y-6">
        {/* ICD 9 */}
        <div>
          <label className="block text-sm sm:text-md text-[#2591D0] mb-1 sm:mb-2 font-bold">ICD 9</label>
          <div className="flex items-center gap-2 sm:gap-3">
            <select
              className="flex-1 border text-sm border-blue-200 rounded-full py-2 sm:py-3 pl-3 sm:pl-4 pr-8 sm:pr-10 text-[#2591D0] placeholder-blue-400 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:outline-0"
            >
              <option value="" disabled>Masukkan prosedur</option>
              <option className="text-gray-700">00.01 - Insisi</option>
              <option className="text-gray-700">00.02 - Eksisi</option>
              <option className="text-gray-700">00.03 - Biopsi</option>
            </select>
            <button
              type="button"
              className="w-7 h-7 sm:w-8 sm:h-8 bg-[#2591D0] rounded-full flex items-center justify-center text-white hover:bg-[#1e7ba8] transition-colors flex-shrink-0"
            >
              <FaPlus className="text-xs sm:text-sm" />
            </button>
          </div>
        </div>

        {/* ICD 10 */}
        <div>
          <label className="block text-sm sm:text-md text-[#2591D0] mb-1 sm:mb-2 font-bold">ICD 10</label>
          <div className="flex items-center gap-2 sm:gap-3">
            <select
              className="flex-1 border text-sm border-blue-200 rounded-full py-2 sm:py-3 pl-3 sm:pl-4 pr-8 sm:pr-10 text-[#2591D0] placeholder-blue-400 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:outline-0"
            >
              <option value="" disabled>Masukkan diagnosa</option>
              <option className="text-gray-700">A00 - Kolera</option>
              <option className="text-gray-700">A01 - Demam Tifoid</option>
              <option className="text-gray-700">A02 - Infeksi Salmonella</option>
            </select>
            <button
              type="button"
              className="w-7 h-7 sm:w-8 sm:h-8 bg-[#2591D0] rounded-full flex items-center justify-center text-white hover:bg-[#1e7ba8] transition-colors flex-shrink-0"
            >
              <FaPlus className="text-xs sm:text-sm" />
            </button>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="ml-0 sm:ml-4 mt-4 sm:mt-6 mb-4 sm:mb-6 flex justify-center">
        <button
          type="button"
          className="bg-[#2591D0] text-white px-6 sm:px-8 py-2 sm:py-3 rounded-full font-medium hover:bg-[#1e7ba8] transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base w-full sm:w-auto"
        >
          Save
        </button>
      </div>
      
      </div>
    </div>
  );
};

export default BillingPasien;
