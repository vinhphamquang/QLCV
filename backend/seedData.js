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

// Helper function to get date
const getDate = (daysFromNow) => {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date;
};

const seedData = async () => {
  try {
    console.log('🌱 Bắt đầu thêm dữ liệu mẫu...\n');

    // 1. Kiểm tra nội bộ
    console.log('📋 Thêm Kiểm tra nội bộ...');
    const inspections = [
      {
        thang: '2026-04',
        tenGiaoVien: 'Nguyễn Văn A',
        noiDungKiemTra: 'Kiểm tra giảng dạy môn Toán lớp 10A1',
        tietKiemTra: 'Tiết 3',
        thoiGianKiemTra: getDate(1), // Ngày mai
        danhGia: '',
        rutKinhNghiem: ''
      },
      {
        thang: '2026-04',
        tenGiaoVien: 'Trần Thị B',
        noiDungKiemTra: 'Kiểm tra giảng dạy môn Văn lớp 11A2',
        tietKiemTra: 'Tiết 4-5',
        thoiGianKiemTra: getDate(3), // 3 ngày nữa
        danhGia: '',
        rutKinhNghiem: ''
      }
    ];
    await Inspection.insertMany(inspections);
    console.log(`✅ Đã thêm ${inspections.length} kiểm tra nội bộ\n`);

    // 2. Kiểm tra các kỳ
    console.log('📝 Thêm Kiểm tra các kỳ...');
    const examPeriods = [
      {
        mon: 'Toán',
        ngay: getDate(2),
        noiDungConHanChe: 'Cần chuẩn bị đề thi giữa kỳ',
        rutKinhNghiem: '',
        ghiChu: 'Ưu tiên các dạng bài tập nâng cao'
      },
      {
        mon: 'Tiếng Anh',
        ngay: getDate(5),
        noiDungConHanChe: 'Kiểm tra kỹ năng nghe',
        rutKinhNghiem: '',
        ghiChu: 'Chuẩn bị thiết bị âm thanh'
      }
    ];
    await ExamPeriodInspection.insertMany(examPeriods);
    console.log(`✅ Đã thêm ${examPeriods.length} kiểm tra các kỳ\n`);

    // 3. Công việc tuần
    console.log('📅 Thêm Công việc tuần...');
    const weeklyTasks = [
      {
        thu: 'Thứ 2',
        noiDungCongViec: 'Họp tổ chuyên môn Toán - Lý',
        thoiGian: getDate(0), // Hôm nay
        diaDiem: 'Phòng họp tầng 2',
        ghiChu: 'Mang theo giáo án',
        daHoanThanh: false
      },
      {
        thu: 'Thứ 4',
        noiDungCongViec: 'Kiểm tra sổ đầu bài học sinh',
        thoiGian: getDate(2),
        diaDiem: 'Văn phòng',
        ghiChu: 'Lớp 10A1, 10A2',
        daHoanThanh: false
      },
      {
        thu: 'Thứ 6',
        noiDungCongViec: 'Họp phụ huynh học sinh yếu kém',
        thoiGian: getDate(4),
        diaDiem: 'Hội trường',
        ghiChu: 'Chuẩn bị danh sách học sinh',
        daHoanThanh: false
      }
    ];
    await WeeklyTask.insertMany(weeklyTasks);
    console.log(`✅ Đã thêm ${weeklyTasks.length} công việc tuần\n`);

    // 4. Công việc tháng
    console.log('📆 Thêm Công việc tháng...');
    const monthlyTasks = [
      {
        tuan: 'Tuần 1',
        thu: 'Thứ 3',
        noiDung: 'Nộp kế hoạch giảng dạy tháng 4',
        thoiGian: getDate(1),
        giaoViec: 'Tổ trưởng chuyên môn',
        ghiChu: 'Deadline: 17h00'
      },
      {
        tuan: 'Tuần 2',
        thu: 'Thứ 5',
        noiDung: 'Tổ chức thi học sinh giỏi cấp trường',
        thoiGian: getDate(6),
        giaoViec: 'Ban giám hiệu',
        ghiChu: 'Chuẩn bị đề thi và phòng thi'
      }
    ];
    await MonthlyTask.insertMany(monthlyTasks);
    console.log(`✅ Đã thêm ${monthlyTasks.length} công việc tháng\n`);

    // 5. Ra đề kiểm tra
    console.log('📄 Thêm Ra đề kiểm tra...');
    const examPreps = [
      {
        mon: 'Vật Lý',
        ngayNop: getDate(2),
        nguoiNop: 'Phạm Văn C',
        nguoiRaDe: 'Lê Thị D',
        thoiGianLamBai: '45 phút',
        tot: true,
        noiDungLoi: '',
        ghiChu: 'Đề kiểm tra 15 phút'
      },
      {
        mon: 'Hóa Học',
        ngayNop: getDate(4),
        nguoiNop: 'Hoàng Văn E',
        nguoiRaDe: 'Nguyễn Thị F',
        thoiGianLamBai: '90 phút',
        tot: true,
        noiDungLoi: '',
        ghiChu: 'Đề thi giữa kỳ'
      }
    ];
    await ExamPreparation.insertMany(examPreps);
    console.log(`✅ Đã thêm ${examPreps.length} ra đề kiểm tra\n`);

    console.log('🎉 Hoàn thành! Đã thêm tất cả dữ liệu mẫu.');
    console.log('\n📊 Tổng kết:');
    console.log(`   - ${inspections.length} Kiểm tra nội bộ`);
    console.log(`   - ${examPeriods.length} Kiểm tra các kỳ`);
    console.log(`   - ${weeklyTasks.length} Công việc tuần`);
    console.log(`   - ${monthlyTasks.length} Công việc tháng`);
    console.log(`   - ${examPreps.length} Ra đề kiểm tra`);
    console.log(`   = ${inspections.length + examPeriods.length + weeklyTasks.length + monthlyTasks.length + examPreps.length} Tổng số bản ghi\n`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Lỗi khi thêm dữ liệu:', error);
    process.exit(1);
  }
};

// Run seed
seedData();
