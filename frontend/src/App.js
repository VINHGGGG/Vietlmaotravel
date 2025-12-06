import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
// Import Component Header
import Header from './components/Header/Header.jsx'; 

// Import các trang
import AdminRoute from './components/AdminRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminAddTour from './pages/AdminAddTour';
import AdminAllTours from './pages/AdminAllTours';
import HomePage from './pages/HomePage';
import AdminEditTour from './pages/AdminEditTour';
import AdminAllBookings from './pages/AdminAllBookings'; // Import vào

function App() {
  return (
    <BrowserRouter>   
      {/* Đặt Header ở đây thì trang nào cũng có */}
      <Header /> 

      <Routes>
        <Route path="/" element={<HomePage/>} />
        <Route path="/tours" element={<h1 className="text-center mt-5">Danh sách Tours (Khách xem)</h1>} />
        
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* --- KHU VỰC CẤM ĐỊA (ADMIN ONLY) --- */}
        <Route 
            path="/admin/all" 
            element={
                <AdminRoute>
                    <AdminAllTours />
                </AdminRoute>
            } 
        />

        <Route 
            path="/admin/add" 
            element={
                <AdminRoute>
                    <AdminAddTour />
                </AdminRoute>
            } 
        />

        <Route 
            path="/admin/edit/:id" 
            element={
                <AdminRoute>
                    <AdminEditTour />
                </AdminRoute>
            } 
        />
        <Route 
    path="/admin/bookings" 
    element={
        <AdminRoute>
            <AdminAllBookings />
        </AdminRoute>
    } 
/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;