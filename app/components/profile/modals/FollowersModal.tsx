'use client';
import React from 'react';
import styles from './FollowersModal.module.css';

interface Follower {
  id: string;
  username: string;
  avatar: string;
  displayName: string;
}

interface FollowersModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  users: Follower[];
  onFollow?: (userId: string) => void;
}

export default function FollowersModal({ isOpen, onClose, title, users, onFollow }: FollowersModalProps) {
  if (!isOpen) return null;

  return (
    <div className={`modal ${isOpen ? 'show' : ''}`}>
      <div className="modal-content">
        <div className="modal-header">
          <h3>{title}</h3>
          <span className="close-modal" onClick={onClose}>&times;</span>
        </div>
        
        {users.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.5)' }}>No users yet</p>
        ) : (
          users.map(user => (
            <div key={user.id} className="treasure-item" style={{ justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', gap: '12px' }}>
                <div className="post-avatar" style={{ width: '40px', height: '40px' }}>{user.avatar}</div>
                <div>
                  <strong>{user.displayName}</strong>
                  <div style={{ fontSize: '11px' }}>@{user.username}</div>
                </div>
              </div>
              {onFollow && (
                <button
                  className="profile-btn"
                  style={{ padding: '4px 12px', fontSize: '11px' }}
                  onClick={() => onFollow(user.id)}
                >
                  Follow
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}