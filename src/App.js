
import { Route, Routes } from 'react-router-dom';
import Login from './auth/login';
import Register from './auth/register';
import Sidebar from './component/Sidebar';
import { useState } from 'react';

function App() {
  const [sidebarToggle, setSidebarToggle] = useState(false)
  return (
    <div className="App">
      {/* <Sidebar sidebarToggle={sidebarToggle} /> S
      <Dashboard sidebarToggle={sidebarToggle}
        setSidebarToggle={setSidebarToggle} /> */}
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/Sidebar' element={<Sidebar sidebarToggle={sidebarToggle} />} />
      </Routes>
    </div>
  );
}

export default App;
