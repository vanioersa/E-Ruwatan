import React from 'react';
import Sidebar from './Sidebar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChalkboardTeacher, faDoorOpen, faUser } from '@fortawesome/free-solid-svg-icons';

function Dashboard() {
  return (
    <div className="min-h-screen flex flex-col sm:flex-row">
      <Sidebar />
      <section className="text-gray-800 body-font flex-1">
        <div className="container mx-auto py-24 sm:py-8 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center">
            {/* Kartu pertama */}
            <div className="mb-4 p-4 md:w-1/4 sm:w-1/2 w-full">
              <div className="ring-1 shadow-lg bg-sky-600 px-6 py-6 mx-5 rounded-lg flex items-center justify-between md:mt-16 md:my-12">
                <FontAwesomeIcon icon={faUser} className="inline-block w-12 h-12 text-white mr-4" />
                <div>
                  <h2 className="title-font font-medium text-3xl text-white">20</h2>
                  <p className="leading-relaxed font-medium text-white">Siswa</p>
                </div>
              </div>
            </div>
            {/* Kartu kedua */}
            <div className="mb-4 p-4 md:w-1/4 sm:w-1/2 w-full">
              <div className="ring-1 shadow-lg bg-blue-600 px-6 py-6 mx-5 rounded-lg flex items-center justify-between md:mt-16 md:my-12">
                <FontAwesomeIcon icon={faDoorOpen} className="inline-block w-12 h-12 text-white mr-4" />
                <div>
                  <h2 className="title-font font-medium text-3xl text-white">200</h2>
                  <p className="leading-relaxed font-medium text-white">Kelas</p>
                </div>
              </div>
            </div>
            {/* Kartu ketiga */}
            <div className="mb-4 p-4 md:w-1/4 sm:w-1/2 w-full">
              <div className="ring-1 shadow-lg bg-blue-600 px-6 py-6 mx-5 rounded-lg flex items-center justify-between md:mt-16 md:my-12">
                <FontAwesomeIcon icon={faChalkboardTeacher} className="inline-block w-12 h-12 text-white mr-4" />
                <div>
                  <h2 className="title-font font-medium text-3xl text-white">200</h2>
                  <p className="leading-relaxed font-medium text-white">Guru</p>
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