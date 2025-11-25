

// // Header.jsx
// import React from "react";
// import { useAuth } from "../context/AuthContext.jsx";
// import { useNavigate } from "react-router-dom";
// import { FiLogOut } from "react-icons/fi";
// import { FaUserCircle } from "react-icons/fa"; // user icon
// import { TrendingUp } from "lucide-react";

// export default function Header({ onToggleSidebar }) {
//   const { user, setUser } = useAuth();
//   const navigate = useNavigate();

//   // localStorage se user parse karo
//   const storedUser = JSON.parse(localStorage.getItem("user") || "{}");

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     setUser(null);
//     navigate("/");
//   };

//   return (
//     <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-md">
//       <div className="mx-auto flex items-center justify-between px-4 py-2">
//         {/* Left Side (Logo + Sidebar toggle) */}
//         <div className="flex items-center gap-3">
//           <button
//             onClick={onToggleSidebar}
//             className="md:hidden p-2 rounded-lg border"
//           >
//             ☰
//           </button>
//           <img
//             src="/leadgen.png"
//             alt="Lead Generate"
//             className="h-12 md:h-18 w-auto object-contain"
//           />
//         </div>

//         {/* Right Side (User Info + Logout) */}
//         <div className="flex items-center gap-4">

          

//           {storedUser?.role !== 'admin' && (
//     <button
//       onClick={() => navigate('/my-performance')}
//       className="flex items-center gap-2 px-4 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition mr-5"
//     >
//       <TrendingUp className="text-lg" />
//       My Performance
//     </button>
//   )}



//           {/* User info */}
//           <div className="flex items-center gap-2 text-gray-700 font-medium">
//             <FaUserCircle className="text-2xl text-gray-600" />
//             <span>{storedUser?.name || "Guest"}</span>
//           </div>






//           {/* Logout button */}
//           <button
//             onClick={handleLogout}
//             className="flex items-center gap-2 px-4 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
//           >
//             <FiLogOut className="text-lg" />
            
//           </button>
//         </div>
//       </div>
//     </header>
//   );
// }


import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import { FiLogOut, FiChevronDown, FiChevronUp, FiSettings, FiUser } from "react-icons/fi";
import { FaUserCircle } from "react-icons/fa";
import { TrendingUp } from "lucide-react";

export default function Header({ onToggleSidebar }) {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const apiUrl = import.meta.env.VITE_API_URL;

  // --- GET USER DATA FROM LOCALSTORAGE ---
  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const adminData = JSON.parse(localStorage.getItem("adminData") || "{}");

  console.log("Stored User:", storedUser);
  console.log("Admin Data:", adminData);

  // --- LOGO HANDLING LOGIC ---
  // If employee → show adminData logo
  // Else → show user logo normally
  const selectedLogo =
    storedUser?.role === "employee"
      ? adminData?.logo
      : storedUser?.logo;

  const logo = selectedLogo
    ? selectedLogo.startsWith("http")
      ? selectedLogo
      : `${apiUrl}/${selectedLogo}`
    : "/fallback-logo.png";

  // --- LOGOUT ---
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
    setIsDropdownOpen(false);
  };

  // --- CLOSE DROPDOWN ON OUTSIDE CLICK ---
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case "admin":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "manager":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "employee":
        return "bg-orange-100 text-orange-800 border-orange-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm backdrop-blur-sm bg-white/95">
      <div className="mx-auto flex items-center justify-between px-6 py-3">

        {/* LEFT */}
        <div className="flex items-center gap-4">
          <button
            onClick={onToggleSidebar}
            className="md:hidden p-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 transition-all"
          >
            <div className="w-5 h-5 flex flex-col justify-center">
              <span className="w-full h-0.5 bg-gray-600 mb-1"></span>
              <span className="w-full h-0.5 bg-gray-600 mb-1"></span>
              <span className="w-full h-0.5 bg-gray-600"></span>
            </div>
          </button>

          {/* DYNAMIC LOGO */}
          <img
            src={logo}
            alt="Logo"
            className="h-10 md:h-12 w-auto object-contain"
          />
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-4">

          {/* My Performance employee only */}
          {storedUser?.role === "employee" && (
            <button
              onClick={() => navigate("/my-performance")}
              className="flex items-center gap-3 px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
            >
              <TrendingUp />
              <span>My Performance</span>
            </button>
          )}

          {/* DROPDOWN */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-50"
            >
              <FaUserCircle className="text-2xl text-gray-500" />
              <p className="text-sm font-semibold hidden sm:block">
                {storedUser?.name}
              </p>

              {isDropdownOpen ? <FiChevronUp /> : <FiChevronDown />}
            </button>

            {/* MENU */}
            {isDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-300 py-2">

                {/* Info */}
                <div className="px-4 py-3 border-b border-gray-300">
                  <p className="text-sm font-semibold">{storedUser?.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs border ${getRoleBadgeColor(
                        storedUser?.role
                      )}`}
                    >
                      {storedUser?.role}
                    </span>
                    <span className="text-xs text-gray-500">{storedUser?.email}</span>
                  </div>
                </div>

                {/* Profile */}
                {storedUser?.role !== "employee" && (
                  <button
                    onClick={() => {
                      navigate("/profile");
                      setIsDropdownOpen(false);
                    }}
                    className="flex items-center gap-3 w-full px-4 py-2.5 text-sm hover:bg-gray-50"
                  >
                    <FiUser />
                    Update Logo
                  </button>
                )}


                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
                >
                  <FiLogOut />
                  Sign Out
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
}