import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDoorOpen,
  faHome,
  faChalkboardTeacher,
  faRightToBracket,
  faUserGroup,
  faBars,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import logobinus from "../asset/logobinus.png";
import Swal from "sweetalert2";

const Sidebar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  // Helper function to determine if a menu should be "active"
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
          willClose: () => {
            window.location.href = "/";
          },
        });
      }
    });
  }

  return (
    <div>
      {loading}
      <nav className="fixed top-0 z-50 w-full bg-gray-100 border shadow-sm flex justify-between items-center px-3 py-3 lg:px-5 lg:pl-3">
        <div className="flex items-center">
          <button
            id="sidebar-toggle"
            className="text-black focus:outline-none md:hidden mx-3"
            onClick={toggleSidebar}
          >
           {sidebarOpen ? (
              <FontAwesomeIcon icon={faTimes} size="lg" />
            ) : (
              <FontAwesomeIcon icon={faBars} size="lg" />
            )}
          </button>
          <img src={logobinus} className="h-12" alt="Logo" />
          <a href="/dashboard_siswa">
            <span className="text-black text-3xl font-medium ml-2">E-RUWATAN</span>
          </a>
        </div>
      </nav>
      <div className={`fixed top-0 left-0 z-40 w-64 h-full bg-white shadow-xl border transition-transform duration-300 transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="bg-blue-800 text-white px-4 py-3">
          <h1 className="text-2xl font-semibold">E-RUWATAN</h1>
        </div>
        <ul className="mt-6 text-xl mx-2 text-gray-600">
          {/* Iterate through menu items */}
          {[
            { icon: faHome, name: "Dashboard", path: "/dashboard_siswa" },
            { icon: faUserGroup, name: "Siswa", path: "/Siswa" },
            { icon: faChalkboardTeacher, name: "Guru", path: "/Guru" },
            { icon: faDoorOpen, name: "Kelas", path: "/Kelas" }
          ].map((item, index) => (
            <li
              key={index}
              className={`py-2 px-3 my-2 rounded cursor-pointer 
                      ${isActive(item.path)
                  ? "bg-gray-400 text-black"
                  : "hover:bg-gray-400 hover:text-black"
                }`}
            >
              <button
                onClick={() => handleNavigation(item.path)}
                className="flex items-center w-full"
              >
                <FontAwesomeIcon icon={item.icon} className="mr-2" />
                <span
                  style={{ fontFamily: "Segoe UI" }}
                  className="mx-2 font-medium"
                >
                  {item.name}
                </span>
              </button>
            </li>
          ))}
          {/* Logout list item */}
          <li className="py-2 px-3 my-2 hover:text-black hover:bg-gray-400 rounded cursor-pointer absolute bottom-0 left-0 w-full">
            <button onClick={logout} className="flex items-center w-full">
              <FontAwesomeIcon icon={faRightToBracket} className="mr-2 ml-3" />
              <span style={{ fontFamily: "Segoe UI" }} className="mx-2 font-medium">Keluar</span>
            </button>
          </li>
        </ul>
      </div>
      <div className={`ml-0 md:ml-56 transition-transform duration-300 ease-in-out ${sidebarOpen ? "md:ml-0" : "-md:ml-64"}`} />
    </div>
  );
};

export default Sidebar;
