'use client';
import React, { useState } from 'react';
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
    website: string;
    location: string;
  };
  onSave: (data: {
    first_name: string;
    last_name: string;
    bio: string;
    category: string;
    website: string;
    location: string;
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
    category: profile.category || 'Art',
    website: profile.website || '',
    location: profile.location || ''
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await onSave(formData);
    setSaving(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={`modal ${isOpen ? 'show' : ''}`}>
      <div className="modal-content">
        <div className="modal-header">
          <h3>Edit Profile</h3>
          <span className="close-modal" onClick={onClose}>&times;</span>
        </div>
        
        <input
          type="text"
          className="edit-input"
          placeholder="First Name"
          value={formData.first_name}
          onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
        />
        
        <input
          type="text"
          className="edit-input"
          placeholder="Last Name"
          value={formData.last_name}
          onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
        />
        
        <textarea
          className="edit-input"
          rows={3}
          placeholder="Bio"
          value={formData.bio}
          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
        />
        
        <select
          className="edit-input"
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>{categoryIcons[cat]} {cat}</option>
          ))}
        </select>
        
        <input
          type="text"
          className="edit-input"
          placeholder="Website"
          value={formData.website}
          onChange={(e) => setFormData({ ...formData, website: e.target.value })}
        />
        
        <input
          type="text"
          className="edit-input"
          placeholder="Location"
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
        />
        
        <button className="save-btn" onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}