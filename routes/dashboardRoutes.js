const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const Lecturer = require('../models/Lecturer');

router.get('/stats', async (req, res) => {
  try {
    const [totalStudents, totalLecturers] = await Promise.all([
      Student.countDocuments(),
      Lecturer.countDocuments()
    ]);
    res.json({ success: true, data: { totalStudents, totalLecturers } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi server: ' + err.message });
  }
});

module.exports = router;
