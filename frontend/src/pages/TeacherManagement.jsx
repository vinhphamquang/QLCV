import { useState, useEffect } from 'react';
import axios from 'axios';
import './TeacherManagement.css';

function TeacherManagement() {
  const [teachers, setTeachers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
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

  return (
    <div className="teacher-management">
      <div className="header-section">
        <h2>Quản Lý Giáo Viên</h2>
        <button className="btn-add" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Đóng Form' : '+ Thêm Giáo Viên'}
        </button>
      </div>

      {showForm && (
        <div className="form-container">
          <h3>{editingId ? 'Chỉnh Sửa Giáo Viên' : 'Thêm Giáo Viên Mới'}</h3>
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
        </div>
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
            {teachers.map((teacher, index) => (
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
        {teachers.length === 0 && (
          <p className="no-data">Chưa có dữ liệu giáo viên</p>
        )}
      </div>
    </div>
  );
}

export default TeacherManagement;
