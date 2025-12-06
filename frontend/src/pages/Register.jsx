import React, { useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../utils/config";
import "./Register.css"; // File css rỗng tạo sẵn

const Register = () => {
  const [credentials, setCredentials] = useState({
    username: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${BASE_URL}/auth/register`, credentials);
      alert("Đăng ký thành công! Giờ hãy đăng nhập nhé.");
      navigate("/login");
    } catch (err) {
      alert("Lỗi: " + err.response.data.message);
    }
  };

  return (
    <section className="mt-5">
      <Container>
        <Row>
          <Col lg="4" className="m-auto">
            <div className="login__container p-4 border rounded shadow-sm">
              <h2 className="text-center mb-4">Đăng Ký Thành Viên</h2>
              <Form onSubmit={handleClick}>
                <Form.Group className="mb-3">
                  <Form.Control
                    type="text"
                    placeholder="Tên đăng nhập"
                    id="username"
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
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
                <Button variant="success" className="w-100" type="submit">
                  Tạo Tài Khoản
                </Button>
              </Form>
              <p className="mt-3 text-center">
                Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
              </p>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Register;