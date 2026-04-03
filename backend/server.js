const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/school-management')
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
const teacherRoutes = require('./routes/teacherRoutes');
const inspectionRoutes = require('./routes/inspectionRoutes');
const examPreparationRoutes = require('./routes/examPreparationRoutes');
const examPeriodInspectionRoutes = require('./routes/examPeriodInspectionRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const weeklyTaskRoutes = require('./routes/weeklyTaskRoutes');
const monthlyTaskRoutes = require('./routes/monthlyTaskRoutes');
const competitionRoutes = require('./routes/competitionRoutes');
const examCheckRoutes = require('./routes/examCheckRoutes');
const assignmentRoutes = require('./routes/assignmentChangeRoutes');
const dailyDutyRoutes = require('./routes/dailyDutyRoutes');
const timetableRoutes = require('./routes/timetableChangeRoutes');
const lessonLearnedRoutes = require('./routes/lessonLearnedRoutes');
const holidayRoutes = require('./routes/holidayRoutes');
const keyActivityRoutes = require('./routes/keyActivityRoutes');
const authRoutes = require('./routes/authRoutes');

//api
app.use('/api/teachers', teacherRoutes);
app.use('/api/inspections', inspectionRoutes);
app.use('/api/exam-preparations', examPreparationRoutes);
app.use('/api/exam-period-inspections', examPeriodInspectionRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/weekly-tasks', weeklyTaskRoutes);
app.use('/api/monthly-tasks', monthlyTaskRoutes);
app.use('/api/competitions', competitionRoutes);
app.use('/api/examCheck', examCheckRoutes);
app.use('/api/assignment-changes', assignmentRoutes);
app.use('/api/daily-duties', dailyDutyRoutes);
app.use('/api/timetable-changes', timetableRoutes);
app.use('/api/lessons-learned', lessonLearnedRoutes);
app.use('/api/holidays', holidayRoutes);
app.use('/api/key-activities', keyActivityRoutes);
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
