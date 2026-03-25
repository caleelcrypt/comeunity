'use client';
import React from 'react';
import styles from './ReferralModal.module.css';

interface ReferralModalProps {
  isOpen: boolean;
  onClose: () => void;
  referralCode: string;
  referralInvites: number;
  referralXPEarned: number;
  onCopyCode: () => void;
  onShare: (platform: string) => void;
}

export default function ReferralModal({
  isOpen,
  onClose,
  referralCode,
  referralInvites,
  referralXPEarned,
  onCopyCode,
  onShare
}: ReferralModalProps) {
  if (!isOpen) return null;

  const sharePlatforms = ['whatsapp', 'facebook', 'twitter', 'telegram', 'copy'];

  const getPlatformIcon = (platform: string) => {
    const icons: Record<string, string> = {
      whatsapp: 'fab fa-whatsapp',
      facebook: 'fab fa-facebook-f',
      twitter: 'fab fa-twitter',
      telegram: 'fab fa-telegram-plane',
      copy: 'fas fa-link'
    };
    return icons[platform] || 'fas fa-share';
  };

  return (
    <div className={`modal ${isOpen ? 'show' : ''}`}>
      <div className="modal-content">
        <div className="modal-header">
          <h3><i className="fas fa-gift"></i> Invite Friends</h3>
          <span className="close-modal" onClick={onClose}>&times;</span>
        </div>
        
        <div className="referral-section">
          <h4>🎁 Invite Friends, Earn XP</h4>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
            Share your unique code – both you and your friend get 50 XP!
          </p>
          
          <div className="referral-code">
            <span>{referralCode}</span>
            <button className="copy-btn" onClick={onCopyCode}>Copy</button>
          </div>
          
          <div className="share-buttons-ref">
            {sharePlatforms.map(platform => (
              <div
                key={platform}
                className="share-icon"
                onClick={() => onShare(platform)}
              >
                <i className={getPlatformIcon(platform)}></i>
              </div>
            ))}
          </div>
        </div>
        
        <div className="referral-stats-preview">
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
            <i className="fas fa-users"></i> Invite friends to unlock rewards!
          </p>
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginTop: '12px' }}>
            <div>
              <div style={{ fontSize: '18px', fontWeight: 700, color: '#ffd700' }}>{referralInvites}</div>
              <div style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>Invites Sent</div>
            </div>
            <div>
              <div style={{ fontSize: '18px', fontWeight: 700, color: '#ffd700' }}>{referralXPEarned}</div>
              <div style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>XP Earned</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}