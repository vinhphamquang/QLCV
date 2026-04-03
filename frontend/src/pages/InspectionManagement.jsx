import { useState, useEffect } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import './InspectionManagement.css';
import Modal from '../components/Modal';

function InspectionManagement() {
  const [inspections, setInspections] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    thang: '',
    tenGiaoVien: '',
    noiDungKiemTra: '',
    tietKiemTra: '',
    thoiGianKiemTra: '',
    danhGia: '',
    rutKinhNghiem: ''
  });

  useEffect(() => {
    fetchInspections();
  }, []);

  const fetchInspections = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/inspections');
      setInspections(response.data);
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`http://localhost:5000/api/inspections/${editingId}`, formData);
      } else {
        await axios.post('http://localhost:5000/api/inspections', formData);
      }
      fetchInspections();
      resetForm();
    } catch (error) {
      console.error('Lỗi khi lưu dữ liệu:', error);
    }
  };

  const handleEdit = (inspection) => {
    setEditingId(inspection._id);
    setFormData({
      thang: inspection.thang,
      tenGiaoVien: inspection.tenGiaoVien,
      noiDungKiemTra: inspection.noiDungKiemTra,
      tietKiemTra: inspection.tietKiemTra,
      thoiGianKiemTra: new Date(inspection.thoiGianKiemTra).toISOString().slice(0, 16),
      danhGia: inspection.danhGia || '',
      rutKinhNghiem: inspection.rutKinhNghiem || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa bản ghi này?')) {
      try {
        await axios.delete(`http://localhost:5000/api/inspections/${id}`);
        fetchInspections();
      } catch (error) {
        console.error('Lỗi khi xóa:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      thang: '',
      tenGiaoVien: '',
      noiDungKiemTra: '',
      tietKiemTra: '',
      thoiGianKiemTra: '',
      danhGia: '',
      rutKinhNghiem: ''
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
      minute: '2-digit'
    });
  };

  const excelColumns = [
    { header: 'Tháng', key: 'thang' },
    { header: 'Tên Giáo Viên', key: 'tenGiaoVien' },
    { header: 'Nội Dung Kiểm Tra', key: 'noiDungKiemTra' },
    { header: 'Tiết Kiểm Tra', key: 'tietKiemTra' },
    { header: 'Thời Gian Kiểm Tra', key: 'thoiGianKiemTra' },
    { header: 'Đánh Giá', key: 'danhGia' },
    { header: 'Rút Kinh Nghiệm', key: 'rutKinhNghiem' }
  ];

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
          await axios.post('http://localhost:5000/api/inspections', item);
          successCount++;
        } catch (error) {
          errorCount++;
        }
      }
      alert(`Nhập thành công ${successCount} bản ghi${errorCount > 0 ? `, ${errorCount} lỗi` : ''}`);
      fetchInspections();
    } catch (error) {
      alert('Có lỗi xảy ra!');
    }
  };

  const filteredInspections = inspections.filter(item => {
    const searchLower = searchTerm.toLowerCase();
    return (
      (item.tenGiaoVien || '').toLowerCase().includes(searchLower) ||
      (item.noiDungKiemTra || '').toLowerCase().includes(searchLower) ||
      (item.thang || '').toLowerCase().includes(searchLower) ||
      (item.tietKiemTra || '').toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="inspection-management">
      {/* HEADER */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-6 gap-4">
        <h2 className="text-2xl md:text-[2rem] font-bold text-[#2563eb] whitespace-nowrap">
          Quản Lý Công Tác Kiểm Tra Nội Bộ
        </h2>
        <div className="w-full xl:flex-1 xl:max-w-lg xl:mx-4">
          <div className="relative group">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 group-focus-within:text-[#2563eb] transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Tìm kiếm..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-full focus:outline-none focus:border-[#2563eb] text-sm shadow-sm transition-all bg-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-3 w-full xl:w-auto">
          <label className="flex-1 xl:flex-none justify-center bg-white border border-green-600 text-green-700 hover:bg-green-50 font-medium py-2.5 px-5 rounded shadow-sm transition-colors flex items-center gap-2 text-sm cursor-pointer outline-none">
            <span className="text-lg leading-none">📥</span> Nhập Excel
            <input type="file" accept=".xlsx, .xls" className="hidden" onChange={(e) => {
              const file = e.target.files[0]; if (!file) return;
              const reader = new FileReader();
              reader.onload = (ev) => {
                const data = new Uint8Array(ev.target.result);
                const wb = XLSX.read(data, { type: 'array' });
                const ws = wb.Sheets[wb.SheetNames[0]];
                const rows = XLSX.utils.sheet_to_json(ws);
                const imported = rows.map(row => { const item = {}; excelColumns.forEach(col => { if (row[col.header] !== undefined) item[col.key] = row[col.header]; }); return item; });
                handleImportExcel(imported);
              };
              reader.readAsArrayBuffer(file); e.target.value = '';
            }} />
          </label>
          <button
            onClick={() => {
              if (!inspections || inspections.length === 0) { alert('Không có dữ liệu để xuất!'); return; }
              const exportData = inspections.map(item => { const row = {}; excelColumns.forEach(col => { row[col.header] = item[col.key] || ''; }); return row; });
              const ws = XLSX.utils.json_to_sheet(exportData); const wb2 = XLSX.utils.book_new();
              XLSX.utils.book_append_sheet(wb2, ws, 'Sheet1');
              const buf = XLSX.write(wb2, { bookType: 'xlsx', type: 'array' });
              saveAs(new Blob([buf], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }), `KiemTraNoiBo_${new Date().toISOString().split('T')[0]}.xlsx`);
            }}
            className="flex-1 xl:flex-none justify-center bg-white border border-green-600 text-green-700 hover:bg-green-50 font-medium py-2.5 px-5 rounded shadow-sm transition-colors flex items-center gap-2 text-sm outline-none"
          >
            <span className="text-lg leading-none">📊</span> Xuất Excel
          </button>
          <button
            onClick={() => setShowForm(!showForm)}
            className="w-full sm:w-auto sm:flex-1 xl:flex-none justify-center bg-[#2453c9] hover:bg-blue-800 text-white font-medium py-2.5 px-5 rounded shadow transition-colors flex items-center gap-2 text-sm border-none outline-none"
          >
            <span className="text-lg leading-none">+</span> Thêm Bản Ghi
          </button>
        </div>
      </div>

      {showForm && (
        <Modal 
          isOpen={showForm} 
          onClose={resetForm}
          title={editingId ? 'Chỉnh Sửa Bản Ghi' : 'Thêm Bản Ghi Mới'}
        >
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Tháng *</label>
                <input
                  type="month"
                  value={formData.thang}
                  onChange={(e) => setFormData({...formData, thang: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label>Tên Giáo Viên *</label>
                <input
                  type="text"
                  value={formData.tenGiaoVien}
                  onChange={(e) => setFormData({...formData, tenGiaoVien: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Nội Dung Kiểm Tra *</label>
              <textarea
                value={formData.noiDungKiemTra}
                onChange={(e) => setFormData({...formData, noiDungKiemTra: e.target.value})}
                rows="3"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Tiết Kiểm Tra *</label>
                <input
                  type="text"
                  value={formData.tietKiemTra}
                  onChange={(e) => setFormData({...formData, tietKiemTra: e.target.value})}
                  placeholder="VD: Tiết 1, Tiết 2-3"
                  required
                />
              </div>

              <div className="form-group">
                <label>Thời Gian Kiểm Tra *</label>
                <input
                  type="datetime-local"
                  value={formData.thoiGianKiemTra}
                  onChange={(e) => setFormData({...formData, thoiGianKiemTra: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Đánh Giá</label>
              <textarea
                value={formData.danhGia}
                onChange={(e) => setFormData({...formData, danhGia: e.target.value})}
                rows="3"
              />
            </div>

            <div className="form-group">
              <label>Rút Kinh Nghiệm</label>
              <textarea
                value={formData.rutKinhNghiem}
                onChange={(e) => setFormData({...formData, rutKinhNghiem: e.target.value})}
                rows="3"
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
        <table className="inspection-table">
          <thead>
            <tr>
              <th>STT</th>
              <th>Tháng</th>
              <th>Tên Giáo Viên</th>
              <th>Nội Dung Kiểm Tra</th>
              <th>Tiết Kiểm Tra</th>
              <th>Thời Gian Kiểm Tra</th>
              <th>Đánh Giá</th>
              <th>Rút Kinh Nghiệm</th>
              <th>Thao Tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredInspections.map((inspection, index) => (
              <tr key={inspection._id}>
                <td>{index + 1}</td>
                <td>{inspection.thang}</td>
                <td>{inspection.tenGiaoVien}</td>
                <td>{inspection.noiDungKiemTra}</td>
                <td>{inspection.tietKiemTra}</td>
                <td>{formatDateTime(inspection.thoiGianKiemTra)}</td>
                <td>{inspection.danhGia || '-'}</td>
                <td>{inspection.rutKinhNghiem || '-'}</td>
                <td>
                  <button className="btn-edit" onClick={() => handleEdit(inspection)}>Sửa</button>
                  <button className="btn-delete" onClick={() => handleDelete(inspection._id)}>Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredInspections.length === 0 && (
          <p className="no-data">{searchTerm ? 'Không tìm thấy kết quả' : 'Chưa có dữ liệu kiểm tra nội bộ'}</p>
        )}
      </div>
    </div>
  );
}

export default InspectionManagement;
