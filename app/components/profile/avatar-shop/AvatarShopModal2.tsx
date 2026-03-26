'use client';
import React, { useState, useMemo } from 'react';
import styles from './AvatarShopModal.module.css';
import { 
  ALL_AVATARS, 
  tierConfig, 
  getNextAffordableAvatar,
  getCompletionPercentage 
} from '../../../../lib/avatarData';

interface Avatar {
  emoji: string;
  name: string;
  price: number;
  tier: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary' | 'mythic' | 'limited';
  description?: string;
}

interface AvatarShopModalProps {
  isOpen: boolean;
  onClose: () => void;
  ownedAvatars: string[];
  currentAvatar: string;
  coins: number;
  onSelectAvatar: (emoji: string) => void;
  onPurchase: (avatar: Avatar) => void;
}

export default function AvatarShopModal({
  isOpen,
  onClose,
  ownedAvatars,
  currentAvatar,
  coins,
  onSelectAvatar,
  onPurchase
}: AvatarShopModalProps) {
  const [selectedTier, setSelectedTier] = useState<string>('all');
  const [showOwnedOnly, setShowOwnedOnly] = useState(false);

  const filteredAvatars = useMemo(() => {
    let filtered = ALL_AVATARS;
    
    if (selectedTier !== 'all') {
      filtered = filtered.filter(a => a.tier === selectedTier);
    }
    
    if (showOwnedOnly) {
      filtered = filtered.filter(a => ownedAvatars.includes(a.emoji));
    }
    
    return filtered;
  }, [selectedTier, showOwnedOnly, ownedAvatars]);

  const ownedCount = ownedAvatars.length;
  const totalCount = ALL_AVATARS.length;
  const completionPercentage = (ownedCount / totalCount) * 100;
  const nextAffordable = getNextAffordableAvatar(ownedAvatars, coins);

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        {/* Header */}
        <div className={styles.header}>
          <h2>🎨 Avatar Collection</h2>
          <button className={styles.closeBtn} onClick={onClose}>×</button>
        </div>

        {/* Stats Bar */}
        <div className={styles.statsBar}>
          <div className={styles.statsItem}>
            <i className="fas fa-coins"></i>
            <span>{coins}</span>
            <small>Coins</small>
          </div>
          <div className={styles.statsItem}>
            <i className="fas fa-user-astronaut"></i>
            <span>{ownedCount}/{totalCount}</span>
            <small>Owned</small>
          </div>
          <div className={styles.statsItem}>
            <i className="fas fa-chart-line"></i>
            <span>{Math.round(completionPercentage)}%</span>
            <small>Complete</small>
          </div>
        </div>

        {/* Progress Bar */}
        <div className={styles.progressSection}>
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: `${completionPercentage}%` }}></div>
          </div>
          <div className={styles.progressText}>
            {ownedCount} / {totalCount} avatars collected
          </div>
        </div>

        {/* Next Goal Suggestion */}
        {nextAffordable && !showOwnedOnly && (
          <div className={styles.suggestionCard}>
            <i className="fas fa-bullseye"></i>
            <div>
              <strong>Next Goal:</strong> {nextAffordable.emoji} {nextAffordable.name}
              <span> - {nextAffordable.price} coins</span>
            </div>
            <small>{Math.ceil(nextAffordable.price / 50)} days of earning</small>
          </div>
        )}

        {/* Filters */}
        <div className={styles.filters}>
          <div className={styles.tierFilters}>
            <button 
              className={`${styles.tierBtn} ${selectedTier === 'all' ? styles.active : ''}`}
              onClick={() => setSelectedTier('all')}
            >
              All ({totalCount})
            </button>
            {Object.entries(tierConfig).map(([key, config]) => {
              const tierCount = ALL_AVATARS.filter(a => a.tier === key).length;
              if (tierCount === 0) return null;
              return (
                <button
                  key={key}
                  className={`${styles.tierBtn} ${selectedTier === key ? styles.active : ''}`}
                  style={{ borderColor: config.color }}
                  onClick={() => setSelectedTier(key)}
                >
                  {config.name.split(' ')[1] || config.name} ({tierCount})
                </button>
              );
            })}
          </div>
          <button
            className={`${styles.ownedFilter} ${showOwnedOnly ? styles.active : ''}`}
            onClick={() => setShowOwnedOnly(!showOwnedOnly)}
          >
            <i className="fas fa-check-circle"></i>
            {showOwnedOnly ? 'Showing Owned' : 'Show Owned Only'}
          </button>
        </div>

        {/* Avatar Grid by Tier */}
        {selectedTier === 'all' ? (
          // Show all tiers grouped by order
          Object.entries(tierConfig)
            .sort((a, b) => a[1].order - b[1].order)
            .map(([tier, config]) => {
              const tierAvatars = ALL_AVATARS.filter(a => a.tier === tier);
              if (tierAvatars.length === 0) return null;
              
              const ownedInTier = tierAvatars.filter(a => ownedAvatars.includes(a.emoji)).length;
              
              return (
                <div key={tier} className={styles.tierSection}>
                  <div className={styles.tierHeader}>
                    <h3 style={{ color: config.color }}>{config.name}</h3>
                    <span className={styles.tierCount}>{ownedInTier}/{tierAvatars.length}</span>
                  </div>
                  <div className={styles.avatarGrid}>
                    {tierAvatars.map(avatar => (
                      <AvatarCard
                        key={avatar.emoji}
                        avatar={avatar}
                        owned={ownedAvatars.includes(avatar.emoji)}
                        isCurrent={currentAvatar === avatar.emoji}
                        coins={coins}
                        onSelect={onSelectAvatar}
                        onPurchase={onPurchase}
                        tierColor={config.color}
                      />
                    ))}
                  </div>
                </div>
              );
            })
        ) : (
          // Show single tier
          <div className={styles.avatarGrid}>
            {filteredAvatars.map(avatar => (
              <AvatarCard
                key={avatar.emoji}
                avatar={avatar}
                owned={ownedAvatars.includes(avatar.emoji)}
                isCurrent={currentAvatar === avatar.emoji}
                coins={coins}
                onSelect={onSelectAvatar}
                onPurchase={onPurchase}
                tierColor={tierConfig[avatar.tier]?.color || '#6b7280'}
              />
            ))}
          </div>
        )}

        {/* Collection Completion Message */}
        {ownedCount === totalCount && (
          <div className={styles.completionMessage}>
            <i className="fas fa-crown"></i>
            <div>
              <h4>Avatar God! 👑</h4>
              <p>You've collected all 50 avatars! You are a true legend of ComeUnity.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Avatar Card Component
function AvatarCard({ 
  avatar, 
  owned, 
  isCurrent, 
  coins, 
  onSelect, 
  onPurchase,
  tierColor 
}: { 
  avatar: Avatar; 
  owned: boolean; 
  isCurrent: boolean; 
  coins: number; 
  onSelect: (emoji: string) => void; 
  onPurchase: (avatar: Avatar) => void;
  tierColor: string;
}) {
  const canAfford = coins >= avatar.price;
  
  const handleClick = () => {
    if (owned) {
      onSelect(avatar.emoji);
    }
  };
  
  const handlePurchase = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!owned && canAfford) {
      onPurchase(avatar);
    }
  };
  
  return (
    <div 
      className={`${styles.avatarCard} ${owned ? styles.owned : ''} ${isCurrent ? styles.current : ''}`}
      style={{ borderColor: isCurrent ? tierColor : 'rgba(255,255,255,0.1)' }}
      onClick={handleClick}
    >
      <div className={styles.avatarEmoji}>{avatar.emoji}</div>
      <div className={styles.avatarName}>{avatar.name}</div>
      {avatar.price > 0 ? (
        <div className={styles.avatarPrice}>
          <i className="fas fa-coins"></i> {avatar.price}
        </div>
      ) : (
        <div className={styles.avatarFree}>FREE</div>
      )}
      {avatar.description && (
        <div className={styles.avatarDescription}>{avatar.description}</div>
      )}
      
      {owned ? (
        <button className={`${styles.avatarBtn} ${styles.equipBtn}`}>
          {isCurrent ? 'Equipped ✓' : 'Equip'}
        </button>
      ) : (
        <button 
          className={`${styles.avatarBtn} ${canAfford ? styles.buyBtn : styles.lockedBtn}`}
          onClick={handlePurchase}
          disabled={!canAfford}
        >
          {canAfford ? 'Buy' : `Need ${avatar.price - coins} more`}
        </button>
      )}
    </div>
  );
}