/**
 * test/helpers.js - Các hàm tiện ích cho kiểm thử
 */
const User = require('../models/User');
const Student = require('../models/Student');
const Lecturer = require('../models/Lecturer');

async function createDefaultUser() {
  return await User.create({
    username: 'admin',
    password: '123456',
    hoTen: 'Người quản lý',
    role: 'manager'
  });
}

async function createSampleStudent(overrides = {}) {
  return await Student.create({
    maSinhVien: 'SV001',
    hoTen: 'Nguyễn Văn A',
    ngaySinh: new Date('2003-05-15'),
    gioiTinh: 'Nam',
    lop: 'CNTT01',
    khoa: 'Công nghệ thông tin',
    soDienThoai: '0901234567',
    email: 'nguyenvana@test.com',
    ...overrides
  });
}

async function createSampleLecturer(overrides = {}) {
  return await Lecturer.create({
    maGiangVien: 'GV001',
    hoTen: 'Trần Thị B',
    ngaySinh: new Date('1985-03-20'),
    gioiTinh: 'Nữ',
    khoa: 'Công nghệ thông tin',
    boMon: 'Kỹ thuật phần mềm',
    soDienThoai: '0912345678',
    email: 'tranthib@test.com',
    ...overrides
  });
}

module.exports = {
  createDefaultUser,
  createSampleStudent,
  createSampleLecturer
};
