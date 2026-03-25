'use client';
import React from 'react';
import styles from './AvatarShopModal.module.css';

interface Avatar {
  emoji: string;
  name: string;
  price: number;
  tier: string;
}

interface AvatarShopModalProps {
  isOpen: boolean;
  onClose: () => void;
  ownedAvatars: string[];
  currentAvatar: string;
  coins: number;
  freeAvatars: Avatar[];
  premiumAvatars: Avatar[];
  onSelectAvatar: (emoji: string) => void;
  onPurchase: (avatar: Avatar) => void;
}

export default function AvatarShopModal({
  isOpen,
  onClose,
  ownedAvatars,
  currentAvatar,
  coins,
  freeAvatars,
  premiumAvatars,
  onSelectAvatar,
  onPurchase
}: AvatarShopModalProps) {
  if (!isOpen) return null;

  return (
    <div className={`avatar-shop-modal ${isOpen ? 'show' : ''}`}>
      <div className="shop-header">
        <h2>🎨 Avatar Shop</h2>
        <span className="close-modal" onClick={onClose}>&times;</span>
      </div>
      
      <div style={{ padding: '0 20px' }}>
        <div className="wallet-badge" style={{ display: 'inline-flex' }}>
          <i className="fas fa-coins"></i> <span>{coins}</span> coins
        </div>
      </div>
      
      <h3 style={{ padding: '0 20px', marginTop: '16px' }}>🎁 FREE AVATARS</h3>
      <div className="free-avatars-grid">
        {freeAvatars.map(avatar => (
          <div
            key={avatar.emoji}
            className={`avatar-item ${currentAvatar === avatar.emoji ? 'selected' : ''}`}
            onClick={() => onSelectAvatar(avatar.emoji)}
          >
            <div className="avatar-preview">{avatar.emoji}</div>
            <div className="avatar-name">{avatar.name}</div>
            <div style={{ fontSize: '10px' }}>
              {ownedAvatars.includes(avatar.emoji) ? 'Owned' : 'Free'}
            </div>
          </div>
        ))}
      </div>
      
      <h3 style={{ padding: '0 20px' }}>✨ PREMIUM AVATARS</h3>
      <div className="premium-avatars-grid">
        {premiumAvatars.map(avatar => (
          <div
            key={avatar.emoji}
            className="premium-avatar-card"
            onClick={() => !ownedAvatars.includes(avatar.emoji) && onPurchase(avatar)}
          >
            <div style={{ fontSize: '48px' }}>{avatar.emoji}</div>
            <div className="avatar-name">{avatar.name}</div>
            <div style={{ color: '#ffd700' }}>{avatar.price} 🪙</div>
            <button
              className="purchase-btn"
              style={ownedAvatars.includes(avatar.emoji) ? { opacity: 0.5 } : {}}
            >
              {ownedAvatars.includes(avatar.emoji) ? 'Owned' : 'Buy'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}