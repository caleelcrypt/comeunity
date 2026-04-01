import React from 'react';

interface CreatePostBarProps {
  onClick: () => void;
}

export const CreatePostBar: React.FC<CreatePostBarProps> = ({ onClick }) => {
  return (
    <div className="create-post-bar" onClick={onClick}>
      <i className="fas fa-pen-fancy" style={{ color: 'var(--gradient-2)' }}></i>
      <div className="create-input">Share your work with a link...</div>
      <i className="fas fa-link" style={{ color: 'var(--text-tertiary)' }}></i>
    </div>
  );
};