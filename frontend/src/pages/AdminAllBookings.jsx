import React, { useEffect, useState } from 'react';
import { Container, Table, Badge, Form, InputGroup } from 'react-bootstrap';
import axios from 'axios';
import { BASE_URL } from '../utils/config';

const AdminAllBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [filterVal, setFilterVal] = useState(''); // Để lưu từ khóa tìm kiếm

    // 1. Lấy dữ liệu Booking
    const fetchBookings = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/bookings`, { withCredentials: true });
            setBookings(res.data.data);
        } catch (error) {
            console.error("Lỗi:", error);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    // 2. Hàm đổi trạng thái thanh toán (Paid <-> Unpaid)
    const togglePayment = async (booking) => {
        try {
            const newIsPaid = !booking.isPaid; // Đảo ngược trạng thái hiện tại
            const newStatus = newIsPaid ? 'approved' : 'pending'; // Nếu đã thanh toán -> Duyệt, ngược lại -> Chờ

            await axios.put(`${BASE_URL}/bookings/${booking._id}`, 
                { 
                    isPaid: newIsPaid,
                    status: newStatus
                }, 
                { withCredentials: true }
            );
            // Load lại dữ liệu sau khi sửa
            fetchBookings(); 
        } catch (error) {
            alert("Lỗi cập nhật trạng thái!");
        }
    };

    // 3. Logic lọc dữ liệu (Search)
    // Lọc theo Tên Tour hoặc Tên Khách hàng
    const filteredBookings = bookings.filter(item => 
        item.tourName.toLowerCase().includes(filterVal.toLowerCase()) || 
        item.fullName.toLowerCase().includes(filterVal.toLowerCase())
    );

    return (
        <Container className="mt-5">
            <h2 className="mb-4 text-primary">Quản lý Đặt Tour (Bookings)</h2>
            
            {/* Thanh tìm kiếm */}
            <div className="mb-4 w-50">
                <InputGroup>
                    <InputGroup.Text id="search-icon">🔍</InputGroup.Text>
                    <Form.Control
                        placeholder="Tìm theo tên tour hoặc tên khách..."
                        value={filterVal}
                        onChange={(e) => setFilterVal(e.target.value)}
                    />
                </InputGroup>
            </div>

            <Table striped bordered hover responsive className="text-center align-middle">
                <thead className="bg-light">
                    <tr>
                        <th>#</th>
                        <th>Khách hàng</th>
                        <th>Tour đã đặt</th>
                        <th>Số người</th>
                        <th>Ngày đi</th>
                        <th>Tổng tiền</th>
                        <th>Trạng thái</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredBookings.length === 0 ? (
                        <tr><td colSpan="8">Chưa có booking nào phù hợp!</td></tr>
                    ) : (
                        filteredBookings.map((item, index) => (
                            <tr key={item._id}>
                                <td>{index + 1}</td>
                                <td className="text-start">
                                    <strong>{item.fullName}</strong><br/>
                                    <small className="text-muted">{item.phone}</small>
                                </td>
                                <td className="text-start" style={{maxWidth: '200px'}}>{item.tourName}</td>
                                <td>{item.guestSize}</td>
                                <td>{new Date(item.bookAt).toLocaleDateString('vi-VN')}</td>
                                <td className="fw-bold text-success">
                                    {item.totalPrice.toLocaleString()} đ
                                </td>
                                <td>
                                    {item.isPaid ? (
                                        <Badge bg="success">Đã thanh toán</Badge>
                                    ) : (
                                        <Badge bg="danger">Chưa thanh toán</Badge>
                                    )}
                                </td>
                                <td>
                                    {/* Nút Toggle trạng thái */}
                                    <Form.Check 
                                        type="switch"
                                        id={`custom-switch-${item._id}`}
                                        label={item.isPaid ? "Hủy thu" : "Thu tiền"}
                                        checked={item.isPaid}
                                        onChange={() => togglePayment(item)}
                                    />
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </Table>
        </Container>
    );
};

export default AdminAllBookings;