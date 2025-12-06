import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import CSS của Bootstrap

// Import các trang vừa tạo
import AdminAddTour from './pages/AdminAddTour';
import AdminAllTours from './pages/AdminAllTours';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/HomePage';
import HomePage from './pages/HomePage';

function App() {
  return (
    <BrowserRouter>
      {/* Menu tạm thời để chuyển trang */}
      <nav className="p-3 bg-dark text-white d-flex gap-3">
        <h3>Admin Panel</h3>
        <Link to="/admin/add" className="text-white">Thêm Tour</Link>
        <Link to="/admin/all" className="text-white">Danh sách Tour</Link>
      </nav>

      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />  {/* <--- Thêm dòng này */}
        <Route path="/admin/add" element={<AdminAddTour />} />
        <Route path="/admin/all" element={<AdminAllTours />} />
        
        <Route path="/" element={<HomePage/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

