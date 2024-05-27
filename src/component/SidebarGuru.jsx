import React, { useState, useEffect } from "react";
import logobinus from "../asset/logobinus.png";
import profil from "../asset/profil.png";
import Swal from "sweetalert2";
import { Link, useLocation } from "react-router-dom";

const SidebarGuru = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );
  const [currentTime, setCurrentTime] = useState("");
  const location = useLocation();

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

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
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

  useEffect(() => {
    const interval = setInterval(() => {
      const options = { timeZone: "Asia/Jakarta", hour12: false };
      const currentTime = new Date().toLocaleTimeString("en-US", options);
      setCurrentTime(currentTime);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark");
      localStorage.setItem("darkMode", "true");
    } else {
      document.body.classList.remove("dark");
      localStorage.setItem("darkMode", "false");
    }
  }, [darkMode]);

  return (
    <div className={darkMode ? "dark" : ""}>
      {loading}
      <nav className="fixed top-0 z-50 w-full bg-gray-100 dark:bg-gray-800 border shadow-sm flex justify-between items-center px-3 py-3 lg:px-5 lg:pl-3">
        <div className="flex items-center">
          <button
            id="sidebar-toggle"
            className={`text-black focus:outline-none md:hidden mx-3 ${
              darkMode ? "text-white" : "text-black"
            }`}
            onClick={toggleSidebar}
          >
            {sidebarOpen ? (
              <svg
                className="w-6 h-6"
                data-slot="icon"
                fill="none"
                strokeWidth="1.5"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18 18 6M6 6l12 12"
                ></path>
              </svg>
            ) : (
              <svg
                className="w-6 h-6"
                data-slot="icon"
                fill="none"
                strokeWidth="1.5"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                ></path>
              </svg>
            )}
          </button>
          <img src={logobinus} className="h-12" alt="Logo" />
          <a href="/dashboard_guru">
            <span
              className={`text-black text-3xl font-medium ml-2 ${
                darkMode ? "text-white" : "text-black"
              }`}
            >
              E-RUWATAN
            </span>
          </a>
        </div>

        {/* Profil dropdown */}
        <div className="relative ml-3">
          <div>
            <button
              type="button"
              className={`${
                darkMode ? "bg-white" : "bg-gray-800"
              } relative flex rounded-full text-sm`}
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
              className={`absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md py-1 ${
                darkMode ? "bg-gray-700" : "bg-white"
              } py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none`}
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="user-menu-button"
              tabIndex="-1"
            >
              <a
                href="/profile_guru"
                className={`block px-4 py-2 text-sm ${
                  darkMode ? "text-white" : "text-gray-700"
                }`}
                role="menuitem"
                tabIndex="-1"
                id="user-menu-item-0"
              >
                Profile
              </a>
              <a
                onClick={logout}
                className={`block px-4 py-2 text-sm ${
                  darkMode ? "text-white" : "text-gray-700"
                }`}
                role="menuitem"
                tabIndex="-1"
                id="user-menu-item-2"
              >
                Keluar
              </a>
            </div>
          )}
        </div>
      </nav>

      <div
        className={`fixed top-0 left-0 z-40 w-64 h-full bg-white ${
          darkMode ? "dark:bg-gray-800" : ""
        } shadow-xl border transition-transform duration-300 transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div
          className={`bg-blue-800 text-white px-4 py-3 ${
            darkMode ? "bg-gray-800" : ""
          }`}
        >
          <h1 className="text-2xl font-semibold">E-RUWATAN</h1>
        </div>
        <ul
          className={`mt-6 text-xl mx-2 ${
            darkMode ? "text-gray-200" : "text-gray-600"
          }`}
        >
          <li
            className={`py-2 px-3 my-2 rounded cursor-pointer ${
              isActive("/dashboard_guru")
                ? `bg-gray-400 text-black`
                : `hover:bg-gray-400 hover:text-black`
            }`}
          >
            <Link to="/dashboard_guru" className="flex items-center w-full">
              <svg
                className="w-7 h-7 mr-2"
                data-slot="icon"
                fill="none"
                strokeWidth="1.5"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                ></path>
              </svg>
              <span
                style={{ fontFamily: "Poopins", fontWeight: "bold" }}
                className={`${darkMode ? "text-white" : "text-black"} mx-2`}
              >
                Dashboard
              </span>
            </Link>
          </li>
          <li
            className={`py-2 px-3 my-2 rounded cursor-pointer ${
              isActive("/kbm_guru")
                ? `bg-gray-400 text-black`
                : `hover:bg-gray-400 hover:text-black`
            }`}
          >
            <Link to="/kbm_guru" className="flex items-center w-full">
              <svg
                className="w-7 h-7 mr-2"
                data-slot="icon"
                fill="none"
                strokeWidth="1.5"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"
                ></path>
              </svg>
              <span
                style={{ fontFamily: "Poopins", fontWeight: "bold" }}
                className={`${
                  darkMode ? "text-white" : "text-black"
                } mx-2 font-medium`}
              >
                KBM Guru
              </span>
            </Link>
          </li>
          <li
            className={`py-2 px-3 my-2 rounded cursor-pointer ${
              isActive("/piketan_guru")
                ? `bg-gray-400 text-black`
                : `hover:bg-gray-400 hover:text-black`
            }`}
          >
            <Link to="/piketan_guru" className="flex items-center w-full">
              <svg
                className="w-7 h-7 mr-2"
                data-slot="icon"
                fill="none"
                strokeWidth="1.5"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z"
                ></path>
              </svg>
              <span
                style={{ fontFamily: "Poopins", fontWeight: "bold" }}
                className={`${
                  darkMode ? "text-white" : "text-black"
                } mx-2 font-medium`}
              >
                Piketan
              </span>
            </Link>
          </li>
          <li
            className={`py-2 px-3 my-2 rounded cursor-pointer ${
              isActive("/penilaian")
                ? `bg-gray-400 text-black`
                : `hover:bg-gray-400 hover:text-black`
            }`}
          >
            <Link to="/penilaian" className="flex items-center w-full">
              <svg
                className="w-7 h-7 mr-2"
                data-slot="icon"
                fill="none"
                strokeWidth="1.5"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
                ></path>
              </svg>
              <span
                style={{ fontFamily: "Poopins", fontWeight: "bold" }}
                className={`${
                  darkMode ? "text-white" : "text-black"
                } mx-2 font-medium`}
              >
                Penilaian
              </span>
            </Link>
          </li>
          <div className="ml-6 text-xl font-bold absolute bottom-16 w-full">
            Waktu : {currentTime}
          </div>
          <hr
            className={`absolute bottom-14 w-60 ${
              darkMode ? "text-white" : "text-black"
            }`}
          />
          <li
            className={`py-2 px-3 my-2 hover:text-black hover:bg-gray-400 rounded cursor-pointer absolute bottom-0 left-0 w-full`}
          >
            <button
              onClick={toggleDarkMode}
              className={`flex items-center w-full ${
                darkMode ? "text-white" : "text-gray-800"
              }`}
            >
              <span
                className={`w-7 h-7 mx-2 ${
                  darkMode ? "text-white" : "text-gray-800"
                }`}
              >
                {darkMode ? (
                  <svg
                    className="w-7 h-7 mr-2"
                    xmlns="http://www.w3.org/2000/svg"
                    data-slot="icon"
                    fill="none"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-7 h-7 mr-2"
                    xmlns="http://www.w3.org/2000/svg"
                    data-slot="icon"
                    fill="none"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
                    />
                  </svg>
                )}
              </span>
              <span
                style={{ fontFamily: "Poopins", fontWeight: "bold" }}
                className={`${
                  darkMode ? "text-white" : "text-black"
                } mx-2 font-medium`}
              >
                {darkMode ? "Gelap" : "Terang"}
              </span>
            </button>
          </li>
        </ul>
      </div>
      <div
        className={`ml-0 md:ml-64 transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "md:ml-0" : "-md:ml-64"
        }`}
      />
      <style>{`
          body {
            background-color: white;
            color: black;
            transition: background-color 0.3s ease, color 0.3s ease;
          }
          
          body.dark {
            background-color: #2a2b2e;
            color: white;
          }
  
          .dark nav,
          .dark .bg-blue-800 {
            background-color: #43537d;
            transition: background-color 0.3s ease, color 0.3s ease;
          }
  
          .dark .bg-white {
            background-color: #434752;
            transition: background-color 0.3s ease, color 0.3s ease;
          }
        `}</style>
    </div>
  );
};

export default SidebarGuru;
