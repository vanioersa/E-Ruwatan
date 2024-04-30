import React from 'react';
import SidebarGuru from './SidebarGuru';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChalkboardTeacher, faUser } from '@fortawesome/free-solid-svg-icons';

function Dashboard() {
    return (
        <div className="bg-gray-50 min-h-screen">
            <SidebarGuru />
            <section className="text-gray-800 body-font">
                <div className="container mx-auto py-24">
                    <div className="flex flex-wrap justify-center">
                        {/* Kartu pertama */}
                        <div className="p-4 md:w-1/3 sm:w-1/2 w-full">
                            <div className="ring-1 shadow-lg bg-sky-600 px-6 py-6 rounded-lg flex items-center justify-between">
                                <FontAwesomeIcon icon={faChalkboardTeacher} className="inline-block w-12 h-12 text-white mr-4" />
                                <div>
                                    <h2 className="title-font font-medium text-3xl text-white">20</h2>
                                    <p className="leading-relaxed font-medium text-white">KBM Guru</p>
                                </div>
                            </div>
                        </div>
                        {/* Kartu kedua */}
                        <div className="p-4 md:w-1/3 sm:w-1/2 w-full">
                            <div className="ring-1 shadow-lg bg-blue-600 px-6 py-6 rounded-lg flex items-center justify-b">
                                <FontAwesomeIcon icon={faUser} className="inline-block w-12 h-12 text-white mr-4" />
                                <div>
                                    <h2 className="title-font font-medium text-3xl text-white">200</h2>
                                    <p className="leading-relaxed font-medium text-white">Piketan</p>
                                </div>
                            </div>
                        </div>
                        {/* Tambahkan lebih banyak kartu jika diperlukan */}
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Dashboard;
