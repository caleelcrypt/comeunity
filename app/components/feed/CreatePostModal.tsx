// comeunity/app/components/feed/CreatePostModal.tsx
import React, { useState, useRef, useEffect } from 'react';
import { useMentions } from '../../hooks/useMentions';
import { ShowToastFunction } from '../../types'; // Add this import

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreatePost: (content: string, link: string | undefined, category: string) => Promise<boolean>;
  onConfirm: (title: string, message: string, onConfirm: () => void) => void;
  showToast: ShowToastFunction; // Change to ShowToastFunction
}

const CATEGORIES = [
  { id: 'Challenge', label: '🏆 Challenge' },
  { id: 'Art', label: '🎨 Art' },
  { id: 'Music', label: '🎵 Music' },
  { id: 'Gaming', label: '🎮 Gaming' },
  { id: 'Writing', label: '✍️ Writing' },
  { id: 'Photography', label: '📸 Photography' },
  { id: 'Fitness', label: '💪 Fitness' },
  { id: 'Tech', label: '💻 Tech' },
  { id: 'Fashion', label: '👕 Fashion' },
  { id: 'Food', label: '🍜 Food' },
  { id: 'Dance', label: '💃 Dance' },
  { id: 'Comedy', label: '🎭 Comedy' },
  { id: 'Travel', label: '✈️ Travel' }
];

export const CreatePostModal: React.FC<CreatePostModalProps> = ({
  isOpen,
  onClose,
  onCreatePost,
  onConfirm,
  showToast
}) => {
  const [content, setContent] = useState('');
  const [link, setLink] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showTip, setShowTip] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const userEngagement = {
    'Jessica Parker': 12,
    'Mike Chen': 8,
    'Maya Rivera': 5,
    'Sarah Kim': 3
  };

  const {
    textareaRef,
    showSuggestions,
    suggestions,
    selectedIndex,
    handleInput,
    handleKeyDown,
    insertMention
  } = useMentions(userEngagement);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowCategoryDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setContent('');
      setLink('');
      setSelectedCategory('');
      setIsSubmitting(false);
      setTimeout(() => textareaRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    handleInput(e);
  };

  const getCharColor = () => {
    const len = content.length;
    if (len < 20) return 'red';
    if (len >= 90) return 'red';
    if (len >= 70) return 'orange';
    if (len >= 50) return 'yellow';
    return 'green';
  };

  const getXpPreview = () => {
    const mentions = content.match(/@(\w+)/g) || [];
    // Base XP: 50 for Challenge, 15 for regular
    let xp = selectedCategory === 'Challenge' ? 50 : 15;
    // Link bonus: +20 XP
    if (link) xp += 20;
    // Mention bonus: +10 XP per mention (max 3)
    xp += mentions.slice(0, 3).length * 10;
    return xp;
  };

  const getCoinPreview = () => {
    // Coins: 50 for Challenge, 5 for regular
    return selectedCategory === 'Challenge' ? 50 : 5;
  };

  const handleSubmit = async () => {
    console.log('Submit clicked', { content, link, selectedCategory });
    
    if (!content.trim()) {
      showToast('Please write something');
      return;
    }
    if (!selectedCategory) {
      showToast('Please select a category');
      return;
    }
    if (content.length < 20) {
      showToast('Post must be at least 20 characters');
      return;
    }
    if (content.length > 100) {
      showToast('Post must be 100 characters or less');
      return;
    }
    if (selectedCategory === 'Challenge' && !link) {
      showToast('⚠️ Challenge posts require a link!');
      return;
    }
    if (link && !link.startsWith('https://')) {
      showToast('Link must start with https://');
      return;
    }

    setIsSubmitting(true);
    console.log('Calling onCreatePost...');
    const success = await onCreatePost(content, link || undefined, selectedCategory);
    console.log('onCreatePost result:', success);
    setIsSubmitting(false);
    
    if (success) {
      const xpAmount = getXpPreview();
      const coinAmount = getCoinPreview();
      showToast(`✨ Post shared! +${xpAmount} XP +${coinAmount} Coins`, 'info'); // Changed from 'xp' to 'info'
      onClose();
    } else {
      showToast('Failed to create post. Please try again.', 'error');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal show" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-content">
        <div className="modal-header">
          <h3>
            Share Your Work 
            <span 
              className="glowing-yellow" 
              onClick={() => {
                setShowTip(true);
                setTimeout(() => setShowTip(false), 6000);
              }}
            >
              <i className="fas fa-lightbulb" style={{ color: 'var(--gold)' }}></i>
            </span>
          </h3>
          <span className="close-modal" onClick={onClose}>&times;</span>
        </div>
        
        {showTip && (
          <div className="tip-message show">
            💡 Tip: Type @ followed by a username to mention someone!
          </div>
        )}
        
        <div style={{ position: 'relative' }}>
          <textarea
            ref={textareaRef}
            className="post-input"
            rows={3}
            placeholder="Tell us about your work... (20–100 characters) Use @ to mention someone!"
            value={content}
            onChange={handleContentChange}
            onKeyDown={handleKeyDown}
          />
          {showSuggestions && suggestions.length > 0 && (
            <div className="mention-suggestions show">
              {suggestions.map((suggestion, idx) => (
                <div
                  key={suggestion.username}
                  className={`mention-suggestion-item ${idx === selectedIndex ? 'selected' : ''}`}
                  onClick={() => insertMention(suggestion.username)}
                >
                  <div className="mention-suggestion-avatar">{suggestion.avatar}</div>
                  <div className="mention-suggestion-info">
                    <div className="mention-suggestion-name">{suggestion.displayName}</div>
                    <div className="mention-suggestion-handle">@{suggestion.username}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className={`char-counter ${getCharColor()}`}>
          {content.length}/100
        </div>
        
        <input
          type="text"
          className="link-input"
          placeholder="https:// Paste your link (optional)"
          value={link}
          onChange={(e) => setLink(e.target.value)}
        />
        
        <div className="custom-select" ref={dropdownRef}>
          <div className="select-trigger" onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}>
            <span>{selectedCategory ? CATEGORIES.find(c => c.id === selectedCategory)?.label : 'Select Category'}</span>
            <i className="fas fa-chevron-down"></i>
          </div>
          <div className={`select-dropdown ${showCategoryDropdown ? 'show' : ''}`}>
            {CATEGORIES.map(cat => (
              <div
                key={cat.id}
                className="select-option"
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setShowCategoryDropdown(false);
                }}
              >
                {cat.label}
              </div>
            ))}
          </div>
        </div>
        
        <div className="xp-preview">
          {selectedCategory === 'Challenge' ? '🏆 Challenge Post' : '📝 Regular Post'} → 
          +{getXpPreview()} XP +{getCoinPreview()} Coins
          {link && ' (includes link bonus +20 XP)'}
          {content.match(/@(\w+)/g) && ` (includes ${Math.min(content.match(/@(\w+)/g)?.length || 0, 3)} mention bonus +${Math.min(content.match(/@(\w+)/g)?.length || 0, 3) * 10} XP)`}
        </div>
        
        <button 
          className="modal-submit" 
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Sharing...' : 'Share Post'}
        </button>
      </div>
    </div>
  );
};