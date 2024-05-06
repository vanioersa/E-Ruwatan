// import React from "react";
// import Sidebar from "../../../component/Sidebar";

// const UpdateGuru = () => {

//   return (
//     <div className="flex flex-col md:flex-row h-screen">
//       <div className="sidebar w-full md:w-64">
//         <Sidebar />
//       </div>
//       <div className="content-page max-h-screen container p-8 min-h-screen">
//         <h1 className="judul text-3xl font-semibold">Update Guru</h1>
//         <div className="add-guru mt-12 bg-white p-5 mr-1 md:ml-8 border border-gray-200 rounded-xl shadow-lg">
//           <p className="text-lg sm:text-xl font-medium mb-4 sm:mb-7">
//             Update Guru
//           </p>
//           <form onSubmit={}>
//             <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-2">
//               <div className="relative">
//                 <label
//                   htmlFor=""
//                   className="block mb-2 text-sm sm:text-sm font-medium text-gray-900"
//                 >
//                   Nama Pengguna (Username)
//                 </label>
//                 <input
//                   type="text"
//                   id=""
//                   name=""
//                   value={}
//                   onChange={}
//                   className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
//                   placeholder="Masukkan Nama Guru"
//                   required
//                   autoComplete="off"
//                 />
//               </div>
//               <div className="relative">
//                 <label
//                   htmlFor=""
//                   className="block mb-2 text-sm sm:text-sm font-medium text-gray-900"
//                 >
//                   Email
//                 </label>
//                 <input
//                   type="email"
//                   id=""
//                   name=""
//                   value={}
//                   onChange={}
//                   className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
//                   placeholder="Masukkan "
//                   required
//                   autoComplete="off"
//                 />
//               </div>
//             </div>

//             <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-2">
//               <div className="relative">
//                 <label
//                   htmlFor=""
//                   className="block mb-2 text-sm sm:text-sm font-medium text-gray-900"
//                 >
//                   Kata Sandi (Password)
//                 </label>
//                 <input
//                   type="password"
//                   id=""
//                   name=""
//                   value={}
//                   onChange={}
//                   className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
//                   placeholder="Masukkan"
//                   required
//                   autoComplete="off"
//                 />
//               </div>
//               <div className="relative">
//                 <label
//                   htmlFor=""
//                   className="block mb-2 text-sm sm:text-sm font-medium text-gray-900"
//                 >
//                   Alamat
//                 </label>
//                 <input
//                   type="text"
//                   id=""
//                   name=""
//                   value={}
//                   onChange={}
//                   className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
//                   placeholder="Masukkan "
//                   required
//                   autoComplete="off"
//                 />
//               </div>
//             </div>

//             <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-2">
//               <div className="relative">
//                 <label
//                   htmlFor=""
//                   className="block mb-2 text-sm sm:text-sm font-medium text-gray-900"
//                 >
//                   Alamat
//                 </label>
//                 <input
//                   type="text"
//                   id=""
//                   name=""
//                   value={}
//                   onChange={}
//                   className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
//                   placeholder="Masukkan "
//                   required
//                   autoComplete="off"
//                 />
//               </div>
//               <div className="relative">
//                 <label
//                   htmlFor=""
//                   className="block mb-2 text-sm sm:text-sm font-medium text-gray-900"
//                 >
//                   Nomor Telfon
//                 </label>
//                 <input
//                   type="number"
//                   id=""
//                   name=""
//                   value={}
//                   onChange={}
//                   className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
//                   placeholder="Masukkan "
//                   required
//                   autoComplete="off"
//                 />
//               </div>
//             </div>

//             <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-2">
//               <div className="relative">
//                 <label
//                   htmlFor=""
//                   className="block mb-2 text-sm sm:text-sm font-medium text-gray-900"
//                 >
//                   Jenis Kelamin
//                 </label>
//                 <input
//                   type="text"
//                   id=""
//                   name=""
//                   value={}
//                   onChange={}
//                   className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
//                   placeholder="Masukkan "
//                   required
//                   autoComplete="off"
//                 />
//               </div>
//               <div className="relative">
//                 <label
//                   htmlFor=""
//                   className="block mb-2 text-sm sm:text-sm font-medium text-gray-900"
//                 >
//                   Status Nikah
//                 </label>
//                 <input
//                   type="number"
//                   id=""
//                   name=""
//                   value={}
//                   onChange={}
//                   className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
//                   placeholder="Masukkan "
//                   required
//                   autoComplete="off"
//                 />
//               </div>
//             </div>

//             <div className="flex justify-between mt-6">
//               <button
//                 type="button"
//                 onClick={batal}
//                 className="block w-20 sm:w-24 rounded-lg text-black outline outline-red-500 py-3 text-sm sm:text-sm font-medium"
//               >
//                 Batal
//               </button>
//               <button
//                 type="submit"
//                 className="block w-20 sm:w-24 rounded-lg text-black outline outline-[#0b409c] py-3 text-sm sm:text-sm font-medium"
//               >
//                 Perbarui
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UpdateGuru;