import React, { useContext, useRef, useEffect } from 'react';
import { Container, Row, Button } from 'react-bootstrap';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import './header.css'; 

// 1. Menu dành cho Khách du lịch
const navLinksGuest = [
  { path: '/', display: 'Trang chủ' },
  { path: '/tours', display: 'Tours' },
  { path: '/my-bookings', display: 'Đơn đặt của tôi' },
];

// 2. Menu dành riêng cho Admin
const navLinksAdmin = [
  { path: '/admin/all', display: 'Quản lý Tour' },
  { path: '/admin/add', display: 'Thêm Tour Mới' },
  { path: '/admin/bookings', display: 'Quản lý Đặt Tour' },
  // Sau này có thể thêm: Quản lý Booking, Thống kê...
];

const Header = () => {
  const { user, dispatch } = useContext(AuthContext);
  const navigate = useNavigate();
  
  // Logic đăng xuất
  const logout = () => {
    dispatch({ type: 'LOGOUT' });
    navigate('/login');
  };

  // Xác định xem người dùng hiện tại có phải admin không
  const isAdmin = user && user.role === 'admin';

  return (
    // Nếu là Admin thì dùng nền đen (bg-dark), khách thì nền trắng
    <header className={`header sticky-top ${isAdmin ? 'bg-dark text-white shadow' : 'bg-white'}`}>
      <Container>
        <Row>
          <div className="nav__wrapper d-flex align-items-center justify-content-between">
            
            {/* === LOGO === */}
            <div className="logo">
               <Link to={isAdmin ? "/admin/all" : "/"} style={{textDecoration:'none', color: 'inherit'}}>
                  {isAdmin ? (
                      <h3 className="text-warning">🛠️ AdminPanel</h3> 
                  ) : (
                      <h3 className="text-primary">✈️ TravelApp</h3>
                  )}
               </Link>
            </div>

            {/* === MENU ĐIỀU HƯỚNG (Logic thông minh ở đây) === */}
            <div className="navigation">
              <ul className="menu d-flex align-items-center gap-5">
                {
                  // Nếu là Admin -> Duyệt mảng menu Admin. Nếu Khách -> Duyệt mảng menu Khách
                  (isAdmin ? navLinksAdmin : navLinksGuest).map((item, index) => (
                    <li className="nav__item" key={index}>
                      <NavLink 
                        to={item.path} 
                        className={navClass => navClass.isActive ? "active__link" : (isAdmin ? "text-light" : "")}
                      >
                        {item.display}
                      </NavLink>
                    </li>
                  ))
                }
              </ul>
            </div>

            {/* === NÚT BẤM BÊN PHẢI === */}
            <div className="nav__right d-flex align-items-center gap-4">
              <div className="nav__btns d-flex align-items-center gap-4">
                
                {user ? (
                  <>
                    <h5 className={`mb-0 ${isAdmin ? 'text-warning' : 'text-primary'}`}>
                        {user.username} {isAdmin && '(Admin)'}
                    </h5>
                    <Button className="btn btn-secondary" onClick={logout}>Đăng xuất</Button>
                  </>
                ) : (
                  <>
                    <Button className="btn secondary__btn">
                      <Link to="/login">Đăng nhập</Link>
                    </Button>
                    <Button className="btn primary__btn">
                      <Link to="/register">Đăng ký</Link>
                    </Button>
                  </>
                )}
                
              </div>
            </div>
          </div>
        </Row>
      </Container>
    </header>
  );
};

export default Header;