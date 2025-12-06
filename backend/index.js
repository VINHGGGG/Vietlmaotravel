const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const tourRoute = require('./routes/tour');
const bookingRoute = require('./routes/booking');  
const authRoute = require('./routes/auth');
const multer = require('multer');
const path = require('path');


// Cấu hình dotenv để đọc file .env
dotenv.config();

const app = express();
// Đồng bộ với BASE_URL phía frontend (http://localhost:4000)
const port = process.env.PORT || 4000;

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

// 1. Cấu hình nơi lưu ảnh và tên ảnh
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images'); // Lưu vào thư mục này
    },
    filename: (req, file, cb) => {
        // Đặt tên file = thời gian hiện tại + tên gốc (để tránh trùng)
        cb(null, Date.now() + path.extname(file.originalname)); 
    }
});

const upload = multer({ storage: storage });

// 2. Tạo API Upload riêng
app.post('/api/v1/upload', upload.single('file'), (req, res) => {
    try {
        // Trả về đường dẫn ảnh cho Frontend
        // Ví dụ: /images/16382123.jpg
        const filePath = `/images/${req.file.filename}`;
        res.status(200).json({ 
            success: true, 
            message: "Upload thành công", 
            data: filePath 
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Lỗi upload ảnh" });
    }
});

// 3. QUAN TRỌNG: Mở quyền truy cập thư mục public (để web xem được ảnh)
app.use(express.static(path.join(__dirname, 'public'))); // Hoặc app.use('/images', express.static('public/images'));

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