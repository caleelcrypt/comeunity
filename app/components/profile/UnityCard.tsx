'use client';
import React from 'react';
import styles from './UnityCard.module.css';

interface UnityCardProps {
  name: string;
  icon: string;
  members: number;
  tag: 'founder' | 'contributor' | 'member';
  onView: () => void;
}

export default function UnityCard({ name, icon, members, tag, onView }: UnityCardProps) {
  const tagConfig = {
    founder: { label: '🏆 FOUNDER', class: styles.tagFounder },
    contributor: { label: '🤝 CONTRIBUTOR', class: styles.tagContributor },
    member: { label: 'MEMBER', class: styles.tagMember }
  };

  return (
    <div className={styles.unityCard} onClick={onView}>
      <div className={styles.unityLeft}>
        <div className={styles.unityIconLarge}>{icon}</div>
        <div className={styles.unityInfo}>
          <div className={styles.unityName}>
            {name}
            <span className={tagConfig[tag].class}>{tagConfig[tag].label}</span>
          </div>
          <div className={styles.unityStats}>{members.toLocaleString()} units • active</div>
        </div>
      </div>
      <button className={styles.viewUnityBtn} onClick={(e) => { e.stopPropagation(); onView(); }}>
        View Unity <i className="fas fa-arrow-right"></i>
      </button>
    </div>
  );
}