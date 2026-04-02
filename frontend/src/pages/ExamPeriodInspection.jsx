import { useState, useEffect } from 'react';
import axios from 'axios';
import './ExamPeriodInspection.css';
import ExcelButtons from '../components/ExcelButtons';

function ExamPeriodInspection() {
  const [inspections, setInspections] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    mon: '',
    ngay: '',
    noiDungConHanChe: '',
    rutKinhNghiem: '',
    ghiChu: ''
  });

  useEffect(() => {
    fetchInspections();
  }, []);

  const fetchInspections = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/exam-period-inspections');
      setInspections(response.data);
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`http://localhost:5000/api/exam-period-inspections/${editingId}`, formData);
      } else {
        await axios.post('http://localhost:5000/api/exam-period-inspections', formData);
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
      mon: inspection.mon,
      ngay: new Date(inspection.ngay).toISOString().split('T')[0],
      noiDungConHanChe: inspection.noiDungConHanChe || '',
      rutKinhNghiem: inspection.rutKinhNghiem || '',
      ghiChu: inspection.ghiChu || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa bản ghi này?')) {
      try {
        await axios.delete(`http://localhost:5000/api/exam-period-inspections/${id}`);
        fetchInspections();
      } catch (error) {
        console.error('Lỗi khi xóa:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      mon: '',
      ngay: '',
      noiDungConHanChe: '',
      rutKinhNghiem: '',
      ghiChu: ''
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
    { header: 'Môn', key: 'mon' },
    { header: 'Ngày', key: 'ngay' },
    { header: 'Nội Dung Còn Hạn Chế', key: 'noiDungConHanChe' },
    { header: 'Rút Kinh Nghiệm', key: 'rutKinhNghiem' },
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
          await axios.post('http://localhost:5000/api/exam-period-inspections', item);
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
      (item.mon || '').toLowerCase().includes(searchLower) ||
      (item.noiDungConHanChe || '').toLowerCase().includes(searchLower) ||
      (item.rutKinhNghiem || '').toLowerCase().includes(searchLower) ||
      (item.ghiChu || '').toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="exam-period-inspection">
      <div className="header-section">
        <h2>Công Tác Kiểm Tra Các Kỳ</h2>
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
            data={inspections}
            columns={excelColumns}
            fileName="KiemTraCacKy"
            onImport={handleImportExcel}
          />
          <button className="btn-add" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Đóng Form' : '+ Thêm Bản Ghi'}
          </button>
        </div>
      </div>

      {showForm && (
        <div className="form-container">
          <h3>{editingId ? 'Chỉnh Sửa Bản Ghi' : 'Thêm Bản Ghi Mới'}</h3>
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
                <label>Ngày *</label>
                <input
                  type="date"
                  value={formData.ngay}
                  onChange={(e) => setFormData({...formData, ngay: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Nội Dung Còn Hạn Chế</label>
              <textarea
                value={formData.noiDungConHanChe}
                onChange={(e) => setFormData({...formData, noiDungConHanChe: e.target.value})}
                rows="4"
                placeholder="Mô tả những điểm còn hạn chế..."
              />
            </div>

            <div className="form-group">
              <label>Rút Kinh Nghiệm</label>
              <textarea
                value={formData.rutKinhNghiem}
                onChange={(e) => setFormData({...formData, rutKinhNghiem: e.target.value})}
                rows="4"
                placeholder="Những bài học kinh nghiệm rút ra..."
              />
            </div>

            <div className="form-group">
              <label>Ghi Chú</label>
              <textarea
                value={formData.ghiChu}
                onChange={(e) => setFormData({...formData, ghiChu: e.target.value})}
                rows="3"
                placeholder="Ghi chú thêm..."
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
        <table className="exam-period-table">
          <thead>
            <tr>
              <th>STT</th>
              <th>Môn</th>
              <th>Ngày</th>
              <th>Nội Dung Còn Hạn Chế</th>
              <th>Rút Kinh Nghiệm</th>
              <th>Ghi Chú</th>
              <th>Thao Tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredInspections.map((inspection, index) => (
              <tr key={inspection._id}>
                <td>{index + 1}</td>
                <td>{inspection.mon}</td>
                <td>{formatDate(inspection.ngay)}</td>
                <td>{inspection.noiDungConHanChe || '-'}</td>
                <td>{inspection.rutKinhNghiem || '-'}</td>
                <td>{inspection.ghiChu || '-'}</td>
                <td>
                  <button className="btn-edit" onClick={() => handleEdit(inspection)}>Sửa</button>
                  <button className="btn-delete" onClick={() => handleDelete(inspection._id)}>Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredInspections.length === 0 && (
          <p className="no-data">{searchTerm ? 'Không tìm thấy kết quả' : 'Chưa có dữ liệu kiểm tra các kỳ'}</p>
        )}
      </div>
    </div>
  );
}

export default ExamPeriodInspection;
