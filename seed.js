const mongoose = require('mongoose');
const User = require('./models/User');
const Student = require('./models/Student');
const Lecturer = require('./models/Lecturer');

const seedData = async () => {
  try {
    const uri = 'mongodb://localhost:27017/QuanLySinhVienGiangVien';
    await mongoose.connect(uri);
    console.log('✅ Đã kết nối cơ sở dữ liệu để seed data');

    // Xóa dữ liệu cũ
    await User.deleteMany({});
    await Student.deleteMany({});
    await Lecturer.deleteMany({});
    console.log('🧹 Đã xóa dữ liệu cũ');

    // Thêm User quản lý
    await User.create({
      username: 'admin',
      password: '123456',
      hoTen: 'Người quản lý',
      role: 'manager'
    });

    // Thêm sinh viên mẫu
    await Student.insertMany([
      { maSinhVien: 'SV001', hoTen: 'Nguyễn Văn An', ngaySinh: '2003-01-15', gioiTinh: 'Nam', lop: 'KTPM01', khoa: 'Công nghệ thông tin', soDienThoai: '0901234567', email: 'nguyenvanan@student.edu.vn' },
      { maSinhVien: 'SV002', hoTen: 'Trần Thị Bích Ngọc', ngaySinh: '2003-05-22', gioiTinh: 'Nữ', lop: 'KTPM01', khoa: 'Công nghệ thông tin', soDienThoai: '0902345678', email: 'tranthibichngoc@student.edu.vn' },
      { maSinhVien: 'SV003', hoTen: 'Lê Hoàng Minh Đức', ngaySinh: '2002-11-08', gioiTinh: 'Nam', lop: 'KHMT01', khoa: 'Công nghệ thông tin', soDienThoai: '0903456789', email: 'lehoangminhduc@student.edu.vn' },
      { maSinhVien: 'SV004', hoTen: 'Phạm Thị Diệu Linh', ngaySinh: '2003-07-30', gioiTinh: 'Nữ', lop: 'KT01', khoa: 'Kinh tế', soDienThoai: '0904567890', email: 'phamthidieulinh@student.edu.vn' },
      { maSinhVien: 'SV005', hoTen: 'Hoàng Quốc Bảo', ngaySinh: '2002-03-14', gioiTinh: 'Nam', lop: 'KT01', khoa: 'Kinh tế', soDienThoai: '0905678901', email: 'hoangquocbao@student.edu.vn' },
      { maSinhVien: 'SV006', hoTen: 'Đỗ Thị Phương Thảo', ngaySinh: '2003-09-02', gioiTinh: 'Nữ', lop: 'NN01', khoa: 'Ngoại ngữ', soDienThoai: '0906789012', email: 'dothiphuongthao@student.edu.vn' },
      { maSinhVien: 'SV007', hoTen: 'Bùi Quang Huy', ngaySinh: '2002-12-25', gioiTinh: 'Nam', lop: 'NN01', khoa: 'Ngoại ngữ', soDienThoai: '0907890123', email: 'buiquanghuy@student.edu.vn' },
      { maSinhVien: 'SV008', hoTen: 'Ngô Thị Hồng Nhung', ngaySinh: '2003-04-18', gioiTinh: 'Nữ', lop: 'KTPM02', khoa: 'Công nghệ thông tin', soDienThoai: '0908901234', email: 'ngothihongnhung@student.edu.vn' }
    ]);

    // Thêm giảng viên mẫu
    await Lecturer.insertMany([
      { maGiangVien: 'GV001', hoTen: 'TS. Nguyễn Trọng Nghĩa', ngaySinh: '1980-06-10', gioiTinh: 'Nam', khoa: 'Công nghệ thông tin', boMon: 'Kỹ thuật phần mềm', soDienThoai: '0911234567', email: 'nguyentrongnghia@university.edu.vn' },
      { maGiangVien: 'GV002', hoTen: 'ThS. Trần Thị Kim Oanh', ngaySinh: '1985-02-28', gioiTinh: 'Nữ', khoa: 'Công nghệ thông tin', boMon: 'Khoa học máy tính', soDienThoai: '0912345678', email: 'tranthikimoanh@university.edu.vn' },
      { maGiangVien: 'GV003', hoTen: 'PGS.TS. Lê Hồng Phúc', ngaySinh: '1975-08-15', gioiTinh: 'Nam', khoa: 'Kinh tế', boMon: 'Kế toán - Tài chính', soDienThoai: '0913456789', email: 'lehongphuc@university.edu.vn' },
      { maGiangVien: 'GV004', hoTen: 'ThS. Phạm Quang Minh', ngaySinh: '1982-11-20', gioiTinh: 'Nam', khoa: 'Kinh tế', boMon: 'Quản trị kinh doanh', soDienThoai: '0914567890', email: 'phamquangminh@university.edu.vn' },
      { maGiangVien: 'GV005', hoTen: 'TS. Hoàng Thị Lan Anh', ngaySinh: '1988-04-05', gioiTinh: 'Nữ', khoa: 'Ngoại ngữ', boMon: 'Ngôn ngữ Anh', soDienThoai: '0915678901', email: 'hoangthilananh@university.edu.vn' },
      { maGiangVien: 'GV006', hoTen: 'ThS. Đỗ Minh Thành', ngaySinh: '1990-01-12', gioiTinh: 'Nam', khoa: 'Ngoại ngữ', boMon: 'Ngôn ngữ Nhật', soDienThoai: '0916789012', email: 'dominhthanh@university.edu.vn' }
    ]);

    console.log('🌱 Seed dữ liệu thành công!');
    mongoose.disconnect();
  } catch (error) {
    console.error('❌ Lỗi seed data:', error);
    process.exit(1);
  }
};

seedData();
