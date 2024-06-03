import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBarsStaggered,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import logobinus from "../asset/logobinus.png";
import profil from "../asset/profil.png";
import Swal from "sweetalert2";

const SidebarAdmin = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );
  const location = useLocation();
  const [currentTime, setCurrentTime] = useState("");

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

  useEffect(() => {
    const interval = setInterval(() => {
      const options = { timeZone: "Asia/Jakarta", hour12: false };
      const currentTime = new Date().toLocaleTimeString("en-US", options);
      setCurrentTime(currentTime);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const backgroundColor = darkMode ? "bg-white" : "bg-gray-800";

  return (
    <div className={darkMode ? "dark" : ""}>
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
              className={`${darkMode ? "text-white" : "text-black"
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
              className={`${darkMode ? "bg-white" : "bg-gray-800"
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
              className={`${darkMode ? backgroundColor : "bg-white"
                } absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md py-1`}
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="user-menu-button"
              tabIndex="-1"
            >
              <Link to="/profile_admin">
                <button
                  className={`${darkMode ? "text-white" : "text-gray-700"
                    } block px-4 py-2 text-sm`}
                  role="menuitem"
                  tabIndex="-1"
                  id="user-menu-item-0"
                >
                  Profile
                </button>
              </Link>
              <button
                onClick={logout}
                className={`${darkMode ? "text-white" : "text-gray-700"
                  } block px-4 py-2 text-sm`}
                role="menuitem"
                tabIndex="-1"
                id="user-menu-item-2"
              >
                keluar
              </button>
            </div>
          )}
        </div>
      </nav>
      <div
        className={`fixed top-0 left-0 z-40 w-64 h-full bg-white ${darkMode ? "dark:bg-gray-800" : ""
          } shadow-xl border transition-transform duration-300 transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="bg-blue-800 text-white px-4 py-3">
          <h1 className="text-2xl font-semibold">E-RUWATAN</h1>
        </div>
        <ul className="mt-6 text-xl mx-2 text-gray-600 dark:text-gray-200">
          {[
            {
              icon:
                <svg className="w-7 h-7 mr-2" data-slot="icon" fill="none" stroke-width="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"></path>
                </svg>,
              name: "Dashboard",
              path: "/dashboard_admin"
            },
            {
              icon:
                <svg className="w-7 h-7 mr-2" data-slot="icon" fill="none" stroke-width="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5"></path>
                </svg>,
              name: "Guru",
              path: "/guru"
            },
            {
              icon:
                <svg className="w-7 h-7 mr-2" data-slot="icon" fill="none" stroke-width="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"></path>
                </svg>,
              name: "Siswa",
              path: "/siswa"
            },
            {
              icon:
                <svg className="w-7 h-7 mr-2" data-slot="icon" fill="none" stroke-width="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path d="M10.385 21.788a.997.997 0 0 0 .857.182l8-2A.999.999 0 0 0 20 19V5a1 1 0 0 0-.758-.97l-8-2A1.003 1.003 0 0 0 10 3v1H6a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h4v1c0 .308.142.599.385.788zM12 4.281l6 1.5v12.438l-6 1.5V4.281zM7 18V6h3v12H7z"></path><path d="M14.242 13.159c.446-.112.758-.512.758-.971v-.377a1 1 0 1 0-2 .001v.377a1 1 0 0 0 1.242.97z"></path>
                </svg>,
              name: "Kelas",
              path: "/kelas"
            },
          ].map((item, index) => (
            <li
              key={index}
              className={`py-2 px-3 my-2 rounded cursor-pointer ${isActive(item.path)
                ? `bg-gray-400 dark:bg-gray-600 text-black dark:text-white`
                : `hover:bg-gray-400 dark:hover:bg-gray-600 hover:text-black dark:hover:text-white`
                }`}
            >
              <Link
                to={item.path}
                className={`${darkMode ? "text-white" : "text-gray-800"
                  } flex items-center w-full`}
              >
                {item.icon}
                <span
                  style={{ fontFamily: "Poopins", fontWeight: "bold" }}
                  className={`${darkMode ? "text-white" : "text-gray-800"
                    } mx-2 font-medium`}
                >
                  {item.name}
                </span>
              </Link>
            </li>
          ))}
          <div className={`${darkMode ? "text-white" : "text-gray-800"} ml-6 text-xl font-bold absolute bottom-16 w-full`}>
            Waktu : {currentTime}
          </div>
          <hr
            className={`absolute bottom-14 w-60 ${darkMode ? "text-white" : "text-black"
              }`}
          />
          <li
            className={`py-2 px-3 my-2 mr-2 mx-2 hover:text-black hover:bg-gray-400 rounded cursor-pointer absolute bottom-0 left-0 min-w-60`}
          >
            <button
              onClick={toggleDarkMode}
              className={`flex items-center w-full ${darkMode ? "text-white" : "text-gray-800"
                }`}
            >
              <span
                className={`w-7 h-7 mx-2 ${darkMode ? "text-white" : "text-gray-800"
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
                      d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
                    />
                  </svg>
                )}
              </span>
              <span
                style={{ fontFamily: "Poopins", fontWeight: "bold" }}
                className={`${darkMode ? "text-white" : "text-black"
                  } mx-2 font-medium`}
              >
                {darkMode ? "Gelap" : "Terang"}
              </span>
            </button>
          </li>
        </ul>
      </div>
      <div
        className={`ml-0 md:ml-64 transition-transform duration-300 ease-in-out ${sidebarOpen ? "md:ml-0" : "-md:ml-64"
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
