const mongoose = require('mongoose');

const LecturerSchema = new mongoose.Schema({
  maGiangVien: {
    type: String, required: [true, 'Mã giảng viên không được để trống'],
    unique: true, trim: true
  },
  hoTen: { type: String, required: [true, 'Họ tên không được để trống'], trim: true },
  ngaySinh: { type: Date },
  gioiTinh: { type: String, enum: ['Nam', 'Nữ', 'Khác'], default: 'Nam' },
  khoa: { type: String, trim: true },
  boMon: { type: String, trim: true },
  soDienThoai: {
    type: String, trim: true,
    validate: {
      validator: function(v) {
        if (!v) return true;
        return /^(0[1-9][0-9]{8,9})$/.test(v.replace(/\s/g, ''));
      },
      message: 'Số điện thoại không hợp lệ'
    }
  },
  email: {
    type: String, trim: true, lowercase: true,
    validate: {
      validator: function(v) {
        if (!v) return true;
        return /\S+@\S+\.\S+/.test(v);
      },
      message: 'Email không hợp lệ'
    }
  }
}, { timestamps: true });

LecturerSchema.index({ maGiangVien: 'text', hoTen: 'text', khoa: 'text', boMon: 'text' });

module.exports = mongoose.model('Lecturer', LecturerSchema);
