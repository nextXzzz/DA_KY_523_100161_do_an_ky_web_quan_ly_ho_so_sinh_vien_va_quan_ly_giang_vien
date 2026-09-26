require('./setup');
const request = require('supertest');
const app = require('../app');
const { createSampleLecturer } = require('./helpers');

describe('👨‍🏫 CRUD Giảng viên', () => {

  // ============================================================
  // GET /api/lecturers
  // ============================================================
  describe('GET /api/lecturers', () => {
    it('✅ Trả về mảng rỗng ban đầu', async () => {
      const res = await request(app).get('/api/lecturers');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBe(0);
    });

    it('✅ Trả về danh sách giảng viên sau khi thêm', async () => {
      await createSampleLecturer();
      await createSampleLecturer({ maGiangVien: 'GV002', email: 'gv2@test.com' });

      const res = await request(app).get('/api/lecturers');
      expect(res.status).toBe(200);
      expect(res.body.data.length).toBe(2);
    });
  });

  // ============================================================
  // GET /api/lecturers/:id
  // ============================================================
  describe('GET /api/lecturers/:id', () => {
    it('✅ Trả về chi tiết giảng viên', async () => {
      const lecturer = await createSampleLecturer();
      const res = await request(app).get(`/api/lecturers/${lecturer._id}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.maGiangVien).toBe('GV001');
      expect(res.body.data.hoTen).toBe('Trần Thị B');
    });

    it('❌ Trả về 404 cho ID không tồn tại', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const res = await request(app).get(`/api/lecturers/${fakeId}`);
      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  // ============================================================
  // POST /api/lecturers
  // ============================================================
  describe('POST /api/lecturers', () => {
    it('✅ Tạo giảng viên thành công với đầy đủ thông tin', async () => {
      const newLecturer = {
        maGiangVien: 'GV003',
        hoTen: 'Lê Văn C',
        ngaySinh: '1980-10-10',
        gioiTinh: 'Nam',
        khoa: 'Công nghệ thông tin',
        boMon: 'Khoa học máy tính',
        soDienThoai: '0987654321',
        email: 'levanc@test.com'
      };

      const res = await request(app)
        .post('/api/lecturers')
        .send(newLecturer);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.maGiangVien).toBe('GV003');
      expect(res.body.data.hoTen).toBe('Lê Văn C');
    });

    it('❌ Thất bại khi thiếu maGiangVien', async () => {
      const res = await request(app)
        .post('/api/lecturers')
        .send({ hoTen: 'Test' });
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('❌ Thất bại khi thiếu hoTen', async () => {
      const res = await request(app)
        .post('/api/lecturers')
        .send({ maGiangVien: 'GV004' });
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('❌ Thất bại khi trùng mã giảng viên', async () => {
      await createSampleLecturer({ maGiangVien: 'GV001' });
      const res = await request(app)
        .post('/api/lecturers')
        .send({
          maGiangVien: 'GV001',
          hoTen: 'Test Duplicate',
          email: 'dup@test.com'
        });
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/đã tồn tại/i);
    });

    it('❌ Thất bại khi email không đúng định dạng', async () => {
      const res = await request(app)
        .post('/api/lecturers')
        .send({
          maGiangVien: 'GV005',
          hoTen: 'Test Email',
          email: 'invalid-email'
        });
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  // ============================================================
  // PUT /api/lecturers/:id
  // ============================================================
  describe('PUT /api/lecturers/:id', () => {
    it('✅ Cập nhật giảng viên thành công', async () => {
      const lecturer = await createSampleLecturer();
      const res = await request(app)
        .put(`/api/lecturers/${lecturer._id}`)
        .send({ hoTen: 'Nguyễn Văn Cập Nhật' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.hoTen).toBe('Nguyễn Văn Cập Nhật');
    });

    it('❌ Trả về 404 cho ID không tồn tại', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const res = await request(app)
        .put(`/api/lecturers/${fakeId}`)
        .send({ hoTen: 'Test' });
      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  // ============================================================
  // DELETE /api/lecturers/:id
  // ============================================================
  describe('DELETE /api/lecturers/:id', () => {
    it('✅ Xóa giảng viên thành công', async () => {
      const lecturer = await createSampleLecturer();
      const res = await request(app).delete(`/api/lecturers/${lecturer._id}`);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);

      // Kiểm tra đã xóa thật
      const checkRes = await request(app).get(`/api/lecturers/${lecturer._id}`);
      expect(checkRes.status).toBe(404);
    });

    it('❌ Trả về 404 cho ID không tồn tại', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const res = await request(app).delete(`/api/lecturers/${fakeId}`);
      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  // ============================================================
  // Tìm kiếm
  // ============================================================
  describe('GET /api/lecturers?search=', () => {
    beforeEach(async () => {
      await createSampleLecturer({ hoTen: 'Trần Văn Search', maGiangVien: 'GV999' });
      await createSampleLecturer({ hoTen: 'Lê Thị Tim Kiem', maGiangVien: 'GV888', email: 'lethi@test.com' });
    });

    it('✅ Tìm kiếm theo họ tên', async () => {
      const res = await request(app).get('/api/lecturers?search=Search');
      expect(res.status).toBe(200);
      expect(res.body.data.length).toBe(1);
      expect(res.body.data[0].hoTen).toBe('Trần Văn Search');
    });

    it('✅ Tìm kiếm theo mã giảng viên', async () => {
      const res = await request(app).get('/api/lecturers?search=GV888');
      expect(res.status).toBe(200);
      expect(res.body.data.length).toBe(1);
      expect(res.body.data[0].maGiangVien).toBe('GV888');
    });

    it('✅ Trả về mảng rỗng nếu không khớp', async () => {
      const res = await request(app).get('/api/lecturers?search=KhongCoKetQua');
      expect(res.status).toBe(200);
      expect(res.body.data.length).toBe(0);
    });
  });
});
