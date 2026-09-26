require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/authRoutes');
const studentRoutes = require('./routes/studentRoutes');
const lecturerRoutes = require('./routes/lecturerRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const chatbotRoutes = require('./routes/chatbotRoutes');

const app = express();

app.use(cors({ origin: ['http://localhost:3000', 'http://127.0.0.1:5500'] }));
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));

app.use(express.static(__dirname));

app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/lecturers', lecturerRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/chatbot', chatbotRoutes);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/pages/:page', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages', req.params.page));
});

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: 'Không tìm thấy API route này' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Lỗi server nội bộ' });
});

module.exports = app;
