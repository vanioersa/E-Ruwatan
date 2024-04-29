import React from "react";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faRightToBracket,
  faBook,
  faUserGroup,
} from "@fortawesome/free-solid-svg-icons";
import logobinus from "../asset/logobinus.png";
import IconLoader from "./Loader";
import Swal from "sweetalert2";

function SidebarGuru() {
  // State untuk sidebar dan loading
  const [sidebarOpen, setSidebarOpen] = useState(true); // Mulai dengan sidebar terbuka
  const [loading, setLoading] = useState(false);

  // Fungsi untuk menangani perubahan ukuran layar
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(false); // Tutup sidebar saat lebar layar kecil
      } else {
        setSidebarOpen(true); // Buka sidebar saat lebar layar besar
      }
    };

    // Tambahkan event listener untuk menangani perubahan ukuran layar
    window.addEventListener("resize", handleResize);

    // Panggil fungsi handleResize saat komponen dimuat
    handleResize();

    // Hapus event listener saat komponen dilepas
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Fungsi Loader
  const handleNavigation = (to) => {
    setLoading(true);
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    delay(3000)
      .then(() => {
        window.location.href = to;
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // Fungsi untuk membuka atau menutup sidebar
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  function logout() {
    Swal.fire({
      title: "Logout",
      text: "Anda harus login kembali apabila keluar dari aplikasi ini!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, Logout",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("token");
        Swal.fire({
          title: "Logout Berhasil",
          text: "Anda telah berhasil logout.",
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
      {loading && <IconLoader />}
      {/* Navbar */}
      <nav className="fixed top-0 z-50 w-full bg-gradient-to-r bg-gray-100 border shadow-sm flex justify-between items-center px-3 py-3 lg:px-5 lg:pl-3">
        <div className="flex items-center">
          <button
            id="sidebar-toggle"
            className="text-black focus:outline-none md:hidden"
            onClick={toggleSidebar}
          >
            <svg
              className="w-6 h-6"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          <img src={logobinus} className="h-12" alt="Logo" />
          <span className="text-black text-3xl font-medium ml-2">
            E-RUWATAN
          </span>
        </div>
      </nav>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 z-40 w-64 h-full bg-white shadow-xl border transition-transform duration-300 transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="bg-blue-800 text-white px-4 py-3">
          <h1 className="text-2xl font-semibold">E-RUWATAN</h1>
        </div>
        <ul className="mt-6 text-xl mx-2 text-gray-600">
          <li className="py-2 px-3 my-2 hover:text-black hover:bg-gray-400 rounded cursor-pointer">
            <button
              onClick={() => handleNavigation("/dashboard_guru")}
              className="flex items-center"
            >
              <FontAwesomeIcon icon={faHome} className="mr-2" />
              <span
                style={{ fontFamily: "Segoe UI" }}
                className="mx-2 font-medium"
              >
                Dashboard
              </span>
            </button>
          </li>
          <li className="py-2 px-3 my-2 hover:text-black hover:bg-gray-400 rounded cursor-pointer">
            <a href="kbm_guru" className="flex items-center">
              <FontAwesomeIcon icon={faBook} className="mr-2" />
              <span
                style={{ fontFamily: "Segoe UI" }}
                className="mx-3 font-medium"
              >
                KBM Guru
              </span>
            </a>
          </li>
          <li className="py-2 px-3 my-2 hover:text-black hover:bg-gray-400 rounded cursor-pointer">
            <a href="/piketan_guru" className="flex items-center">
              <FontAwesomeIcon icon={faUserGroup} className="mr-2" />
              <span
                style={{ fontFamily: "Segoe UI" }}
                className="mx-1 font-medium"
              >
                Piketan
              </span>
            </a>
          </li>
          <li className="py-2 px-3 my-2 hover:text-black hover:bg-gray-400 rounded cursor-pointer absolute bottom-0 left-0 w-full">
            <button onClick={logout} className="flex items-center w-full">
              <FontAwesomeIcon icon={faRightToBracket} className="mr-2 ml-3" />
              <span
                style={{ fontFamily: "Segoe UI" }}
                className="mx-2 font-medium"
              >
                Keluar
              </span>
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default SidebarGuru;
