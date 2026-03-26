'use client';
import React, { useState, useEffect } from 'react';
import styles from './EditProfileModal.module.css';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: {
    first_name: string;
    last_name: string;
    username: string;
    bio: string;
    category: string;
  };
  onSave: (data: {
    first_name: string;
    last_name: string;
    bio: string;
    category: string;
  }) => void;
}

const categories = [
  "Art", "Music", "Gaming", "Writing", "Photography",
  "Fitness", "Tech", "Fashion", "Food", "Dance", "Comedy", "Travel"
];

const categoryIcons: Record<string, string> = {
  Art: "🎨", Music: "🎵", Gaming: "🎮", Writing: "✍️", Photography: "📸",
  Fitness: "💪", Tech: "💻", Fashion: "👕", Food: "🍜", Dance: "💃", Comedy: "🎭", Travel: "✈️"
};

export default function EditProfileModal({ isOpen, onClose, profile, onSave }: EditProfileModalProps) {
  const [formData, setFormData] = useState({
    first_name: profile.first_name,
    last_name: profile.last_name,
    bio: profile.bio || '',
    category: profile.category || 'Art'
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData({
        first_name: profile.first_name,
        last_name: profile.last_name,
        bio: profile.bio || '',
        category: profile.category || 'Art'
      });
    }
  }, [isOpen, profile]);

  const handleSave = async () => {
    setSaving(true);
    await onSave(formData);
    setSaving(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={`${styles.overlay} ${isOpen ? styles.show : ''}`}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h3>Edit Profile</h3>
          <span className={styles.closeBtn} onClick={onClose}>&times;</span>
        </div>
        
        <div className={styles.field}>
          <label>First Name</label>
          <input
            type="text"
            placeholder="First Name"
            value={formData.first_name}
            onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
          />
        </div>
        
        <div className={styles.field}>
          <label>Last Name</label>
          <input
            type="text"
            placeholder="Last Name"
            value={formData.last_name}
            onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
          />
        </div>
        
        <div className={styles.field}>
          <label>Username</label>
          <input
            type="text"
            value={profile.username}
            disabled
            style={{ opacity: 0.6, cursor: 'not-allowed' }}
          />
          <small style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', display: 'block', marginTop: '4px' }}>
            Username cannot be changed
          </small>
        </div>
        
        <div className={styles.field}>
          <label>Bio</label>
          <textarea
            rows={3}
            placeholder="Tell us about yourself..."
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
          />
        </div>
        
        <div className={styles.field}>
          <label>Category</label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{categoryIcons[cat]} {cat}</option>
            ))}
          </select>
        </div>
        
        <button className={styles.saveBtn} onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}