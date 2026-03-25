'use client';
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '../../../lib/supabaseClient';
import styles from './LandingPage.module.css';

export default function LandingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showDropdown, setShowDropdown] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [ratingSubmitted, setRatingSubmitted] = useState(false);
  const [reviewText, setReviewText] = useState('');
  const [creatorCount, setCreatorCount] = useState(1234);
  const [toast, setToast] = useState<string | null>(null);

  // Mock data for trending creators
  const trendingCreators = [
    { username: 'caleel_ceo', xp: 1250, views: '1,240', icon: '🎨' },
    { username: 'creative_mind', xp: 890, likes: '89', icon: '🎬' },
    { username: 'collab_king', xp: 670, views: '2,450', icon: '🏆' },
  ];

  // Mock data for leaderboard
  const leaderboard = [
    { name: 'Digital Art', members: '12.4K', online: 234, xp: '12,450', icon: '🎨' },
    { name: 'Music Makers', members: '8.7K', online: 156, xp: '8,900', icon: '🎵' },
    { name: 'Gaming Hub', members: '15.3K', online: 890, xp: '7,200', icon: '🎮' },
  ];

  // Save referral code to localStorage
  useEffect(() => {
    const refCode = searchParams.get('ref');
    if (refCode) {
      localStorage.setItem('comeunity_referral', refCode);
    }
  }, [searchParams]);

  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.push('/feed');
      }
    };
    checkAuth();
  }, [router]);

  // Animate creator count
  useEffect(() => {
    const interval = setInterval(() => {
      setCreatorCount(prev => {
        if (prev < 1250) {
          return prev + Math.floor(Math.random() * 3);
        }
        clearInterval(interval);
        return prev;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const showToastMessage = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 2000);
  };

  const handleLogin = () => {
    router.push('/auth?tab=login');
  };

  const handleSignUp = () => {
    router.push('/auth?tab=signup');
  };

  const openReviewModal = () => {
    setShowRatingModal(true);
    setRating(0);
    setReviewText('');
    setShowDropdown(false);
  };

  const closeReviewModal = () => {
    setShowRatingModal(false);
  };

  const submitReview = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      closeReviewModal();
      router.push('/auth?tab=signup');
      return;
    }
    
    if (rating === 0) {
      showToastMessage("Please select a rating");
      return;
    }
    
    if (!reviewText.trim()) {
      showToastMessage("Please share your experience");
      return;
    }
    
    showToastMessage(`⭐ Thank you for your ${rating}-star review! +50 XP`);
    closeReviewModal();
    setCreatorCount(prev => prev + 1);
  };

  const showNotification = (message: string) => {
    showToastMessage(message);
    setShowDropdown(false);
  };

  // Navigate to legal pages
  const navigateToGuidelines = () => {
    router.push('/legal/guidelines');
    setShowDropdown(false);
  };

  const navigateToPrivacy = () => {
    router.push('/legal/privacy');
    setShowDropdown(false);
  };

  const navigateToTerms = () => {
    router.push('/legal/terms');
    setShowDropdown(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const dropdown = document.getElementById('landingDropdown');
      const menuButton = document.getElementById('landingMenuBtn');
      if (showDropdown && dropdown && menuButton && 
          !dropdown.contains(event.target as Node) && 
          !menuButton.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showDropdown]);

  return (
    <div className={styles.landingPage}>
      <div className={styles.landingContainer}>
        <div className={styles.landingWrapper}>
          {/* Header with Menu Button */}
          <div className={styles.landingHeader}>
            <div id="landingMenuBtn" className={styles.menuBtn} onClick={() => setShowDropdown(!showDropdown)}>
              <i className="fas fa-ellipsis-v"></i>
            </div>
            <div id="landingDropdown" className={`${styles.dropdown} ${showDropdown ? styles.dropdownOpen : ''}`}>
              <div className={styles.dropdownItem} onClick={navigateToGuidelines}>
                <i className="fas fa-handshake"></i>
                <span>ComeUnity Guidelines</span>
              </div>
              <div className={styles.dropdownItem} onClick={navigateToPrivacy}>
                <i className="fas fa-shield-alt"></i>
                <span>Privacy Policy</span>
              </div>
              <div className={styles.dropdownItem} onClick={navigateToTerms}>
                <i className="fas fa-file-contract"></i>
                <span>Terms of Service</span>
              </div>
              <div className={styles.dropdownDivider}></div>
              <div className={styles.dropdownItem} onClick={openReviewModal}>
                <i className="fas fa-star"></i>
                <span>Leave a Review</span>
              </div>
            </div>
          </div>

          {/* Logo Section */}
          <div className={styles.logoSection}>
            <div className={styles.logo}>
              <span>COME</span><span>UNITY</span>
            </div>
            <div className={styles.tagline}>The Home for Creators</div>
          </div>

          {/* Trending Card */}
          <div className={styles.trendingCard}>
            <div className={styles.cardHeader}>
              <i className="fas fa-fire"></i>
              <span>Trending Creators</span>
            </div>
            <div className={styles.trendingList}>
              {trendingCreators.map((creator, index) => (
                <div key={index} className={styles.trendingItem} onClick={() => showToastMessage(`Viewing @${creator.username}'s profile`)}>
                  <div className={styles.trendingIcon}>{creator.icon}</div>
                  <div className={styles.trendingInfo}>
                    <div className={styles.trendingTitle}>{creator.username}</div>
                    <div className={styles.trendingMeta}>{creator.icon === '🎨' ? 'Artist' : creator.icon === '🎬' ? 'Music' : 'Leaderboard'}</div>
                  </div>
                  <div className={styles.trendingValue}>{creator.views ? `+${creator.views} views` : creator.likes ? `${creator.likes} likes` : `🔥 ${creator.xp} XP`}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Leaderboard Card */}
          <div className={styles.leaderboardCard}>
            <div className={styles.cardHeader}>
              <i className="fas fa-trophy"></i>
              <span>Top Unities This Week</span>
            </div>
            <div className={styles.leaderboardList}>
              {leaderboard.map((item, index) => (
                <div key={index} className={styles.leaderboardItem} onClick={() => showToastMessage(`Viewing ${item.name}`)}>
                  <div className={styles.rankNumber}>{index + 1}</div>
                  <div className={styles.rankAvatar}>{item.icon}</div>
                  <div className={styles.rankInfo}>
                    <div className={styles.rankName}>{item.name}</div>
                    <div className={styles.rankStats}>{item.members} Units • {item.online} online</div>
                  </div>
                  <div className={styles.rankXp}>{item.xp} XP</div>
                </div>
              ))}
            </div>
          </div>

          {/* Auth Section */}
          <div className={styles.authSection}>
            <div className={styles.authButtons}>
              <button className={`${styles.authBtn} ${styles.loginBtn}`} onClick={handleLogin}>
                <i className="fas fa-sign-in-alt"></i> Log In
              </button>
              <button className={`${styles.authBtn} ${styles.signupBtn}`} onClick={handleSignUp}>
                <i className="fas fa-user-plus"></i> Sign Up
              </button>
            </div>
            <div className={styles.socialCount}>
              <i className="fas fa-users"></i>
              <span>Join <span className={styles.countNumber}>{creatorCount.toLocaleString()}</span> creators already here</span>
            </div>
          </div>
        </div>
      </div>

      {/* Review Modal - uses global modal styles */}
      <div className={`modal ${showRatingModal ? 'show' : ''}`}>
        <div className="modal-content">
          <div className="modal-header">
            <h3>Leave a Review</h3>
            <span className="close-modal" onClick={closeReviewModal}>&times;</span>
          </div>
          <div className="rating-stars">
            {[1, 2, 3, 4, 5].map((star) => (
              <i
                key={star}
                className={`fas fa-star star ${star <= (hoverRating || rating) ? 'active' : ''}`}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                style={{ cursor: 'pointer' }}
              ></i>
            ))}
          </div>
          <textarea
            className="review-textarea"
            rows={3}
            placeholder="Share your experience with ComeUnity..."
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
          ></textarea>
          <button className="submit-review-btn" onClick={submitReview}>
            Submit Review
          </button>
          <p style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.4)', textAlign: 'center', marginTop: '12px' }}>
            Your feedback helps us grow
          </p>
        </div>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div className="toast">
          <i className="fas fa-info-circle"></i> {toast}
        </div>
      )}
    </div>
  );
}