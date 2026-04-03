import { useState, useEffect } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import './TeacherManagement.css';
import Modal from '../components/Modal';

function TeacherManagement() {
  const [teachers, setTeachers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    hoTen: '',
    noiDungViPham: '',
    noiDungTuyenDuong: '',
    ngayVang: ''
  });

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/teachers');
      setTeachers(response.data);
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`http://localhost:5000/api/teachers/${editingId}`, formData);
      } else {
        await axios.post('http://localhost:5000/api/teachers', formData);
      }
      fetchTeachers();
      resetForm();
    } catch (error) {
      console.error('Lỗi khi lưu dữ liệu:', error);
    }
  };

  const handleEdit = (teacher) => {
    setEditingId(teacher._id);
    setFormData({
      hoTen: teacher.hoTen,
      noiDungViPham: teacher.noiDungViPham || '',
      noiDungTuyenDuong: teacher.noiDungTuyenDuong || '',
      ngayVang: teacher.ngayVang ? new Date(teacher.ngayVang).toISOString().split('T')[0] : ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa giáo viên này?')) {
      try {
        await axios.delete(`http://localhost:5000/api/teachers/${id}`);
        fetchTeachers();
      } catch (error) {
        console.error('Lỗi khi xóa:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      hoTen: '',
      noiDungViPham: '',
      noiDungTuyenDuong: '',
      ngayVang: ''
    });
    setEditingId(null);
    setShowForm(false);
  };

  const formatDateTime = (date) => {
    return new Date(date).toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  // Cấu hình columns cho Excel
  const excelColumns = [
    { header: 'Họ Tên', key: 'hoTen' },
    { header: 'Nội Dung Vi Phạm', key: 'noiDungViPham' },
    { header: 'Nội Dung Làm Việc Tốt / Tuyên Dương', key: 'noiDungTuyenDuong' },
    { header: 'Ngày Vắng', key: 'ngayVang' }
  ];

  // Xử lý import Excel
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
          await axios.post('http://localhost:5000/api/teachers', item);
          successCount++;
        } catch (error) {
          errorCount++;
          console.error('Lỗi khi thêm:', item, error);
        }
      }

      alert(`Nhập thành công ${successCount} bản ghi${errorCount > 0 ? `, ${errorCount} bản ghi lỗi` : ''}`);
      fetchTeachers();
    } catch (error) {
      alert('Có lỗi xảy ra khi nhập dữ liệu!');
      console.error(error);
    }
  };

  const filteredTeachers = teachers.filter(teacher => {
    const searchLower = searchTerm.toLowerCase();
    return (
      teacher.hoTen.toLowerCase().includes(searchLower) ||
      (teacher.noiDungViPham || '').toLowerCase().includes(searchLower) ||
      (teacher.noiDungTuyenDuong || '').toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="teacher-management">
      {/* HEADER */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-6 gap-4">

        <h2 className="text-2xl md:text-[2rem] font-bold text-[#2563eb] whitespace-nowrap">
          Quản Lý Giáo Viên
        </h2>

        {/* THANH TÌM KIẾM */}
        <div className="w-full xl:flex-1 xl:max-w-lg xl:mx-4">
          <div className="relative group">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 group-focus-within:text-[#2563eb] transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Tìm kiếm giáo viên..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-full focus:outline-none focus:border-[#2563eb] text-sm shadow-sm transition-all bg-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* NHÓM NÚT */}
        <div className="flex flex-wrap gap-3 w-full xl:w-auto">
          <label className="flex-1 xl:flex-none justify-center bg-white border border-green-600 text-green-700 hover:bg-green-50 font-medium py-2.5 px-5 rounded shadow-sm transition-colors flex items-center gap-2 text-sm cursor-pointer outline-none">
            <span className="text-lg leading-none">📥</span> Nhập Excel
            <input
              type="file"
              accept=".xlsx, .xls"
              onChange={(e) => {
                const file = e.target.files[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = (event) => {
                  const data = new Uint8Array(event.target.result);
                  const workbook = XLSX.read(data, { type: 'array' });
                  const worksheet = workbook.Sheets[workbook.SheetNames[0]];
                  const jsonData = XLSX.utils.sheet_to_json(worksheet);
                  const importedData = jsonData.map(row => {
                    const item = {};
                    excelColumns.forEach(col => {
                      if (row[col.header] !== undefined) item[col.key] = row[col.header];
                    });
                    return item;
                  });
                  handleImportExcel(importedData);
                };
                reader.readAsArrayBuffer(file);
                e.target.value = '';
              }}
              className="hidden"
            />
          </label>

          <button
            onClick={() => {
              if (!teachers || teachers.length === 0) { alert('Không có dữ liệu để xuất!'); return; }
              const exportData = teachers.map(item => {
                const row = {};
                excelColumns.forEach(col => { row[col.header] = item[col.key] || ''; });
                return row;
              });
              const ws = XLSX.utils.json_to_sheet(exportData);
              const wb = XLSX.utils.book_new();
              XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
              const buf = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
              saveAs(new Blob([buf], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }), `DanhSachGiaoVien_${new Date().toISOString().split('T')[0]}.xlsx`);
            }}
            className="flex-1 xl:flex-none justify-center bg-white border border-green-600 text-green-700 hover:bg-green-50 font-medium py-2.5 px-5 rounded shadow-sm transition-colors flex items-center gap-2 text-sm outline-none"
          >
            <span className="text-lg leading-none">📊</span> Xuất Excel
          </button>

          <button
            onClick={() => setShowForm(!showForm)}
            className="w-full sm:w-auto sm:flex-1 xl:flex-none justify-center bg-[#2453c9] hover:bg-blue-800 text-white font-medium py-2.5 px-5 rounded shadow transition-colors flex items-center gap-2 text-sm border-none outline-none"
          >
            <span className="text-lg leading-none">+</span> Thêm Giáo Viên
          </button>
        </div>
      </div>

      {showForm && (
        <Modal 
          isOpen={showForm} 
          onClose={resetForm}
          title={editingId ? 'Chỉnh Sửa Giáo Viên' : 'Thêm Giáo Viên Mới'}
        >
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Họ Tên *</label>
              <input
                type="text"
                value={formData.hoTen}
                onChange={(e) => setFormData({...formData, hoTen: e.target.value})}
                required
              />
            </div>

            <div className="form-group">
              <label>Nội Dung Vi Phạm</label>
              <textarea
                value={formData.noiDungViPham}
                onChange={(e) => setFormData({...formData, noiDungViPham: e.target.value})}
                rows="3"
              />
            </div>

            <div className="form-group">
              <label>Nội Dung Làm Việc Tốt / Tuyên Dương</label>
              <textarea
                value={formData.noiDungTuyenDuong}
                onChange={(e) => setFormData({...formData, noiDungTuyenDuong: e.target.value})}
                rows="3"
              />
            </div>

            <div className="form-group">
              <label>Ngày Vắng</label>
              <input
                type="date"
                value={formData.ngayVang}
                onChange={(e) => setFormData({...formData, ngayVang: e.target.value})}
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-submit">
                {editingId ? 'Cập Nhật' : 'Thêm Mới'}
              </button>
              <button type="button" className="btn-cancel" onClick={resetForm}>
                Hủy
              </button>
            </div>
          </form>
        </Modal>
      )}

      <div className="table-container">
        <table className="teacher-table">
          <thead>
            <tr>
              <th>STT</th>
              <th>Họ Tên</th>
              <th>Nội Dung Vi Phạm</th>
              <th>Nội Dung Làm Việc Tốt / Tuyên Dương</th>
              <th>Ngày Vắng</th>
              <th>Ngày Nhập</th>
              <th>Thao Tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredTeachers.map((teacher, index) => (
              <tr key={teacher._id}>
                <td>{index + 1}</td>
                <td>{teacher.hoTen}</td>
                <td>{teacher.noiDungViPham || '-'}</td>
                <td>{teacher.noiDungTuyenDuong || '-'}</td>
                <td>{teacher.ngayVang ? new Date(teacher.ngayVang).toLocaleDateString('vi-VN') : '-'}</td>
                <td>{formatDateTime(teacher.ngayNhap)}</td>
                <td>
                  <button className="btn-edit" onClick={() => handleEdit(teacher)}>Sửa</button>
                  <button className="btn-delete" onClick={() => handleDelete(teacher._id)}>Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredTeachers.length === 0 && (
          <p className="no-data">{searchTerm ? 'Không tìm thấy kết quả' : 'Chưa có dữ liệu giáo viên'}</p>
        )}
      </div>
    </div>
  );
}

export default TeacherManagement;
