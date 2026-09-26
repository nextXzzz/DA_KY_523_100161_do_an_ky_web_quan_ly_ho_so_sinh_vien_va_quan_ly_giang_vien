# Quản Lý Hồ Sơ Sinh Viên và Giảng Viên

Hệ thống web quản lý hồ sơ sinh viên và giảng viên, xây dựng bằng Node.js + Express.js + MongoDB + Mongoose.

## Công nghệ sử dụng

- **Backend:** Node.js, Express.js, MongoDB, Mongoose
- **Frontend:** HTML, CSS, JavaScript (Vanilla)
- **Testing:** Jest, Supertest, MongoDB Memory Server

## Chức năng

1. **Đăng nhập** - Xác thực người quản lý
2. **Dashboard** - Thống kê tổng quan (tổng sinh viên, giảng viên)
3. **Quản lý hồ sơ sinh viên** - Thêm, xem, sửa, xóa, tìm kiếm
4. **Quản lý hồ sơ giảng viên** - Thêm, xem, sửa, xóa, tìm kiếm
5. **Chatbot hỗ trợ** - Hướng dẫn sử dụng hệ thống
6. **Đăng xuất**

## Cài đặt

### Yêu cầu
- Node.js >= 18
- MongoDB (chạy trên localhost:27017)

### Bước 1: Cài đặt dependencies
```bash
npm install
```

### Bước 2: Cấu hình môi trường
Tạo file `.env` từ `.env.example`:
```bash
copy .env.example .env
```

### Bước 3: Tạo dữ liệu mẫu
```bash
npm run seed
```

### Bước 4: Chạy server
```bash
# Development (auto-reload)
npm run dev

# Production
npm start
```

Server sẽ chạy tại: http://localhost:3000

## Tài khoản đăng nhập

| Username | Password | Họ tên | Role |
|----------|----------|--------|------|
| admin | 123456 | Người quản lý | manager |

## Cấu trúc dự án

```
├── server.js              # Entry point
├── app.js                 # Express configuration
├── connect.js             # MongoDB connection
├── seed.js                # Seed data script
├── models/
│   ├── User.js            # User model
│   ├── Student.js         # Student model
│   └── Lecturer.js        # Lecturer model
├── routes/
│   ├── authRoutes.js      # Authentication routes
│   ├── studentRoutes.js   # Student CRUD routes
│   ├── lecturerRoutes.js  # Lecturer CRUD routes
│   ├── dashboardRoutes.js # Dashboard stats
│   └── chatbotRoutes.js   # Chatbot routes
├── index.html             # Login page
├── pages/
│   ├── dashboard.html     # Dashboard
│   ├── students.html      # Student management
│   ├── lecturers.html     # Lecturer management
│   └── chatbot.html       # Chatbot
├── assets/
│   ├── css/               # Stylesheets
│   └── js/                # Frontend scripts
└── test/                  # Jest tests
```

## API Endpoints

### Auth
- `POST /api/auth/login` - Đăng nhập

### Sinh viên
- `GET /api/students` - Danh sách sinh viên
- `GET /api/students?search=...` - Tìm kiếm
- `GET /api/students/:id` - Chi tiết
- `POST /api/students` - Thêm mới
- `PUT /api/students/:id` - Cập nhật
- `DELETE /api/students/:id` - Xóa

### Giảng viên
- `GET /api/lecturers` - Danh sách giảng viên
- `GET /api/lecturers?search=...` - Tìm kiếm
- `GET /api/lecturers/:id` - Chi tiết
- `POST /api/lecturers` - Thêm mới
- `PUT /api/lecturers/:id` - Cập nhật
- `DELETE /api/lecturers/:id` - Xóa

### Dashboard
- `GET /api/dashboard/stats` - Thống kê tổng quan

### Chatbot
- `POST /api/chatbot` - Gửi tin nhắn cho chatbot

## Database

- **Database name:** QuanLySinhVienGiangVien
- **Collections:** users, students, lecturers

## Testing

```bash
# Chạy tất cả test
npm test

# Chạy test với coverage
npm run test:coverage

# Chạy test riêng lẻ
npm run test:auth
npm run test:students
npm run test:lecturers
```

## License

MIT
