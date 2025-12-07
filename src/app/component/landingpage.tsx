"use client";
import Image from "next/image";

interface LandingPageProps {
  onStartNow?: () => void;
}

const LandingPage = ({ onStartNow }: LandingPageProps) => {
  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row">
      {/* Left Section - White Background */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-8 md:px-16 lg:px-24 py-8 sm:py-12">
        {/* Logo */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Image
              src="/assets/LOGO_CAREIT.svg"
              alt="CARE-IT Logo"
              width={120}
              height={60}
              className="object-contain w-24 sm:w-32 md:w-40"
              priority
            />
          </div>
        </div>

        {/* Main Heading */}
        <div className="mb-4 sm:mb-6">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-[#87CEEB] leading-tight">
            TARIF BPJS TEPAT
            <br />
            LAYANAN HEBAT
          </h2>
        </div>

        {/* Descriptive Text */}
        <div className="mb-6 sm:mb-8 max-w-2xl">
          <p className="text-sm sm:text-base md:text-lg text-[#1e3a5f] leading-relaxed">
            Care It memudahkan dokter memverifikasi tarif tindakan agar sesuai standar BPJS, 
            dengan fitur warning billing sign yang memberi peringatan otomatis saat tarif melebihi batas, 
            sehingga rumah sakit tetap patuh, aman, dan bebas overbilling.
          </p>
        </div>

        {/* Call-to-Action Button */}
        <div>
          <button 
            onClick={onStartNow}
            className="bg-[#87CEEB] text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold text-base sm:text-lg uppercase hover:bg-[#6bb8d8] transition-colors shadow-lg w-full sm:w-auto"
          >
            START NOW
          </button>
        </div>
      </div>

      {/* Right Section - Blue Background with Curve */}
      <div className="flex-1 relative hidden lg:block overflow-hidden min-h-[400px] lg:min-h-screen">
        {/* Blue Background with White Curve */}
        <div className="absolute inset-0 bg-[#87CEEB]">
          {/* White Curve Overlay - from bottom left extending upward */}
          <div 
            className="absolute left-0 bottom-0 w-full h-full bg-white" 
            style={{
              clipPath: "ellipse(70% 100% at 0% 100%)"
            }}>
          </div>
        </div>

        {/* 3D Doctor Illustration */}
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="relative w-full h-full flex items-center justify-center">
            <div className="relative">
              <Image
                src="/assets/LandingPage/dokterLucu.svg"
                alt="Doctor Illustration"
                width={450}
                height={550}
                className="object-contain w-full max-w-md lg:max-w-lg xl:max-w-xl"
                priority
              />
            </div>
          </div>
        </div>

        {/* Floating Stethoscope Icon - Upper Middle Left (more centered horizontally) */}
        <div className="absolute top-16 sm:top-24 left-1/4 z-20">
          <div className="bg-[#87CEEB] rounded-2xl p-3 sm:p-4 shadow-xl">
            <Image
              src="/assets/LandingPage/stetoskop.svg"
              alt="Stethoscope"
              width={56}
              height={56}
              className="object-contain w-10 h-10 sm:w-14 sm:h-14"
            />
          </div>
        </div>

        {/* Floating Syringe Icon - Lower Right */}
        <div className="absolute bottom-24 sm:bottom-32 right-8 sm:right-16 z-20">
          <div className="bg-[#87CEEB] rounded-2xl p-3 sm:p-4 shadow-xl">
            <Image
              src="/assets/LandingPage/suntik.svg"
              alt="Syringe"
              width={56}
              height={56}
              className="object-contain w-10 h-10 sm:w-14 sm:h-14"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;

