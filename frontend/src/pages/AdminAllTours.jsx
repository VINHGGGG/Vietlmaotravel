import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Table, Button } from 'react-bootstrap';
import axios from 'axios';
import { BASE_URL } from '../utils/config';

const AdminAllTours = () => {
    const [tours, setTours] = useState([]);

    // Hàm lấy dữ liệu tour từ Backend
    const fetchTours = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/tours`);
            setTours(res.data.data);
        } catch (error) {
            console.error("Lỗi fetch data:", error);
        }
    };

    useEffect(() => {
        fetchTours();
    }, []);

    // Hàm xóa tour
    const handleDelete = async (id) => {
        if(window.confirm("Bạn chắc chắn muốn xóa tour này chứ?")) {
            try {
                await axios.delete(`${BASE_URL}/tours/${id}`, { withCredentials: true });
                alert("Đã xóa!");
                fetchTours(); // Load lại danh sách sau khi xóa
            } catch (error) {
                alert("Lỗi xóa tour (Bạn có phải Admin không?)");
            }
        }
    };

    return (
        <Container className="mt-5">
            <h2 className="mb-4">Quản lý Tour Du Lịch</h2>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Tên Tour</th>
                        <th>Giá</th>
                        <th>Ngày đi</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {tours.map((tour, index) => (
                        <tr key={tour._id}>
                            <td>{index + 1}</td>
                            <td>{tour.title}</td>
                            <td>{tour.price.toLocaleString()} đ</td>
                            <td>{new Date(tour.startDate).toLocaleDateString()}</td>
                            <td>
                                <Button variant="warning" size="sm" className="me-2">Sửa</Button>
                                <Button variant="danger" size="sm" onClick={() => handleDelete(tour._id)}>Xóa</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Container>
    );
};

export default AdminAllTours;