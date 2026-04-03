import { useState, useEffect } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import './Competitions.css';
import Modal from '../components/Modal';

function Competitions() {
  const [competitions, setCompetitions] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    tenHoiThi: '',
    giaoViec: '',
    thoiGianHoanThanh: '',
    thoiGianThamGiaCacCap: ''
  });

  useEffect(() => {
    fetchCompetitions();
  }, []);

  const fetchCompetitions = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/competitions');
      setCompetitions(response.data);
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`http://localhost:5000/api/competitions/${editingId}`, formData);
      } else {
        await axios.post('http://localhost:5000/api/competitions', formData);
      }
      fetchCompetitions();
      resetForm();
    } catch (error) {
      console.error('Lỗi khi lưu dữ liệu:', error);
    }
  };

  const handleEdit = (competition) => {
    setEditingId(competition._id);
    setFormData({
      tenHoiThi: competition.tenHoiThi,
      giaoViec: competition.giaoViec,
      thoiGianHoanThanh: new Date(competition.thoiGianHoanThanh).toISOString().split('T')[0],
      thoiGianThamGiaCacCap: competition.thoiGianThamGiaCacCap
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa hội thi này?')) {
      try {
        await axios.delete(`http://localhost:5000/api/competitions/${id}`);
        fetchCompetitions();
      } catch (error) {
        console.error('Lỗi khi xóa:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      tenHoiThi: '',
      giaoViec: '',
      thoiGianHoanThanh: '',
      thoiGianThamGiaCacCap: ''
    });
    setEditingId(null);
    setShowForm(false);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const excelColumns = [
    { header: 'Tên Hội Thi', key: 'tenHoiThi' },
    { header: 'Giao Việc', key: 'giaoViec' },
    { header: 'Thời Gian Hoàn Thành', key: 'thoiGianHoanThanh' },
    { header: 'Thời Gian Tham Gia Các Cấp', key: 'thoiGianThamGiaCacCap' }
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
          await axios.post('http://localhost:5000/api/competitions', item);
          successCount++;
        } catch (error) {
          errorCount++;
        }
      }
      alert(`Nhập thành công ${successCount} bản ghi${errorCount > 0 ? `, ${errorCount} lỗi` : ''}`);
      fetchCompetitions();
    } catch (error) {
      alert('Có lỗi xảy ra!');
    }
  };

  const filteredCompetitions = competitions.filter(item => {
    const searchLower = searchTerm.toLowerCase();
    return (
      (item.tenHoiThi || '').toLowerCase().includes(searchLower) ||
      (item.giaoViec || '').toLowerCase().includes(searchLower) ||
      (item.thoiGianThamGiaCacCap || '').toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="competitions">
      {/* HEADER */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-6 gap-4">
        <h2 className="text-2xl md:text-[2rem] font-bold text-[#2563eb] whitespace-nowrap">
          Quản Lý Hội Thi
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
              if (!competitions || competitions.length === 0) { alert('Không có dữ liệu để xuất!'); return; }
              const exportData = competitions.map(item => { const row = {}; excelColumns.forEach(col => { row[col.header] = item[col.key] || ''; }); return row; });
              const ws = XLSX.utils.json_to_sheet(exportData); const wb2 = XLSX.utils.book_new();
              XLSX.utils.book_append_sheet(wb2, ws, 'Sheet1');
              const buf = XLSX.write(wb2, { bookType: 'xlsx', type: 'array' });
              saveAs(new Blob([buf], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }), `HoiThi_${new Date().toISOString().split('T')[0]}.xlsx`);
            }}
            className="flex-1 xl:flex-none justify-center bg-white border border-green-600 text-green-700 hover:bg-green-50 font-medium py-2.5 px-5 rounded shadow-sm transition-colors flex items-center gap-2 text-sm outline-none"
          >
            <span className="text-lg leading-none">📊</span> Xuất Excel
          </button>
          <button
            onClick={() => setShowForm(!showForm)}
            className="w-full sm:w-auto sm:flex-1 xl:flex-none justify-center bg-[#2453c9] hover:bg-blue-800 text-white font-medium py-2.5 px-5 rounded shadow transition-colors flex items-center gap-2 text-sm border-none outline-none"
          >
            <span className="text-lg leading-none">+</span> Thêm Hội Thi
          </button>
        </div>
      </div>

      {showForm && (
        <Modal 
          isOpen={showForm} 
          onClose={resetForm}
          title={editingId ? 'Chỉnh Sửa Hội Thi' : 'Thêm Hội Thi Mới'}
        >
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Tên Hội Thi *</label>
              <input
                type="text"
                value={formData.tenHoiThi}
                onChange={(e) => setFormData({...formData, tenHoiThi: e.target.value})}
                placeholder="VD: Hội thi giáo viên dạy giỏi..."
                required
              />
            </div>

            <div className="form-group">
              <label>Giao Việc *</label>
              <input
                type="text"
                value={formData.giaoViec}
                onChange={(e) => setFormData({...formData, giaoViec: e.target.value})}
                placeholder="Người được giao nhiệm vụ..."
                required
              />
            </div>

            <div className="form-group">
              <label>Thời Gian Hoàn Thành *</label>
              <input
                type="date"
                value={formData.thoiGianHoanThanh}
                onChange={(e) => setFormData({...formData, thoiGianHoanThanh: e.target.value})}
                required
              />
            </div>

            <div className="form-group">
              <label>Thời Gian Tham Gia Các Cấp *</label>
              <textarea
                value={formData.thoiGianThamGiaCacCap}
                onChange={(e) => setFormData({...formData, thoiGianThamGiaCacCap: e.target.value})}
                rows="4"
                placeholder="VD: Cấp trường: 15/03/2024&#10;Cấp huyện: 20/03/2024&#10;Cấp tỉnh: 25/03/2024"
                required
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
        <table className="competitions-table">
          <thead>
            <tr>
              <th>STT</th>
              <th>Tên Hội Thi</th>
              <th>Giao Việc</th>
              <th>Thời Gian Hoàn Thành</th>
              <th>Thời Gian Tham Gia Các Cấp</th>
              <th>Thao Tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredCompetitions.map((competition, index) => (
              <tr key={competition._id}>
                <td>{index + 1}</td>
                <td>{competition.tenHoiThi}</td>
                <td>{competition.giaoViec}</td>
                <td>{formatDate(competition.thoiGianHoanThanh)}</td>
                <td style={{ whiteSpace: 'pre-line' }}>{competition.thoiGianThamGiaCacCap}</td>
                <td>
                  <button className="btn-edit" onClick={() => handleEdit(competition)}>Sửa</button>
                  <button className="btn-delete" onClick={() => handleDelete(competition._id)}>Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredCompetitions.length === 0 && (
          <p className="no-data">{searchTerm ? 'Không tìm thấy kết quả' : 'Chưa có hội thi nào'}</p>
        )}
      </div>
    </div>
  );
}

export default Competitions;
