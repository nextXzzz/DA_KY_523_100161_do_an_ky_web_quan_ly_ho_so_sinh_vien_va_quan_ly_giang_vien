require('./setup');
const request = require('supertest');
const app = require('../app');
const { createSampleStudent } = require('./helpers');

describe('📚 CRUD Sinh viên', () => {

  // ============================================================
  // GET /api/students
  // ============================================================
  describe('GET /api/students', () => {
    it('✅ Trả về mảng rỗng ban đầu', async () => {
      const res = await request(app).get('/api/students');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBe(0);
    });

    it('✅ Trả về danh sách sinh viên sau khi thêm', async () => {
      await createSampleStudent();
      await createSampleStudent({ maSinhVien: 'SV002', email: 'sv2@test.com' });

      const res = await request(app).get('/api/students');
      expect(res.status).toBe(200);
      expect(res.body.data.length).toBe(2);
    });
  });

  // ============================================================
  // GET /api/students/:id
  // ============================================================
  describe('GET /api/students/:id', () => {
    it('✅ Trả về chi tiết sinh viên', async () => {
      const student = await createSampleStudent();
      const res = await request(app).get(`/api/students/${student._id}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.maSinhVien).toBe('SV001');
      expect(res.body.data.hoTen).toBe('Nguyễn Văn A');
    });

    it('❌ Trả về 404 cho ID không tồn tại', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const res = await request(app).get(`/api/students/${fakeId}`);
      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  // ============================================================
  // POST /api/students
  // ============================================================
  describe('POST /api/students', () => {
    it('✅ Tạo sinh viên thành công với đầy đủ thông tin', async () => {
      const newStudent = {
        maSinhVien: 'SV003',
        hoTen: 'Lê Văn C',
        ngaySinh: '2002-10-10',
        gioiTinh: 'Nam',
        lop: 'CNTT02',
        khoa: 'Công nghệ thông tin',
        soDienThoai: '0987654321',
        email: 'levanc@test.com'
      };

      const res = await request(app)
        .post('/api/students')
        .send(newStudent);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.maSinhVien).toBe('SV003');
      expect(res.body.data.hoTen).toBe('Lê Văn C');
    });

    it('❌ Thất bại khi thiếu maSinhVien', async () => {
      const res = await request(app)
        .post('/api/students')
        .send({ hoTen: 'Test' });
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('❌ Thất bại khi thiếu hoTen', async () => {
      const res = await request(app)
        .post('/api/students')
        .send({ maSinhVien: 'SV004' });
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('❌ Thất bại khi trùng mã sinh viên', async () => {
      await createSampleStudent({ maSinhVien: 'SV001' });
      const res = await request(app)
        .post('/api/students')
        .send({
          maSinhVien: 'SV001',
          hoTen: 'Test Duplicate',
          email: 'dup@test.com'
        });
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/đã tồn tại/i);
    });

    it('❌ Thất bại khi email không đúng định dạng', async () => {
      const res = await request(app)
        .post('/api/students')
        .send({
          maSinhVien: 'SV005',
          hoTen: 'Test Email',
          email: 'invalid-email'
        });
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  // ============================================================
  // PUT /api/students/:id
  // ============================================================
  describe('PUT /api/students/:id', () => {
    it('✅ Cập nhật sinh viên thành công', async () => {
      const student = await createSampleStudent();
      const res = await request(app)
        .put(`/api/students/${student._id}`)
        .send({ hoTen: 'Nguyễn Văn Cập Nhật' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.hoTen).toBe('Nguyễn Văn Cập Nhật');
    });

    it('❌ Trả về 404 cho ID không tồn tại', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const res = await request(app)
        .put(`/api/students/${fakeId}`)
        .send({ hoTen: 'Test' });
      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  // ============================================================
  // DELETE /api/students/:id
  // ============================================================
  describe('DELETE /api/students/:id', () => {
    it('✅ Xóa sinh viên thành công', async () => {
      const student = await createSampleStudent();
      const res = await request(app).delete(`/api/students/${student._id}`);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);

      // Kiểm tra đã xóa thật
      const checkRes = await request(app).get(`/api/students/${student._id}`);
      expect(checkRes.status).toBe(404);
    });

    it('❌ Trả về 404 cho ID không tồn tại', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const res = await request(app).delete(`/api/students/${fakeId}`);
      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  // ============================================================
  // Tìm kiếm
  // ============================================================
  describe('GET /api/students?search=', () => {
    beforeEach(async () => {
      await createSampleStudent({ hoTen: 'Trần Văn Search', maSinhVien: 'SV999' });
      await createSampleStudent({ hoTen: 'Lê Thị Tim Kiem', maSinhVien: 'SV888', email: 'lethi@test.com' });
    });

    it('✅ Tìm kiếm theo họ tên', async () => {
      const res = await request(app).get('/api/students?search=Search');
      expect(res.status).toBe(200);
      expect(res.body.data.length).toBe(1);
      expect(res.body.data[0].hoTen).toBe('Trần Văn Search');
    });

    it('✅ Tìm kiếm theo mã sinh viên', async () => {
      const res = await request(app).get('/api/students?search=SV888');
      expect(res.status).toBe(200);
      expect(res.body.data.length).toBe(1);
      expect(res.body.data[0].maSinhVien).toBe('SV888');
    });

    it('✅ Trả về mảng rỗng nếu không khớp', async () => {
      const res = await request(app).get('/api/students?search=KhongCoKetQua');
      expect(res.status).toBe(200);
      expect(res.body.data.length).toBe(0);
    });
  });
});
