const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


exports.register = async (req, res) => {
    try {
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.password, salt);

        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hash,
            photo: req.body.photo,
            role: 'user'
        });

        await newUser.save();

        res.status(200).json({
            success: true,
            message: "Tạo tài khoản thành công!"
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Tạo tài khoản thất bại (Có thể tên/email đã trùng)"
        });
    }
};

// 2. Đăng nhập
exports.login = async (req, res) => {
    try {
        const email = req.body.email;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ success: false, message: "Không tìm thấy người dùng!" });
        }

        const checkPassword = bcrypt.compareSync(req.body.password, user.password);

        if (!checkPassword) {
            return res.status(401).json({ success: false, message: "Sai mật khẩu hoặc Email!" });
        }

        const { password, role, ...rest } = user._doc; // Ẩn mật khẩu và role khỏi dữ liệu trả về

        const token = jwt.sign(
            { id: user._id, role: user.role }, 
            process.env.JWT_SECRET, 
            { expiresIn: "15d" }
        );

        res.cookie('accessToken', token, {
            httpOnly: true,
            expires: token.expiresIn
        }).status(200).json({
            success: true,
            message: "Đăng nhập thành công!",
            token, 
            data: { ...rest }, 
            role // Gửi role về để Frontend biết là admin hay user
        });

    } catch (err) {
        res.status(500).json({ success: false, message: "Lỗi đăng nhập" });
    }
};