import { useState, useEffect } from 'react';
import axios from 'axios';
import './WeeklyTasks.css';

function WeeklyTasks() {
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    thu: '',
    noiDungCongViec: '',
    thoiGian: '',
    diaDiem: '',
    ghiChu: '',
    daHoanThanh: false
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/weekly-tasks');
      setTasks(response.data);
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`http://localhost:5000/api/weekly-tasks/${editingId}`, formData);
      } else {
        await axios.post('http://localhost:5000/api/weekly-tasks', formData);
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
      thu: task.thu,
      noiDungCongViec: task.noiDungCongViec,
      thoiGian: new Date(task.thoiGian).toISOString().slice(0, 16),
      diaDiem: task.diaDiem || '',
      ghiChu: task.ghiChu || '',
      daHoanThanh: task.daHoanThanh
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa công việc này?')) {
      try {
        await axios.delete(`http://localhost:5000/api/weekly-tasks/${id}`);
        fetchTasks();
      } catch (error) {
        console.error('Lỗi khi xóa:', error);
      }
    }
  };

  const toggleComplete = async (task) => {
    try {
      await axios.put(`http://localhost:5000/api/weekly-tasks/${task._id}`, {
        ...task,
        daHoanThanh: !task.daHoanThanh
      });
      fetchTasks();
    } catch (error) {
      console.error('Lỗi khi cập nhật:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      thu: '',
      noiDungCongViec: '',
      thoiGian: '',
      diaDiem: '',
      ghiChu: '',
      daHoanThanh: false
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

  const getTaskStatus = (task) => {
    if (task.daHoanThanh) {
      return 'completed';
    }

    const now = new Date();
    const taskTime = new Date(task.thoiGian);
    const diffHours = (taskTime - now) / (1000 * 60 * 60);

    if (diffHours < 0) {
      return 'overdue'; // Đỏ - Quá hạn
    } else if (diffHours <= 24) {
      return 'urgent'; // Đỏ - Đến hạn (trong 24h)
    } else if (diffHours <= 48) {
      return 'warning'; // Vàng - Gần đến hạn (trong 48h)
    }
    return 'normal'; // Xanh - Bình thường
  };

  const getStatusText = (task) => {
    if (task.daHoanThanh) {
      return '✓ Hoàn thành';
    }

    const now = new Date();
    const taskTime = new Date(task.thoiGian);
    const diffHours = (taskTime - now) / (1000 * 60 * 60);

    if (diffHours < 0) {
      return '✗ Quá hạn';
    } else if (diffHours <= 24) {
      return '🔴 Đến hạn';
    } else if (diffHours <= 48) {
      return '🟡 Gần đến hạn';
    }
    return '🟢 Bình thường';
  };

  return (
    <div className="weekly-tasks">
      <div className="header-section">
        <h2>Công Việc Tuần</h2>
        <button className="btn-add" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Đóng Form' : '+ Thêm Công Việc'}
        </button>
      </div>

      {showForm && (
        <div className="form-container">
          <h3>{editingId ? 'Chỉnh Sửa Công Việc' : 'Thêm Công Việc Mới'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Thứ *</label>
                <select
                  value={formData.thu}
                  onChange={(e) => setFormData({...formData, thu: e.target.value})}
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

              <div className="form-group">
                <label>Thời Gian *</label>
                <input
                  type="datetime-local"
                  value={formData.thoiGian}
                  onChange={(e) => setFormData({...formData, thoiGian: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Nội Dung Công Việc *</label>
              <textarea
                value={formData.noiDungCongViec}
                onChange={(e) => setFormData({...formData, noiDungCongViec: e.target.value})}
                rows="3"
                placeholder="Mô tả công việc cần làm..."
                required
              />
            </div>

            <div className="form-group">
              <label>Địa Điểm</label>
              <input
                type="text"
                value={formData.diaDiem}
                onChange={(e) => setFormData({...formData, diaDiem: e.target.value})}
                placeholder="VD: Phòng họp, Văn phòng..."
              />
            </div>

            <div className="form-group">
              <label>Ghi Chú</label>
              <textarea
                value={formData.ghiChu}
                onChange={(e) => setFormData({...formData, ghiChu: e.target.value})}
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
        </div>
      )}

      <div className="table-container">
        <table className="tasks-table">
          <thead>
            <tr>
              <th>STT</th>
              <th>Thứ</th>
              <th>Nội Dung Công Việc</th>
              <th>Thời Gian</th>
              <th>Địa Điểm</th>
              <th>Ghi Chú</th>
              <th>Trạng Thái</th>
              <th>Thao Tác</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task, index) => (
              <tr key={task._id} className={`task-row ${getTaskStatus(task)}`}>
                <td>{index + 1}</td>
                <td>{task.thu}</td>
                <td>{task.noiDungCongViec}</td>
                <td>{formatDateTime(task.thoiGian)}</td>
                <td>{task.diaDiem || '-'}</td>
                <td>{task.ghiChu || '-'}</td>
                <td>
                  <span className={`status-badge ${getTaskStatus(task)}`}>
                    {getStatusText(task)}
                  </span>
                </td>
                <td>
                  <button 
                    className={`btn-complete ${task.daHoanThanh ? 'completed' : ''}`}
                    onClick={() => toggleComplete(task)}
                    title={task.daHoanThanh ? 'Đánh dấu chưa hoàn thành' : 'Đánh dấu hoàn thành'}
                  >
                    {task.daHoanThanh ? '✓' : '○'}
                  </button>
                  <button className="btn-edit" onClick={() => handleEdit(task)}>Sửa</button>
                  <button className="btn-delete" onClick={() => handleDelete(task._id)}>Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {tasks.length === 0 && (
          <p className="no-data">Chưa có công việc nào trong tuần</p>
        )}
      </div>
    </div>
  );
}

export default WeeklyTasks;
