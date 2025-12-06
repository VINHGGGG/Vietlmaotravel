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
  const [selectedFile, setSelectedFile] = useState(null);

  // Hàm xử lý khi chọn file
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file); // Lưu file vào state tạm
  };

  const handleChange = (e) => {
    setTourData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let photoUrl = ""; // Mặc định rỗng

      // BƯỚC 1: Nếu có chọn file, upload file trước
      if (selectedFile) {
        const formData = new FormData();
        formData.append("file", selectedFile);

        // Gọi API upload mà mình vừa viết ở Backend
        const uploadRes = await axios.post(`${BASE_URL}/upload`, formData, {
           headers: { "Content-Type": "multipart/form-data" }
        });

        if(uploadRes.data.success) {
            photoUrl = uploadRes.data.data; // Lấy đường dẫn: /images/xxx.jpg
        }
      }

      // BƯỚC 2: Gán đường dẫn ảnh vào dữ liệu Tour
      // Nếu không upload ảnh mới thì dùng ảnh mặc định hoặc rỗng
      const newTourData = { 
          ...tourData, 
          photo: photoUrl || tourData.photo 
      };

      // BƯỚC 3: Tạo tour như bình thường
      const res = await axios.post(`${BASE_URL}/tours`, newTourData, {
        withCredentials: true, 
      });

      if(res.status === 200) {
          alert('Thêm tour thành công!');
      }

    } catch (err) {
      alert('Lỗi: ' + err.message);
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

              {/* Thay input text cũ bằng input file */}
              <Form.Group className="mb-3">
                <Form.Label>Ảnh Tour</Form.Label>
                {/* type="file" */}
                <Form.Control 
                    type="file" 
                    id="photo" 
                    onChange={handleFileChange} 
                    accept="image/*" // Chỉ cho chọn ảnh
                />
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