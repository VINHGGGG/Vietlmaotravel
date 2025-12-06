import React, { useState, useContext } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../utils/config";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  const { dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();
    dispatch({ type: "LOGIN_START" });

    try {
      const res = await axios.post(`${BASE_URL}/auth/login`, credentials);

      // --- SỬA ĐOẠN NÀY ---
      // Cũ: dispatch({ type: "LOGIN_SUCCESS", payload: res.data.data });
      // Lỗi: res.data.data không chứa role.
      
      // Mới: Gộp cả data và role vào chung 1 object User
      const userInfo = { ...res.data.data, role: res.data.role }; 
      dispatch({ type: "LOGIN_SUCCESS", payload: userInfo }); 
      // --------------------

      if(res.data.role === 'admin') {
         navigate("/admin/all");
      } else {
         navigate("/");
      }

    } catch (err) {
      dispatch({ type: "LOGIN_FAILURE", payload: err.response.data.message });
      alert("Đăng nhập thất bại: " + err.response.data.message);
    }
  };

  return (
    <section className="mt-5">
      <Container>
        <Row>
          <Col lg="4" className="m-auto">
            <div className="login__container p-4 border rounded shadow-sm">
              <h2 className="text-center mb-4">Đăng Nhập</h2>
              <Form onSubmit={handleClick}>
                <Form.Group className="mb-3">
                  <Form.Control
                    type="email"
                    placeholder="Email"
                    id="email"
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Control
                    type="password"
                    placeholder="Mật khẩu"
                    id="password"
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                <Button variant="primary" className="w-100" type="submit">
                  Đăng Nhập
                </Button>
              </Form>
              <p className="mt-3 text-center">
                Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
              </p>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Login;