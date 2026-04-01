'use client';
import React from 'react';
import styles from '../Auth.module.css';

const LandingPreview = () => {
  const hotCreators = [
    { name: 'Jessica Parker', role: 'Digital Artist', xp: 12450, avatar: '🎨', followers: '12.4K' },
    { name: 'Mike Chen', role: 'Music Producer', xp: 8920, avatar: '🎵', followers: '8.2K' },
    { name: 'Maya Rivera', role: 'Gaming Creator', xp: 15670, avatar: '🎮', followers: '15.1K' },
  ];

  const unities = [
    { name: 'Digital Artists', members: '4.2K', icon: '🎨', posts: '234' },
    { name: 'Music Makers', members: '3.1K', icon: '🎵', posts: '189' },
    { name: 'Gaming Hub', members: '5.6K', icon: '🎮', posts: '456' },
  ];

  return (
    <div className={styles.landingPreview}>
      <div className={styles.logoSection}>
        <div className={styles.logoIcon}>🎨</div>
        <div className={styles.logoText}>COMEUNITY</div>
        <p className={styles.tagline}>Create. Connect. Collab.</p>
      </div>

      <div className={styles.statsSection}>
        <div className={styles.stat}>
          <span className={styles.statValue}>50K+</span>
          <span className={styles.statLabel}>Active Creators</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue}>100K+</span>
          <span className={styles.statLabel}>Community Members</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue}>500K+</span>
          <span className={styles.statLabel}>Posts Shared</span>
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>
          <i className="fas fa-fire" style={{ color: '#ff4d6d' }}></i> Hottest Creators
        </h3>
        <div className={styles.creatorList}>
          {hotCreators.map(creator => (
            <div key={creator.name} className={styles.creatorCard}>
              <div className={styles.creatorAvatar}>{creator.avatar}</div>
              <div className={styles.creatorInfo}>
                <div className={styles.creatorName}>{creator.name}</div>
                <div className={styles.creatorRole}>{creator.role}</div>
                <div className={styles.creatorStats}>
                  <span><i className="fas fa-star"></i> {creator.xp} XP</span>
                  <span><i className="fas fa-users"></i> {creator.followers}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>
          <i className="fas fa-users" style={{ color: '#b5179e' }}></i> Active Unities
        </h3>
        <div className={styles.unityList}>
          {unities.map(unity => (
            <div key={unity.name} className={styles.unityCard}>
              <div className={styles.unityIcon}>{unity.icon}</div>
              <div className={styles.unityInfo}>
                <div className={styles.unityName}>{unity.name}</div>
                <div className={styles.unityStats}>
                  <span><i className="fas fa-users"></i> {unity.members} members</span>
                  <span><i className="fas fa-file-alt"></i> {unity.posts} posts</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.guidelines}>
        <h4>✨ ComeUnity Guidelines</h4>
        <ul>
          <li>🎨 Share your authentic work</li>
          <li>💖 Support fellow creators</li>
          <li>🚫 No hate speech or harassment</li>
          <li>💰 100% of tips go to creators</li>
        </ul>
      </div>
    </div>
  );
};

export default LandingPreview;