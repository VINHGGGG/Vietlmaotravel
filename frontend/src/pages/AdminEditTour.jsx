import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL, SERVER_URL } from '../utils/config'; // <--- Nhớ import SERVER_URL

const AdminEditTour = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // State lưu dữ liệu tour
  const [tourData, setTourData] = useState({
    title: '',
    city: '',
    address: '',
    distance: 0,
    price: 0,
    maxGroupSize: 0,
    desc: '',
    photo: '',
    startDate: '',
    featured: false,
  });

  // State lưu file ảnh mới (nếu admin muốn thay đổi)
  const [selectedFile, setSelectedFile] = useState(null);
  // State để xem trước ảnh mới khi vừa chọn xong (Optional)
  const [previewImg, setPreviewImg] = useState(null);

  // 1. Lấy dữ liệu cũ
  useEffect(() => {
    const fetchTour = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/tours/${id}`);
            const data = res.data.data;
            if(data.startDate) {
                data.startDate = new Date(data.startDate).toISOString().split('T')[0];
            }
            setTourData(data);
        } catch (error) {
            alert('Không tìm thấy tour!');
        }
    };
    fetchTour();
  }, [id]);

  const handleChange = (e) => {
    setTourData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  // Xử lý khi chọn file ảnh mới
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    // Tạo link ảo để xem trước ảnh vừa chọn ngay lập tức
    setPreviewImg(URL.createObjectURL(file));
  };

  // 2. Gửi dữ liệu (PUT)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let photoUrl = tourData.photo; // Mặc định giữ nguyên ảnh cũ

      // Nếu có chọn ảnh mới -> Upload ảnh mới trước
      if (selectedFile) {
        const formData = new FormData();
        formData.append("file", selectedFile);

        const uploadRes = await axios.post(`${BASE_URL}/upload`, formData, {
           headers: { "Content-Type": "multipart/form-data" }
        });

        if(uploadRes.data.success) {
            photoUrl = uploadRes.data.data; // Cập nhật đường dẫn ảnh mới
        }
      }

      // Gửi dữ liệu cập nhật
      const updatedTour = { ...tourData, photo: photoUrl };

      await axios.put(`${BASE_URL}/tours/${id}`, updatedTour, {
        withCredentials: true,
      });

      alert('Cập nhật tour thành công!');
      navigate('/admin/all');
    } catch (err) {
      alert('Lỗi cập nhật: ' + err.message);
    }
  };

  return (
    <section className="mt-4">
      <Container>
        <Row>
          <Col lg="8" className="m-auto">
            <h2 className="text-center mb-4 text-warning">Chỉnh Sửa Tour</h2>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Tên Tour</Form.Label>
                <Form.Control type="text" id="title" value={tourData.title} onChange={handleChange} required />
              </Form.Group>

              {/* --- PHẦN HIỂN THỊ ẢNH --- */}
              <Form.Group className="mb-3">
                <Form.Label>Ảnh hiện tại</Form.Label>
                <div className="mb-2">
                    {/* Logic hiển thị: Nếu có ảnh preview (vừa chọn) thì hiện preview. 
                        Nếu không thì hiện ảnh cũ (tourData.photo).
                        Nếu ảnh là link online (http) thì giữ nguyên, nếu là local (/images) thì ghép SERVER_URL */}
                    <img 
                        src={
                            previewImg 
                            ? previewImg 
                            : (tourData.photo?.startsWith('http') ? tourData.photo : `${SERVER_URL}${tourData.photo}`)
                        } 
                        alt="Tour preview" 
                        style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', borderRadius: '5px' }} 
                    />
                </div>
                <Form.Label>Chọn ảnh mới (Nếu muốn thay đổi)</Form.Label>
                <Form.Control 
                    type="file" 
                    id="photo" 
                    onChange={handleFileChange} 
                    accept="image/*"
                />
              </Form.Group>
              {/* ------------------------- */}

              <Row>
                <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Label>Thành phố</Form.Label>
                        <Form.Control type="text" id="city" value={tourData.city} onChange={handleChange} required />
                    </Form.Group>
                </Col>
                <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Label>Địa chỉ</Form.Label>
                        <Form.Control type="text" id="address" value={tourData.address} onChange={handleChange} required />
                    </Form.Group>
                </Col>
              </Row>
              
              <Row>
                <Col md={4}>
                    <Form.Group className="mb-3">
                        <Form.Label>Giá</Form.Label>
                        <Form.Control type="number" id="price" value={tourData.price} onChange={handleChange} required />
                    </Form.Group>
                </Col>
                <Col md={4}>
                    <Form.Group className="mb-3">
                        <Form.Label>Khoảng cách</Form.Label>
                        <Form.Control type="number" id="distance" value={tourData.distance} onChange={handleChange} required />
                    </Form.Group>
                </Col>
                <Col md={4}>
                    <Form.Group className="mb-3">
                        <Form.Label>Max người</Form.Label>
                        <Form.Control type="number" id="maxGroupSize" value={tourData.maxGroupSize} onChange={handleChange} required />
                    </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>Ngày khởi hành</Form.Label>
                <Form.Control type="date" id="startDate" value={tourData.startDate} onChange={handleChange} required />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Mô tả chi tiết</Form.Label>
                <Form.Control as="textarea" rows={3} id="desc" value={tourData.desc} onChange={handleChange} required />
              </Form.Group>

              <Button variant="warning" type="submit" className="w-100 text-white fw-bold">
                Cập Nhật Tour
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default AdminEditTour;