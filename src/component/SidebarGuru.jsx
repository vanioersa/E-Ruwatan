import React, { useState, useEffect } from "react";
import logobinus from "../asset/logobinus.png";
import profil from "../asset/profil.png";
import Swal from "sweetalert2";
import { useLocation } from "react-router-dom";

function SidebarGuru() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    handleResize(); // Check initial window size
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleNavigation = (to) => {
    setLoading(true);
    setTimeout(() => {
      window.location.href = to;
      setLoading(false);
    }, 1000);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen);
  };

  function logout() {
    Swal.fire({
      title: "Keluar",
      text: "Anda harus login kembali apabila keluar dari aplikasi ini!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Keluar",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("token");
        Swal.fire({
          title: "Berhasil Keluar",
          text: "Anda telah berhasil keluar.",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        }).then(() => {
          window.location.href = "/";
        });
      }
    });
  }

  const isActive = (path) => location.pathname === path;

  return (
    <div>
      {loading}
      <nav className="fixed top-0 z-50 w-full bg-gray-100 border-b border-gray-200 shadow-sm flex justify-between items-center px-3 py-3 lg:px-5 lg:pl-3">
        <div className="flex items-center">
          <button
            id="sidebar-toggle"
            className="text-black focus:outline-none md:hidden mx-3"
            onClick={toggleSidebar}
          >
            {sidebarOpen ? (
              <svg className="w-6 h-6" data-slot="icon" fill="none" stroke-width="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12"></path>
              </svg>
            ) : (
              <svg className="w-6 h-6" data-slot="icon" fill="none" stroke-width="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"></path>
              </svg>

            )}
          </button>
          <img src={logobinus} className="h-12" alt="Logo" />
          <a href="/dashboard_guru">
            <span className="text-black text-3xl font-medium ml-2">
              E-RUWATAN
            </span>
          </a>
        </div>

        {/* Profil dropdown */}
        <div className="relative ml-3">
          <div>
            <button
              type="button"
              className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
              id="user-menu-button"
              aria-expanded={userMenuOpen}
              aria-haspopup="true"
              onClick={toggleUserMenu}
            >
              <span className="absolute -inset-1.5"></span>
              <span className="sr-only">Open user menu</span>
              <img className="h-8 w-8 rounded-full" src={profil} alt="" />
            </button>
          </div>

          {userMenuOpen && (
            <div
              className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="user-menu-button"
              tabIndex="-1"
            >
              <a
                href="/profile_guru"
                className="block px-4 py-2 text-sm text-gray-700"
                role="menuitem"
                tabIndex="-1"
                id="user-menu-item-0"
              >
                Profile
              </a>
              <a
                onClick={logout}
                className="block px-4 py-2 text-sm text-gray-700"
                role="menuitem"
                tabIndex="-1"
                id="user-menu-item-2"
              >
                keluar
              </a>
            </div>
          )}
        </div>
      </nav>

      <div
        className={`fixed top-0 left-0 z-40 w-64 h-full bg-white shadow-xl border-r transition-transform duration-300 transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="bg-blue-800 text-white px-4 py-3">
          <h1 className="text-2xl font-semibold">E-RUWATAN</h1>
        </div>
        <ul className="mt-6 text-xl mx-2 text-gray-600">
          <li
            className={`py-2 px-3 my-2 rounded cursor-pointer ${isActive("/dashboard_guru")
              ? "bg-gray-400 text-black"
              : "hover:bg-gray-400 hover:text-black"
              }`}
          >
            <button
              onClick={() => handleNavigation("/dashboard_guru")}
              className="flex items-center w-full"
            >
              <svg className="w-7 h-7 mr-2" data-slot="icon" fill="none" stroke-width="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"></path>
              </svg>
              <span style={{ fontFamily: "Roboto", fontWeight: "bold" }} className="mx-2">
                Dashboard
              </span>
            </button>
          </li>
          <li
            className={`py-2 px-3 my-2 rounded cursor-pointer ${isActive("/kbm_guru")
              ? "bg-gray-400 text-black"
              : "hover:bg-gray-400 hover:text-black"
              }`}
          >
            <button
              onClick={() => handleNavigation("/kbm_guru")}
              className="flex items-center w-full"
            >
              <svg className="w-7 h-7 mr-2" data-slot="icon" fill="none" stroke-width="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"></path>
              </svg>
              <span style={{ fontFamily: "Poopins", fontWeight: "bold" }} className="mx-2 font-medium">
                KBM Guru
              </span>
            </button>
          </li>
          <li
            className={`py-2 px-3 my-2 rounded cursor-pointer ${isActive("/piketan_guru")
              ? "bg-gray-400 text-black"
              : "hover:bg-gray-400 hover:text-black"
              }`}
          >
            <button
              onClick={() => handleNavigation("/piketan_guru")}
              className="flex items-center w-full"
            >
              <svg className="w-7 h-7 mr-2" data-slot="icon" fill="none" stroke-width="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z"></path>
              </svg>
              <span style={{ fontFamily: "Poopins", fontWeight: "bold" }} className="mx-2 font-medium">
                Piketan
              </span>
            </button>
          </li>
          <li
            className={`py-2 px-3 my-2 rounded cursor-pointer ${isActive("/penilaian")
              ? "bg-gray-400 text-black"
              : "hover:bg-gray-400 hover:text-black"
              }`}
          >
            <button
              onClick={() => handleNavigation("/penilaian")}
              className="flex items-center w-full"
            >
              <svg className="w-7 h-7 mr-2" data-slot="icon" fill="none" stroke-width="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"></path>
              </svg>
              <span style={{ fontFamily: "Poopins", fontWeight: "bold" }} className="mx-2 font-medium">
                Penilaian
              </span>
            </button>
          </li>
          <li className="py-2 px-3 my-2 hover:text-black hover:bg-gray-400 rounded cursor-pointer absolute bottom-0 left-0 w-full">
            <button onClick={logout} className="flex items-center w-full">
              <svg className="w-7 h-7 mr-2 ml-3" data-slot="icon" fill="none" stroke-width="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"></path>
              </svg>
              <span style={{ fontFamily: "Poopins", fontWeight: "bold" }} className="mx-2 font-medium">
                Keluar
              </span>
            </button>
          </li>
        </ul>
      </div>
      <div
        className={`ml-0 md:ml-64 transition-transform duration-300 ease-in-out ${sidebarOpen ? "md:ml-0" : "-md:ml-64"
          }`}
      />
    </div>
  );
}

export default SidebarGuru;
