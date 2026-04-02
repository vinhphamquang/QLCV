import { useState, useEffect } from 'react';
import axios from 'axios';
import './Competitions.css';
import ExcelButtons from '../components/ExcelButtons';

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
      <div className="header-section">
        <h2>Quản Lý Hội Thi</h2>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <input
            type="text"
            placeholder="🔍 Tìm kiếm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: '10px 16px',
              border: '2px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '14px',
              width: '250px',
              outline: 'none'
            }}
            onFocus={(e) => e.target.style.borderColor = '#2563eb'}
            onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
          />
          <ExcelButtons
            data={competitions}
            columns={excelColumns}
            fileName="HoiThi"
            onImport={handleImportExcel}
          />
          <button className="btn-add" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Đóng Form' : '+ Thêm Hội Thi'}
          </button>
        </div>
      </div>

      {showForm && (
        <div className="form-container">
          <h3>{editingId ? 'Chỉnh Sửa Hội Thi' : 'Thêm Hội Thi Mới'}</h3>
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
        </div>
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
