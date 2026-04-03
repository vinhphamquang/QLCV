import { useState, useEffect } from 'react';
import axios from 'axios';
import './MonthlyTasks.css';
import ExcelButtons from '../components/ExcelButtons';
import Modal from '../components/Modal';

function MonthlyTasks() {
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    tuan: '',
    thu: '',
    noiDung: '',
    thoiGian: '',
    giaoViec: '',
    ghiChu: ''
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/monthly-tasks');
      setTasks(response.data);
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`http://localhost:5000/api/monthly-tasks/${editingId}`, formData);
      } else {
        await axios.post('http://localhost:5000/api/monthly-tasks', formData);
      }
      fetchTasks();
      resetForm();
    } catch (error) {
      console.error('Lỗi khi lưu dữ liệu:', error);
    }
  };

  const handleEdit = (task) => {
    setEditingId(task._id);
    setFormData({
      tuan: task.tuan,
      thu: task.thu,
      noiDung: task.noiDung,
      thoiGian: new Date(task.thoiGian).toISOString().slice(0, 16),
      giaoViec: task.giaoViec,
      ghiChu: task.ghiChu || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa công việc này?')) {
      try {
        await axios.delete(`http://localhost:5000/api/monthly-tasks/${id}`);
        fetchTasks();
      } catch (error) {
        console.error('Lỗi khi xóa:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      tuan: '',
      thu: '',
      noiDung: '',
      thoiGian: '',
      giaoViec: '',
      ghiChu: ''
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

  const filteredTasks = tasks.filter(item => {
    const searchLower = searchTerm.toLowerCase();
    return (
      (item.tuan || '').toLowerCase().includes(searchLower) ||
      (item.thu || '').toLowerCase().includes(searchLower) ||
      (item.noiDung || '').toLowerCase().includes(searchLower) ||
      (item.giaoViec || '').toLowerCase().includes(searchLower) ||
      (item.ghiChu || '').toLowerCase().includes(searchLower)
    );
  });
  // Group tasks by week
  const groupedTasks = filteredTasks.reduce((acc, task) => {
    if (!acc[task.tuan]) {
      acc[task.tuan] = [];
    }
    acc[task.tuan].push(task);
    return acc;
  }, {});

  const weekOrder = ['Tuần 1', 'Tuần 2', 'Tuần 3', 'Tuần 4', 'Tuần 5'];

  const excelColumns = [
    { header: 'Tuần', key: 'tuan' },
    { header: 'Thứ', key: 'thu' },
    { header: 'Nội Dung', key: 'noiDung' },
    { header: 'Thời Gian', key: 'thoiGian' },
    { header: 'Giao Việc', key: 'giaoViec' },
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
          await axios.post('http://localhost:5000/api/monthly-tasks', item);
          successCount++;
        } catch (error) {
          errorCount++;
        }
      }
      alert(`Nhập thành công ${successCount} bản ghi${errorCount > 0 ? `, ${errorCount} lỗi` : ''}`);
      fetchTasks();
    } catch (error) {
      alert('Có lỗi xảy ra!');
    }
  };



  return (
    <div className="monthly-tasks">
      <div className="header-section">
        <h2>Công Việc Tháng</h2>
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
              data={tasks}
              columns={excelColumns}
              fileName="CongViecThang"
              onImport={handleImportExcel}
            />
            <button className="btn-add" onClick={() => setShowForm(!showForm)}>
              + Thêm Công Việc
            </button>
          </div>
        </div>
      </div>

      {showForm && (
        <Modal 
          isOpen={showForm} 
          onClose={resetForm}
          title={editingId ? 'Chỉnh Sửa Công Việc' : 'Thêm Công Việc Mới'}
        >
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Tuần *</label>
                <select
                  value={formData.tuan}
                  onChange={(e) => setFormData({ ...formData, tuan: e.target.value })}
                  required
                >
                  <option value="">Chọn tuần</option>
                  <option value="Tuần 1">Tuần 1</option>
                  <option value="Tuần 2">Tuần 2</option>
                  <option value="Tuần 3">Tuần 3</option>
                  <option value="Tuần 4">Tuần 4</option>
                  <option value="Tuần 5">Tuần 5</option>
                </select>
              </div>

              <div className="form-group">
                <label>Thứ *</label>
                <select
                  value={formData.thu}
                  onChange={(e) => setFormData({ ...formData, thu: e.target.value })}
                  required
                >
                  <option value="">Chọn thứ</option>
                  <option value="Thứ 2">Thứ 2</option>
                  <option value="Thứ 3">Thứ 3</option>
                  <option value="Thứ 4">Thứ 4</option>
                  <option value="Thứ 5">Thứ 5</option>
                  <option value="Thứ 6">Thứ 6</option>
                  <option value="Thứ 7">Thứ 7</option>
                  <option value="Chủ Nhật">Chủ Nhật</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Nội Dung *</label>
              <textarea
                value={formData.noiDung}
                onChange={(e) => setFormData({ ...formData, noiDung: e.target.value })}
                rows="3"
                placeholder="Mô tả nội dung công việc..."
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Thời Gian *</label>
                <input
                  type="datetime-local"
                  value={formData.thoiGian}
                  onChange={(e) => setFormData({ ...formData, thoiGian: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Giao Việc *</label>
                <input
                  type="text"
                  value={formData.giaoViec}
                  onChange={(e) => setFormData({ ...formData, giaoViec: e.target.value })}
                  placeholder="Người được giao việc..."
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Ghi Chú</label>
              <textarea
                value={formData.ghiChu}
                onChange={(e) => setFormData({ ...formData, ghiChu: e.target.value })}
                rows="2"
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
        </Modal>
      )}

      <div className="tasks-by-week">
        {weekOrder.map((week) => (
          groupedTasks[week] && groupedTasks[week].length > 0 && (
            <div key={week} className="week-section">
              <h3 className="week-title">{week}</h3>
              <div className="table-container">
                <table className="monthly-table">
                  <thead>
                    <tr>
                      <th>STT</th>
                      <th>Thứ</th>
                      <th>Nội Dung</th>
                      <th>Thời Gian</th>
                      <th>Giao Việc</th>
                      <th>Ghi Chú</th>
                      <th>Thao Tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {groupedTasks[week].map((task, index) => (
                      <tr key={task._id}>
                        <td>{index + 1}</td>
                        <td>{task.thu}</td>
                        <td>{task.noiDung}</td>
                        <td>{formatDateTime(task.thoiGian)}</td>
                        <td>{task.giaoViec}</td>
                        <td>{task.ghiChu || '-'}</td>
                        <td>
                          <button className="btn-edit" onClick={() => handleEdit(task)}>Sửa</button>
                          <button className="btn-delete" onClick={() => handleDelete(task._id)}>Xóa</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )
        ))}

        {filteredTasks.length === 0 && (
          <p className="no-data">{searchTerm ? 'Không tìm thấy kết quả' : 'Chưa có công việc nào trong tháng'}</p>
        )}
      </div>
    </div>
  );
}

export default MonthlyTasks;
