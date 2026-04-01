import React, { useState, useEffect } from 'react';
import { Post } from '../../types';
import { Avatar } from '../common/Avatar';
import { LinkPreview } from './LinkPreview';
import { PostActions } from './PostActions';
import { getRelativeTime, renderMentionsInText } from '../../utils/helpers';

interface PostCardProps {
  post: Post;
  onLike: () => void;
  onFollow: () => void;
  onReport: () => void;
  onComment: () => void;
  onTip: () => void;
  onShare: () => void;
  onConfirm: (title: string, message: string, onConfirm: () => void) => void;
}

export const PostCard: React.FC<PostCardProps> = ({
  post,
  onLike,
  onFollow,
  onReport,
  onComment,
  onTip,
  onShare,
  onConfirm
}) => {
  const hasLink = post.link && post.link.trim() !== "";
  const [showMenu, setShowMenu] = useState(false);

  const handleMentionClick = (username: string) => {
    onConfirm('View Profile', `View @${username}'s profile?`, () => {});
  };

  useEffect(() => {
    (window as any).handleMentionClick = handleMentionClick;
    return () => {
      delete (window as any).handleMentionClick;
    };
  }, []);

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
            <button 
              className={`follow-btn ${(post as any).is_following ? 'following' : ''}`} 
              onClick={onFollow}
            >
              {(post as any).is_following ? '✓ Following' : '+ Follow'}
            </button>
            <div className="post-time">{getRelativeTime(post.created_at)}</div>
          </div>
        </div>
        <button className="more-menu-btn" onClick={() => setShowMenu(!showMenu)}>
          <i className="fas fa-ellipsis-v"></i>
        </button>
        <div className={`dropdown-menu ${showMenu ? 'show' : ''}`}>
          <div className="dropdown-item" onClick={onReport}>
            <i className="fas fa-flag"></i> Report
          </div>
          <div className="dropdown-item danger" onClick={() => onConfirm('Block User', `Block @${post.author_name}? You won't see their posts anymore.`, () => {})}>
            <i className="fas fa-ban"></i> Block User
          </div>
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
      />
    </div>
  );
};