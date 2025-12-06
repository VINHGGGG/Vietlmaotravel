import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { BASE_URL, SERVER_URL } from "../utils/config";

export default function HomePage() {
  const [tours, setTours] = useState([]);
  const [search, setSearch] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [city, setCity] = useState("");

  useEffect(() => {
    const loadTours = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/tours`);
        setTours(res.data.data || []);
      } catch (e) {
        setTours([]);
      }
    };
    loadTours();
  }, []);

  const filteredTours = useMemo(() => {
    return (tours || []).filter((t) => {
      const matchSearch = search
        ? t.title.toLowerCase().includes(search.toLowerCase()) ||
          t.city.toLowerCase().includes(search.toLowerCase())
        : true;
      const matchCity = city ? t.city.toLowerCase().includes(city.toLowerCase()) : true;
      const matchPrice = maxPrice ? Number(t.price) <= Number(maxPrice) : true;
      return matchSearch && matchCity && matchPrice;
    });
  }, [tours, search, city, maxPrice]);

  return (
    <div style={{ padding: "20px", maxWidth: 1200, margin: "0 auto" }}>
      <h2>Danh Mục Tour Du Lịch</h2>

      <div style={{ marginTop: 20, marginBottom: 25, display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))" }}>
        <input
          type="text"
          placeholder="Tìm theo tên/địa điểm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <input
          type="text"
          placeholder="Thành phố"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <input
          type="number"
          placeholder="Giá tối đa"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
        />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "20px",
        }}
      >
        {filteredTours.map((tour) => (
          <div
            key={tour._id}
            style={{
              border: "1px solid #ccc",
              borderRadius: 8,
              padding: 15,
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
              maxWidth: 420,
              margin: "0 auto",
            }}
          >
            <img
              src={tour.photo?.startsWith('http') ? tour.photo : `${SERVER_URL}${tour.photo}`}
              alt={tour.title}
              style={{ width: "100%", borderRadius: 6, height: 220, objectFit: "cover" }}
            />

            <h3 style={{ marginTop: 10 }}>{tour.title}</h3>

            <p>📍 {tour.city}</p>
            <p>💰 {Number(tour.price).toLocaleString()} VNĐ</p>
            <p>🚩 Khởi hành: {new Date(tour.startDate).toLocaleDateString('vi-VN')}</p>

            <Link to={`/booking/${tour._id}`} className="btn btn-primary w-100">
              Đặt Tour
            </Link>
          </div>
        ))}
      </div>

      {filteredTours.length === 0 && <p className="mt-3">Không tìm thấy tour phù hợp.</p>}
    </div>
  );
}


