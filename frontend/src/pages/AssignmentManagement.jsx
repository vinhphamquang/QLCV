import React, { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';

const AssignmentManagement = () => {
  const [assignments, setAssignments] = useState([]);
  const [formData, setFormData] = useState({
    subject: '',
    lessonCount: '',
    startWeek: '',
    endWeek: '',
    notes: ''
  });
  const [editingId, setEditingId] = useState(null);

  const fetchAssignments = async () => {
    try {
      const res = await axiosClient.get('/assignment-changes');
      setAssignments(res.data.data);
    } catch (err) {
      alert('Không thể lấy dữ liệu!');
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axiosClient.put(`/assignment-changes/${editingId}`, formData);
        alert('Cập nhật thành công!');
      } else {
        await axiosClient.post('/assignment-changes', formData);
        alert('Thêm mới thành công!');
      }
      resetForm();
      fetchAssignments();
    } catch (err) {
      alert(err.response?.data?.message || 'Có lỗi xảy ra!');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Thầy có chắc chắn muốn xóa dòng này không?')) {
      try {
        await axiosClient.delete(`/assignment-changes/${id}`);
        fetchAssignments();
      } catch (err) {
        alert('Xóa thất bại!');
      }
    }
  };

  const handleEdit = (item) => {
    setEditingId(item._id);
    setFormData({
      subject: item.subject,
      lessonCount: item.lessonCount,
      startWeek: item.startWeek,
      endWeek: item.endWeek,
      notes: item.notes
    });
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({ subject: '', lessonCount: '', startWeek: '', endWeek: '', notes: '' });
  };

  return (
    <div className="tw:p-8 tw:max-w-7xl tw:mx-auto">
      {/* Tiêu đề trang */}
      <div className="tw:mb-8 tw:border-b-2 tw:border-blue-500 tw:pb-2">
        <h2 className="tw:text-3xl tw:font-extrabold tw:text-gray-800 tw:tracking-tight">
          QUẢN LÝ THAY ĐỔI PHÂN CÔNG TIẾT
        </h2>
        <p className="tw:text-gray-500 tw:mt-1">Cập nhật và điều chỉnh kế hoạch giảng dạy định kỳ</p>
      </div>

      {/* CARD FORM NHẬP LIỆU */}
      <div className="tw:bg-white tw:shadow-xl tw:rounded-xl tw:p-6 tw:mb-10 tw:border tw:border-gray-200">
        <h3 className="tw:text-lg tw:font-bold tw:text-blue-600 tw:mb-5 tw:flex tw:items-center">
          <span className="tw:mr-2">📝</span>
          {editingId ? 'Cập nhật thông tin' : 'Thêm phân công mới'}
        </h3>
        
        <form onSubmit={handleSubmit} className="tw:grid tw:grid-cols-1 md:tw:grid-cols-2 lg:tw:grid-cols-5 tw:gap-4">
          <div className="tw:flex tw:flex-col">
            <label className="tw:text-xs tw:font-bold tw:text-gray-500 tw:uppercase tw:mb-1">Môn học</label>
            <input 
              name="subject" value={formData.subject} onChange={handleChange} required 
              placeholder="Toán, Văn..."
              className="tw:border-2 tw:border-gray-200 tw:rounded-lg tw:px-3 tw:py-2 tw:focus:border-blue-500 tw:outline-none tw:transition-all"
            />
          </div>

          <div className="tw:flex tw:flex-col">
            <label className="tw:text-xs tw:font-bold tw:text-gray-500 tw:uppercase tw:mb-1">Số tiết</label>
            <input 
              name="lessonCount" type="number" value={formData.lessonCount} onChange={handleChange} required 
              className="tw:border-2 tw:border-gray-200 tw:rounded-lg tw:px-3 tw:py-2 tw:focus:border-blue-500 tw:outline-none"
            />
          </div>

          <div className="tw:flex tw:flex-col">
            <label className="tw:text-xs tw:font-bold tw:text-gray-500 tw:uppercase tw:mb-1">Tuần bắt đầu</label>
            <input 
              name="startWeek" type="number" value={formData.startWeek} onChange={handleChange} required 
              className="tw:border-2 tw:border-gray-200 tw:rounded-lg tw:px-3 tw:py-2 tw:focus:border-blue-500 tw:outline-none"
            />
          </div>

          <div className="tw:flex tw:flex-col">
            <label className="tw:text-xs tw:font-bold tw:text-gray-500 tw:uppercase tw:mb-1">Tuần kết thúc</label>
            <input 
              name="endWeek" type="number" value={formData.endWeek} onChange={handleChange} required 
              className="tw:border-2 tw:border-gray-200 tw:rounded-lg tw:px-3 tw:py-2 tw:focus:border-blue-500 tw:outline-none"
            />
          </div>

          <div className="tw:flex tw:flex-col lg:tw:col-span-4">
            <label className="tw:text-xs tw:font-bold tw:text-gray-500 tw:uppercase tw:mb-1">Ghi chú thêm</label>
            <input 
              name="notes" value={formData.notes} onChange={handleChange} 
              placeholder="Nhập ghi chú cho thầy..."
              className="tw:border-2 tw:border-gray-200 tw:rounded-lg tw:px-3 tw:py-2 tw:focus:border-blue-500 tw:outline-none"
            />
          </div>

          <div className="tw:flex tw:items-end tw:gap-2 lg:tw:col-span-1">
            <button 
              type="submit" 
              className={`tw:flex-1 tw:py-2 tw:rounded-lg tw:font-bold tw:text-white tw:transition-all ${editingId ? 'tw:bg-orange-500 tw:hover:bg-orange-600' : 'tw:bg-blue-600 tw:hover:bg-blue-700'}`}
            >
              {editingId ? 'Cập nhật' : 'Thêm ngay'}
            </button>
            {editingId && (
              <button 
                type="button" onClick={resetForm}
                className="tw:bg-gray-400 tw:hover:bg-gray-500 tw:text-white tw:px-4 tw:py-2 tw:rounded-lg tw:font-bold"
              >
                Hủy
              </button>
            )}
          </div>
        </form>
      </div>

      {/* BẢNG DANH SÁCH DỮ LIỆU */}
      <div className="tw:bg-white tw:shadow-2xl tw:rounded-2xl tw:overflow-hidden tw:border tw:border-gray-100">
        <table className="tw:w-full tw:text-left tw:border-collapse">
          <thead>
            <tr className="tw:bg-gray-50 tw:border-b tw:border-gray-200">
              <th className="tw:px-6 tw:py-4 tw:text-xs tw:font-black tw:text-gray-600 tw:uppercase">Môn học</th>
              <th className="tw:px-6 tw:py-4 tw:text-xs tw:font-black tw:text-gray-600 tw:uppercase">Số tiết</th>
              <th className="tw:px-6 tw:py-4 tw:text-xs tw:font-black tw:text-gray-600 tw:uppercase">Thời gian</th>
              <th className="tw:px-6 tw:py-4 tw:text-xs tw:font-black tw:text-gray-600 tw:uppercase">Ghi chú</th>
              <th className="tw:px-6 tw:py-4 tw:text-xs tw:font-black tw:text-gray-600 tw:uppercase tw:text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody className="tw:divide-y tw:divide-gray-100">
            {assignments.length > 0 ? (
              assignments.map((item) => (
                <tr key={item._id} className="tw:hover:bg-blue-50/50 tw:transition-colors">
                  <td className="tw:px-6 tw:py-4 tw:font-bold tw:text-gray-800">{item.subject}</td>
                  <td className="tw:px-6 tw:py-4">
                    <span className="tw:px-3 tw:py-1 tw:bg-purple-100 tw:text-purple-700 tw:rounded-full tw:text-sm tw:font-bold">
                      {item.lessonCount} tiết
                    </span>
                  </td>
                  <td className="tw:px-6 tw:py-4">
                    <div className="tw:text-sm tw:text-gray-700">
                      Tuần <span className="tw:font-bold tw:text-blue-600">{item.startWeek}</span> 
                      <span className="tw:mx-1">→</span> 
                      <span className="tw:font-bold tw:text-blue-600">{item.endWeek}</span>
                    </div>
                  </td>
                  <td className="tw:px-6 tw:py-4 tw:text-sm tw:text-gray-500 tw:italic">
                    {item.notes || '---'}
                  </td>
                  <td className="tw:px-6 tw:py-4">
                    <div className="tw:flex tw:justify-center tw:gap-3">
                      <button 
                        onClick={() => handleEdit(item)} 
                        className="tw:text-blue-500 tw:hover:text-blue-700 tw:font-bold tw:text-sm tw:underline"
                      >
                        Sửa
                      </button>
                      <button 
                        onClick={() => handleDelete(item._id)} 
                        className="tw:text-red-500 tw:hover:text-red-700 tw:font-bold tw:text-sm tw:underline"
                      >
                        Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="tw:px-6 tw:py-20 tw:text-center tw:text-gray-400 tw:italic">
                  Chưa có dữ liệu nào được ghi nhận...
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AssignmentManagement;