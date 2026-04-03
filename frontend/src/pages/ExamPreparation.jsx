import { useState, useEffect } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import './ExamPreparation.css';
import Modal from '../components/Modal';

function ExamPreparation() {
  const [exams, setExams] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    mon: '',
    ngayNop: '',
    nguoiNop: '',
    nguoiRaDe: '',
    thoiGianLamBai: '',
    tot: true,
    noiDungLoi: '',
    ghiChu: ''
  });

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/exam-preparations');
      setExams(response.data);
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`http://localhost:5000/api/exam-preparations/${editingId}`, formData);
      } else {
        await axios.post('http://localhost:5000/api/exam-preparations', formData);
      }
      fetchExams();
      resetForm();
    } catch (error) {
      console.error('Lỗi khi lưu dữ liệu:', error);
    }
  };

  const handleEdit = (exam) => {
    setEditingId(exam._id);
    setFormData({
      mon: exam.mon,
      ngayNop: new Date(exam.ngayNop).toISOString().split('T')[0],
      nguoiNop: exam.nguoiNop,
      nguoiRaDe: exam.nguoiRaDe,
      thoiGianLamBai: exam.thoiGianLamBai,
      tot: exam.tot,
      noiDungLoi: exam.noiDungLoi || '',
      ghiChu: exam.ghiChu || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa bản ghi này?')) {
      try {
        await axios.delete(`http://localhost:5000/api/exam-preparations/${id}`);
        fetchExams();
      } catch (error) {
        console.error('Lỗi khi xóa:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      mon: '',
      ngayNop: '',
      nguoiNop: '',
      nguoiRaDe: '',
      thoiGianLamBai: '',
      tot: true,
      noiDungLoi: '',
      ghiChu: ''
    });
    setEditingId(null);
    setShowForm(false);
  };

  const excelColumns = [
    { header: 'Môn', key: 'mon' },
    { header: 'Ngày Nộp', key: 'ngayNop' },
    { header: 'Người Nộp', key: 'nguoiNop' },
    { header: 'Người Ra Đề', key: 'nguoiRaDe' },
    { header: 'Thời Gian Làm Bài', key: 'thoiGianLamBai' },
    { header: 'Nội Dung Lỗi', key: 'noiDungLoi' },
    { header: 'Ghi Chú', key: 'ghiChu' }
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
          await axios.post('http://localhost:5000/api/exam-preparations', item);
          successCount++;
        } catch (error) {
          errorCount++;
        }
      }
      alert(`Nhập thành công ${successCount} bản ghi${errorCount > 0 ? `, ${errorCount} lỗi` : ''}`);
      fetchExams();
    } catch (error) {
      alert('Có lỗi xảy ra!');
    }
  };

  const filteredExams = exams.filter(item => {
    const searchLower = searchTerm.toLowerCase();
    return (
      (item.mon || '').toLowerCase().includes(searchLower) ||
      (item.nguoiNop || '').toLowerCase().includes(searchLower) ||
      (item.nguoiRaDe || '').toLowerCase().includes(searchLower) ||
      (item.thoiGianLamBai || '').toLowerCase().includes(searchLower) ||
      (item.noiDungLoi || '').toLowerCase().includes(searchLower) ||
      (item.ghiChu || '').toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="exam-preparation">
      {/* HEADER */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-6 gap-4">
        <h2 className="text-2xl md:text-[2rem] font-bold text-[#2563eb] whitespace-nowrap">
          Quản Lý Công Tác Ra Đề Kiểm Tra
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
              if (!exams || exams.length === 0) { alert('Không có dữ liệu để xuất!'); return; }
              const exportData = exams.map(item => { const row = {}; excelColumns.forEach(col => { row[col.header] = item[col.key] || ''; }); return row; });
              const ws = XLSX.utils.json_to_sheet(exportData); const wb2 = XLSX.utils.book_new();
              XLSX.utils.book_append_sheet(wb2, ws, 'Sheet1');
              const buf = XLSX.write(wb2, { bookType: 'xlsx', type: 'array' });
              saveAs(new Blob([buf], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }), `RaDeKiemTra_${new Date().toISOString().split('T')[0]}.xlsx`);
            }}
            className="flex-1 xl:flex-none justify-center bg-white border border-green-600 text-green-700 hover:bg-green-50 font-medium py-2.5 px-5 rounded shadow-sm transition-colors flex items-center gap-2 text-sm outline-none"
          >
            <span className="text-lg leading-none">📊</span> Xuất Excel
          </button>
          <button
            onClick={() => setShowForm(!showForm)}
            className="w-full sm:w-auto sm:flex-1 xl:flex-none justify-center bg-[#2453c9] hover:bg-blue-800 text-white font-medium py-2.5 px-5 rounded shadow transition-colors flex items-center gap-2 text-sm border-none outline-none"
          >
            <span className="text-lg leading-none">+</span> Thêm Đề Kiểm Tra
          </button>
        </div>
      </div>

      {showForm && (
        <Modal 
          isOpen={showForm} 
          onClose={resetForm}
          title={editingId ? 'Chỉnh Sửa Đề Kiểm Tra' : 'Thêm Đề Kiểm Tra Mới'}
        >
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Môn *</label>
                <input
                  type="text"
                  value={formData.mon}
                  onChange={(e) => setFormData({...formData, mon: e.target.value})}
                  placeholder="VD: Toán, Văn, Anh..."
                  required
                />
              </div>

              <div className="form-group">
                <label>Ngày Nộp *</label>
                <input
                  type="date"
                  value={formData.ngayNop}
                  onChange={(e) => setFormData({...formData, ngayNop: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Người Nộp *</label>
                <input
                  type="text"
                  value={formData.nguoiNop}
                  onChange={(e) => setFormData({...formData, nguoiNop: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label>Người Ra Đề *</label>
                <input
                  type="text"
                  value={formData.nguoiRaDe}
                  onChange={(e) => setFormData({...formData, nguoiRaDe: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Thời Gian Làm Bài *</label>
                <input
                  type="text"
                  value={formData.thoiGianLamBai}
                  onChange={(e) => setFormData({...formData, thoiGianLamBai: e.target.value})}
                  placeholder="VD: 45 phút, 90 phút..."
                  required
                />
              </div>

              <div className="form-group">
                <label>Trạng Thái</label>
                <select
                  value={formData.tot}
                  onChange={(e) => setFormData({...formData, tot: e.target.value === 'true'})}
                >
                  <option value="true">Tốt</option>
                  <option value="false">Có Lỗi</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Nội Dung Lỗi</label>
              <textarea
                value={formData.noiDungLoi}
                onChange={(e) => setFormData({...formData, noiDungLoi: e.target.value})}
                rows="3"
                placeholder="Ghi rõ nội dung lỗi nếu có..."
              />
            </div>

            <div className="form-group">
              <label>Ghi Chú</label>
              <textarea
                value={formData.ghiChu}
                onChange={(e) => setFormData({...formData, ghiChu: e.target.value})}
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
        <table className="exam-table">
          <thead>
            <tr>
              <th>STT</th>
              <th>Môn</th>
              <th>Ngày Nộp</th>
              <th>Người Nộp</th>
              <th>Người Ra Đề</th>
              <th>Thời Gian Làm Bài</th>
              <th>Trạng Thái</th>
              <th>Nội Dung Lỗi</th>
              <th>Ghi Chú</th>
              <th>Thao Tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredExams.map((exam, index) => (
              <tr key={exam._id}>
                <td>{index + 1}</td>
                <td>{exam.mon}</td>
                <td>{new Date(exam.ngayNop).toLocaleDateString('vi-VN')}</td>
                <td>{exam.nguoiNop}</td>
                <td>{exam.nguoiRaDe}</td>
                <td>{exam.thoiGianLamBai}</td>
                <td>
                  <span className={`status ${exam.tot ? 'status-good' : 'status-error'}`}>
                    {exam.tot ? 'Tốt' : 'Có Lỗi'}
                  </span>
                </td>
                <td>{exam.noiDungLoi || '-'}</td>
                <td>{exam.ghiChu || '-'}</td>
                <td>
                  <button className="btn-edit" onClick={() => handleEdit(exam)}>Sửa</button>
                  <button className="btn-delete" onClick={() => handleDelete(exam._id)}>Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredExams.length === 0 && (
          <p className="no-data">{searchTerm ? 'Không tìm thấy kết quả' : 'Chưa có dữ liệu đề kiểm tra'}</p>
        )}
      </div>
    </div>
  );
}

export default ExamPreparation;
