const express = require('express');
const router = express.Router();
const User = require('../models/User');

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Vui lòng nhập tên đăng nhập và mật khẩu' });
    }
    const user = await User.findOne({ username });
    if (!user || user.password !== password) {
      return res.status(401).json({ success: false, message: 'Tên đăng nhập hoặc mật khẩu không đúng' });
    }
    res.json({
      success: true,
      message: 'Đăng nhập thành công',
      user: { id: user._id, username: user.username, hoTen: user.hoTen, role: user.role, avatar: user.avatar || '' }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi server: ' + err.message });
  }
});

// PUT /api/auth/avatar - Upload avatar (base64)
router.put('/avatar', async (req, res) => {
  try {
    const { username, avatar } = req.body;
    if (!username || !avatar) {
      return res.status(400).json({ success: false, message: 'Thiếu thông tin' });
    }

    // Kiểm tra kích thước base64 (giới hạn ~2MB)
    if (avatar.length > 2 * 1024 * 1024) {
      return res.status(400).json({ success: false, message: 'Ảnh quá lớn. Vui lòng chọn ảnh nhỏ hơn 2MB' });
    }

    const user = await User.findOneAndUpdate(
      { username },
      { avatar },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng' });
    }

    res.json({
      success: true,
      message: 'Cập nhật ảnh đại diện thành công',
      user: { id: user._id, username: user.username, hoTen: user.hoTen, role: user.role, avatar: user.avatar || '' }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi server: ' + err.message });
  }
});

module.exports = router;
