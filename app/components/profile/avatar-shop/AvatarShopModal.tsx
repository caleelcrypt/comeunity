// app/components/profile/avatar-shop/AvatarShopModal2.tsx
'use client';
import React, { useState } from 'react';
import { 
  ALL_AVATARS, 
  tierConfig, 
  getNextAffordableAvatar,
  getCompletionPercentage,
  Avatar 
} from '../../../../lib/avatarData';

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

  const filteredAvatars = React.useMemo(() => {
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

  // Helper to get tier color safely
  const getTierColor = (tier: string): string => {
    const config = tierConfig[tier as keyof typeof tierConfig];
    return config?.color || '#6b7280';
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.95)',
      zIndex: 999999,
      overflow: 'auto',
      padding: '20px'
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        background: '#0a0a0f',
        borderRadius: '24px',
        padding: '24px',
        border: '1px solid rgba(255,77,109,0.3)'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h2 style={{ color: 'white', margin: 0 }}>🎨 Avatar Collection</h2>
          <button onClick={onClose} style={{ fontSize: '28px', background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>×</button>
        </div>
        
        {/* Stats */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(3, 1fr)', 
          gap: '12px', 
          marginBottom: '20px',
          background: 'rgba(255,255,255,0.05)',
          borderRadius: '16px',
          padding: '16px'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: '#ffd700', fontSize: '24px', fontWeight: 'bold' }}>{coins}</div>
            <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px' }}>Coins</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: '#ffd700', fontSize: '24px', fontWeight: 'bold' }}>{ownedCount}/{totalCount}</div>
            <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px' }}>Owned</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: '#ffd700', fontSize: '24px', fontWeight: 'bold' }}>{Math.round(completionPercentage)}%</div>
            <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px' }}>Complete</div>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ width: `${completionPercentage}%`, height: '100%', background: 'linear-gradient(90deg, #ffd700, #ff4d6d)' }}></div>
          </div>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
          <button 
            onClick={() => setSelectedTier('all')}
            style={{ padding: '8px 16px', background: selectedTier === 'all' ? '#ff4d6d' : '#2a2a3e', border: 'none', borderRadius: '20px', color: 'white', cursor: 'pointer' }}
          >
            All
          </button>
          {Object.keys(tierConfig).map(tier => (
            <button 
              key={tier}
              onClick={() => setSelectedTier(tier)}
              style={{ padding: '8px 16px', background: selectedTier === tier ? '#ff4d6d' : '#2a2a3e', border: 'none', borderRadius: '20px', color: 'white', cursor: 'pointer' }}
            >
              {tier}
            </button>
          ))}
          <button 
            onClick={() => setShowOwnedOnly(!showOwnedOnly)}
            style={{ padding: '8px 16px', background: showOwnedOnly ? '#10b981' : '#2a2a3e', border: 'none', borderRadius: '20px', color: 'white', cursor: 'pointer' }}
          >
            {showOwnedOnly ? 'Showing Owned' : 'Show Owned'}
          </button>
        </div>
        
        {/* Avatar Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '12px' }}>
          {filteredAvatars.map(avatar => {
            const owned = ownedAvatars.includes(avatar.emoji);
            const isCurrent = currentAvatar === avatar.emoji;
            const canAfford = coins >= avatar.price;
            
            return (
              <div key={avatar.emoji} style={{
                textAlign: 'center',
                padding: '12px',
                background: owned ? 'rgba(255,77,109,0.1)' : 'rgba(255,255,255,0.03)',
                borderRadius: '16px',
                border: isCurrent ? '2px solid #ff4d6d' : '1px solid rgba(255,255,255,0.1)',
                cursor: owned ? 'pointer' : 'default',
                transition: 'all 0.2s'
              }} onClick={() => owned && onSelectAvatar(avatar.emoji)}>
                <div style={{ fontSize: '48px' }}>{avatar.emoji}</div>
                <div style={{ color: 'white', fontSize: '12px', fontWeight: '500', marginTop: '8px' }}>{avatar.name}</div>
                {avatar.price > 0 ? (
                  <div style={{ color: '#ffd700', fontSize: '11px', marginTop: '4px' }}>{avatar.price} 🪙</div>
                ) : (
                  <div style={{ color: '#10b981', fontSize: '11px', marginTop: '4px' }}>FREE</div>
                )}
                {avatar.description && (
                  <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '9px', marginTop: '4px' }}>{avatar.description}</div>
                )}
                {owned ? (
                  <div style={{ color: isCurrent ? '#ff4d6d' : '#10b981', fontSize: '11px', marginTop: '8px' }}>
                    {isCurrent ? '✓ Equipped' : 'Owned'}
                  </div>
                ) : (
                  <button 
                    onClick={(e) => { e.stopPropagation(); onPurchase(avatar); }}
                    disabled={!canAfford}
                    style={{
                      marginTop: '8px',
                      padding: '6px 12px',
                      background: canAfford ? 'linear-gradient(135deg, #ff4d6d, #b5179e)' : '#555',
                      border: 'none',
                      borderRadius: '20px',
                      color: 'white',
                      fontSize: '11px',
                      fontWeight: '600',
                      cursor: canAfford ? 'pointer' : 'not-allowed',
                      width: '100%'
                    }}
                  >
                    {canAfford ? 'Buy' : `Need ${avatar.price - coins} more`}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}