import React, { useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import './AdminAddTour.css'; // Cậu tạo file css rỗng để đó lát style sau
import { BASE_URL } from '../utils/config';
import axios from 'axios';

const AdminAddTour = () => {
  const [tourData, setTourData] = useState({
    title: '',
    city: '',
    address: '',
    distance: 0,
    price: 0,
    maxGroupSize: 0,
    desc: '',
    photo: '', // Tạm thời mình nhập link ảnh online nhé
    startDate: '',
    featured: false,
  });

  const handleChange = (e) => {
    setTourData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Gửi request kèm theo credentials (cookie token) nếu đã làm auth
      const res = await axios.post(`${BASE_URL}/tours`, tourData, {
        withCredentials: true, 
      });

      if(res.status === 200) {
          alert('Thêm tour thành công!');
          // Reset form hoặc chuyển trang
      }
    } catch (err) {
      alert('Lỗi: ' + err.message);
      console.log(err);
    }
  };

  return (
    <section>
      <Container>
        <Row>
          <Col lg="8" className="m-auto">
            <h2 className="text-center mb-4">Thêm Tour Mới</h2>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Tên Tour</Form.Label>
                <Form.Control type="text" placeholder="Ví dụ: Hạ Long 3 ngày 2 đêm" id="title" onChange={handleChange} required />
              </Form.Group>

              <Row>
                <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Label>Thành phố</Form.Label>
                        <Form.Control type="text" placeholder="Hà Nội" id="city" onChange={handleChange} required />
                    </Form.Group>
                </Col>
                <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Label>Địa chỉ cụ thể</Form.Label>
                        <Form.Control type="text" id="address" onChange={handleChange} required />
                    </Form.Group>
                </Col>
              </Row>
              
              <Row>
                <Col md={4}>
                    <Form.Group className="mb-3">
                        <Form.Label>Giá (VNĐ)</Form.Label>
                        <Form.Control type="number" id="price" onChange={handleChange} required />
                    </Form.Group>
                </Col>
                <Col md={4}>
                    <Form.Group className="mb-3">
                        <Form.Label>Khoảng cách (km)</Form.Label>
                        <Form.Control type="number" id="distance" onChange={handleChange} required />
                    </Form.Group>
                </Col>
                <Col md={4}>
                    <Form.Group className="mb-3">
                        <Form.Label>Số người tối đa</Form.Label>
                        <Form.Control type="number" id="maxGroupSize" onChange={handleChange} required />
                    </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>Link Ảnh (URL)</Form.Label>
                <Form.Control type="text" placeholder="https://..." id="photo" onChange={handleChange} required />
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>Ngày khởi hành</Form.Label>
                <Form.Control type="date" id="startDate" onChange={handleChange} required />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Mô tả chi tiết</Form.Label>
                <Form.Control as="textarea" rows={3} id="desc" onChange={handleChange} required />
              </Form.Group>

              <Button variant="primary" type="submit" className="w-100">
                Đăng Tour
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default AdminAddTour;