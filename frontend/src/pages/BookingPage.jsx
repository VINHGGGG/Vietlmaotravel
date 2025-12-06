import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

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
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadTour = async () => {
      try {
        const res = await fetch(`/api/v1/tours/${id}`);
        const json = await res.json();
        setTour(json.data || null);
      } catch (e) {
        setTour(null);
      }
    };
    loadTour();
  }, [id]);

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
      const res = await fetch('/api/v1/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tourId: id,
          fullName: form.fullName,
          userEmail: form.userEmail,
          phone: form.phone,
          guestSize: form.guestSize,
          bookAt: form.bookAt
        })
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.message || 'Đặt tour thất bại');
      }
      alert(`Đặt tour thành công! Tổng giá: ${Number(json.data.totalPrice).toLocaleString('vi-VN')} VNĐ`);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (!tour) return <div>Đang tải tour hoặc không tìm thấy...</div>;

  return (
    <div style={{ padding: 24, maxWidth: 720, margin: '0 auto' }}>
      <h1>Đặt Tour: {tour.title}</h1>
      <p><strong>Giá / người:</strong> {Number(tour.price).toLocaleString('vi-VN')} VNĐ</p>

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
          Số lượng người đi:
          <input type="number" min="1" name="guestSize" value={form.guestSize} onChange={onChange} required />
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