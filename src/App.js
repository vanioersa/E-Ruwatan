
import { Route, Routes } from 'react-router-dom';
import Login from './auth/login';
import Register from './auth/register';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
      </Routes>
    </div>
  );
}

export default App;
