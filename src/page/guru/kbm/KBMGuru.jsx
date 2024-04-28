import React from 'react'
import SidebarGuru from '../../../component/SidebarGuru'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'

function KBMGuru() {
    return (
        <div className='flex flex-col md:flex-row h-screen'>
            <div className='w-full md:w-64'>
                <SidebarGuru />
            </div>
            <div className='flex-1 container p-8 overflow-y-auto'>
                <div className='my-20 border border-gray-200 bg-white p-5 rounded-xl shadow-lg'>
                    <div className='bg-gray-700 shadow-sm rounded-lg p-4 flex justify-between items-center'>
                        <h1 className='text-3xl text-white font-semibold'>
                            KBM Guru
                        </h1>
                        <div className='flex items-center ml-auto'>
                            <input
                                type="text"
                                placeholder='Cari KBM'
                                className='rounded-lg shadow-xl px-3 py-3 bg-slate-100' />
                        </div>
                        <Link to={`/tambahkbm`}>
                            <button className="ml-2 rounded-lg shadow-xl px-3 py-3 bg-slate-100">
                                <FontAwesomeIcon
                                    icon={faPlus}
                                    className="h-5 w-5 text-blue-500"
                                />
                            </button>
                        </Link>
                    </div>
                    <div className="overflow-x-auto rounded-lg border border-gray-200 mt-4">
                        <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-s">
                            <thead className="text-left">
                                <tr>
                                    <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                                        No
                                    </th>
                                    <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                                        Jam Masuk
                                    </th>
                                    <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                                        Jam Selesai
                                    </th>
                                    <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                                        Materi
                                    </th>
                                    <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                                        Keterangan
                                    </th>
                                    <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>

                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default KBMGuru
