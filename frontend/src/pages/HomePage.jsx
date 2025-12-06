import React, { useState, useEffect } from "react";

// ======= DATA MẪU =========
const mockTours = [
  {
    id: 1,
    name: "Tour Đà Lạt 3N2Đ",
    image: "https://picsum.photos/300/200",
    price: 3500000,
    location: "Đà Lạt",
    days: 3,
    startDate: "2025-01-10",
    maxGuests: 20,
    description: "Trải nghiệm khí hậu se lạnh, tham quan đồi chè, đồi thiên phúc.",
  },
  {
    id: 2,
    name: "Tour Phú Quốc 4N3Đ",
    image: "https://picsum.photos/300/201",
    price: 5500000,
    location: "Phú Quốc",
    days: 4,
    startDate: "2025-02-05",
    maxGuests: 25,
    description: "Khám phá đảo ngọc, câu cá, lặn biển ngắm san hô.",
  },
  {
    id: 3,
    name: "Tour Thái Lan 5N4Đ",
    image: "https://picsum.photos/300/202",
    price: 8900000,
    location: "Bangkok - Pattaya",
    days: 5,
    startDate: "2025-03-12",
    maxGuests: 30,
    description: "Du lịch nước ngoài giá tốt, khám phá chùa Vàng, phố đi bộ.",
  },
];

// =============== COMPONENT ===================
export default function HomePage() {
  const [tours, setTours] = useState(mockTours);

  // Lọc
  const [filterPrice, setFilterPrice] = useState("");
  const [filterLocation, setFilterLocation] = useState("");
  const [filterDays, setFilterDays] = useState("");

  // Modal đặt tour
  const [selectedTour, setSelectedTour] = useState(null);
  const [bookingInfo, setBookingInfo] = useState({
    name: "",
    email: "",
    phone: "",
    quantity: 1,
  });

  // ================== FILTER FUNCTION ===================
  const handleFilter = () => {
    let filtered = mockTours;

    if (filterPrice)
      filtered = filtered.filter((t) => t.price <= parseInt(filterPrice));

    if (filterLocation)
      filtered = filtered.filter((t) =>
        t.location.toLowerCase().includes(filterLocation.toLowerCase())
      );

    if (filterDays)
      filtered = filtered.filter((t) => t.days == filterDays);

    setTours(filtered);
  };

  // ================== HANDLE BOOKING ===================
  const handleBookingSubmit = () => {
    alert(`
    ĐẶT TOUR THÀNH CÔNG!
    Tour: ${selectedTour.name}
    Khách: ${bookingInfo.name}
    Email: ${bookingInfo.email}
    Số lượng: ${bookingInfo.quantity}
    Tổng tiền: ${bookingInfo.quantity * selectedTour.price} VNĐ
    `);

    // Reset form
    setBookingInfo({ name: "", email: "", phone: "", quantity: 1 });
    setSelectedTour(null);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Danh Mục Tour Du Lịch</h2>

      {/* ========== FILTER SECTION ========== */}
      <div style={{ marginTop: 20, marginBottom: 25 }}>
        <h3>Lọc Tour</h3>

        <div style={{ display: "flex", gap: 15 }}>
          <input
            type="number"
            placeholder="Giá tối đa"
            value={filterPrice}
            onChange={(e) => setFilterPrice(e.target.value)}
          />

          <input
            type="text"
            placeholder="Địa điểm"
            value={filterLocation}
            onChange={(e) => setFilterLocation(e.target.value)}
          />

          <input
            type="number"
            placeholder="Số ngày"
            value={filterDays}
            onChange={(e) => setFilterDays(e.target.value)}
          />

          <button onClick={handleFilter}>Lọc</button>
        </div>
      </div>

      {/* ========== TOUR LIST ========== */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "20px",
        }}
      >
        {tours.map((tour) => (
          <div
            key={tour.id}
            style={{
              border: "1px solid #ccc",
              borderRadius: 8,
              padding: 15,
            }}
          >
            <img
              src={tour.image}
              alt={tour.name}
              style={{ width: "100%", borderRadius: 6 }}
            />

            <h3>{tour.name}</h3>

            <p>📍 {tour.location}</p>
            <p>⏱ {tour.days} ngày</p>
            <p>💰 {tour.price.toLocaleString()} VNĐ</p>
            <p>🚩 Khởi hành: {tour.startDate}</p>

            <button onClick={() => setSelectedTour(tour)}>
              Đặt Tour
            </button>
          </div>
        ))}
      </div>

      {/* ========== MODAL ĐẶT TOUR ========== */}
      {selectedTour && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: "white",
              padding: 25,
              borderRadius: 8,
              width: 400,
            }}
          >
            <h2>Đặt Tour: {selectedTour.name}</h2>

            <input
              type="text"
              placeholder="Họ tên"
              value={bookingInfo.name}
              onChange={(e) =>
                setBookingInfo({ ...bookingInfo, name: e.target.value })
              }
            />

            <input
              type="email"
              placeholder="Email"
              style={{ marginTop: 10 }}
              value={bookingInfo.email}
              onChange={(e) =>
                setBookingInfo({ ...bookingInfo, email: e.target.value })
              }
            />

            <input
              type="text"
              placeholder="Số điện thoại"
              style={{ marginTop: 10 }}
              value={bookingInfo.phone}
              onChange={(e) =>
                setBookingInfo({ ...bookingInfo, phone: e.target.value })
              }
            />

            <input
              type="number"
              min="1"
              style={{ marginTop: 10 }}
              placeholder="Số người"
              value={bookingInfo.quantity}
              onChange={(e) =>
                setBookingInfo({ ...bookingInfo, quantity: e.target.value })
              }
            />

            <p style={{ marginTop: 10 }}>
              👉 Tổng tiền:{" "}
              <b>
                {(bookingInfo.quantity * selectedTour.price).toLocaleString()}{" "}
                VNĐ
              </b>
            </p>

            <button
              onClick={handleBookingSubmit}
              style={{ marginTop: 10, width: "100%" }}
            >
              Xác nhận đặt tour
            </button>

            <button
              style={{ marginTop: 10, width: "100%" }}
              onClick={() => setSelectedTour(null)}
            >
              Hủy
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
