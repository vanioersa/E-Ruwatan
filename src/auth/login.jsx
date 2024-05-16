import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import logobinus from "../asset/logobinus.png";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";

const apiUrl = "http://localhost:4001";

function Logins() {
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordType, setPasswordType] = useState("password");
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
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

    const isEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
      usernameOrEmail
    );
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
          localStorage.setItem("id" , userData.id);
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
    <div className="flex min-h-screen justify-center items-center px-6 py-8 lg:px-8">
      <div className="sm:w-full sm:max-w-sm bg-slate-50 p-6 rounded-lg shadow-lg ring-1 ring-slate-200 w-full">
        <div className="text-center mb-8">
          <img
            className="mx-auto h-32 w-auto"
            src={logobinus}
            alt="Binus Logo"
          />
        </div>
        <form className="space-y-4" onSubmit={handleLogin}>
          <div>
            <label
              htmlFor="usernameOrEmail"
              className="block text-base font-medium leading-6 text-gray-900"
            >
              Email atau Username
            </label>
            <div className="mt-1">
              <input
                id="usernameOrEmail"
                type="text"
                required
                autoComplete="off"
                className="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-lg ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-cyan-600 sm:text-sm sm:leading-6"
                value={usernameOrEmail}
                onChange={(e) => setUsernameOrEmail(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-base font-medium text-gray-900"
            >
              Password
            </label>
            <div className="relative mt-1">
              <input
                id="password"
                type={passwordType}
                required
                autoComplete="current-password"
                className="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-lg ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-cyan-600 sm:text-sm sm:leading-6 pr-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
              >
                <FontAwesomeIcon
                  icon={passwordType === "password" ? faEyeSlash : faEye}
                />
              </span>
            </div>
          </div>
          <div className="pt-3 pb-10">
            <button
              type="submit"
              className="flex w-full py-2 justify-center rounded-md bg-sky-600 px-3 py-1.5 text-lg font-semibold leading-6 text-white shadow-sm hover:bg-sky-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Masuk
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Logins;
