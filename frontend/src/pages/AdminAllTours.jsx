import React, { useEffect, useState } from 'react';
import { Container, Table, Button } from 'react-bootstrap';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { BASE_URL, SERVER_URL } from '../utils/config'; // <--- Import SERVER_URL

const AdminAllTours = () => {
    const [tours, setTours] = useState([]);

    const fetchTours = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/tours`);
            setTours(res.data.data);
        } catch (error) {
            console.error("Lỗi:", error);
        }
    };

    useEffect(() => {
        fetchTours();
    }, []);

    const handleDelete = async (id) => {
        if(window.confirm("Bạn chắc chắn muốn xóa?")) {
            try {
                await axios.delete(`${BASE_URL}/tours/${id}`, { withCredentials: true });
                alert("Đã xóa!");
                fetchTours();
            } catch (error) {
                alert("Lỗi xóa tour");
            }
        }
    };

    return (
        <Container className="mt-5">
            <h2 className="mb-4">Quản lý Tour</h2>
            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Ảnh</th> {/* <--- Thêm cột Ảnh */}
                        <th>Tên Tour</th>
                        <th>Giá</th>
                        <th>Ngày đi</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {tours.map((tour, index) => (
                        <tr key={tour._id} className="align-middle">
                            <td>{index + 1}</td>
                            
                            {/* --- HIỂN THỊ ẢNH --- */}
                            <td>
                                <img 
                                    src={
                                        // Kiểm tra nếu link là online (http) thì để nguyên
                                        // Nếu là link local (/images/...) thì thêm localhost:4000 vào trước
                                        tour.photo && tour.photo.startsWith('http') 
                                        ? tour.photo 
                                        : `${SERVER_URL}${tour.photo}`
                                    } 
                                    alt={tour.title} 
                                    style={{ width: '80px', height: '60px', objectFit: 'cover', borderRadius: '5px' }}
                                />
                            </td>
                            {/* ------------------- */}

                            <td>{tour.title}</td>
                            <td>{tour.price?.toLocaleString()} đ</td>
                            <td>{new Date(tour.startDate).toLocaleDateString()}</td>
                            <td>
                                <Link to={`/admin/edit/${tour._id}`} className="btn btn-warning btn-sm me-2">Sửa</Link>
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