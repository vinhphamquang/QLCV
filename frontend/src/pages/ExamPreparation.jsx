import { useState, useEffect } from 'react';
import axios from 'axios';
import './ExamPreparation.css';

function ExamPreparation() {
  const [exams, setExams] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
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

  return (
    <div className="exam-preparation">
      <div className="header-section">
        <h2>Quản Lý Công Tác Ra Đề Kiểm Tra</h2>
        <button className="btn-add" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Đóng Form' : '+ Thêm Đề Kiểm Tra'}
        </button>
      </div>

      {showForm && (
        <div className="form-container">
          <h3>{editingId ? 'Chỉnh Sửa Đề Kiểm Tra' : 'Thêm Đề Kiểm Tra Mới'}</h3>
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
        </div>
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
            {exams.map((exam, index) => (
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
        {exams.length === 0 && (
          <p className="no-data">Chưa có dữ liệu đề kiểm tra</p>
        )}
      </div>
    </div>
  );
}

export default ExamPreparation;
