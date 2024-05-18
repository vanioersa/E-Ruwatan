import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faUser } from '@fortawesome/free-solid-svg-icons';
import logobinus from "../asset/logobinus.png";
import komputer from "../asset/komputer.gif";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";

const apiUrl = "http://localhost:4001";

function Logins() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordType, setPasswordType] = useState("password");
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
    setPasswordType(passwordType === "password" ? "text" : "password");
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!usernameOrEmail || !password) {
      Swal.fire({
        icon: "error",
        title: "Login Gagal",
        text: "Email atau Username dan Password harus diisi.",
        timer: 2000,
        showConfirmButton: false,
      });
      return;
    }

    const isEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(usernameOrEmail);
    const isUsername = /^(?=.*[A-Z])[A-Za-z\s]+$/.test(usernameOrEmail);

    if (isEmail || isUsername) {
      try {
        const response = await axios.post(`${apiUrl}/login`, {
          usernameOrEmail,
          password,
        });
        if (response.data) {
          const { userData, token } = response.data;
          localStorage.setItem("token", token);
          localStorage.setItem("username", userData.username);
          localStorage.setItem("id", userData.id);
          localStorage.setItem("role", userData.role);

          Swal.fire({
            icon: "success",
            title: "Login Berhasil",
            text: `Selamat datang ${userData.username}. Anda berhasil login.`,
            timer: 2000,
            showConfirmButton: false,
          });

          if (userData.role === "ADMIN") {
            setTimeout(() => {
              navigate("/dashboard_admin");
              window.location.reload();
            }, 2000);
          } else if (userData.role === "GURU") {
            setTimeout(() => {
              navigate("/dashboard_guru");
              window.location.reload();
            }, 2000);
          }
        }
      } catch (error) {
        let errorMessage = "Terjadi kesalahan";
        if (error.response?.status === 401) {
          if (isEmail) {
            errorMessage = "Email atau Password salah";
          } else if (isUsername) {
            errorMessage = "Username atau Password salah";
          }
        } else {
          errorMessage = error.response?.data?.message || "Terjadi kesalahan";
        }
        Swal.fire({
          icon: "error",
          title: "Login Gagal",
          text: errorMessage,
          timer: 2000,
          showConfirmButton: false,
        });
      }
    } else {
      Swal.fire({
        icon: "error",
        title: "Login Gagal",
        text: "Format Username tidak sesuai.",
        timer: 2000,
        showConfirmButton: false,
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-5 lg:px-0 bg-gradient-to-r bg-gray-100">
      <div className="max-w-screen-xl bg-white border border-gray-300 shadow-lg sm:rounded-lg rounded-lg flex justify-center flex-1">
        <div className="hidden md:flex md:flex-1 bg-gray-100 text-center">
          <div className="m-12 xl:m-16 w-full flex items-center justify-center">
            <img src={komputer} className='w-80 h-80 rounded-lg' alt="Komputer" />
          </div>
        </div>
        <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
          <div className="flex flex-col items-center">
            <div className="text-center">
              <div className="text-center">
                <img
                  className="mx-auto h-32 w-auto"
                  src={logobinus}
                  alt="Binus Logo"
                />
              </div>
              <h1 className="text-2xl xl:text-4xl font-extrabold text-sky-600 my-4">
                E-RUWATAN
              </h1>
            </div>
            <div className="w-full mt-5">
              <form className="mx-auto max-w-xs flex flex-col gap-4" onSubmit={handleLogin}>
                <div>
                  <input
                    id="usernameOrEmail"
                    className="w-full px-5 py-3 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                    type="text"
                    placeholder="Masukkan Email atau Username"
                    value={usernameOrEmail}
                    onChange={(e) => setUsernameOrEmail(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <div className="relative w-full">
                    <input
                      id="password"
                      className="w-full px-5 py-3 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white pr-10"
                      type={passwordType}
                      placeholder="Masukkan Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <span
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 cursor-pointer"
                      onClick={togglePasswordVisibility}
                    >
                      <FontAwesomeIcon icon={passwordVisible ? faEye : faEyeSlash} />
                    </span>
                  </div>
                  <p className="text-red-500 text-xs mt-1">
                    * Password harus terdiri 8 karakter
                  </p>
                </div>
                <button className="mt-5 tracking-wide font-semibold bg-sky-600 text-gray-100 w-full py-3 md:py-4 rounded-lg hover:bg-sky-700 flex items-center justify-center focus:shadow-outline focus:outline-none transition duration-300">
                  <FontAwesomeIcon icon={faUser} size='1x' />
                  <span className="ml-3">Masuk</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Logins;
