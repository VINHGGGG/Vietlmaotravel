import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL, SERVER_URL } from '../utils/config';
import { AuthContext } from '../context/AuthContext';

const BookingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tour, setTour] = useState(null);
  const [form, setForm] = useState({
    fullName: '',
    userEmail: '',
    phone: '',
    guestSize: 1,
    bookAt: ''
  });
  const [maxGroupSize, setMaxGroupSize] = useState(100); // Mặc định
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const loadTour = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/tours/${id}`);
        setTour(res.data.data || null);
        if (res.data.data) {
            setMaxGroupSize(res.data.data.maxGroupSize || 100);
        }
      } catch (e) {
        setTour(null);
      }
    };
    loadTour();
  }, [id]);

  useEffect(() => {
    if (user) {
      setForm(prev => ({ ...prev, fullName: user.username || prev.fullName, userEmail: user.email || prev.userEmail }));
    }
  }, [user]);

  const totalPrice = useMemo(() => {
    if (!tour) return 0;
    const price = Number(tour.price) || 0;
    const qty = Number(form.guestSize) || 0;
    return price * qty;
  }, [tour, form.guestSize]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: name === 'guestSize' ? Number(value) : value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const bookingInfo = {
        tourId: id,
        fullName: form.fullName,
        userEmail: form.userEmail,
        phone: form.phone,
        guestSize: Number(form.guestSize),
        bookAt: form.bookAt
      };

      if (user) {
        bookingInfo.userId = user._id || user.id;
      }

      const res = await axios.post(`${BASE_URL}/bookings`, bookingInfo, {
        withCredentials: true
      });
      alert(`Đặt tour thành công! Tổng giá: ${Number(res.data.data.totalPrice).toLocaleString('vi-VN')} VNĐ`);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (!tour) return <div>Đang tải tour hoặc không tìm thấy...</div>;

  return (
    <div style={{ padding: 24, maxWidth: 720, margin: '0 auto' }}>
      <h1>Đặt Tour: {tour.title}</h1>
      <p><strong>Giá / người:</strong> {Number(tour.price).toLocaleString('vi-VN')} VNĐ</p>
      <img
        src={tour.photo?.startsWith('http') ? tour.photo : `${SERVER_URL}${tour.photo}`}
        alt={tour.title}
        style={{ width: '100%', maxHeight: 300, objectFit: 'cover', borderRadius: 8, marginBottom: 12 }}
      />

      <form onSubmit={onSubmit} style={{ display: 'grid', gap: 12 }}>
        <label>
          Họ tên:
          <input name="fullName" value={form.fullName} onChange={onChange} required />
        </label>
        <label>
          Email:
          <input type="email" name="userEmail" value={form.userEmail} onChange={onChange} required />
        </label>
        <label>
          Số điện thoại:
          <input type="tel" name="phone" value={form.phone} onChange={onChange} required />
        </label>
        <label>
          Số lượng người đi (Tối đa {maxGroupSize}):
          <input 
            type="number" 
            min="1" 
            max={maxGroupSize}
            name="guestSize" 
            value={form.guestSize} 
            onChange={onChange} 
            required 
          />
        </label>
        <label>
          Ngày đặt tour:
          <input type="date" name="bookAt" value={form.bookAt} onChange={onChange} required />
        </label>

        <div style={{ padding: 12, border: '1px dashed #ccc', borderRadius: 8 }}>
          <strong>Tổng giá:</strong> {totalPrice.toLocaleString('vi-VN')} VNĐ
        </div>

        {error && <div style={{ color: 'red' }}>{error}</div>}

        <button type="submit" disabled={submitting}>
          {submitting ? 'Đang xác nhận...' : 'Xác nhận đặt tour'}
        </button>
      </form>
    </div>
  );
};

export default BookingPage;