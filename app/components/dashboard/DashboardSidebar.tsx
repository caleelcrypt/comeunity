import React from 'react';

interface DashboardSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenReviews: () => void;
  showToast: (message: string, type?: string) => void;
}

export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  isOpen,
  onClose,
  onOpenReviews,
  showToast
}) => {
  const handleAnalytics = () => {
    onClose();
    showToast('📊 Analytics dashboard coming soon!');
  };

  const handleControlRoom = () => {
    onClose();
    showToast('⚙️ Control Room - Customize your experience');
  };

  const handleHowItWorks = () => {
    onClose();
    showToast('📖 How It Works: Join Unities → Share → Earn XP & Coins → Level Up!');
  };

  const handleLogout = () => {
    onClose();
    showToast('👋 You\'ve been logged out successfully!');
  };

  if (!isOpen) return null;

  return (
    <>
      <div className={`dashboard-sidebar ${isOpen ? 'open' : ''}`}>
        <div className="dropdown-close-btn" onClick={onClose}>
          <i className="fas fa-times"></i>
        </div>
        
        <div className="dropdown-header">
          <div className="dropdown-logo">
            <span>COME</span>
            <span>UNITY</span>
          </div>
          <div className="premium-tag">
            <i className="fas fa-home"></i> Creators Home
          </div>
        </div>
        
        <div className="dropdown-user-stats">
          <div className="user-card-stats">
            <div className="user-avatar-large">🎨</div>
            <div className="user-info-stats">
              <div className="user-name-stats">Alex Creator</div>
              <div className="user-handle-stats">@alex.creator</div>
              <span className="level-badge">
                <i className="fas fa-trophy"></i> Level 12
              </span>
            </div>
          </div>
          <div className="xp-container">
            <div className="xp-bar-bg">
              <div className="xp-fill-bar" style={{ width: '68%' }}></div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginTop: '6px' }}>
              <span>⭐ 3,420 XP</span>
              <span>Next: 5,000 XP</span>
            </div>
          </div>
          <div className="stats-row">
            <div className="stat-item">
              <div className="stat-value">147</div>
              <div className="stat-label">Posts</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">2.4K</div>
              <div className="stat-label">Followers</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">189</div>
              <div className="stat-label">Following</div>
            </div>
          </div>
        </div>
        
        <div className="dropdown-nav-menu">
          <div className="dropdown-nav-item" onClick={handleAnalytics}>
            <i className="fas fa-chart-line"></i>
            <span>Analytics</span>
          </div>
          <div className="dropdown-nav-item" onClick={handleControlRoom}>
            <i className="fas fa-sliders-h"></i>
            <span>Control Room</span>
          </div>
          <div className="dropdown-nav-item" onClick={handleHowItWorks}>
            <i className="fas fa-question-circle"></i>
            <span>How It Works</span>
          </div>
          <div className="dropdown-nav-item" onClick={onOpenReviews}>
            <i className="fas fa-star"></i>
            <span>Reviews</span>
          </div>
          <div className="divider"></div>
          <div className="dropdown-nav-item" onClick={handleLogout}>
            <i className="fas fa-sign-out-alt"></i>
            <span>Logout</span>
          </div>
        </div>
      </div>
      <div 
        className={`dashboard-overlay ${isOpen ? 'open' : ''}`} 
        onClick={onClose}
      ></div>
      
      <style>{`
        .dashboard-sidebar {
          position: fixed;
          top: 0;
          left: -300px;
          width: 300px;
          height: 100%;
          background: linear-gradient(180deg, #12121a 0%, #0a0a0f 100%);
          backdrop-filter: blur(20px);
          border-right: 1px solid var(--border-glass);
          z-index: 200;
          transition: left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          flex-direction: column;
          overflow-y: auto;
          box-shadow: 5px 0 30px rgba(0, 0, 0, 0.5);
        }
        .dashboard-sidebar.open {
          left: 0;
        }
        .dashboard-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          z-index: 199;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.3s;
        }
        .dashboard-overlay.open {
          opacity: 1;
          pointer-events: auto;
        }
        .dropdown-close-btn {
          position: absolute;
          top: 20px;
          right: 20px;
          width: 36px;
          height: 36px;
          background: var(--surface-glass);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: var(--text-secondary);
          transition: all 0.2s;
          z-index: 10;
        }
        .dropdown-close-btn:hover {
          background: var(--surface-glass-hover);
          color: var(--text-primary);
          transform: scale(1.05);
        }
        .dropdown-header {
          padding: 28px 20px 20px;
          border-bottom: 1px solid var(--border-glass);
          background: linear-gradient(135deg, rgba(255, 77, 109, 0.1), rgba(67, 97, 238, 0.05));
        }
        .dropdown-logo {
          font-size: 28px;
          font-weight: 800;
          letter-spacing: -0.5px;
        }
        .dropdown-logo span:first-child {
          background: linear-gradient(135deg, #ff4d6d, #b5179e);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .dropdown-logo span:last-child {
          background: linear-gradient(135deg, #b5179e, #4361ee);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .premium-tag {
          display: inline-block;
          background: linear-gradient(135deg, var(--gradient-2), var(--gradient-3));
          color: white;
          font-size: 11px;
          font-weight: 600;
          padding: 4px 14px;
          border-radius: 100px;
          margin-top: 10px;
          letter-spacing: 0.5px;
        }
        .dropdown-user-stats {
          margin: 20px;
          background: var(--surface-glass);
          border-radius: 24px;
          padding: 18px;
          border: 1px solid var(--border-glass);
        }
        .user-card-stats {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 16px;
        }
        .user-avatar-large {
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, var(--gradient-1), var(--gradient-3));
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28px;
          box-shadow: 0 0 30px rgba(180, 83, 255, 0.3);
        }
        .user-name-stats {
          font-size: 18px;
          font-weight: 700;
          margin-bottom: 4px;
        }
        .user-handle-stats {
          font-size: 11px;
          color: var(--text-tertiary);
          margin-bottom: 8px;
        }
        .level-badge {
          background: linear-gradient(135deg, var(--gradient-2), var(--gradient-3));
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 10px;
          font-weight: 600;
          display: inline-block;
        }
        .xp-container {
          margin: 12px 0;
        }
        .xp-bar-bg {
          height: 8px;
          background: var(--surface-glass);
          border-radius: 10px;
          overflow: hidden;
        }
        .xp-fill-bar {
          height: 100%;
          background: linear-gradient(90deg, var(--gradient-1), var(--gradient-3));
          border-radius: 10px;
        }
        .stats-row {
          display: flex;
          gap: 12px;
          margin-top: 12px;
          padding-top: 12px;
          border-top: 1px solid var(--border-glass);
        }
        .stat-item {
          flex: 1;
          text-align: center;
          background: rgba(255, 255, 255, 0.03);
          border-radius: 16px;
          padding: 10px;
        }
        .stat-value {
          font-size: 18px;
          font-weight: 700;
          color: var(--gold);
        }
        .stat-label {
          font-size: 10px;
          color: var(--text-tertiary);
          margin-top: 4px;
        }
        .dropdown-nav-menu {
          padding: 0 12px;
          margin-top: 10px;
          margin-bottom: 20px;
        }
        .dropdown-nav-item {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 14px 16px;
          border-radius: 16px;
          cursor: pointer;
          margin-bottom: 6px;
          transition: all 0.25s;
          color: var(--text-secondary);
          background: transparent;
          border: none;
          width: 100%;
          font-size: 15px;
          font-weight: 500;
        }
        .dropdown-nav-item:hover {
          background: linear-gradient(135deg, rgba(255, 77, 109, 0.15), rgba(67, 97, 238, 0.15));
          color: #ffffff;
          border-left: 3px solid #b5179e;
          transform: translateX(4px);
        }
        .dropdown-nav-item i {
          width: 28px;
          font-size: 18px;
        }
        .divider {
          height: 1px;
          background: var(--border-glass);
          margin: 12px 0;
        }
      `}</style>
    </>
  );
};