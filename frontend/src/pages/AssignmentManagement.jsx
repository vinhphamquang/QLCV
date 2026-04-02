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
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchAssignments = async () => {
    try {
      const res = await axiosClient.get('/assignment-changes');
      setAssignments(res.data.data);
    } catch (err) {
      alert('Không thể lấy dữ liệu!');
    }
  };

  useEffect(() => { fetchAssignments(); }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axiosClient.put(`/assignment-changes/${editingId}`, formData);
      } else {
        await axiosClient.post('/assignment-changes', formData);
      }
      closeModal();
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
    setIsModalOpen(true);
  };

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({ subject: '', lessonCount: '', startWeek: '', endWeek: '', notes: '' });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({ subject: '', lessonCount: '', startWeek: '', endWeek: '', notes: '' });
  };

  return (
    // Đã thêm thẻ div bao ngoài cùng (bắt buộc trong React)
    // Đã xóa class bg-[#eaf4fc] và min-h-screen để bỏ background
    <div className="p-8 max-w-full mx-auto font-sans bg-transparent">

      {/* HEADER: Tiêu đề và Nút Thêm */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-[2rem] font-bold text-[#2563eb]">
          Quản Lý Thay Đổi Phân Môn Số Tiết
        </h2>
        <button
          onClick={handleOpenAdd}
          className="bg-[#2453c9] hover:bg-blue-800 text-white font-medium py-2 px-5 rounded shadow transition-colors flex items-center gap-2 text-sm"
        >
          <span className="text-lg leading-none">+</span> Thêm Phân Công
        </button>
      </div>

      {/* BẢNG DANH SÁCH */}
      <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[linear-gradient(135deg, #2563eb 0%, #1e40af 100%)] text-white">
                <th className="px-6 py-3.5 text-base font-medium whitespace-nowrap">STT</th>
                <th className="px-6 py-3.5 text-base font-medium whitespace-nowrap">Môn Học</th>
                <th className="px-6 py-3.5 text-base font-medium whitespace-nowrap">Số Tiết</th>
                <th className="px-6 py-3.5 text-base font-medium whitespace-nowrap">Thời Gian</th>
                <th className="px-6 py-3.5 text-base font-medium whitespace-nowrap">Ghi Chú</th>
                <th className="px-6 py-3.5 text-base font-medium whitespace-nowrap text-center">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {assignments.length > 0 ? (
                assignments.map((item, index) => (
                  <tr key={item._id} className="hover:bg-blue-50/50 transition-colors">
                    <td className="px-6 py-4 text-base font-[450] text-[#0a0a0a]">{index + 1}</td>
                    <td className="px-6 py-4 text-base font-[450] text-[#0a0a0a]">{item.subject}</td>
                    <td className="px-6 py-4 text-base font-[450] text-[#0a0a0a]">{item.lessonCount}</td>
                    <td className="px-6 py-4 text-base font-[450] text-[#0a0a0a]">Tuần {item.startWeek} - {item.endWeek}</td>
                    <td className="px-6 py-4 text-base font-[450] text-[#0a0a0a]">{item.notes || ''}</td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleEdit(item)}
                          className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-1.5 rounded text-sm font-medium transition-colors border-none outline-none"
                        >
                          Sửa
                        </button>

                        <button
                          onClick={() => handleDelete(item._id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded text-sm font-medium transition-colors border-none outline-none"
                        >
                          Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-10 text-center text-gray-500 italic text-sm">
                    Chưa có dữ liệu phân công.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL POPUP FORM */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-2xl rounded-lg shadow-xl overflow-hidden">

            {/* Modal Header */}
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-medium text-[#2453c9]">
                {editingId ? 'Chỉnh Sửa Phân Công' : 'Thêm Phân Công Mới'}
              </h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-red-500 text-2xl font-light leading-none">
                &times;
              </button>
            </div>

            {/* Modal Body (Form) */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Tên môn học</label>
                <input
                  name="subject" value={formData.subject} onChange={handleChange} required
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#2453c9] focus:ring-1 focus:ring-[#2453c9] transition-colors"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Số tiết</label>
                  <input
                    name="lessonCount" type="number" value={formData.lessonCount} onChange={handleChange} required
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#2453c9] focus:ring-1 focus:ring-[#2453c9] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Tuần bắt đầu</label>
                  <input
                    name="startWeek" type="number" value={formData.startWeek} onChange={handleChange} required
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#2453c9] focus:ring-1 focus:ring-[#2453c9] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Tuần kết thúc</label>
                  <input
                    name="endWeek" type="number" value={formData.endWeek} onChange={handleChange} required
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#2453c9] focus:ring-1 focus:ring-[#2453c9] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Ghi chú thêm</label>
                <textarea
                  name="notes" value={formData.notes} onChange={handleChange} rows="3"
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#2453c9] focus:ring-1 focus:ring-[#2453c9] transition-colors resize-none"
                />
              </div>

              {/* Modal Footer (Buttons) */}
              <div className="pt-4 mt-6 border-t border-gray-100 flex justify-end gap-3">
                <button
                  type="button" onClick={closeModal}
                  className="px-5 py-2 rounded border border-gray-300 bg-white text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded bg-[#2453c9] text-white text-sm font-medium hover:bg-blue-800 transition-colors"
                >
                  {editingId ? 'Lưu Cập Nhật' : 'Xác Nhận Thêm'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div> // Đóng thẻ div wrapper
  );
};

export default AssignmentManagement;