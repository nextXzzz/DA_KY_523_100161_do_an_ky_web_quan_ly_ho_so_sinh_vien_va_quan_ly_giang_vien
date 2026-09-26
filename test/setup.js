/**
 * test/setup.js - Cấu hình MongoDB In-Memory cho kiểm thử
 * Sử dụng mongodb-memory-server để không cần MongoDB thật
 */
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

/**
 * Kết nối MongoDB In-Memory trước khi chạy test
 */
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();

  // Đóng kết nối cũ nếu có
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }

  await mongoose.connect(mongoUri);
});

/**
 * Xóa toàn bộ dữ liệu sau mỗi test suite
 */
afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
});

/**
 * Đóng kết nối và dừng MongoDB sau khi test xong
 */
afterAll(async () => {
  await mongoose.disconnect();
  if (mongoServer) {
    await mongoServer.stop();
  }
});
