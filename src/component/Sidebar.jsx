import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDoorOpen,
  faHome,
  faChalkboardTeacher,
  faRightToBracket,
  faUserGroup,
  faBarsStaggered,
  faXmark,
  faMoon,
  faSun,
} from "@fortawesome/free-solid-svg-icons";
import logobinus from "../asset/logobinus.png";
import profil from "../asset/profil.png";
import Swal from "sweetalert2";

const SidebarAdmin = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
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

  const logout = () => {
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
          willClose: () => {
            window.location.href = "/";
          },
        });
      }
    });
  };

  const backgroundColor = darkMode ? "bg-white" : "bg-gray-800";

  return (
    <div className={darkMode ? "dark" : ""}>
      {loading}
      <nav className="fixed top-0 z-50 w-full bg-gray-100 dark:bg-gray-800 border shadow-sm flex justify-between items-center px-3 py-3 lg:px-5 lg:pl-3">
        <div className="flex items-center">
          <button
            id="sidebar-toggle"
            className="text-black dark:text-white focus:outline-none md:hidden mx-3"
            onClick={toggleSidebar}
          >
            {sidebarOpen ? (
              <FontAwesomeIcon icon={faXmark} size="lg" />
            ) : (
              <FontAwesomeIcon icon={faBarsStaggered} size="lg" />
            )}
          </button>
          <img src={logobinus} className="h-12" alt="Logo" />
          <a href="/dashboard_admin">
            <span
              className={`${
                darkMode ? "text-white" : "text-black"
              } text-3xl font-medium ml-2`}
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
              className={`${
                darkMode ? backgroundColor : "bg-white"
              } absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md py-1`}
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="user-menu-button"
              tabIndex="-1"
            >
              <Link to="/profile_admin">
                <button
                  className={`${
                    darkMode ? "text-white" : "text-gray-700"
                  } block px-4 py-2 text-sm`}
                  role="menuitem"
                  tabIndex="-1"
                  id="user-menu-item-0"
                >
                  Profile
                </button>
              </Link>
              <a
                onClick={logout}
                className={`${
                  darkMode ? "text-white" : "text-gray-700"
                } block px-4 py-2 text-sm`}
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
        className={`fixed top-0 left-0 z-40 w-64 h-full bg-white ${
          darkMode ? "dark:bg-gray-800" : ""
        } shadow-xl border transition-transform duration-300 transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="bg-blue-800 text-white px-4 py-3">
          <h1 className="text-2xl font-semibold">E-RUWATAN</h1>
        </div>
        <ul className="mt-6 text-xl mx-2 text-gray-600 dark:text-gray-200">
          {[
            { icon: faHome, name: "Dashboard", path: "/dashboard_admin" },
            { icon: faChalkboardTeacher, name: "Guru", path: "/guru" },
            { icon: faUserGroup, name: "Siswa", path: "/siswa" },
            { icon: faDoorOpen, name: "Kelas", path: "/kelas" },
          ].map((item, index) => (
            <li
              key={index}
              className={`py-2 px-3 my-2 rounded cursor-pointer ${
                isActive(item.path)
                  ? `bg-gray-400 dark:bg-gray-600 text-black dark:text-white`
                  : `hover:bg-gray-400 dark:hover:bg-gray-600 hover:text-black dark:hover:text-white`
              }`}
            >
              <Link
                to={item.path}
                className={`${
                  darkMode ? "text-white" : "text-gray-800"
                } flex items-center w-full`}
              >
                <FontAwesomeIcon icon={item.icon} className="mr-2" />
                <span
                  style={{ fontFamily: "Segoe UI" }}
                  className={`${
                    darkMode ? "text-white" : "text-gray-800"
                  } mx-2 font-medium`}
                >
                  {item.name}
                </span>
              </Link>
            </li>
          ))}
          <li
            className={`py-2 px-5 my-2 rounded cursor-pointer ${
              darkMode
                ? "hover:text-black hover:bg-gray-400 "
                : "hover:text-white hover:bg-gray-600"
            } absolute bottom-0 left-0 right-0 w-full`}
          >
            <Link
              type="button"
              className={`${
                darkMode ? "text-white" : "text-black"
              } flex items-center w-full`}
              onClick={toggleDarkMode}
            >
              <FontAwesomeIcon icon={darkMode ? faMoon : faSun} size="lg" />{" "}
              <span
                style={{ fontFamily: "Segoe UI" }}
                className={`${
                  darkMode ? "text-white" : "text-black"
                } mx-3 font-medium`}
              >
                {darkMode ? "Gelap" : "Terang"}
              </span>
            </Link>
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

export default SidebarAdmin;
