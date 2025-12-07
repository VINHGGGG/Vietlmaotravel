import React, { useContext, useEffect, useState } from 'react';
import { Container, Row, Table } from 'react-bootstrap';
import axios from 'axios';
import { BASE_URL } from '../utils/config';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const MyBookings = () => {
  const { user } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
        navigate('/login');
        return;
    }

    const fetchBookings = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/bookings/user/${user._id || user.id}`, {
            withCredentials: true
        });
        setBookings(res.data.data);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || "Có lỗi xảy ra khi tải lịch sử đặt tour");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user, navigate]);

  if (loading) return <h4 className="text-center pt-5">Đang tải...</h4>;
  if (error) return <h4 className="text-center pt-5 text-danger">{error}</h4>;

  return (
    <section>
      <Container>
        <Row>
          <h2 className="mb-4">Lịch sử đặt tour của tôi</h2>
          {bookings.length === 0 ? (
            <h5 className="text-center">Bạn chưa đặt tour nào.</h5>
          ) : (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Mã đơn</th>
                  <th>Tên Tour</th>
                  <th>Ngày đặt</th>
                  <th>Số người</th>
                  <th>Tổng tiền</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((item) => (
                  <tr key={item._id}>
                    <td>{item._id}</td>
                    <td>{item.tourName}</td>
                    <td>{new Date(item.bookAt).toLocaleDateString('vi-VN')}</td>
                    <td>{item.guestSize}</td>
                    <td>{Number(item.totalPrice).toLocaleString('vi-VN')} VNĐ</td>
                    <td>
                        {item.status === 'pending' && <span className="text-warning">Chờ duyệt</span>}
                        {item.status === 'approved' && <span className="text-success">Đã duyệt</span>}
                        {item.status === 'cancelled' && <span className="text-danger">Đã hủy</span>}
                        {item.isPaid && <div className="small text-success fw-bold">(Đã thanh toán)</div>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Row>
      </Container>
    </section>
  );
};

export default MyBookings;
