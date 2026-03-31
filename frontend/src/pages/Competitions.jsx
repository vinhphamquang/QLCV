import { useState, useEffect } from 'react';
import axios from 'axios';
import './Competitions.css';

function Competitions() {
  const [competitions, setCompetitions] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
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

  return (
    <div className="competitions">
      <div className="header-section">
        <h2>Quản Lý Hội Thi</h2>
        <button className="btn-add" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Đóng Form' : '+ Thêm Hội Thi'}
        </button>
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
            {competitions.map((competition, index) => (
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
        {competitions.length === 0 && (
          <p className="no-data">Chưa có hội thi nào</p>
        )}
      </div>
    </div>
  );
}

export default Competitions;
