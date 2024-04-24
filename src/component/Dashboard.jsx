import React from 'react';
import Sidebar from './Sidebar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChalkboardTeacher, faUser } from '@fortawesome/free-solid-svg-icons';

function Dashboard() {
  return (
    <div className="min-h-screen">
      <Sidebar />
      <section className="text-gray-800 body-font">
        <div className="container mx-auto py-24">
          <div className="flex flex-wrap justify-center">
            {/* Kartu pertama */}
            <div className="p-4 md:w-1/3 sm:w-1/2 w-full">
              <div className="ring-0 shadow-lg bg-emerald-400 px-6 py-6 rounded-lg flex items-center justify-center">
                <FontAwesomeIcon icon={faChalkboardTeacher} className="inline-block w-14 h-14 text-white mr-auto -mt-2"></FontAwesomeIcon>
                <div>
                  <h2 className="title-font font-medium text-3xl text-white">20</h2>
                  <p className="leading-relaxed font-medium text-white">Total Guru</p>
                </div>
              </div>
            </div>
            {/* Kartu kedua */}
            <div className="p-4 md:w-1/3 sm:w-1/2 w-full">
              <div className="ring-0 shadow-lg bg-sky-500 px-6 py-6 rounded-lg flex items-center justify-center">
                <FontAwesomeIcon icon={faUser} className="inline-block w-12 h-12 text-white mr-auto -mt-2"></FontAwesomeIcon>
                <div>
                  <h2 className="title-font font-medium text-3xl text-white">200</h2>
                  <p className="leading-relaxed font-medium text-white">Total Siswa</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Dashboard;
