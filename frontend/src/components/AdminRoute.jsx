import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const AdminRoute = ({ children }) => {
    const { user } = useContext(AuthContext);

    // 1. Nếu chưa đăng nhập -> Đuổi về trang Login
    if (!user) {
        return <Navigate to="/login" />;
    }

    // 2. Nếu đã đăng nhập nhưng không phải Admin -> Đuổi về Trang chủ
    if (user.role !== 'admin') {
        return <Navigate to="/" />;
    }

    // 3. Nếu đúng là Admin -> Mời vào (Hiển thị trang con bên trong)
    return children;
};

export default AdminRoute;