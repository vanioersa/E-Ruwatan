import React, { useState } from 'react'
import logobinus from '../asset/logobinus.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-regular-svg-icons';
function Login() {
    const [passwordType, setPasswordType] = useState("password");
    const togglePassword = () => {
        if (passwordType === "password") {
            setPasswordType("text");
            return;
        }
        setPasswordType("password");
    };
    return (
        <>
            <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8 mt-5">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <h2 className="mt-10 text-center text-2xl font-bold text-gray-900">
                        <img
                            className="mx-auto h-32 w-auto"
                            src={logobinus}
                            alt="binusa"
                        />
                    </h2>
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form className="space-y-6" action="">
                        <div>
                            <label
                                htmlFor="email"
                                className="block float-left mb-1 text-base font-medium leading-6 text-sky-900"
                            >
                                Email
                            </label>
                            <div className="mt-2">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    autoComplete="email"
                                    className="block w-full rounded-md border-0 py-1.5 pl-2 text-sky-900 shadow-lg ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-cyan-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>

                        <div>
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
                                    type={passwordType === "password" ? "password" : "text"}
                                    autoComplete="current-password"
                                    className="block w-full rounded-md border-0 py-1.5 pl-2 text-sky-900 shadow-lg ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-cyan-600 sm:text-sm sm:leading-6 pr-10"
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
                            <div className=" mt-3 mb-3 float-right text-sm">
                                {/* <a
                                    href="#"
                                    className="font-semibold text-sky-600 hover:text-sky-500"
                                />
                                Forgot password? */}
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="flex w-full justify-center rounded-md bg-sky-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-sky-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                Masuk
                            </button>
                        </div>
                    </form>

                    <p className="mt-10 text-center text-sm text-gray-500">
                        Belum Punya Akun?
                        <a
                            href="/register"
                            className="mx-2 font-semibold leading-6 text-cyan-600 hover:text-blue-700"
                        >
                            Register
                        </a>
                    </p>
                </div>
            </div>
        </>
    )
}

export default Login
