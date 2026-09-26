require('./setup');
const request = require('supertest');
const app = require('../app');
const { createDefaultUser } = require('./helpers');

describe('API Đăng nhập', () => {
  beforeEach(async () => {
    await createDefaultUser();
  });

  it('✅ Đăng nhập thành công với username/password đúng', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'admin', password: '123456' });
    
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.user).toBeDefined();
    expect(res.body.user.username).toBe('admin');
    expect(res.body.user.hoTen).toBe('Người quản lý');
    expect(res.body.user.role).toBe('manager');
    expect(res.body.user.password).toBeUndefined(); // Không trả về password
  });

  it('❌ Thất bại khi thiếu username', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ password: '123456' });
    
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('❌ Thất bại khi thiếu password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'admin' });
    
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('❌ Thất bại khi username không tồn tại', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'wrongadmin', password: '123456' });
    
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('❌ Thất bại khi password sai', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'admin', password: 'wrongpassword' });
    
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });
});
