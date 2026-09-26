const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const Lecturer = require('../models/Lecturer');

router.post('/', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.json({ success: true, reply: 'Xin chào! 👋 Tôi là trợ lý ảo của hệ thống. Hãy hỏi tôi bất cứ điều gì bạn cần nhé!' });
    }

    const lowerMessage = message.toLowerCase();
    let reply = 'Xin lỗi, tôi chưa hiểu rõ câu hỏi của bạn. 🤔<br><br>Tôi có thể giúp bạn các việc sau:<ul style="margin-top:8px;padding-left:20px;"><li>Quản lý <b>sinh viên</b> (thêm/sửa/xóa/tìm kiếm)</li><li>Quản lý <b>giảng viên</b> (thêm/sửa/xóa/tìm kiếm)</li><li>Tra cứu <b>số lượng</b> hồ sơ hiện tại</li><li>Hướng dẫn các tính năng của hệ thống</li></ul>';

    if (lowerMessage.includes('bao nhiêu') || lowerMessage.includes('thống kê') || lowerMessage.includes('số lượng')) {
      if (lowerMessage.includes('sinh viên')) {
        const count = await Student.countDocuments();
        reply = `🎓 Hiện tại hệ thống đang quản lý <b>${count}</b> hồ sơ sinh viên. Bạn có thể xem chi tiết trên bảng điều khiển (Dashboard).`;
      } else if (lowerMessage.includes('giảng viên')) {
        const count = await Lecturer.countDocuments();
        reply = `👨‍🏫 Hiện tại hệ thống đang quản lý <b>${count}</b> hồ sơ giảng viên. Bạn có thể xem chi tiết ở mục Quản lý Giảng viên.`;
      } else {
        const [svCount, gvCount] = await Promise.all([
          Student.countDocuments(),
          Lecturer.countDocuments()
        ]);
        reply = `📊 Tổng quan hệ thống hiện tại có:<br>• <b>${svCount}</b> sinh viên 🎓<br>• <b>${gvCount}</b> giảng viên 👨‍🏫`;
      }
    } else if (lowerMessage.includes('thêm') && lowerMessage.includes('sinh viên')) {
      reply = 'Để <b>thêm sinh viên mới</b>, bạn làm theo các bước sau: 📝<br>1. Click vào <b>"Quản lý sinh viên"</b> ở thanh menu bên trái.<br>2. Bấm vào nút <span style="color:var(--primary-color)"><b>+ Thêm sinh viên</b></span> (Góc phải trên bảng).<br>3. Điền các thông tin cần thiết vào form hiện ra.<br>4. Nhấn <b>"Lưu"</b> là xong!';
    } else if (lowerMessage.includes('thêm') && lowerMessage.includes('giảng viên')) {
      reply = 'Để <b>thêm giảng viên mới</b>, bạn làm theo các bước sau: 📝<br>1. Click vào <b>"Quản lý giảng viên"</b> ở thanh menu bên trái.<br>2. Bấm vào nút <span style="color:var(--primary-color)"><b>+ Thêm giảng viên</b></span>.<br>3. Điền đầy đủ thông tin (Mã GV, họ tên, khoa, bộ môn...).<br>4. Nhấn <b>"Lưu"</b> để hoàn tất!';
    } else if (lowerMessage.includes('sửa') || lowerMessage.includes('cập nhật')) {
      reply = 'Để <b>sửa thông tin</b>: ✏️<br>1. Ở danh sách, tìm đến người bạn muốn sửa.<br>2. Cột "Thao tác" ngoài cùng, bạn bấm vào nút <b>Sửa</b> (biểu tượng cây bút ✏️).<br>3. Chỉnh sửa thông tin và nhấn <b>Lưu</b>.';
    } else if (lowerMessage.includes('tìm kiếm') || lowerMessage.includes('tìm')) {
      reply = 'Để <b>tìm kiếm hồ sơ</b>: 🔍<br>Bạn chỉ cần gõ từ khoá vào ô <b>Tìm kiếm...</b> phía trên bảng (Có thể gõ mã, họ tên, lớp hoặc khoa).<br>Hệ thống sẽ lọc kết quả ngay lập tức ⚡ mà không cần bấm nút tìm!';
    } else if (lowerMessage.includes('xóa')) {
      reply = 'Để <b>xoá hồ sơ</b>: 🗑️<br>1. Tìm hồ sơ cần xoá trong bảng danh sách.<br>2. Nhấn nút <b>Xóa</b> (biểu tượng thùng rác màu đỏ 🗑️).<br>3. Một bảng cảnh báo sẽ hiện ra, bạn xác nhận là xong.<br><i style="color:var(--danger)">Lưu ý: Dữ liệu đã xóa sẽ không thể khôi phục lại!</i>';
    } else if (lowerMessage.includes('giảng viên')) {
      reply = 'Mục <b>Quản lý Giảng viên</b> giúp bạn:<br>• Xem và tìm kiếm hồ sơ giảng viên 👨‍🏫<br>• Thêm mới, cập nhật thông tin cá nhân/công tác<br>• Xoá các hồ sơ không còn sử dụng';
    } else if (lowerMessage.includes('sinh viên')) {
      reply = 'Mục <b>Quản lý Sinh viên</b> giúp bạn:<br>• Xem và tìm kiếm hồ sơ sinh viên 🎓<br>• Quản lý thông tin (Họ tên, ngày sinh, lớp, khoa...)<br>• Dễ dàng tra cứu thông tin liên hệ (SĐT, Email)';
    } else if (lowerMessage.includes('đăng nhập')) {
      reply = 'Bạn đã đăng nhập vào hệ thống rồi đấy! 😎<br>Nếu muốn sử dụng tài khoản khác, hãy <b>Đăng xuất</b> trước nhé.';
    } else if (lowerMessage.includes('đăng xuất')) {
      reply = 'Để <b>Đăng xuất</b> khỏi hệ thống: 🚪<br>1. Kéo xuống cuối thanh menu bên trái (Sidebar).<br>2. Bấm vào dòng <b>"Đăng xuất"</b> màu đỏ.<br>3. Xác nhận trên hộp thoại để trở về màn hình đăng nhập.';
    } else if (lowerMessage.includes('chức năng') || lowerMessage.includes('hệ thống') || lowerMessage.includes('làm gì') || lowerMessage.includes('chào') || lowerMessage.includes('hello')) {
      reply = 'Hệ thống Quản lý Sinh viên & Giảng viên phiên bản mới cung cấp: ✨<br><br>1. 📊 <b>Dashboard</b> - Xem tổng quan dữ liệu.<br>2. 🎓 <b>Quản lý Sinh viên</b> - Dễ dàng cập nhật, tìm kiếm hồ sơ.<br>3. 👨‍🏫 <b>Quản lý Giảng viên</b> - Thông tin chi tiết, khoa/bộ môn.<br>4. 🤖 <b>Trợ lý ảo</b> - Là mình đây! Luôn sẵn sàng hỗ trợ bạn.';
    }

    res.json({ success: true, reply });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi server: ' + err.message });
  }
});

module.exports = router;
