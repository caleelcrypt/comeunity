'use client';
import React, { useState } from 'react';
import styles from './AchievementsModal.module.css';

interface Achievement {
  id: string;
  name: string;
  icon: string;
  description: string;
  unlocked: boolean;
  category: string;
}

interface AchievementsModalProps {
  isOpen: boolean;
  onClose: () => void;
  achievements: Achievement[];
}

const categories = ['All', 'Level', 'Creator', 'Streak', 'Generosity', 'Engagement', 'Collector'];

export default function AchievementsModal({ isOpen, onClose, achievements }: AchievementsModalProps) {
  const [selectedCategory, setSelectedCategory] = useState('All');

  if (!isOpen) return null;

  const filteredAchievements = selectedCategory === 'All'
    ? achievements
    : achievements.filter(a => a.category === selectedCategory);

  return (
    <div className={`modal ${isOpen ? 'show' : ''}`}>
      <div className="modal-content">
        <div className="modal-header">
          <h3>🏆 All Achievements</h3>
          <span className="close-modal" onClick={onClose}>&times;</span>
        </div>
        
        <div className="achievement-categories">
          {categories.map(cat => (
            <div
              key={cat}
              className={`category-chip ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </div>
          ))}
        </div>
        
        {filteredAchievements.map(ach => (
          <div
            key={ach.id}
            className="achievement-row"
            style={{ opacity: ach.unlocked ? 1 : 0.5, padding: '12px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}
          >
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div className="achievement-icon-small">{ach.icon}</div>
              <div>
                <strong>{ach.name}</strong>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>{ach.description}</div>
              </div>
            </div>
            {ach.unlocked ? (
              <i className="fas fa-check-circle" style={{ color: 'green' }}></i>
            ) : (
              <i className="fas fa-lock"></i>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}