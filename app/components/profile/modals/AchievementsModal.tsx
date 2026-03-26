'use client';
import React, { useState, useMemo, useEffect } from 'react';
import styles from './AchievementsModal.module.css';

interface Achievement {
  id: string;
  name: string;
  icon: string;
  description: string;
  unlocked: boolean;
  category: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary' | 'mythic' | 'secret';
  xpReward?: number;
  earnedAt?: string;
}

interface AchievementsModalProps {
  isOpen: boolean;
  onClose: () => void;
  achievements: Achievement[];
  onShare?: (achievement: Achievement) => void;
}

const categories = [
  { id: 'all', name: 'All', icon: '🏆' },
  { id: 'level', name: 'Level', icon: '⭐' },
  { id: 'streak', name: 'Streak', icon: '🔥' },
  { id: 'creator', name: 'Creator', icon: '🎨' },
  { id: 'unity', name: 'Unity', icon: '🤝' },
  { id: 'generosity', name: 'Generosity', icon: '💝' },
  { id: 'collector', name: 'Collector', icon: '🛍️' },
  { id: 'community', name: 'Community', icon: '🤝' },
  { id: 'event', name: 'Event', icon: '🎉' },
  { id: 'secret', name: 'Secret', icon: '🤫' }
];

const rarityColors = {
  common: { bg: 'rgba(107, 114, 128, 0.2)', border: '#6b7280', text: '#9ca3af', glow: 'none' },
  rare: { bg: 'rgba(59, 130, 246, 0.2)', border: '#3b82f6', text: '#60a5fa', glow: '0 0 10px rgba(59, 130, 246, 0.3)' },
  epic: { bg: 'rgba(139, 92, 246, 0.2)', border: '#8b5cf6', text: '#a78bfa', glow: '0 0 10px rgba(139, 92, 246, 0.3)' },
  legendary: { bg: 'rgba(249, 115, 22, 0.2)', border: '#f97316', text: '#fb923c', glow: '0 0 15px rgba(249, 115, 22, 0.4)' },
  mythic: { bg: 'rgba(239, 68, 68, 0.2)', border: '#ef4444', text: '#f87171', glow: '0 0 20px rgba(239, 68, 68, 0.5)' },
  secret: { bg: 'linear-gradient(135deg, rgba(255, 77, 109, 0.2), rgba(67, 97, 238, 0.2))', border: 'transparent', text: '#ffd700', glow: '0 0 25px rgba(255, 215, 0, 0.6)' }
};

const rarityNames = {
  common: 'Common',
  rare: 'Rare',
  epic: 'Epic',
  legendary: 'Legendary',
  mythic: 'Mythic',
  secret: 'Secret'
};

export default function AchievementsModal({ isOpen, onClose, achievements, onShare }: AchievementsModalProps) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);
  const [filterRarity, setFilterRarity] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showUnlockedOnly, setShowUnlockedOnly] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (achievements.length > 0) {
      setLoading(false);
    }
  }, [achievements]);

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;
  const completionPercentage = totalCount > 0 ? (unlockedCount / totalCount) * 100 : 0;

  const filteredAchievements = useMemo(() => {
    let filtered = achievements;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(a => a.category.toLowerCase() === selectedCategory);
    }

    if (filterRarity !== 'all') {
      filtered = filtered.filter(a => a.rarity === filterRarity);
    }

    if (showUnlockedOnly) {
      filtered = filtered.filter(a => a.unlocked);
    }

    if (searchTerm) {
      filtered = filtered.filter(a => 
        a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered.sort((a, b) => {
      if (a.unlocked !== b.unlocked) return a.unlocked ? -1 : 1;
      const rarityOrder = { secret: 0, mythic: 1, legendary: 2, epic: 3, rare: 4, common: 5 };
      return (rarityOrder[a.rarity] || 0) - (rarityOrder[b.rarity] || 0);
    });
  }, [achievements, selectedCategory, filterRarity, searchTerm, showUnlockedOnly]);

  const getRarityStats = (rarity: string) => {
    const total = achievements.filter(a => a.rarity === rarity).length;
    const unlocked = achievements.filter(a => a.rarity === rarity && a.unlocked).length;
    return { total, unlocked, percentage: total ? (unlocked / total) * 100 : 0 };
  };

  if (!isOpen) return null;

  return (
    <div className={`${styles.overlay} ${isOpen ? styles.show : ''}`}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h3>
            <i className="fas fa-trophy"></i> Badges & Achievements
          </h3>
          <span className={styles.closeBtn} onClick={onClose}>&times;</span>
        </div>

        {loading ? (
          <div className={styles.loadingState}>
            <div className={styles.spinner}></div>
            <p>Loading achievements...</p>
          </div>
        ) : (
          <>
            {/* Stats Overview */}
            <div className={styles.statsOverview}>
              <div className={styles.statCard}>
                <div className={styles.statValue}>{unlockedCount}</div>
                <div className={styles.statLabel}>Badges Earned</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statValue}>{totalCount}</div>
                <div className={styles.statLabel}>Total Badges</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statValue}>{Math.round(completionPercentage)}%</div>
                <div className={styles.statLabel}>Completion</div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className={styles.progressSection}>
              <div className={styles.progressLabel}>
                <span>Journey Progress</span>
                <span>{unlockedCount}/{totalCount} Badges</span>
              </div>
              <div className={styles.progressBar}>
                <div className={styles.progressFill} style={{ width: `${completionPercentage}%` }}></div>
              </div>
            </div>

            {/* Search and Filters */}
            <div className={styles.filtersSection}>
              <div className={styles.searchBar}>
                <i className="fas fa-search"></i>
                <input
                  type="text"
                  placeholder="Search badges..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className={styles.filterRow}>
                <button
                  className={`${styles.filterChip} ${showUnlockedOnly ? styles.active : ''}`}
                  onClick={() => setShowUnlockedOnly(!showUnlockedOnly)}
                >
                  <i className="fas fa-check-circle"></i> Unlocked Only
                </button>
                
                <select 
                  className={styles.rarityFilter}
                  value={filterRarity}
                  onChange={(e) => setFilterRarity(e.target.value)}
                >
                  <option value="all">All Rarities</option>
                  <option value="secret">🤫 Secret</option>
                  <option value="mythic">🌟 Mythic</option>
                  <option value="legendary">👑 Legendary</option>
                  <option value="epic">💜 Epic</option>
                  <option value="rare">💙 Rare</option>
                  <option value="common">🤍 Common</option>
                </select>
              </div>
            </div>

            {/* Category Tabs */}
            <div className={styles.categories}>
              {categories.map(cat => {
                const categoryAchievements = achievements.filter(a => a.category.toLowerCase() === cat.id);
                const unlockedInCategory = categoryAchievements.filter(a => a.unlocked).length;
                const hasNew = categoryAchievements.some(a => a.unlocked && !a.earnedAt);
                
                return (
                  <button
                    key={cat.id}
                    className={`${styles.categoryTab} ${selectedCategory === cat.id ? styles.active : ''}`}
                    onClick={() => setSelectedCategory(cat.id)}
                  >
                    <span className={styles.categoryIcon}>{cat.icon}</span>
                    <span className={styles.categoryName}>{cat.name}</span>
                    {categoryAchievements.length > 0 && (
                      <span className={styles.categoryCount}>
                        {unlockedInCategory}/{categoryAchievements.length}
                      </span>
                    )}
                    {hasNew && <span className={styles.newDot}></span>}
                  </button>
                );
              })}
            </div>

            {/* Rarity Stats */}
            <div className={styles.rarityStats}>
              {Object.entries(rarityNames).map(([key, name]) => {
                const stats = getRarityStats(key);
                if (stats.total === 0) return null;
                return (
                  <div key={key} className={styles.rarityStatItem}>
                    <div className={styles.rarityStatLabel}>
                      <span className={styles.rarityDot} style={{ background: rarityColors[key as keyof typeof rarityColors].border }}></span>
                      <span>{name}</span>
                    </div>
                    <div className={styles.rarityStatBar}>
                      <div 
                        className={styles.rarityStatFill} 
                        style={{ 
                          width: `${stats.percentage}%`,
                          background: rarityColors[key as keyof typeof rarityColors].border
                        }}
                      ></div>
                    </div>
                    <div className={styles.rarityStatCount}>{stats.unlocked}/{stats.total}</div>
                  </div>
                );
              })}
            </div>

            {/* Achievements Grid */}
            <div className={styles.achievementsGrid}>
              {filteredAchievements.map(ach => (
                <div
                  key={ach.id}
                  className={`${styles.achievementCard} ${ach.unlocked ? styles.unlocked : styles.locked}`}
                  style={{
                    borderColor: ach.unlocked ? rarityColors[ach.rarity].border : 'rgba(255,255,255,0.1)',
                    boxShadow: ach.unlocked ? rarityColors[ach.rarity].glow : 'none'
                  }}
                  onClick={() => setSelectedAchievement(ach)}
                >
                  <div className={styles.achievementIcon} style={{ 
                    background: ach.unlocked ? rarityColors[ach.rarity].bg : 'rgba(255,255,255,0.05)'
                  }}>
                    {ach.icon}
                  </div>
                  <div className={styles.achievementInfo}>
                    <div className={styles.achievementName}>{ach.name}</div>
                    <div className={styles.achievementRarity} style={{ color: rarityColors[ach.rarity].text }}>
                      {rarityNames[ach.rarity]}
                    </div>
                  </div>
                  {ach.unlocked ? (
                    <div className={styles.unlockedBadge}>
                      <i className="fas fa-check-circle"></i>
                    </div>
                  ) : (
                    <div className={styles.lockedBadge}>
                      <i className="fas fa-lock"></i>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}

        {/* Achievement Detail Modal */}
        {selectedAchievement && (
          <div className={styles.detailOverlay} onClick={() => setSelectedAchievement(null)}>
            <div className={styles.detailModal} onClick={(e) => e.stopPropagation()}>
              <div className={styles.detailHeader}>
                <div className={styles.detailIcon} style={{
                  background: selectedAchievement.unlocked ? rarityColors[selectedAchievement.rarity].bg : 'rgba(255,255,255,0.05)',
                  border: `2px solid ${rarityColors[selectedAchievement.rarity].border}`
                }}>
                  {selectedAchievement.icon}
                </div>
                <button className={styles.detailClose} onClick={() => setSelectedAchievement(null)}>×</button>
              </div>
              
              <div className={styles.detailContent}>
                <h3>{selectedAchievement.name}</h3>
                <div className={styles.detailRarity} style={{ color: rarityColors[selectedAchievement.rarity].text }}>
                  {rarityNames[selectedAchievement.rarity]} Badge
                </div>
                <p className={styles.detailDescription}>{selectedAchievement.description}</p>
                
                {selectedAchievement.unlocked ? (
                  <>
                    <div className={styles.detailUnlocked}>
                      <i className="fas fa-check-circle"></i>
                      <span>Unlocked on {selectedAchievement.earnedAt || 'your journey'}</span>
                    </div>
                    {selectedAchievement.xpReward && (
                      <div className={styles.detailReward}>
                        <i className="fas fa-star"></i>
                        <span>+{selectedAchievement.xpReward} XP Earned</span>
                      </div>
                    )}
                    {onShare && (
                      <button 
                        className={styles.shareBtn}
                        onClick={() => onShare(selectedAchievement)}
                      >
                        <i className="fas fa-share-alt"></i> Share Badge
                      </button>
                    )}
                  </>
                ) : (
                  <div className={styles.detailLocked}>
                    <i className="fas fa-lock"></i>
                    <span>Locked</span>
                    <p className={styles.detailHint}>Complete the requirements to unlock this badge</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}