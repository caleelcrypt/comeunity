import React from 'react';

interface EmptyFeedProps {
  onCreatePost: () => void;
}

export const EmptyFeed: React.FC<EmptyFeedProps> = ({ onCreatePost }) => {
  return (
    <div style={{ 
      textAlign: 'center', 
      padding: '60px 20px',
      background: 'var(--surface-glass)',
      borderRadius: '32px',
      border: '1px solid var(--border-glass)'
    }}>
      <i className="fas fa-newspaper" style={{ 
        fontSize: '48px', 
        color: 'var(--text-tertiary)',
        marginBottom: '16px',
        display: 'block'
      }}></i>
      <h3 style={{ marginBottom: '8px' }}>No posts yet</h3>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
        Be the first to share something amazing!
      </p>
      <button 
        onClick={onCreatePost}
        style={{
          background: 'linear-gradient(135deg, var(--gradient-1), var(--gradient-3))',
          border: 'none',
          padding: '12px 24px',
          borderRadius: '100px',
          color: 'white',
          fontWeight: '600',
          cursor: 'pointer'
        }}
      >
        <i className="fas fa-plus"></i> Create First Post
      </button>
    </div>
  );
};