import React, { useState } from "react";
import Sidebar from "../../../component/Sidebar";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

function Setting() {
  const [passwordLama, setPasswordLama] = useState("");
  const [passwordBaru, setPasswordBaru] = useState("");
  const [konfirmasiPassword, setKonfirmasiPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const message = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "passwordLama") {
      setPasswordLama(value);
    } else if (name === "passwordBaru") {
      setPasswordBaru(value);
    } else if (name === "konfirmasiPassword") {
      setKonfirmasiPassword(value);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const validatePasswordLength = (password) => {
    return password.length >= 8;
  };

  const validatePasswordContent = (password) => {
    const hasNumber = /\d/;
    const hasLetter = /[a-zA-Z]/;
    return hasNumber.test(password) && hasLetter.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!passwordLama) {
      Swal.fire({
        icon: "error",
        title: "Kesalahan",
        text: "Password lama harus diisi",
        showConfirmButton: false,
        timer: 2000,
      });
      return;
    }

    if (!passwordBaru) {
      Swal.fire({
        icon: "error",
        title: "Kesalahan",
        text: "password baru harus diisi",
        showConfirmButton: false,
        timer: 2000,
      });
      return;
    }

    if (!konfirmasiPassword) {
      Swal.fire({
        icon: "error",
        title: "Kesalahan",
        text: "konfirmasi password harus diisi",
        showConfirmButton: false,
        timer: 2000,
      });
      return;
    }

    if (!validatePasswordLength(passwordBaru)) {
      Swal.fire({
        icon: "error",
        title: "Kesalahan",
        text: "Password harus minimal 8 karakter",
        showConfirmButton: false,
        timer: 2000,
      });
      return;
    }

    if (!validatePasswordContent(passwordBaru)) {
      Swal.fire({
        icon: "error",
        title: "Kesalahan",
        text: "Password harus mengandung angka dan huruf",
        showConfirmButton: false,
        timer: 2000,
      });
      return;
    }

    if (passwordBaru !== konfirmasiPassword) {
      Swal.fire({
        icon: "error",
        title: "Kesalahan",
        text: "Konfirmasi password tidak sesuai",
        showConfirmButton: false,
        timer: 2000,
      });
      return;
    }

    try {
      const response = await fetch("http://localhost:4001/ubah-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          passwordLama,
          passwordBaru,
          konfirmasiPassword,
        }),
      });

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: "Password berhasil diubah",
          showConfirmButton: false,
          timer: 2000,
        });
        setPasswordLama("");
        setPasswordBaru("");
        setKonfirmasiPassword("");
      } else {
        const result = await response.json();
        Swal.fire({
          icon: "error",
          title: "Error",
          text: result.message || "Gagal mengubah password",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Kesalahan",
        text: "Password lama tidak sesuai.",
        showConfirmButton: false,
        timer: 2000,
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col sm:flex-row">
      <Sidebar />
      <div className="flex flex-grow items-center justify-center">
        <div className="max-w-4xl w-full">
          <div className="mt-20 md:mt-20">
            <div className="mb-4 border-b border-gray-200 dark:border-gray-700">
              <ul
                className="flex flex-wrap -mb-px text-sm font-medium text-center"
                id="default-tab"
                data-tabs-toggle="#default-tab-content"
                role="tablist"
              >
                <li className="me-2" role="presentation">
                  <Link to={"/profile_admin"}>
                    <button
                      className="inline-block p-4 border-b-2 rounded-t-lg hover:text-gray-400 hover:border-gray-300 dark:hover:text-gray-300"
                      id="profile-tab"
                      data-tabs-target="#profile"
                      type="button"
                      role="tab"
                      aria-controls="profile"
                      aria-selected="false"
                    >
                      Profile
                    </button>
                  </Link>
                </li>
                <li className="me-2" role="presentation">
                  <Link to={"/edit_profile_admin"}>
                    <button
                      className="inline-block p-4 border-b-2 rounded-t-lg hover:text-gray-400 hover:border-gray-300 dark:hover:text-gray-300"
                      id="settings-tab"
                      data-tabs-target="#settings"
                      type="button"
                      role="tab"
                      aria-controls="settings"
                      aria-selected="false"
                    >
                      Edit Profile
                    </button>
                  </Link>
                </li>
                <li className="me-2" role="presentation">
                  <Link to={"/edit_password_admin"}>
                    <button
                      className="inline-block p-4 border-b-2 rounded-t-lg hover:text-gray-400 hover:border-gray-300 dark:hover:text-gray-300"
                      id="settings-tab"
                      data-tabs-target="#settings"
                      type="button"
                      role="tab"
                      aria-controls="settings"
                      aria-selected="false"
                    >
                      Edit Password
                    </button>
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="block md:flex">
            <div
              style={{ backgroundColor: "white" }}
              className="md:flex-1 py-10 px-14 lg:ml-4 rounded-xl shadow-md"
            >
              <h1 className="text-xl font-semibold text-gray-800">
                <strong>Setting</strong>
              </h1>{" "}
              <br />
              <form onSubmit={handleSubmit}>
                <div className="pb-2 pt-2">
                  <label
                    htmlFor="passwordLama"
                    className="font-semibold text-gray-700 block pb-1"
                  >
                    Password Lama
                  </label>
                  <input
                    id="passwordLama"
                    name="passwordLama"
                    className="border rounded-lg px-4 py-2 w-full text-gray-600"
                    type={showPassword ? "text" : "password"}
                    value={passwordLama}
                    onChange={handleChange}
                  />
                </div>
                <div className="pb-2 pt-2">
                  <label
                    htmlFor="passwordBaru"
                    className="font-semibold text-gray-700 block pb-1"
                  >
                    Password Baru
                  </label>
                  <input
                    id="passwordBaru"
                    name="passwordBaru"
                    className="border rounded-lg px-4 py-2 w-full text-gray-600"
                    type={showPassword ? "text" : "password"}
                    value={passwordBaru}
                    onChange={handleChange}
                  />
                </div>
                <div className="pb-2 pt-2">
                  <label
                    htmlFor="konfirmasiPassword"
                    className="font-semibold text-gray-700 block pb-1"
                  >
                    Konfirmasi Password
                  </label>
                  <input
                    id="konfirmasiPassword"
                    name="konfirmasiPassword"
                    className="border rounded-lg px-4 py-2 w-full text-gray-600"
                    type={showPassword ? "text" : "password"}
                    value={konfirmasiPassword}
                    onChange={handleChange}
                  />
                </div>
                <div className="pb-1 pt-1">
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      className="form-checkbox text-blue-500"
                      onChange={toggleShowPassword}
                    />
                    <span className="ml-2 text-gray-700">Lihat Password</span>
                  </label>
                </div>
                <div className="flex justify-end mt-4">
                  <button
                    type="submit"
                    className="text-md font-bold text-white bg-blue-500 rounded-full px-8 py-2 hover:bg-blue-600"
                  >
                    Submit
                  </button>
                </div>
                {message && (
                  <div className="text-center mt-4 text-red-500">{message}</div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Setting;
