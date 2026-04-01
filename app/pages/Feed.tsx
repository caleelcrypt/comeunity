'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabaseClient';
import { useFeed } from '../hooks/useFeed';
import { useToast } from '../hooks/useToast';
import { CreatePostBar } from '../components/feed/CreatePostBar';
import { CategoryTabs } from '../components/feed/CategoryTabs';
import { PostCard } from '../components/feed/PostCard';
import { CreatePostModal } from '../components/feed/CreatePostModal';
import { CommentModal } from '../components/feed/CommentModal';
import { TipModal } from '../components/feed/TipModal';
import { ShareModal } from '../components/feed/ShareModal';
import { ReportModal } from '../components/feed/ReportModal';
import { ConfirmModal } from '../components/feed/ConfirmModal';
import { CelebrationPopup } from '../components/feed/CelebrationPopup';
import { EmptyFeed } from '../components/feed/EmptyFeed';
import { DashboardSidebar } from '../components/dashboard/DashboardSidebar';
import { SearchModal } from '../components/dashboard/SearchModal';
import { NotificationModal } from '../components/dashboard/NotificationModal';
import { ReviewPopup } from '../components/dashboard/ReviewPopup';
import { Post } from '../types';
import styles from './Feed.module.css';

export default function FeedPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const feed = useFeed();
  
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [username, setUsername] = useState<string>('me');
  const [userProfile, setUserProfile] = useState<any>(null);
  
  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [showTipModal, setShowTipModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [showReviewPopup, setShowReviewPopup] = useState(false);
  
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [confirmConfig, setConfirmConfig] = useState<{ title: string; message: string; onConfirm: () => void } | null>(null);
  const [celebrationConfig, setCelebrationConfig] = useState<{ message: string; xp: number } | null>(null);

  // Fetch user data on mount
  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session?.user) {
        router.push('/auth');
        return;
      }

      setUser(session.user);

      // Fetch username and profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('username, full_name, avatar_url, xp, level, coins')
        .eq('id', session.user.id)
        .single();
      
      if (profile) {
        setUsername(profile.username);
        setUserProfile(profile);
      }

      setLoading(false);
    };

    fetchUserData();
  }, [router]);

  const handleOpenComment = (post: Post) => {
    setSelectedPost(post);
    setShowCommentModal(true);
  };

  const handleOpenTip = (post: Post) => {
    setSelectedPost(post);
    setShowTipModal(true);
  };

  const handleOpenShare = (post: Post) => {
    setSelectedPost(post);
    setShowShareModal(true);
  };

  const handleOpenReport = (post: Post) => {
    setSelectedPost(post);
    setShowReportModal(true);
  };

  const handleConfirm = (title: string, message: string, onConfirm: () => void) => {
    setConfirmConfig({ title, message, onConfirm });
    setShowConfirmModal(true);
  };

  const handleCelebration = (message: string, xp: number) => {
    setCelebrationConfig({ message, xp });
    setShowCelebration(true);
    setTimeout(() => setShowCelebration(false), 5000);
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className={styles.feedContainer}>
      <div className={styles.phoneFrame}>
        {/* Main Feed Content - Header is now handled by MainLayout */}
        <main className={styles.mainContent}>
          <CreatePostBar onClick={() => setShowCreateModal(true)} />
          
          <CategoryTabs 
            activeCategory={feed.filter} 
            onCategoryChange={feed.setFilter} 
          />
          
          <div className={styles.feedList}>
            {feed.loading && feed.posts.length === 0 ? (
              <div className={styles.loadingFeed}>
                <i className="fas fa-spinner fa-spin"></i>
                <p>Loading posts...</p>
              </div>
            ) : feed.posts.length === 0 ? (
              <EmptyFeed onCreatePost={() => setShowCreateModal(true)} />
            ) : (
              feed.posts.map(post => (
                <PostCard
                  key={post.id}
                  post={post}
                  onLike={() => feed.toggleLike(post.id)}
                  onFollow={() => feed.toggleFollow(post.author_id, post.id)}
                  onReport={() => handleOpenReport(post)}
                  onComment={() => handleOpenComment(post)}
                  onTip={() => handleOpenTip(post)}
                  onShare={() => handleOpenShare(post)}
                  onConfirm={handleConfirm}
                />
              ))
            )}
          </div>
        </main>

        {/* Modals */}
        <CreatePostModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onCreatePost={feed.createPost}
          onConfirm={handleConfirm}
          showToast={showToast}
        />

        <CommentModal
          isOpen={showCommentModal}
          onClose={() => setShowCommentModal(false)}
          post={selectedPost}
          onConfirm={handleConfirm}
          showToast={showToast}
        />

        <TipModal
          isOpen={showTipModal}
          onClose={() => setShowTipModal(false)}
          post={selectedPost}
          onConfirm={handleConfirm}
          showToast={showToast}
          onCelebration={handleCelebration}
        />

        <ShareModal
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
          post={selectedPost}
          showToast={showToast}
          onCelebration={handleCelebration}
        />

        <ReportModal
          isOpen={showReportModal}
          onClose={() => setShowReportModal(false)}
          post={selectedPost}
          onSubmitReport={feed.reportPost}
          onConfirm={handleConfirm}
          showToast={showToast}
        />

        <ConfirmModal
          isOpen={showConfirmModal}
          onClose={() => setShowConfirmModal(false)}
          config={confirmConfig}
        />

        <CelebrationPopup
          isOpen={showCelebration}
          config={celebrationConfig}
          onClose={() => setShowCelebration(false)}
        />

        <DashboardSidebar
          isOpen={showSidebar}
          onClose={() => setShowSidebar(false)}
          onOpenReviews={() => setShowReviewPopup(true)}
          showToast={showToast}
          userProfile={userProfile}
        />

        <SearchModal
          isOpen={showSearchModal}
          onClose={() => setShowSearchModal(false)}
          posts={feed.posts}
          showToast={showToast}
        />

        <NotificationModal
          isOpen={showNotificationModal}
          onClose={() => setShowNotificationModal(false)}
          showToast={showToast}
          onConfirm={handleConfirm}
        />

        <ReviewPopup
          isOpen={showReviewPopup}
          onClose={() => setShowReviewPopup(false)}
          showToast={showToast}
          onConfirm={handleConfirm}
        />
      </div>
    </div>
  );
}