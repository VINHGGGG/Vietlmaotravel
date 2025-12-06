const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const tourRoute = require('./routes/tour');
const bookingRoute = require('./routes/booking');  
const authRoute = require('./routes/auth');

// Cấu hình dotenv để đọc file .env
dotenv.config();

const app = express();
const port = process.env.PORT || 8000;

// Cấu hình tắt cảnh báo của Mongoose (Best practice)
mongoose.set("strictQuery", false);

// --- HÀM KẾT NỐI DATABASE ---
const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
        });
        console.log('MongoDB connected successfully! (Đã kết nối CSDL thành công)');
    } catch (err) {
        console.log('MongoDB connection failed (Lỗi kết nối):', err);
    }
}

// Middleware
app.use(express.json());
const corsOptions = {
    origin: 'http://localhost:3000', // Chỉ cho phép port 3000 của Frontend gọi vào
    credentials: true // Cho phép nhận cookie/token
}

app.use(cors(corsOptions));
app.use(cookieParser());

// Testing route
app.get('/', (req, res) => {
    res.send("API đang chạy ngon lành!");
})
app.use('/api/v1/tours', tourRoute);
app.use('/api/v1/bookings', bookingRoute);
app.use('/api/v1/auth', authRoute);

// Chạy Server và Kết nối Database
app.listen(port, () => {
    connect(); // Gọi hàm kết nối khi server bắt đầu chạy
    console.log(`Server đang lắng nghe tại port: ${port}`);
})