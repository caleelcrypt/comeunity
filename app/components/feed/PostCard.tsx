// comeunity/app/components/feed/PostCard.tsx
import React, { useState, useEffect } from 'react';
import { Post } from '../../types';
import { Avatar } from '../common/Avatar';
import { LinkPreview } from './LinkPreview';
import { PostActions } from './PostActions';
import { getRelativeTime, renderMentionsInText } from '../../utils/helpers';

interface PostCardProps {
  post: Post & { is_own_post?: boolean };
  onLike: () => void;
  onFollow: () => void;
  onReport: () => void;
  onComment: () => void;
  onTip: () => void;
  onShare: () => void;
  onTreasure?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onConfirm: (title: string, message: string, onConfirm: () => void) => void;
  showToast?: (message: string, type?: string) => void;
}

export const PostCard: React.FC<PostCardProps> = ({
  post,
  onLike,
  onFollow,
  onReport,
  onComment,
  onTip,
  onShare,
  onTreasure,
  onEdit,
  onDelete,
  onConfirm,
  showToast
}) => {
  const hasLink = post.link && post.link.trim() !== "";
  const [showMenu, setShowMenu] = useState(false);
  const isOwnPost = post.is_own_post || false;

  const handleMentionClick = (username: string) => {
    onConfirm('View Profile', `View @${username}'s profile?`, () => {});
  };

  useEffect(() => {
    (window as any).handleMentionClick = handleMentionClick;
    return () => {
      delete (window as any).handleMentionClick;
    };
  }, []);

  const handleEdit = () => {
    setShowMenu(false);
    if (onEdit) onEdit();
  };

  const handleDelete = () => {
    setShowMenu(false);
    onConfirm(
      'Delete Post',
      '⚠️ Are you sure you want to delete this post? This action cannot be undone.',
      () => {
        if (onDelete) onDelete();
        if (showToast) showToast('🗑️ Post deleted');
      }
    );
  };

  const handleTreasure = () => {
    setShowMenu(false);
    if (onTreasure) onTreasure();
  };

  return (
    <div className="post-card">
      <div className="post-header">
        <Avatar 
          src={post.author_avatar} 
          alt={post.author_name}
          onClick={() => onConfirm('View Profile', `View ${post.author_name}'s profile?`, () => {})}
        />
        <div className="post-info">
          <div className="post-author-row">
            <span 
              className="post-author" 
              onClick={() => onConfirm('View Profile', `View ${post.author_name}'s profile?`, () => {})}
            >
              {post.author_name}
            </span>
            <span className="category-tag">
              {post.category}
            </span>
          </div>
          <div className="post-meta-row">
            {/* Hide follow button for own posts */}
            {!isOwnPost && (
              <button 
                className={`follow-btn ${(post as any).is_following ? 'following' : ''}`} 
                onClick={onFollow}
              >
                {(post as any).is_following ? '✓ Following' : '+ Follow'}
              </button>
            )}
            <div className="post-time">{getRelativeTime(new Date(post.created_at))}</div>
          </div>
        </div>
        <button className="more-menu-btn" onClick={() => setShowMenu(!showMenu)}>
          <i className="fas fa-ellipsis-v"></i>
        </button>
        <div className={`dropdown-menu ${showMenu ? 'show' : ''}`}>
          {/* Treasure Post - only for others' posts */}
          {!isOwnPost && onTreasure && (
            <div className="dropdown-item" onClick={handleTreasure}>
              <i className="fas fa-gem"></i> Treasure Post
            </div>
          )}
          
          {/* Edit Post - only for own posts */}
          {isOwnPost && onEdit && (
            <div className="dropdown-item" onClick={handleEdit}>
              <i className="fas fa-edit"></i> Edit Post
            </div>
          )}
          
          {/* Delete Post - only for own posts */}
          {isOwnPost && onDelete && (
            <div className="dropdown-item danger" onClick={handleDelete}>
              <i className="fas fa-trash-alt"></i> Delete Post
            </div>
          )}
          
          {/* Report - only for others' posts */}
          {!isOwnPost && (
            <div className="dropdown-item" onClick={onReport}>
              <i className="fas fa-flag"></i> Report
            </div>
          )}
          
          {/* Block User - only for others' posts */}
          {!isOwnPost && (
            <div className="dropdown-item danger" onClick={() => onConfirm('Block User', `Block @${post.author_name}? You won't see their posts anymore.`, () => {})}>
              <i className="fas fa-ban"></i> Block User
            </div>
          )}
        </div>
      </div>
      
      <div 
        className="post-content" 
        dangerouslySetInnerHTML={{ 
          __html: renderMentionsInText(post.content, handleMentionClick) 
        }}
      />
      
      {hasLink && (
        <LinkPreview 
          url={post.link!} 
          onConfirm={onConfirm}
        />
      )}
      
      <PostActions
        liked={(post as any).is_liked}
        likes={post.likes_count}
        comments={post.comments_count}
        onLike={onLike}
        onComment={onComment}
        onTip={onTip}
        onShare={onShare}
        isOwnPost={isOwnPost}
        showToast={showToast}
      />
    </div>
  );
};