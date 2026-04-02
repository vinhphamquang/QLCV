const mongoose = require('mongoose');
require('dotenv').config();

const Inspection = require('./models/Inspection');
const ExamPeriodInspection = require('./models/ExamPeriodInspection');
const WeeklyTask = require('./models/WeeklyTask');
const MonthlyTask = require('./models/MonthlyTask');
const ExamPreparation = require('./models/ExamPreparation');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/school-management')
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

const clearData = async () => {
  try {
    console.log('🗑️  Bắt đầu xóa dữ liệu...\n');

    const results = await Promise.all([
      Inspection.deleteMany({}),
      ExamPeriodInspection.deleteMany({}),
      WeeklyTask.deleteMany({}),
      MonthlyTask.deleteMany({}),
      ExamPreparation.deleteMany({})
    ]);

    console.log('✅ Đã xóa dữ liệu:');
    console.log(`   - ${results[0].deletedCount} Kiểm tra nội bộ`);
    console.log(`   - ${results[1].deletedCount} Kiểm tra các kỳ`);
    console.log(`   - ${results[2].deletedCount} Công việc tuần`);
    console.log(`   - ${results[3].deletedCount} Công việc tháng`);
    console.log(`   - ${results[4].deletedCount} Ra đề kiểm tra\n`);

    console.log('🎉 Hoàn thành xóa dữ liệu!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Lỗi khi xóa dữ liệu:', error);
    process.exit(1);
  }
};

// Run clear
clearData();
