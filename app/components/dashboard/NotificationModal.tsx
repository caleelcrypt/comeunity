import React, { useState, useEffect } from 'react';
import { useSupabase } from '../../hooks/useSupabase';
import { Notification } from '../../types';
import { getRelativeTime } from '../../utils/helpers';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  showToast: (message: string, type?: string) => void;
  onConfirm: (title: string, message: string, onConfirm: () => void) => void;
}

type NotificationCategory = 'all' | 'announcements' | 'engagement' | 'unities' | 'achievements' | 'system';

const CATEGORY_CONFIG: { key: NotificationCategory; label: string; icon: string }[] = [
  { key: 'all', label: 'All', icon: '📢' },
  { key: 'announcements', label: 'Announcements', icon: '📢' },
  { key: 'engagement', label: 'Engagement', icon: '❤️' },
  { key: 'unities', label: 'Unities', icon: '👥' },
  { key: 'achievements', label: 'Achievements', icon: '🏆' },
  { key: 'system', label: 'System', icon: '⚙️' }
];

export const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  onClose,
  showToast,
  onConfirm
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activeCategory, setActiveCategory] = useState<NotificationCategory>('all');
  const [visibleCount, setVisibleCount] = useState(10);
  const [loading, setLoading] = useState(true);
  
  const { fetchNotifications, markNotificationRead, markAllNotificationsRead } = useSupabase();

  useEffect(() => {
    if (isOpen) {
      loadNotifications();
    }
  }, [isOpen]);

  const loadNotifications = async () => {
    setLoading(true);
    const fetched = await fetchNotifications();
    setNotifications(fetched);
    setLoading(false);
  };

  const getFilteredNotifications = () => {
    if (activeCategory === 'all') return notifications;
    return notifications.filter(n => n.category === activeCategory);
  };

  const getVisibleNotifications = () => {
    const filtered = getFilteredNotifications();
    return filtered.slice(0, visibleCount);
  };

  const getUnreadCount = (category?: NotificationCategory) => {
    let filtered = notifications;
    if (category && category !== 'all') {
      filtered = notifications.filter(n => n.category === category);
    }
    return filtered.filter(n => !n.read).length;
  };

  const getNotificationIcon = (type: string, icon?: string) => {
    if (icon) return icon;
    const icons: Record<string, string> = {
      like: '❤️',
      comment: '💬',
      follow: '👤',
      tip: '💰',
      mention: '@',
      announcement: '📢',
      unity_post: '👥',
      unity_event: '🎮',
      unity_milestone: '🏆',
      leaderboard_up: '📈',
      spotlight: '✨',
      streak: '🔥',
      level_up: '⭐',
      badge: '🎖️',
      xp_gain: '✨'
    };
    return icons[type] || '🔔';
  };

  const getNotificationTitle = (type: string, title?: string) => {
    if (title) return title;
    const titles: Record<string, string> = {
      like: 'Liked your post',
      comment: 'Commented on your post',
      follow: 'New follower',
      tip: 'Received a tip',
      mention: 'You were mentioned',
      announcement: 'Announcement',
      unity_post: 'New post in Unity',
      unity_event: 'Unity Event',
      unity_milestone: 'Unity Milestone',
      leaderboard_up: 'Leaderboard Update',
      spotlight: 'Spotlight Feature',
      streak: 'Streak Unlocked',
      level_up: 'Level Up!',
      badge: 'New Badge',
      xp_gain: 'XP Earned'
    };
    return titles[type] || 'Notification';
  };

  const getNotificationTimeGroup = (date: Date) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const threeDaysAgo = new Date(today);
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
    const oneWeekAgo = new Date(today);
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const twoWeeksAgo = new Date(today);
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
    
    if (date >= today) return 'Today';
    if (date >= yesterday) return 'Yesterday';
    if (date >= threeDaysAgo) return '3 days ago';
    if (date >= oneWeekAgo) return '1 week ago';
    if (date >= twoWeeksAgo) return '2 weeks ago';
    return 'Older';
  };

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.read) {
      await markNotificationRead(notification.id);
      setNotifications(prev =>
        prev.map(n => n.id === notification.id ? { ...n, read: true } : n)
      );
      showToast('+10 XP');
    }
    
    // Handle different notification types
    if (notification.type === 'leaderboard_up' && notification.data) {
      showToast(`📈 You moved from #${notification.data.oldRank} to #${notification.data.newRank}! Great progress!`);
    } else if (notification.type === 'spotlight' && notification.actor_name) {
      showToast(`✨ Check out ${notification.actor_name} in the Weekly Spotlight!`);
    } else if (notification.type === 'tip' && notification.actor_name) {
      showToast(`💰 ${notification.actor_name} sent you a tip!`);
    } else {
      showToast(`Opening notification`);
    }
  };

  const handleMarkAllRead = async () => {
    const unreadCount = getUnreadCount();
    if (unreadCount === 0) {
      showToast('No unread notifications');
      return;
    }
    
    onConfirm(
      'Mark All Read',
      `Mark all ${unreadCount} notifications as read?`,
      async () => {
        await markAllNotificationsRead();
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        showToast('All notifications marked as read! +25 XP');
      }
    );
  };

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 10);
  };

  const groupNotificationsByDate = (notifs: Notification[]) => {
    const groups: Record<string, Notification[]> = {};
    notifs.forEach(notif => {
      const group = getNotificationTimeGroup(new Date(notif.created_at));
      if (!groups[group]) groups[group] = [];
      groups[group].push(notif);
    });
    return groups;
  };

  if (!isOpen) return null;

  const visibleNotifications = getVisibleNotifications();
  const groupedNotifications = groupNotificationsByDate(visibleNotifications);
  const hasMore = visibleNotifications.length < getFilteredNotifications().length;

  return (
    <div className="modal show" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="notification-modal-content">
        <div className="notification-modal-header">
          <h2>Notifications</h2>
          <span className="mark-read" onClick={handleMarkAllRead}>
            Mark all read
          </span>
          <span className="close-modal" onClick={onClose}>&times;</span>
        </div>
        
        <div className="category-tabs-wrapper">
          <div className="category-tabs">
            {CATEGORY_CONFIG.map(cat => (
              <div
                key={cat.key}
                className={`category-tab ${activeCategory === cat.key ? 'active' : ''}`}
                onClick={() => {
                  setActiveCategory(cat.key);
                  setVisibleCount(10);
                }}
              >
                {cat.icon} {cat.label}
                {getUnreadCount(cat.key) > 0 && (
                  <span className="badge">{getUnreadCount(cat.key)}</span>
                )}
              </div>
            ))}
          </div>
        </div>
        
        <div className="notification-list-container">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <i className="fas fa-spinner fa-spin"></i>
            </div>
          ) : visibleNotifications.length === 0 ? (
            <div className="empty-notifications">
              <i className="fas fa-inbox"></i><br />
              No notifications in this category
            </div>
          ) : (
            Object.entries(groupedNotifications).map(([group, items]) => (
              <div key={group} className="notification-section">
                <div className="section-date">{group}</div>
                {items.map(notification => (
                  <div
                    key={notification.id}
                    className={`notification-card ${!notification.read ? 'unread' : ''}`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="notification-icon">
                      {getNotificationIcon(notification.type, notification.icon)}
                    </div>
                    <div className="notification-content">
                      <div className="notification-title">
                        {getNotificationTitle(notification.type, notification.title)}
                      </div>
                      <div className="notification-message">{notification.message}</div>
                      <div className="notification-time">
                        <i className="far fa-clock"></i> {getRelativeTime(new Date(notification.created_at))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))
          )}
          
          {hasMore && (
            <div className="see-older-btn" onClick={handleLoadMore}>
              See older notifications
            </div>
          )}
        </div>
      </div>
      
      <style>{`
        .notification-modal-content {
          width: 90%;
          max-width: 340px;
          max-height: 85vh;
          background: var(--bg-secondary);
          border: 1px solid var(--border-glass);
          border-radius: 32px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }
        .notification-modal-header {
          padding: 20px 20px 12px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid var(--border-glass);
          background: var(--bg-secondary);
        }
        .notification-modal-header h2 {
          font-size: 20px;
          font-weight: 700;
        }
        .mark-read {
          color: var(--gradient-2);
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          background: var(--surface-glass);
          padding: 6px 12px;
          border-radius: 100px;
          transition: all 0.2s;
        }
        .mark-read:hover {
          background: var(--surface-glass-hover);
          transform: translateY(-1px);
        }
        .category-tabs-wrapper {
          position: sticky;
          top: 0;
          background: var(--bg-secondary);
          z-index: 5;
          padding: 12px 20px 0;
        }
        .category-tabs {
          display: flex;
          gap: 8px;
          overflow-x: auto;
          padding: 4px 0 12px;
          scrollbar-width: none;
        }
        .category-tabs::-webkit-scrollbar {
          display: none;
        }
        .category-tab {
          position: relative;
          padding: 6px 16px;
          background: var(--surface-glass);
          border: 1px solid var(--border-glass);
          border-radius: 100px;
          font-size: 12px;
          font-weight: 500;
          color: var(--text-secondary);
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.2s;
        }
        .category-tab.active {
          background: linear-gradient(135deg, var(--gradient-1), var(--gradient-3));
          border-color: transparent;
          color: white;
        }
        .category-tab .badge {
          position: absolute;
          top: -6px;
          right: -6px;
          background: var(--gradient-1);
          color: white;
          font-size: 9px;
          font-weight: 600;
          padding: 2px 5px;
          border-radius: 100px;
          min-width: 16px;
          text-align: center;
          border: 1px solid var(--bg-secondary);
        }
        .category-tab.active .badge {
          background: white;
          color: var(--gradient-1);
        }
        .notification-list-container {
          flex: 1;
          overflow-y: auto;
          padding: 12px 20px 20px;
        }
        .notification-section {
          margin-bottom: 20px;
        }
        .section-date {
          font-size: 12px;
          font-weight: 600;
          color: var(--gradient-2);
          margin-bottom: 10px;
          padding-left: 8px;
          border-left: 3px solid var(--gradient-2);
        }
        .notification-card {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          background: var(--surface-glass);
          border: 1px solid var(--border-glass);
          border-radius: 16px;
          cursor: pointer;
          transition: all 0.2s;
          margin-bottom: 8px;
        }
        .notification-card:hover {
          background: var(--surface-glass-hover);
          transform: translateX(4px);
          border-color: var(--gradient-2);
        }
        .notification-card.unread {
          background: linear-gradient(145deg, rgba(255, 77, 109, 0.08), rgba(67, 97, 238, 0.08));
          border-left: 3px solid var(--gradient-1);
        }
        .notification-icon {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, var(--gradient-1), var(--gradient-3));
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          flex-shrink: 0;
        }
        .notification-content {
          flex: 1;
        }
        .notification-title {
          font-weight: 600;
          font-size: 13px;
          margin-bottom: 2px;
        }
        .notification-message {
          font-size: 11px;
          color: var(--text-secondary);
          margin-bottom: 2px;
          line-height: 1.3;
        }
        .notification-time {
          font-size: 9px;
          color: var(--text-tertiary);
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .see-older-btn {
          width: 100%;
          padding: 12px;
          background: var(--surface-glass);
          border: 1px solid var(--border-glass);
          border-radius: 100px;
          color: var(--gradient-2);
          font-weight: 600;
          font-size: 12px;
          cursor: pointer;
          transition: all 0.2s;
          text-align: center;
          margin-top: 12px;
        }
        .see-older-btn:hover {
          background: var(--surface-glass-hover);
          transform: translateY(-2px);
        }
        .empty-notifications {
          text-align: center;
          padding: 40px 20px;
          color: var(--text-tertiary);
          font-size: 13px;
        }
        .empty-notifications i {
          font-size: 32px;
          margin-bottom: 12px;
          display: block;
        }
      `}</style>
    </div>
  );
};