"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { FaPlus, FaChevronDown, FaSignOutAlt, FaTrash } from "react-icons/fa";
import {
  getTarifBPJSRawatInap,
  getTarifBPJSRawatJalan,
  postINACBGAdmin,
  type TarifBPJSRawatInap,
  type TarifBPJSRawatJalan,
  type PostINACBGRequest,
} from "@/lib/api";

interface INACBGAdminRuanganProps {
  onLogout?: () => void;
  billingId?: number;
  pasienData?: {
    nama: string;
    idPasien: string;
    kelas: string;
    tindakan: string;
    totalTarifRS: number;
    icd9: string[];
    icd10: string[];
  };
}

const INACBG_Admin_Ruangan = ({
  onLogout,
  billingId,
  pasienData,
}: INACBGAdminRuanganProps) => {
  const [activeRuangan, setActiveRuangan] = useState("Ruangan 1");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Form state
  const [namaLengkap, setNamaLengkap] = useState("");
  const [idPasien, setIdPasien] = useState("");
  const [kelas, setKelas] = useState("");
  const [tindakan, setTindakan] = useState("");
  const [totalTarifRS, setTotalTarifRS] = useState(0);
  const [icd9, setIcd9] = useState("");
  const [icd10, setIcd10] = useState("");
  const [selectedInacbgCodes, setSelectedInacbgCodes] = useState<string[]>([]);
  const [totalKlaimBPJS, setTotalKlaimBPJS] = useState(0);
  const [totalKlaimOriginal, setTotalKlaimOriginal] = useState<number>(0); // Original from database
  const [tipeInacbg, setTipeInacbg] = useState<"RI" | "RJ">("RI");

  // Dropdown state
  const [inacbgRIData, setInacbgRIData] = useState<TarifBPJSRawatInap[]>([]);
  const [inacbgRJData, setInacbgRJData] = useState<TarifBPJSRawatJalan[]>([]);
  const [inacbgDropdownOpen, setInacbgDropdownOpen] = useState(false);
  const [inacbgJustClosed, setInacbgJustClosed] = useState(false);
  const [selectedInacbgCode, setSelectedInacbgCode] = useState("");
  const [inacbgSearch, setInacbgSearch] = useState("");

  // Billing history state (untuk menampilkan riwayat ICD9, ICD10, dan INACBG)
  const [billingHistory, setBillingHistory] = useState<{
    icd9: string[];
    icd10: string[];
    inacbg: string[];
  } | null>(null);
  const [billingHistoryInfo, setBillingHistoryInfo] = useState('Belum ada data yang dimuat.');

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [ruanganItems, setRuanganItems] = useState<string[]>([]);

  const inacbgDropdownRef = useRef<HTMLDivElement>(null);
  const inacbgInputRef = useRef<HTMLInputElement>(null);

  // Load data pasien dari props pertama kali, atau localStorage, atau API
  useEffect(() => {
    const loadPatientData = async () => {
      try {
        // PRIORITY 1: Use pasienData dari props (dikirim oleh parent)
        if (pasienData) {
          console.log('📦 Patient data from props:', pasienData);
          setNamaLengkap(pasienData.nama || "");
          setIdPasien(pasienData.idPasien || "");
          setKelas(pasienData.kelas || "");
          setTotalTarifRS(pasienData.totalTarifRS || 0);
          setTindakan(Array.isArray(pasienData.tindakan) ? pasienData.tindakan.join(', ') : (pasienData.tindakan || ""));
          setIcd9(Array.isArray(pasienData.icd9) ? pasienData.icd9.join(', ') : (pasienData.icd9 || ""));
          setIcd10(Array.isArray(pasienData.icd10) ? pasienData.icd10.join(', ') : (pasienData.icd10 || ""));
          
          // Save to localStorage for future reference
          const billingData = {
            nama_pasien: pasienData.nama,
            id_pasien: pasienData.idPasien,
            kelas: pasienData.kelas,
            tindakan: Array.isArray(pasienData.tindakan) ? pasienData.tindakan : (pasienData.tindakan ? [pasienData.tindakan] : []),
            total_tarif_rs: pasienData.totalTarifRS,
            icd9: Array.isArray(pasienData.icd9) ? pasienData.icd9 : (pasienData.icd9 ? [pasienData.icd9] : []),
            icd10: Array.isArray(pasienData.icd10) ? pasienData.icd10 : (pasienData.icd10 ? [pasienData.icd10] : []),
          };
          localStorage.setItem('currentBillingData', JSON.stringify(billingData));
          console.log('💾 Patient data saved to localStorage from props');
          return;
        }

        // PRIORITY 2: Try to load from localStorage
        const storedData = localStorage.getItem('currentBillingData');
        if (storedData) {
          const billingData = JSON.parse(storedData);
          console.log('📦 Patient data loaded from localStorage:', billingData);
          
          setNamaLengkap(billingData.nama_pasien || "");
          setIdPasien(billingData.id_pasien || "");
          setKelas(billingData.kelas || "");
          setTotalTarifRS(billingData.total_tarif_rs || 0);
          
          if (billingData.tindakan && Array.isArray(billingData.tindakan) && billingData.tindakan.length > 0) {
            setTindakan(billingData.tindakan.join(', '));
          }
          
          if (billingData.icd9 && Array.isArray(billingData.icd9) && billingData.icd9.length > 0) {
            setIcd9(billingData.icd9.join(', '));
          }
          
          if (billingData.icd10 && Array.isArray(billingData.icd10) && billingData.icd10.length > 0) {
            setIcd10(billingData.icd10.join(', '));
          }
          return;
        }

        // PRIORITY 3: If no localStorage data, fetch from API using billingId
        if (billingId) {
          console.log('📡 Fetching patient data from API with billingId:', billingId);
          try {
            const response = await fetch(`/api/admin/billing/${billingId}`);
            if (response.ok) {
              const data = await response.json();
              console.log('📥 Billing data from API:', data);
              
              setNamaLengkap(data.nama_pasien || data.patient_name || "");
              setIdPasien(data.id_pasien || data.patient_id || "");
              setKelas(data.kelas || "");
              setTotalTarifRS(data.total_tarif_rs || 0);
              
              if (data.tindakan) {
                if (Array.isArray(data.tindakan)) {
                  setTindakan(data.tindakan.join(', '));
                } else {
                  setTindakan(data.tindakan);
                }
              }
              
              if (data.icd9) {
                if (Array.isArray(data.icd9)) {
                  setIcd9(data.icd9.join(', '));
                } else {
                  setIcd9(data.icd9);
                }
              }
              
              if (data.icd10) {
                if (Array.isArray(data.icd10)) {
                  setIcd10(data.icd10.join(', '));
                } else {
                  setIcd10(data.icd10);
                }
              }
              
              // Store to localStorage
              localStorage.setItem('currentBillingData', JSON.stringify(data));
              console.log('💾 Patient data saved to localStorage from API');
            } else {
              console.error('Failed to fetch billing data');
            }
          } catch (err) {
            console.error('❌ Error fetching patient data from API:', err);
          }
        }
      } catch (err) {
        console.error('❌ Error loading patient data:', err);
      }
    };

    loadPatientData();
  }, [billingId, pasienData]);

  // Re-calculate totalKlaimBPJS saat selected codes atau INACBG data berubah
  // Single source of truth untuk perhitungan total klaim (menghindari konflik dengan manual add/remove)
  useEffect(() => {
    // Jika tidak ada kode yang dipilih, set total ke 0
    if (selectedInacbgCodes.length === 0) {
      setTotalKlaimBPJS(0);
      console.log(`💰 Total Klaim reset to 0 (no codes selected)`);
      return;
    }

    // Pastikan data INACBG sudah dimuat
    if (inacbgRIData.length === 0 && inacbgRJData.length === 0) {
      return; // Tunggu data dimuat dulu
    }

    let totalKlaim = 0;
    
    // Extract class number from kelas string (\"Kelas 1\" -> 1, \"Kelas 3\" -> 3)
    const kelasMatch = kelas.match(/(\d+)/);
    const kelasNumber = kelasMatch ? parseInt(kelasMatch[1]) : 1;
    
    selectedInacbgCodes.forEach((code) => {
      let tarif = 0;
      if (tipeInacbg === 'RI') {
        const riItem = inacbgRIData.find((item) => item.KodeINA === code);
        // Select tarif based on kelas yang benar
        if (riItem) {
          if (kelasNumber === 1) tarif = riItem.Kelas1 || 0;
          else if (kelasNumber === 2) tarif = riItem.Kelas2 || 0;
          else if (kelasNumber === 3) tarif = riItem.Kelas3 || 0;
        }
      } else {
        const rjItem = inacbgRJData.find((item) => item.KodeINA === code);
        tarif = rjItem?.TarifINACBG || rjItem?.tarif_inacbg || 0;
      }
      totalKlaim += tarif;
    });
    
    setTotalKlaimBPJS(totalKlaim);
    console.log(`💰 Total Klaim calculated for Kelas ${kelasNumber}: ${totalKlaim} (${selectedInacbgCodes.length} codes)`);
  }, [selectedInacbgCodes, inacbgRIData, inacbgRJData, tipeInacbg, kelas]);

  // Load ruangan dengan pasien dan INACBG data, juga billing original data
  useEffect(() => {
    const loadData = async () => {
      try {
        // Fetch ruangan yang punya pasien
        const ruanganResponse = await fetch("/api/admin/ruangan-dengan-pasien");
        const ruanganData = await ruanganResponse.json();
        
        if (ruanganData && Array.isArray(ruanganData)) {
          const namaRuangan = ruanganData.map((r: any) => r.Nama_Ruangan || r.nama_ruangan);
          setRuanganItems(namaRuangan.length > 0 ? namaRuangan : ["Tidak ada ruangan"]);
          if (namaRuangan.length > 0) {
            setActiveRuangan(namaRuangan[0]);
          }
        }

        // Fetch INACBG data
        const [riResponse, rjResponse] = await Promise.all([
          getTarifBPJSRawatInap(),
          getTarifBPJSRawatJalan(),
        ]);

        if (riResponse.data) {
          setInacbgRIData(riResponse.data);
        }
        if (rjResponse.data) {
          setInacbgRJData(rjResponse.data);
        }

        // Fetch billing detail untuk get Total_Klaim original dan billing aktif
        if (billingId) {
          try {
            // Fetch billing detail
            const response = await fetch(`/api/admin/billing/${billingId}`);
            if (response.ok) {
              const data = await response.json();
              console.log("📊 Billing data from API:", data);
              if (data.total_klaim) {
                setTotalKlaimOriginal(data.total_klaim);
                console.log(`💰 Set totalKlaimOriginal: ${data.total_klaim}`);
              }
            }

          } catch (err) {
            console.error("Error fetching billing data:", err);
            // Fallback: use totalKlaimBPJS yang terakumulasi
          }
        }
      } catch (err) {
        console.error("Error loading data:", err);
        setRuanganItems(["Gagal memuat ruangan"]);
      }
    };

    loadData();
  }, [billingId]);

  // Load billing aktif history saat namaLengkap tersedia
  useEffect(() => {
    if (namaLengkap && namaLengkap.trim() !== '') {
      loadBillingAktifHistory(namaLengkap);
    }
  }, [namaLengkap]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (inacbgDropdownOpen) {
        const isClickInsideInput = inacbgInputRef.current?.contains(target);
        const isClickInsideDropdown = inacbgDropdownRef.current?.contains(target);
        if (!isClickInsideInput && !isClickInsideDropdown) {
          setInacbgDropdownOpen(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [inacbgDropdownOpen]);

  // Get current date
  const getCurrentDate = () => {
    const days = [
      "Minggu",
      "Senin",
      "Selasa",
      "Rabu",
      "Kamis",
      "Jumat",
      "Sabtu",
    ];
    const months = [
      "Januari",
      "Februari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "September",
      "Oktober",
      "November",
      "Desember",
    ];
    const today = new Date();
    return `${days[today.getDay()]}, ${today.getDate()} ${
      months[today.getMonth()]
    } ${today.getFullYear()}`;
  };

  // Load billing aktif history untuk ditampilkan (ICD9, ICD10, INACBG)
  // Menggunakan endpoint yang sama dengan billing pasien untuk konsistensi
  const loadBillingAktifHistory = async (namaPasienParam: string) => {
    try {
      if (!namaPasienParam || namaPasienParam.trim() === '') {
        setBillingHistory({ icd9: [], icd10: [], inacbg: [] });
        setBillingHistoryInfo('Nama pasien tidak tersedia.');
        return;
      }

      const response = await fetch(`/api/billing/aktif?nama_pasien=${encodeURIComponent(namaPasienParam)}`);
      
      if (response.status === 404) {
        console.log('Tidak ada billing aktif untuk pasien ini');
        setBillingHistory({ icd9: [], icd10: [], inacbg: [] });
        setBillingHistoryInfo('Tidak ada riwayat billing aktif untuk pasien ini.');
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const billingData = data.data || {};

      // Ambil ICD9, ICD10, dan INACBG
      const icd9 = Array.isArray(billingData.icd9) ? billingData.icd9 : [];
      const icd10 = Array.isArray(billingData.icd10) ? billingData.icd10 : [];
      
      // Gabungkan INACBG RI dan RJ
      const inacbgRI = Array.isArray(billingData.inacbg_ri) ? billingData.inacbg_ri : [];
      const inacbgRJ = Array.isArray(billingData.inacbg_rj) ? billingData.inacbg_rj : [];
      const inacbg = [...inacbgRI, ...inacbgRJ];

      // Selalu set billing history, meskipun semua array kosong (untuk menampilkan tabel kosong)
      setBillingHistory({ icd9, icd10, inacbg });
      
      if (icd9.length > 0 || icd10.length > 0 || inacbg.length > 0) {
        setBillingHistoryInfo('Riwayat billing aktif berhasil dimuat.');
      } else {
        setBillingHistoryInfo('Riwayat billing aktif ditemukan, tetapi belum ada data ICD9, ICD10, atau INACBG.');
      }

      console.log('Billing aktif history loaded:', { icd9, icd10, inacbg });
    } catch (err) {
      console.error('Error loading billing history:', err);
      setBillingHistory({ icd9: [], icd10: [], inacbg: [] });
      setBillingHistoryInfo('Error: Gagal memuat riwayat billing.');
    }
  };

  // Filter INACBG codes based on search
  const filteredInacbgCodes = () => {
    // Extract class number from kelas string (\"Kelas 1\" -> 1, \"Kelas 3\" -> 3)
    const kelasMatch = kelas.match(/(\d+)/);
    const kelasNumber = kelasMatch ? parseInt(kelasMatch[1]) : 1;
    
    const data =
      tipeInacbg === "RI"
        ? inacbgRIData.map((item) => {
            // Select tarif based on kelas
            let tarifValue = item.Kelas1;
            if (kelasNumber === 1) tarifValue = item.Kelas1;
            else if (kelasNumber === 2) tarifValue = item.Kelas2;
            else if (kelasNumber === 3) tarifValue = item.Kelas3;
            
            return {
              code: item.KodeINA,
              description: item.Deskripsi,
              tarif: tarifValue,
            };
          })
        : inacbgRJData.map((item) => ({
            code: item.KodeINA,
            description: item.Deskripsi,
            tarif: item.TarifINACBG || item.tarif_inacbg || 0,
          }));

    if (!inacbgSearch) return data;

    return data.filter(
      (item) =>
        item.code.toLowerCase().includes(inacbgSearch.toLowerCase()) ||
        item.description.toLowerCase().includes(inacbgSearch.toLowerCase())
    );
  };

  // Add INACBG code - mirip dengan handleAddICD9/ICD10
  // Total klaim akan dihitung ulang otomatis oleh useEffect (single source of truth)
  const handleAddInacbg = (code?: string) => {
    const codeToAdd = code || selectedInacbgCode;
    
    if (!codeToAdd) {
      // Jika ada filtered codes, ambil yang pertama
      const filtered = filteredInacbgCodes();
      if (filtered.length > 0) {
        const firstCode = filtered[0].code;
        if (!selectedInacbgCodes.includes(firstCode)) {
          setSelectedInacbgCodes([...selectedInacbgCodes, firstCode]);
          setInacbgSearch("");
          setInacbgDropdownOpen(false);
          setError("");
        }
      } else {
        setError("Pilih kode INA CBG terlebih dahulu");
      }
      return;
    }

    if (selectedInacbgCodes.includes(codeToAdd)) {
      setError("Kode INA CBG sudah ditambahkan");
      return;
    }

    // Hanya update selectedInacbgCodes, totalKlaimBPJS akan dihitung ulang otomatis oleh useEffect
    setSelectedInacbgCodes([...selectedInacbgCodes, codeToAdd]);
    setInacbgSearch("");
    setInacbgDropdownOpen(false);
    setError(""); // Clear error on successful add
  };

  // Remove INACBG code
  // Total klaim akan dihitung ulang otomatis oleh useEffect (single source of truth)
  const handleRemoveInacbg = (code: string) => {
    // Hanya update selectedInacbgCodes, totalKlaimBPJS akan dihitung ulang otomatis oleh useEffect
    setSelectedInacbgCodes(selectedInacbgCodes.filter((c) => c !== code));
  };

  // Calculate billing sign based on percentage
  // Mapping to database ENUM('Hijau','Kuning','Merah')
  // Rumus: Klaim BPJS dikurangi 25% dulu, baru dibandingkan dengan Tarif RS
  const calculateBillingSign = (totalTarifRS: number, totalKlaimBPJS: number): string => {
    console.log(`🔍 calculateBillingSign called: totalTarifRS=${totalTarifRS}, totalKlaimBPJS=${totalKlaimBPJS}`);
    
    if (!totalKlaimBPJS || totalKlaimBPJS === 0) {
      console.warn("⚠️ totalKlaimBPJS is 0 or empty, returning 'Hijau'");
      return "Hijau";
    }
    
    // Kurangi 25% dari klaim BPJS dulu (untuk alokasi obat/potongan)
    const klaimBPJSEfektif = totalKlaimBPJS * 0.75;
    console.log(`💰 Klaim BPJS Efektif (setelah dikurangi 25%): ${klaimBPJSEfektif.toFixed(2)}`);
    
    // Hitung persentase: (Total_Tarif_RS / Klaim_BPJS_Efektif) × 100%
    const percentage = (totalTarifRS / klaimBPJSEfektif) * 100;
    console.log(`📊 Percentage: ${percentage.toFixed(2)}%`);
    
    if (percentage <= 25) {
      console.log("✅ Returning: Hijau (<=25%)");
      return "Hijau"; // Tarif RS <=25% dari Klaim BPJS Efektif = AMAN
    } else if (percentage <= 50) {
      console.log("✅ Returning: Kuning (26-50%)");
      return "Kuning"; // 26%-50% = PERLU PERHATIAN
    } else {
      console.log("✅ Returning: Merah (>50%)");
      return "Merah"; // >50% = WASPADA
    }
  };

  // Handle save
  const handleSave = async () => {
    if (!billingId) {
      setError("ID Billing tidak ditemukan");
      return;
    }

    if (selectedInacbgCodes.length === 0) {
      setError("Minimal pilih satu kode INA CBG");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Calculate billing_sign based on tariff comparison
      // Use original total_klaim from database, not accumulated INACBG tarif
      const totalTarifRSValue = totalTarifRS || 0;
      const totalKlaimValue = totalKlaimOriginal || totalKlaimBPJS || 0; // Prefer original from DB
      
      console.log(`💰 Data for billing_sign calculation:`);
      console.log(`   - totalTarifRS: ${totalTarifRSValue}`);
      console.log(`   - totalKlaimOriginal from DB: ${totalKlaimOriginal}`);
      console.log(`   - totalKlaimBPJS accumulated: ${totalKlaimBPJS}`);
      console.log(`   - Using for calculation: ${totalKlaimValue}`);
      
      const billingSignColor = calculateBillingSign(totalTarifRSValue, totalKlaimValue);
      
      console.log(`📋 Final billing_sign value: ${billingSignColor}`);

      const payload: PostINACBGRequest = {
        id_billing: billingId,
        tipe_inacbg: tipeInacbg,
        kode_inacbg: selectedInacbgCodes,
        total_klaim: totalKlaimBPJS,
        billing_sign: billingSignColor,
        tanggal_keluar: new Date().toISOString().split("T")[0],
      };

      console.log("📤 Sending INACBG payload:", payload);

      // Simpan selected codes ke localStorage SEBELUM submit
      const currentBillingData = localStorage.getItem('currentBillingData');
      if (currentBillingData) {
        try {
          const billingData = JSON.parse(currentBillingData);
          billingData.selected_inacbg_codes = selectedInacbgCodes;
          billingData.total_klaim_bpjs = totalKlaimBPJS;
          billingData.tipe_inacbg = tipeInacbg;
          localStorage.setItem('currentBillingData', JSON.stringify(billingData));
          console.log('💾 Selected INACBG codes saved to localStorage');
        } catch (err) {
          console.error('❌ Error saving to localStorage:', err);
        }
      }

      const response = await postINACBGAdmin(payload);

      console.log("📥 Response from backend:", response);

      if (response.error) {
        setError(response.error);
        return;
      }

      setSuccess("Data INA CBG berhasil disimpan");
      setTimeout(() => {
        // Navigate back to dashboard
        if (typeof window !== "undefined") {
          window.location.href = "/";
        }
      }, 2000);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Terjadi kesalahan saat menyimpan data"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userRole");
    localStorage.removeItem("token");
    localStorage.removeItem("dokter");
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

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:ml-0">
        {/* Top Bar */}
        <div className="bg-white shadow-sm px-4 sm:px-6 py-3 sm:py-4 flex justify-end items-center">
          <div className="flex items-center gap-4">
            <div className="text-[#2591D0] font-semibold text-sm sm:text-base">
              {getCurrentDate()}
            </div>
            <button
              onClick={handleLogout}
              className="text-[#2591D0] hover:text-[#1e7ba8] transition-colors"
              aria-label="Logout"
            >
              <FaSignOutAlt className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6 bg-white w-full max-w-full">
          {/* Error/Success Messages */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg text-sm">
              {success}
            </div>
          )}

          {/* Title */}
          <div className="text-lg sm:text-xl text-[#2591D0] mb-3 sm:mb-4 font-bold">Data Pasien</div>

          <div className="w-full max-w-full">
            {/* Nama Lengkap */}
            <div className="ml-0 sm:ml-4 mb-3 sm:mb-4">
              <label className="block text-sm sm:text-md text-[#2591D0] mb-1 sm:mb-2 font-bold">
                Nama Lengkap
              </label>
              <input
                type="text"
                value={namaLengkap}
                onChange={(e) => setNamaLengkap(e.target.value)}
                className="w-full border text-sm border-blue-200 rounded-full py-2 sm:py-3 pl-3 sm:pl-4 pr-8 sm:pr-10 text-[#2591D0] bg-white focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:outline-0"
                readOnly
              />
            </div>

            {/* ID Pasien dan Kelas - Two Columns */}
            <div className="ml-0 sm:ml-4 mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-x-3 md:gap-x-4 lg:gap-x-6 sm:gap-y-3 md:gap-y-4 w-full max-w-full">
              <div>
                <label className="block text-sm sm:text-md text-[#2591D0] mb-1 sm:mb-2 font-bold">
                  ID Pasien
                </label>
                <input
                  type="text"
                  value={idPasien}
                  onChange={(e) => setIdPasien(e.target.value)}
                  className="w-full border text-sm border-blue-200 rounded-full py-2 sm:py-3 pl-3 sm:pl-4 pr-8 sm:pr-10 text-[#2591D0] bg-white focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:outline-0"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm sm:text-md text-[#2591D0] mb-1 sm:mb-2 font-bold">
                  Kelas
                </label>
                <input
                  type="text"
                  value={kelas}
                  onChange={(e) => setKelas(e.target.value)}
                  className="w-full border text-sm border-blue-200 rounded-full py-2 sm:py-3 pl-3 sm:pl-4 pr-8 sm:pr-10 text-[#2591D0] bg-white focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:outline-0"
                  readOnly
                />
              </div>
            </div>

            {/* Tindakan dan Pemeriksaan Penunjang & Total Tarif RS - Two Columns */}
            <div className="ml-0 sm:ml-4 mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-x-3 md:gap-x-4 lg:gap-x-6 sm:gap-y-3 md:gap-y-4 w-full max-w-full">
              {/* Tindakan dan Pemeriksaan Penunjang */}
              <div>
                <label className="block text-sm sm:text-md text-[#2591D0] mb-1 sm:mb-2 font-bold">
                  Tindakan dan Pemeriksaan Penunjang
                </label>
                <input
                  type="text"
                  value={tindakan}
                  onChange={(e) => setTindakan(e.target.value)}
                  className="w-full border text-sm border-blue-200 rounded-full py-2 sm:py-3 pl-3 sm:pl-4 pr-8 sm:pr-10 text-[#2591D0] bg-white focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:outline-0"
                  readOnly
                />
              </div>
              {/* Total Tarif RS */}
              <div>
                <label className="block text-sm sm:text-md text-[#2591D0] mb-1 sm:mb-2 font-bold">
                  Total Tarif RS
                </label>
                <input
                  type="text"
                  value={totalTarifRS.toLocaleString('id-ID')}
                  readOnly
                  className="w-full border text-sm border-blue-200 rounded-full py-2 sm:py-3 pl-3 sm:pl-4 pr-8 sm:pr-10 text-[#2591D0] bg-blue-50 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:outline-0"
                />
              </div>
            </div>

            {/* ICD 9 dan ICD 10 - Two Columns */}
            <div className="ml-0 sm:ml-4 mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-x-3 md:gap-x-4 lg:gap-x-6 sm:gap-y-3 md:gap-y-4 w-full max-w-full">
              <div>
                <label className="block text-sm sm:text-md text-[#2591D0] mb-1 sm:mb-2 font-bold">
                  ICD 9
                </label>
                <input
                  type="text"
                  value={icd9}
                  onChange={(e) => setIcd9(e.target.value)}
                  className="w-full border text-sm border-blue-200 rounded-full py-2 sm:py-3 pl-3 sm:pl-4 pr-8 sm:pr-10 text-[#2591D0] bg-white focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:outline-0"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm sm:text-md text-[#2591D0] mb-1 sm:mb-2 font-bold">
                  ICD 10
                </label>
                <input
                  type="text"
                  value={icd10}
                  onChange={(e) => setIcd10(e.target.value)}
                  className="w-full border text-sm border-blue-200 rounded-full py-2 sm:py-3 pl-3 sm:pl-4 pr-8 sm:pr-10 text-[#2591D0] bg-white focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:outline-0"
                  readOnly
                />
              </div>
            </div>

            {/* Riwayat Billing Aktif (ICD9, ICD10, INACBG) */}
            <div className="ml-0 sm:ml-4 mt-4 sm:mt-6 mb-4 sm:mb-6 w-full max-w-full">
              <label className="block text-sm sm:text-md text-[#2591D0] mb-2 sm:mb-3 font-bold">Riwayat Billing Aktif (ICD9, ICD10, INACBG)</label>
              <div className="text-xs sm:text-sm text-blue-600 mb-3">{billingHistoryInfo}</div>
              
              {/* Desktop Table View */}
              {billingHistory && (
                <div className="hidden md:block overflow-x-auto border border-blue-200 rounded-lg">
                  <table className="w-full text-sm md:text-base border-collapse">
                    <thead>
                      <tr className="bg-blue-100 border-b border-blue-200">
                        <th className="border border-blue-200 p-3 md:p-4 text-left font-semibold text-[#2591D0]">ICD 9</th>
                        <th className="border border-blue-200 p-3 md:p-4 text-left font-semibold text-[#2591D0]">ICD 10</th>
                        <th className="border border-blue-200 p-3 md:p-4 text-left font-semibold text-[#2591D0]">INACBG</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Math.max(billingHistory.icd9.length, billingHistory.icd10.length, billingHistory.inacbg.length) > 0 ? (
                        Array.from({
                          length: Math.max(billingHistory.icd9.length, billingHistory.icd10.length, billingHistory.inacbg.length)
                        }).map((_, idx) => (
                          <tr key={`history-row-${idx}`} className={idx % 2 === 0 ? 'bg-white' : 'bg-blue-50'}>
                            <td className="border border-blue-200 p-3 md:p-4 text-[#2591D0] break-words">
                              {billingHistory.icd9[idx] || '-'}
                            </td>
                            <td className="border border-blue-200 p-3 md:p-4 text-[#2591D0] break-words">
                              {billingHistory.icd10[idx] || '-'}
                            </td>
                            <td className="border border-blue-200 p-3 md:p-4 text-[#2591D0] break-words">
                              {billingHistory.inacbg[idx] || '-'}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={3} className="border border-blue-200 p-4 text-center text-gray-500">
                            Belum ada data
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Mobile/Tablet Card View */}
              {billingHistory && (
                <div className="md:hidden space-y-3">
                  {Math.max(billingHistory.icd9.length, billingHistory.icd10.length, billingHistory.inacbg.length) > 0 ? (
                    Array.from({
                      length: Math.max(billingHistory.icd9.length, billingHistory.icd10.length, billingHistory.inacbg.length)
                    }).map((_, idx) => (
                      <div
                        key={`history-card-${idx}`}
                        className="bg-white border border-blue-200 rounded-lg shadow-sm p-3 sm:p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="space-y-2">
                          <div className="flex flex-col space-y-1">
                            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                              ICD 9
                            </span>
                            <span className="text-sm text-[#2591D0] break-words">
                              {billingHistory.icd9[idx] || '-'}
                            </span>
                          </div>
                          <div className="flex flex-col space-y-1">
                            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                              ICD 10
                            </span>
                            <span className="text-sm text-[#2591D0] break-words">
                              {billingHistory.icd10[idx] || '-'}
                            </span>
                          </div>
                          <div className="flex flex-col space-y-1 pt-2 border-t border-blue-100">
                            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                              INACBG
                            </span>
                            <span className="text-sm text-[#2591D0] break-words">
                              {billingHistory.inacbg[idx] || '-'}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-8 text-center text-gray-500 text-sm bg-white border border-blue-200 rounded-lg">
                      Belum ada data
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Tipe INA CBG */}
            <div className="ml-0 sm:ml-4 mt-2 mb-3 sm:mb-4">
              <label className="block text-sm sm:text-md text-[#2591D0] mb-1 sm:mb-2 font-bold">
                Tipe INA CBG
              </label>
              <div className="relative">
                <select
                  value={tipeInacbg}
                  onChange={(e) => {
                    setTipeInacbg(e.target.value as "RI" | "RJ");
                    setSelectedInacbgCodes([]);
                    setTotalKlaimBPJS(0);
                  }}
                  className="w-full border text-sm border-blue-200 rounded-full py-2 sm:py-3 pl-3 sm:pl-4 pr-10 sm:pr-12 text-[#2591D0] focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:outline-0 appearance-none bg-white"
                >
                  <option value="RI">Rawat Inap (RI)</option>
                  <option value="RJ">Rawat Jalan (RJ)</option>
                </select>
                <FaChevronDown className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-blue-400 pointer-events-none text-sm sm:text-base" />
              </div>
            </div>

            {/* INA CBG */}
            <div className="ml-0 sm:ml-4 mt-2 mb-3 sm:mb-4">
              <label className="block text-sm sm:text-md text-[#2591D0] mb-1 sm:mb-2 font-bold">
                INA CBG
              </label>
              <div className="flex items-center gap-2 sm:gap-3 mb-2 relative">
                <div className="flex-1 relative">
                  <input
                    ref={inacbgInputRef}
                    type="text"
                    placeholder="Cari kode INA CBG..."
                    value={inacbgSearch}
                    onChange={(e) => {
                      setInacbgSearch(e.target.value);
                      setInacbgDropdownOpen(true);
                    }}
                    onFocus={() => {
                      if (!inacbgJustClosed) {
                        setInacbgDropdownOpen(true);
                      }
                      setInacbgJustClosed(false);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && filteredInacbgCodes().length > 0) {
                        handleAddInacbg(filteredInacbgCodes()[0].code);
                        e.preventDefault();
                      }
                    }}
                    className="w-full border text-sm border-blue-200 rounded-full py-2 sm:py-3 pl-3 sm:pl-4 pr-10 sm:pr-12 text-[#2591D0] placeholder-blue-400 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:outline-0"
                  />
                  <FaChevronDown
                    onClick={(e) => {
                      e.stopPropagation();
                      if (inacbgDropdownOpen) {
                        setInacbgJustClosed(true);
                        setInacbgDropdownOpen(false);
                      } else {
                        setInacbgJustClosed(false);
                        setInacbgDropdownOpen(true);
                      }
                    }}
                    className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-blue-400 cursor-pointer hover:text-blue-600 text-sm sm:text-base pointer-events-auto z-10"
                  />
                  {inacbgDropdownOpen && (
                    <div 
                      ref={inacbgDropdownRef}
                      className="absolute z-50 w-full mt-1 bg-white border border-blue-200 rounded-lg shadow-lg max-h-[min(24rem,calc(100vh-12rem))] overflow-y-auto"
                      onMouseDown={(e) => e.stopPropagation()}
                    >
                      {filteredInacbgCodes().map((item) => (
                        <div
                          key={item.code}
                          onClick={() => handleAddInacbg(item.code)}
                          className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-sm text-[#2591D0]"
                        >
                          <div className="font-medium">{item.code}</div>
                          <div className="text-xs text-gray-600">{item.description}</div>
                        </div>
                      ))}
                      {inacbgSearch && filteredInacbgCodes().length === 0 && (
                        <div className="px-4 py-2 text-sm text-gray-500 text-center">
                          Tidak ada hasil ditemukan
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  className="w-7 h-7 sm:w-8 sm:h-8 bg-[#2591D0] rounded-full flex items-center justify-center text-white hover:bg-[#1e7ba8] transition-colors flex-shrink-0"
                  onClick={() => {
                    if (filteredInacbgCodes().length > 0) {
                      handleAddInacbg(filteredInacbgCodes()[0].code);
                    }
                  }}
                >
                  <FaPlus className="text-xs sm:text-sm" />
                </button>
              </div>
              {/* Selected INACBG chips */}
              {selectedInacbgCodes.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {selectedInacbgCodes.map((code) => {
                    const codeData = filteredInacbgCodes().find(
                      (item) => item.code === code
                    );
                    return (
                      <div key={code} className="flex items-center bg-blue-50 border border-blue-200 text-[#2591D0] rounded-full px-3 py-1 text-sm">
                        <span className="mr-2">{code}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveInacbg(code)}
                          className="text-red-500 hover:text-red-700 ml-1"
                          aria-label={`Hapus INACBG ${code}`}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Total Klaim BPJS */}
            <div className="ml-0 sm:ml-4 mt-2 mb-3 sm:mb-4">
              <label className="block text-sm sm:text-md text-[#2591D0] mb-1 sm:mb-2 font-bold">
                Total Klaim BPJS
              </label>
              <input
                type="text"
                value={totalKlaimBPJS.toLocaleString('id-ID')}
                readOnly
                className="w-full border text-sm border-blue-200 rounded-full py-2 sm:py-3 pl-3 sm:pl-4 pr-8 sm:pr-10 text-[#2591D0] bg-blue-50 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:outline-0"
              />
            </div>

            {/* Save Button */}
            <div className="ml-0 sm:ml-4 mt-4 sm:mt-6 mb-4 sm:mb-6 flex justify-center">
              <button
                onClick={handleSave}
                disabled={loading}
                className="bg-[#87CEEB] text-white px-6 sm:px-8 py-2 sm:py-3 rounded-full font-medium hover:bg-[#5BAFE2] disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base w-full sm:w-auto"
              >
                {loading ? "Menyimpan..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default INACBG_Admin_Ruangan;

