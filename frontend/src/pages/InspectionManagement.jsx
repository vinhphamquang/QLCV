import { useState, useEffect } from 'react';
import axios from 'axios';
import './InspectionManagement.css';
import ExcelButtons from '../components/ExcelButtons';
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
      <div className="header-section">
        <h2>Quản Lý Công Tác Kiểm Tra Nội Bộ</h2>
        <div className="header-controls">
          <input
            type="text"
            placeholder="🔍 Tìm kiếm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <div className="button-group">
            <ExcelButtons
              data={inspections}
              columns={excelColumns}
              fileName="KiemTraNoiBo"
              onImport={handleImportExcel}
            />
            <button className="btn-add" onClick={() => setShowForm(!showForm)}>
              + Thêm Bản Ghi
            </button>
          </div>
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
