'use client';
import React from 'react';
import styles from './PostCard.module.css';

interface PostCardProps {
  avatar: string;
  author: string;
  time: string;
  content: string;
  link?: {
    url: string;
    domain: string;
    title: string;
  };
  likes: number;
  comments: number;
  liked: boolean;
  onLike: () => void;
  onComment: () => void;
  onTip: () => void;
}

export default function PostCard({
  avatar,
  author,
  time,
  content,
  link,
  likes,
  comments,
  liked,
  onLike,
  onComment,
  onTip
}: PostCardProps) {
  return (
    <div className={styles.postCard}>
      <div className={styles.postHeader}>
        <div className={styles.postAvatar}>{avatar}</div>
        <div>
          <div className={styles.postAuthor}>{author}</div>
          <div className={styles.postTime}>{time}</div>
        </div>
      </div>
      <div className={styles.postContent}>{content}</div>
      {link && (
        <div className={styles.linkPreview} onClick={() => window.open(link.url, '_blank')}>
          <div className={styles.previewContent}>
            <i className="fas fa-link"></i>
            <div>
              <div className={styles.previewDomain}>{link.domain}</div>
              <div className={styles.previewTitle}>{link.title}</div>
            </div>
          </div>
        </div>
      )}
      <div className={styles.postActions}>
        <button className={`${styles.actionBtn} ${liked ? styles.liked : ''}`} onClick={onLike}>
          <i className={`${liked ? 'fas' : 'far'} fa-heart`}></i> {likes}
        </button>
        <button className={styles.actionBtn} onClick={onComment}>
          <i className="far fa-comment"></i> {comments}
        </button>
        <button className={styles.actionBtn} onClick={onTip}>
          <i className="fas fa-coins"></i> Tip
        </button>
      </div>
    </div>
  );
}