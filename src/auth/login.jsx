import React, { useState } from 'react';
import logobinus from '../asset/logobinus.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-regular-svg-icons';

function Login() {
    const [passwordType, setPasswordType] = useState('password');

    const togglePassword = () => {
        setPasswordType(passwordType === 'password' ? 'text' : 'password');
    };

    return (
        <div>
            {/* Main container dengan padding, box shadow, dan border radius */}
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
                        <form className="space-y-6" action="">
                            {/* Email container */}
                            <div>
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
                                        autoComplete="email"
                                        className="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-lg ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-cyan-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>

                            {/* Password container */}
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
                                        type={passwordType}
                                        autoComplete="current-password"
                                        className="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-lg ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-cyan-600 sm:text-sm sm:leading-6 pr-10"
                                    />
                                    <span
                                        onClick={togglePassword}
                                        className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
                                    >
                                        {passwordType === 'password' ? (
                                            <FontAwesomeIcon icon={faEyeSlash} />
                                        ) : (
                                            <FontAwesomeIcon icon={faEye} />
                                        )}
                                    </span>
                                </div>
                            </div>

                            {/* Style button */}
                            <div>
                                <button
                                    type="submit"
                                    className="flex w-full justify-center rounded-md bg-sky-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-sky-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                >
                                    Masuk
                                </button>
                            </div>
                        </form>

                        {/* Register link */}
                        <p className="mt-10 text-center text-sm text-gray-500">
                            Belum Punya Akun?
                            <a
                                href="/register"
                                className="mx-2 font-semibold leading-6 text-sky-600 hover:text-blue-600"
                            >
                                Register
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
