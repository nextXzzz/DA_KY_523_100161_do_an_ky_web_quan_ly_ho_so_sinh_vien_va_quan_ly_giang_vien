const express = require('express');
const router = express.Router();
const Lecturer = require('../models/Lecturer');

// Lấy danh sách giảng viên
router.get('/', async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};
    if (search) {
      const regex = new RegExp(search, 'i');
      query = {
        $or: [
          { maGiangVien: regex },
          { hoTen: regex },
          { khoa: regex },
          { boMon: regex }
        ]
      };
    }
    const lecturers = await Lecturer.find(query).sort({ createdAt: -1 });
    res.json({ success: true, data: lecturers });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi server: ' + err.message });
  }
});

// Lấy thông tin 1 giảng viên
router.get('/:id', async (req, res) => {
  try {
    const lecturer = await Lecturer.findById(req.params.id);
    if (!lecturer) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy giảng viên' });
    }
    res.json({ success: true, data: lecturer });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi server: ' + err.message });
  }
});

// Thêm mới giảng viên
router.post('/', async (req, res) => {
  try {
    const lecturer = new Lecturer(req.body);
    await lecturer.save();
    res.status(201).json({ success: true, message: 'Thêm giảng viên thành công', data: lecturer });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ success: false, message: 'Mã giảng viên đã tồn tại' });
    }
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(val => val.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    res.status(500).json({ success: false, message: 'Lỗi server: ' + err.message });
  }
});

// Cập nhật thông tin giảng viên
router.put('/:id', async (req, res) => {
  try {
    const lecturer = await Lecturer.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!lecturer) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy giảng viên' });
    }
    res.json({ success: true, message: 'Cập nhật thành công', data: lecturer });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ success: false, message: 'Mã giảng viên đã tồn tại' });
    }
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(val => val.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    res.status(500).json({ success: false, message: 'Lỗi server: ' + err.message });
  }
});

// Xóa giảng viên
router.delete('/:id', async (req, res) => {
  try {
    const lecturer = await Lecturer.findByIdAndDelete(req.params.id);
    if (!lecturer) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy giảng viên' });
    }
    res.json({ success: true, message: 'Xóa giảng viên thành công' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi server: ' + err.message });
  }
});

module.exports = router;
