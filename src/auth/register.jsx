import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import logobinus from "../asset/logobinus.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";

const apiUrl = "http://localhost:4001";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordType, setPasswordType] = useState("password");
  const navigate = useNavigate();

  const togglePassword = () => {
    setPasswordType(passwordType === "password" ? "text" : "password");
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!username.match(/^[A-Za-z\s]+$/)) {
      Swal.fire({
          icon: "error",
          title: "Registrasi Gagal",
          text: "Username hanya boleh berisi huruf dan spasi",
          timer: 2000,
          showConfirmButton: false,
      });
      return;
  }
  if (!username.charAt(0).match(/^[A-Z]$/)) {
      Swal.fire({
          icon: "error",
          title: "Registrasi Gagal",
          text: "Huruf pertama username harus kapital",
          timer: 2000,
          showConfirmButton: false,
      });
      return;
  }
    if (!validateEmail(email)) {
      Swal.fire({
        icon: "error",
        title: "Registrasi Gagal",
        text: "Email tidak valid",
        timer: 2000,
        showConfirmButton: false,
      });
      return;
    }
    if (password.length < 8) {
      Swal.fire({
        icon: "error",
        title: "Registrasi Gagal",
        text: "Password harus terdiri dari minimal 8 karakter",
        timer: 2000,
        showConfirmButton: false,
      });
      return;
    }
    if (!password.match(/^(?=.*[a-zA-Z])(?=.*[0-9])/)) {
      Swal.fire({
        icon: "error",
        title: "Registrasi Gagal",
        text: "Password harus terdiri dari angka dan huruf",
        timer: 2000,
        showConfirmButton: false,
      });
      return;
    }

    try {
      const response = await axios.post(`${apiUrl}/register`, {
        username,
        email,
        password,
        role: "murid", // Set role to 'murid'
      });
      if (response.data) {
        Swal.fire({
          icon: "success",
          title: "Registrasi Berhasil!",
          text: "Anda berhasil terdaftar sebagai murid.",
          timer: 2000,
          showConfirmButton: false,
        }).then(() => {
          navigate("/");
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

  const validateEmail = (email) => {
    // Regex untuk validasi email sederhana
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  return (
    <>
      {/* Main container with padding, box shadow, and border radius */}
      <div className="flex min-h-full flex-col justify-center px-6 py-8 lg:px-8 mt-16">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          {/* Style card */}
          <div className="bg-slate-50 p-6 rounded-lg shadow-lg ring-1 ring-slate-200">
            {/* Logo */}
            <div className="text-center mb-8">
              <img
                className="mx-auto h-32 w-auto"
                src={logobinus}
                alt="binusa"
              />
            </div>

            {/* Form */}
            <form className="space-y-6" onSubmit={handleRegister}>
              {/* Username container */}
              <div>
                <label
                  htmlFor="username"
                  className="block text-base font-medium leading-6 text-gray-900"
                >
                  Username
                </label>
                <div className="mt-2">
                  <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    autoComplete="off"
                    className="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-lg ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-cyan-600 sm:text-sm sm:leading-6"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
              </div>

              {/* Email and Password container side by side */}
              <div className="flex gap-4">
                {/* Email container */}
                <div className="flex-1">
                  <label
                    htmlFor="email"
                    className="block text-base font-medium leading-6 text-gray-900"
                  >
                    Email
                  </label>
                  <div className="mt-2">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      autoComplete="off"
                      className="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-lg ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-cyan-600 sm:text-sm sm:leading-6"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                {/* Password container */}
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="password"
                      className="block text-base font-medium leading-6 text-gray-900"
                    >
                      Password
                    </label>
                  </div>
                  <div className="relative mt-2">
                    <input
                      id="password"
                      name="password"
                      required
                      type={passwordType}
                      autoComplete="current-password"
                      className="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-lg ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-cyan-600 sm:text-sm sm:leading-6 pr-10"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <span
                      onClick={togglePassword}
                      className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
                    >
                      {passwordType === "password" ? (
                        <FontAwesomeIcon icon={faEyeSlash} />
                      ) : (
                        <FontAwesomeIcon icon={faEye} />
                      )}
                    </span>
                  </div>
                </div>
              </div>

              {/* Submit button */}
              <div>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-sky-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-sky-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Daftar
                </button>
              </div>
            </form>

            {/* Login link */}
            <p className="mt-10 text-center text-sm text-gray-500">
              Sudah Punya Akun?
              <a
                href="/login"
                className="mx-2 font-semibold leading-6 text-sky-600 hover:text-blue-600"
              >
                Login
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Register;
