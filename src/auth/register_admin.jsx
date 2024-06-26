import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faEyeSlash,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons";
import logobinus from "../asset/logobinus.png";
import register3 from "../asset/register3.gif";
import axios from "axios";
import Swal from "sweetalert2";

function Register_admin() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordType, setPasswordType] = useState("password");

  const togglePassword = () => {
    setPasswordType(passwordType === "password" ? "text" : "password");
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    // Validation logic goes here

    try {
      const response = await axios.post("http://localhost:4001/register", {
        username,
        email,
        password,
        role: "ADMIN",
      });
      if (response.data) {
        Swal.fire({
          icon: "success",
          title: "Registrasi Berhasil!",
          text: "Anda berhasil terdaftar sebagai admin.",
          timer: 2000,
          showConfirmButton: false,
        }).then(() => {
          window.location.href = "/";
        });
      }
    } catch (error) {
      let errorMessage = "Registrasi gagal! Silakan coba lagi.";
      if (error.response?.status === 401) {
        errorMessage = "Username atau email sudah digunakan.";
      } else {
        errorMessage = error.response?.data?.message || "Terjadi kesalahan.";
      }
      Swal.fire({
        icon: "error",
        title: "Registrasi Gagal!",
        text: errorMessage,
        timer: 2000,
        showConfirmButton: false,
      });
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-5 lg:px-0 bg-gradient-to-r bg-sky-50">
      <div className="max-w-screen-lg bg-white border border-gray-300 shadow sm:rounded-lg rounded-lg flex justify-center flex-1">
        <div className="hidden md:flex md:flex-1 bg-gray-100 text-center">
          <div className="m-8 xl:m-12 w-full flex items-center justify-center">
            <img src={register3} className="w-72 h-72" alt="Komputer" />
          </div>
        </div>
        <div className="lg:w-2/4 xl:w-2/4 p-8 sm:p-10">
          <div className="flex flex-col items-center">
            <div className="text-center">
              <div className="text-center">
                <img
                  className="mx-auto h-24 w-auto"
                  src={logobinus}
                  alt="Binus Logo"
                />
              </div>
              <h1 className="text-xl xl:text-3xl font-extrabold text-sky-600 my-2">
                E-RUWATAN
              </h1>
            </div>
            <div className="w-full md:w-full mt-6">
              <form
                className="mx-auto max-w-md md:max-w-full md:w-2/3 flex flex-col gap-4"
                onSubmit={handleRegister}
              >
                <div>
                  <input
                    className="w-full px-4 py-3 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                    type="text"
                    placeholder="Masukkan Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                  <p className="text-red-500 text-xs mt-1">
                    * Username harus diisi
                  </p>
                </div>
                <div>
                  <input
                    className="w-full px-4 py-3 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                    type="email"
                    placeholder="Masukkan Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <p className="text-red-500 text-xs mt-1">
                    * Email harus diisi
                  </p>
                </div>
                <div className="relative w-full">
                  <input
                    className="w-full px-4 py-3 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white pr-8"
                    type={passwordType}
                    placeholder="Masukkan Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <span
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 cursor-pointer"
                    onClick={togglePassword}
                    style={{ top: "37%", transform: "translateY(-50%)" }}
                  >
                    <FontAwesomeIcon
                      icon={passwordType === "password" ? faEyeSlash : faEye}
                    />
                  </span>
                  <p className="text-red-500 text-xs mt-1">
                    * Password harus terdiri dari 8 karakter
                  </p>
                </div>
                <button className="mt-6 tracking-wide font-semibold bg-sky-600 text-gray-100 w-full py-3 md:py-3 rounded-lg hover:bg-sky-700 flex items-center justify-center focus:shadow-outline focus:outline-none">
                  <FontAwesomeIcon icon={faUserPlus} size="1x" />
                  <span className="ml-2">Daftar</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register_admin;
