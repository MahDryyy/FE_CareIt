"use client";

import Image from "next/image";

interface SidebarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  activeMenu: string;
  setActiveMenu: React.Dispatch<React.SetStateAction<string>>;
  menuItems: {
    name: string;
    icon: string;
  }[];
}

const Sidebar = ({
  isSidebarOpen,
  setIsSidebarOpen,
  activeMenu,
  setActiveMenu,
  menuItems,
}: SidebarProps) => {
  return (
    <>
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      
      <div
        className={`
          fixed top-0 left-0
          w-56 sm:w-64 h-screen
          bg-[#ECF6FB] rounded-r-2xl sm:rounded-r-3xl shadow-lg
          transition-transform duration-300 z-50
          overflow-y-auto

          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:relative lg:top-0 lg:left-0 lg:rounded-r-none lg:rounded-l-3xl lg:shadow-none
        `}
      >
      {/* LOGO */}
      <div className="p-3 sm:p-5 flex justify-center border-b border-blue-100">
        <Image
          src="/assets/LOGO_CAREIT.svg"
          alt="Care It Logo"
          width={140}
          height={70}
          className="object-contain w-24 sm:w-32 md:w-36"
        />
      </div>

      {/* MENU */}
      <nav className="mt-4 sm:mt-6 space-y-1 sm:space-y-2 px-2 sm:px-4">
        {menuItems.map((item, index) => {
          const isActive = activeMenu === item.name;

          return (
            <button
              key={index}
              onClick={() => {
                setActiveMenu(item.name);
                setIsSidebarOpen(false);
              }}
              className={`
                w-full flex items-center gap-2 sm:gap-3 py-2 sm:py-3 px-2 sm:px-4
                rounded-lg sm:rounded-xl text-left transition-all
                ${
                  isActive
                    ? "bg-white text-blue-600 border-l-4 border-blue-500 shadow-sm"
                    : "text-gray-400 hover:bg-white"
                }
              `}
            >
              <span className={`text-base sm:text-lg ${isActive ? "text-blue-500" : ""}`}>
                {item.icon}
              </span>
              <span className="text-xs sm:text-sm font-medium">{item.name}</span>
            </button>
          );
        })}
      </nav>
    </div>
    </>
  );
};

export default Sidebar;
