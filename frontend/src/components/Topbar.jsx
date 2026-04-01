import { useState } from 'react';
import './Topbar.css';

function Topbar() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Tìm kiếm:', searchQuery);
    // Implement search functionality here
  };

  return (
    <div className="topbar">
      <div className="topbar-content">
        <form className="search-form" onSubmit={handleSearch}>
          <input
            type="text"
            className="search-input"
            placeholder="🔍 Tìm kiếm danh mục, chức năng..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="search-button">
            Tìm kiếm
          </button>
        </form>

        <div className="topbar-actions">
          <button className="topbar-btn">
            <span className="icon">👤</span>
            <span>Admin</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Topbar;
