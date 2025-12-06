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
      const res = await axios.post(`${BASE_URL}/auth/login`, credentials, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      const data = res?.data || {};
      const user = data?.data || null;
      const role = data?.role || user?.role || "user";

      if (!data.success) {
        throw new Error(data.message || "Đăng nhập thất bại");
      }

      dispatch({ type: "LOGIN_SUCCESS", payload: user });

      if (role === "admin") {
        navigate("/admin/all");
      } else {
        navigate("/");
      }
    } catch (err) {
      const message = err?.response?.data?.message || err.message || "Có lỗi xảy ra";
      dispatch({ type: "LOGIN_FAILURE", payload: message });
      alert("Đăng nhập thất bại: " + message);
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