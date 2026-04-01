import './Topbar.css';

function Topbar() {
  return (
    <div className="topbar">
      <div className="topbar-content">
        <div className="topbar-title">
          <img src="/logo.png" alt="Logo" className="topbar-logo" />
          <h3>Trường THCS Trần Phú - TP. Trà Vinh</h3>
        </div>

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
