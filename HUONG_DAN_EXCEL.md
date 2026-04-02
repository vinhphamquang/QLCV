# Hướng Dẫn Thêm Excel Import/Export Cho Các Trang

## Đã cài đặt
- Component: `frontend/src/components/ExcelButtons.jsx`
- Thư viện: `xlsx`, `file-saver`

## Cách sử dụng cho các trang khác

### Bước 1: Import component
```javascript
import ExcelButtons from '../components/ExcelButtons';
```

### Bước 2: Định nghĩa columns
```javascript
const excelColumns = [
  { header: 'Tên cột trong Excel', key: 'tenTruongTrongData' },
  { header: 'Họ Tên', key: 'hoTen' },
  { header: 'Ngày', key: 'ngay' }
];
```

### Bước 3: Tạo hàm xử lý import
```javascript
const handleImportExcel = async (importedData) => {
  if (!importedData || importedData.length === 0) {
    alert('File Excel không có dữ liệu!');
    return;
  }

  try {
    let successCount = 0;
    let errorCount = 0;

    for (const item of importedData) {
      try {
        await axios.post('http://localhost:5000/api/YOUR_ENDPOINT', item);
        successCount++;
      } catch (error) {
        errorCount++;
        console.error('Lỗi:', item, error);
      }
    }

    alert(`Nhập thành công ${successCount} bản ghi${errorCount > 0 ? `, ${errorCount} lỗi` : ''}`);
    fetchData(); // Reload dữ liệu
  } catch (error) {
    alert('Có lỗi xảy ra!');
  }
};
```

### Bước 4: Thêm component vào JSX
```javascript
<ExcelButtons
  data={yourDataArray}
  columns={excelColumns}
  fileName="TenFile"
  onImport={handleImportExcel}
/>
```

## Ví dụ cho các trang

### WeeklyTasks (Công việc tuần)
```javascript
const excelColumns = [
  { header: 'Thứ', key: 'thu' },
  { header: 'Nội Dung Công Việc', key: 'noiDungCongViec' },
  { header: 'Thời Gian', key: 'thoiGian' },
  { header: 'Địa Điểm', key: 'diaDiem' },
  { header: 'Ghi Chú', key: 'ghiChu' }
];
```

### InspectionManagement (Kiểm tra nội bộ)
```javascript
const excelColumns = [
  { header: 'Tháng', key: 'thang' },
  { header: 'Tên Giáo Viên', key: 'tenGiaoVien' },
  { header: 'Nội Dung Kiểm Tra', key: 'noiDungKiemTra' },
  { header: 'Tiết Kiểm Tra', key: 'tietKiemTra' },
  { header: 'Thời Gian Kiểm Tra', key: 'thoiGianKiemTra' }
];
```

### ExamPeriodInspection (Kiểm tra các kỳ)
```javascript
const excelColumns = [
  { header: 'Môn', key: 'mon' },
  { header: 'Ngày', key: 'ngay' },
  { header: 'Nội Dung Còn Hạn Chế', key: 'noiDungConHanChe' },
  { header: 'Rút Kinh Nghiệm', key: 'rutKinhNghiem' },
  { header: 'Ghi Chú', key: 'ghiChu' }
];
```

## Lưu ý
- File Excel phải có header khớp với `header` trong `excelColumns`
- Dữ liệu sẽ được map tự động từ header sang key
- Import sẽ gọi API POST cho từng dòng dữ liệu
- Export sẽ xuất tất cả dữ liệu hiện có trong bảng
