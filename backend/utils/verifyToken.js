const jwt = require('jsonwebtoken');

// 1. Hàm kiểm tra Token cơ bản (User đã đăng nhập chưa?)
const verifyToken = (req, res, next) => {
    const token = req.cookies.accessToken || req.headers.authorization;

    if (!token) {
        return res.status(401).json({ success: false, message: "Bạn chưa đăng nhập!" });
    }

    // Nếu token gửi dạng "Bearer [token]" thì cần cắt chuỗi, còn nếu gửi raw thì thôi
    // Ở đây giả sử gửi raw hoặc qua cookie
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(401).json({ success: false, message: "Token không hợp lệ!" });
        }
        req.user = user; // Lưu thông tin user vào request để dùng ở bước sau
        next(); // Cho phép đi tiếp
    });
};

// 2. Hàm kiểm tra User (Chính chủ hoặc Admin mới được xóa/sửa tài khoản mình)
const verifyUser = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.id === req.params.id || req.user.role === 'admin') {
            next();
        } else {
            return res.status(401).json({ success: false, message: "Bạn không có quyền truy cập!" });
        }
    });
};

// 3. Hàm kiểm tra Admin (Chỉ Admin mới được làm) - Dùng cho Create/Delete Tour
const verifyAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.role === 'admin') {
            next();
        } else {
            return res.status(401).json({ success: false, message: "Bạn không phải Admin!" });
        }
    });
};

module.exports = {
    verifyToken,
    verifyUser,
    verifyAdmin
};