import React from 'react';
import Sidebar from './Sidebar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChalkboardTeacher, faDoorOpen, faUser } from '@fortawesome/free-solid-svg-icons';

function Dashboard() {
  return (
    <div className="min-h-screen">
      <Sidebar />
      <section className="text-gray-800 body-font">
        <div className="container mx-auto py-24 px-4">
          <div className="flex justify-center">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {/* Kartu pertama */}
              <div className="p-4">
                <div className="ring-0 shadow-lg bg-emerald-500 px-6 py-6 rounded-lg flex items-center justify-center">
                  <FontAwesomeIcon icon={faUser} className="inline-block w-12 h-12 text-white mr-4" />
                  <div>
                    <h2 className="title-font font-medium text-3xl text-white">200</h2>
                    <p className="leading-relaxed font-medium text-white">Total Siswa</p>
                  </div>
                </div>
              </div>

              {/* Kartu kedua */}
              <div className="p-4">
                <div className="ring-0 shadow-lg bg-sky-500 px-6 py-6 rounded-lg flex items-center justify-center">
                  <FontAwesomeIcon icon={faChalkboardTeacher} className="inline-block w-12 h-12 text-white mr-4" />
                  <div>
                    <h2 className="title-font font-medium text-3xl text-white">200</h2>
                    <p className="leading-relaxed font-medium text-white">Total Guru</p>
                  </div>
                </div>
              </div>

              {/* Kartu ketiga */}
              <div className="p-4">
                <div className="ring-0 shadow-lg bg-cyan-500 px-6 py-6 rounded-lg flex items-center justify-center">
                  <FontAwesomeIcon icon={faDoorOpen} className="inline-block w-12 h-12 text-white mr-4" />
                  <div>
                    <h2 className="title-font font-medium text-3xl text-white">200</h2>
                    <p className="leading-relaxed font-medium text-white">Total Kelas</p>
                  </div>
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
