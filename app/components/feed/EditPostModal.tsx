// comeunity/app/components/feed/EditPostModal.tsx
import React, { useState, useEffect } from 'react';
import { Post } from '../../types';

interface EditPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: Post | null;
  onUpdatePost: (content: string, link: string | undefined) => Promise<boolean>;
  showToast: (message: string, type?: string) => void;
}

export const EditPostModal: React.FC<EditPostModalProps> = ({
  isOpen,
  onClose,
  post,
  onUpdatePost,
  showToast
}) => {
  const [content, setContent] = useState('');
  const [link, setLink] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && post) {
      setContent(post.content);
      setLink(post.link || '');
    }
  }, [isOpen, post]);

  const handleSubmit = async () => {
    if (!content.trim()) {
      showToast('Please write something');
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
    if (link && !link.startsWith('https://')) {
      showToast('Link must start with https://');
      return;
    }

    setIsSubmitting(true);
    const success = await onUpdatePost(content, link || undefined);
    setIsSubmitting(false);
    
    if (success) {
      showToast('✨ Post updated successfully!');
      onClose();
    } else {
      showToast('Failed to update post', 'error');
    }
  };

  if (!isOpen || !post) return null;

  const getCharColor = () => {
    const len = content.length;
    if (len < 20) return 'red';
    if (len >= 90) return 'red';
    if (len >= 70) return 'orange';
    if (len >= 50) return 'yellow';
    return 'green';
  };

  return (
    <div className="modal show" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-content">
        <div className="modal-header">
          <h3>Edit Your Post</h3>
          <span className="close-modal" onClick={onClose}>&times;</span>
        </div>
        
        <textarea
          className="post-input"
          rows={3}
          placeholder="Tell us about your work... (20–100 characters)"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        
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
        
        <button 
          className="modal-submit" 
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
};