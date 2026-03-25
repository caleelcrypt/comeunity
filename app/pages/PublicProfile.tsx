'use client';
import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabaseClient';
import styles from './PublicProfile.module.css';

type UserProfile = {
  id: string;
  first_name: string;
  last_name: string;
  full_name: string;
  username: string;
  email: string;
  xp: number;
  own_referral_code: string;
  bio?: string;
  location?: string;
  website?: string;
  created_at: string;
};

type Post = {
  id: string;
  content: string;
  link?: string;
  link_domain?: string;
  link_title?: string;
  likes: number;
  liked_by_user: boolean;
  created_at: string;
  comments_count: number;
};

type Unity = {
  id: string;
  name: string;
  icon: string;
  members_count: number;
  role: string;
};

type Achievement = {
  id: string;
  name: string;
  icon: string;
  description: string;
  unlocked: boolean;
  category: string;
};

export default function PublicProfilePage() {
  const router = useRouter();
  const pathname = usePathname();
  const username = pathname?.split('/').pop() || '';
  
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [posts, setPosts] = useState<Post[]>([]);
  const [unities, setUnities] = useState<Unity[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [activeTab, setActiveTab] = useState<'posts' | 'unities'>('posts');
  const [loading, setLoading] = useState(true);
  const [visitorCoins, setVisitorCoins] = useState(0);
  const [selectedTipAmount, setSelectedTipAmount] = useState(50);
  const [showTipModal, setShowTipModal] = useState(false);
  const [showStreakModal, setShowStreakModal] = useState(false);
  const [showAchievementsModal, setShowAchievementsModal] = useState(false);
  const [showLevelModal, setShowLevelModal] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // Level thresholds
  const levelThresholds = [0, 500, 1200, 2100, 3200, 4500, 6000, 7700, 9600, 11700, 14000];
  const levelNames = ["Rookie", "Newbie", "Explorer", "Adventurer", "Master", "Elite", "Pro", "Expert", "Champion", "Legend", "Grandmaster"];

  const getLevel = (xp: number) => {
    let lvl = 0;
    for (let i = 1; i < levelThresholds.length; i++) {
      if (xp >= levelThresholds[i]) lvl = i;
    }
    return lvl;
  };

  const getNextLevelXP = (xp: number) => {
    let lvl = getLevel(xp);
    return lvl + 1 < levelThresholds.length ? levelThresholds[lvl + 1] : null;
  };

  const showToastMessage = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  useEffect(() => {
    if (username) {
      fetchData();
    }
  }, [username]);

  const fetchData = async () => {
    setLoading(true);
    
    // Get current user
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (authUser) {
      setCurrentUserId(authUser.id);
      const savedCoins = localStorage.getItem('comeunity_coins');
      setVisitorCoins(savedCoins ? parseInt(savedCoins) : 1250);
    }
    
    // Get profile by username
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("username", username)
      .single();
    
    if (profileError || !profileData) {
      console.error("Profile not found:", profileError);
      setLoading(false);
      return;
    }
    
    setProfile(profileData);
    
    // Get followers count
    const { count: followers } = await supabase
      .from("follows")
      .select("*", { count: 'exact', head: true })
      .eq("following_id", profileData.id);
    setFollowersCount(followers || 0);
    
    // Get following count
    const { count: following } = await supabase
      .from("follows")
      .select("*", { count: 'exact', head: true })
      .eq("follower_id", profileData.id);
    setFollowingCount(following || 0);
    
    // Check if current user follows this profile
    if (authUser) {
      const { data: followData } = await supabase
        .from("follows")
        .select("*")
        .eq("follower_id", authUser.id)
        .eq("following_id", profileData.id)
        .single();
      setIsFollowing(!!followData);
    }
    
    // Get posts (mock for now - you'll add posts table later)
    setPosts([]);
    
    // Get unities (mock data)
    setUnities([
      { id: '1', name: 'Digital Artists', icon: '🎨', members_count: 12400, role: 'Member' },
      { id: '2', name: 'Creator Collective', icon: '🚀', members_count: 5600, role: 'Member' }
    ]);
    
    // Get achievements based on XP
    setAchievements([
      { id: '1', name: 'Level 5', icon: '⭐', description: 'Reach Level 5', unlocked: profileData.xp >= 500, category: 'Level' },
      { id: '2', name: 'Level 10', icon: '⭐⭐', description: 'Reach Level 10', unlocked: profileData.xp >= 2100, category: 'Level' },
      { id: '3', name: 'First Tip', icon: '💎', description: 'Send your first tip', unlocked: false, category: 'Generosity' },
      { id: '4', name: 'Streak 7', icon: '🔥', description: '7 day streak', unlocked: false, category: 'Streak' },
      { id: '5', name: 'Liked', icon: '❤️', description: 'Receive 100 likes', unlocked: false, category: 'Engagement' }
    ]);
    
    setLoading(false);
  };

  const handleFollow = async () => {
    if (!currentUserId) {
      router.push('/auth');
      return;
    }
    
    if (isFollowing) {
      await supabase
        .from("follows")
        .delete()
        .eq("follower_id", currentUserId)
        .eq("following_id", profile?.id);
      setIsFollowing(false);
      setFollowersCount(prev => prev - 1);
      showToastMessage(`Unfollowed ${profile?.first_name}`);
    } else {
      await supabase
        .from("follows")
        .insert({
          follower_id: currentUserId,
          following_id: profile?.id
        });
      setIsFollowing(true);
      setFollowersCount(prev => prev + 1);
      showToastMessage(`✨ You're now following ${profile?.first_name}!`);
    }
  };

  const handleTip = async () => {
    if (!currentUserId) {
      router.push('/auth');
      return;
    }
    
    const amount = selectedTipAmount;
    if (visitorCoins < amount) {
      showToastMessage(`Insufficient coins! You have ${visitorCoins} coins.`);
      return;
    }
    
    const newCoins = visitorCoins - amount;
    setVisitorCoins(newCoins);
    localStorage.setItem('comeunity_coins', newCoins.toString());
    
    showToastMessage(`💎 You tipped ${amount} coins to ${profile?.first_name}!`);
    setShowTipModal(false);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const categoryIcons: { [key: string]: string } = {
    Art: "🎨", Music: "🎵", Gaming: "🎮", Writing: "✍️", Photography: "📸",
    Fitness: "💪", Tech: "💻", Fashion: "👕", Food: "🍜", Dance: "💃", Comedy: "🎭", Travel: "✈️"
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.loadingSpinner}></div>
        <p>Loading profile...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className={styles.notFound}>
        <i className="fas fa-user-slash"></i>
        <h2>User not found</h2>
        <p>This user doesn't exist or may have been deleted.</p>
        <button onClick={() => router.push('/feed')}>Go Home</button>
      </div>
    );
  }

  const level = getLevel(profile.xp);
  const nextXP = getNextLevelXP(profile.xp);
  const currentXP = levelThresholds[level];
  const progress = nextXP ? ((profile.xp - currentXP) / (nextXP - currentXP)) * 100 : 100;
  const categoryIcon = categoryIcons[profile.category as string] || "🎨";
  const unlockedAchievements = achievements.filter(a => a.unlocked).length;

  return (
    <div className={styles.profilePage}>
      <div className={styles.profileContainer}>
        {/* Header */}
        <header className={styles.header}>
          <div className={styles.headerContent}>
            <div className={styles.leftGroup}>
              <div className={styles.backIcon} onClick={() => router.back()}>
                <i className="fas fa-arrow-left"></i>
              </div>
              <div className={styles.logo} onClick={() => router.push('/feed')}>
                <span>COME</span><span>UNITY</span>
              </div>
            </div>
            <div className={styles.headerActions}>
              <div className={styles.headerIcon}><i className="far fa-bell"></i></div>
              <div className={styles.headerIcon}><i className="fas fa-ellipsis-v"></i></div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className={styles.mainContent}>
          {/* Profile Header Card */}
          <div className={styles.profileHeaderCard}>
            <div className={styles.profileCover}></div>
            <div className={styles.profileInfo}>
              <div className={styles.avatarContainer}>
                <div className={styles.avatarLarge}>😎</div>
              </div>
              <div className={styles.profileName}>
                {profile.first_name} {profile.last_name}
                <span className={styles.verificationBadge}>✓✓ Creator</span>
              </div>
              <div className={styles.profileHandle}>@{profile.username}</div>
              <div className={styles.categoryTag}>{categoryIcon} Creator</div>
              {profile.bio && <div className={styles.profileBio}>{profile.bio}</div>}
              
              <div className={styles.profileStats}>
                <div className={styles.profileStat} onClick={() => showToastMessage(`${followersCount.toLocaleString()} followers`)}>
                  <div className={styles.statNumber}>{formatNumber(followersCount)}</div>
                  <div className={styles.statLabel}>Followers</div>
                </div>
                <div className={styles.profileStat} onClick={() => showToastMessage(`Following ${followingCount} creators`)}>
                  <div className={styles.statNumber}>{formatNumber(followingCount)}</div>
                  <div className={styles.statLabel}>Following</div>
                </div>
              </div>
              
              <div className={styles.profileActions}>
                <button className={`${styles.profileBtn} ${isFollowing ? styles.followingBtn : styles.primaryBtn}`} onClick={handleFollow}>
                  <i className={`fas ${isFollowing ? 'fa-check' : 'fa-plus'}`}></i>
                  {isFollowing ? 'Following' : 'Follow'}
                </button>
                <button className={styles.profileBtn} onClick={() => setShowTipModal(true)}>
                  <i className="fas fa-coins"></i> Tip
                </button>
                <button className={styles.profileBtn} onClick={() => {
                  navigator.clipboard.writeText(`${window.location.origin}/profile/${profile.username}`);
                  showToastMessage('Profile link copied!');
                }}>
                  <i className="fas fa-share-alt"></i>
                </button>
              </div>
            </div>
          </div>

          {/* Level Card */}
          <div className={styles.levelCard} onClick={() => setShowLevelModal(true)}>
            <div className={styles.levelInfo}>
              <div className={styles.levelBadge}>Lvl {level} {levelNames[level]}</div>
              <div className={styles.levelProgressContainer}>
                <div className={styles.levelProgressBar}>
                  <div className={styles.levelProgressFill} style={{ width: `${progress}%` }}></div>
                </div>
                <div className={styles.xpText}>{profile.xp} / {nextXP || 'MAX'} XP</div>
              </div>
            </div>
            <i className="fas fa-chevron-right" style={{ color: 'rgba(255,255,255,0.4)' }}></i>
          </div>

          {/* Stats Banner */}
          <div className={styles.statsBanner}>
            <div className={styles.bannerStat}>
              <div className={styles.bannerValue}>{posts.length}</div>
              <div className={styles.bannerLabel}>Posts</div>
            </div>
            <div className={`${styles.bannerStat} ${styles.streakBadge}`} onClick={() => setShowStreakModal(true)}>
              <div className={styles.bannerValue}><i className="fas fa-fire"></i> 0</div>
              <div className={styles.bannerLabel}>Day Streak</div>
            </div>
            <div className={styles.bannerStat}>
              <div className={styles.bannerValue}>🏆 {unlockedAchievements}</div>
              <div className={styles.bannerLabel}>Achievements</div>
            </div>
          </div>

          {/* Achievements Preview */}
          <div className={styles.achievementsSection}>
            <div className={styles.achievementsHeader}>
              <h3>🏆 ACHIEVEMENTS</h3>
              <span className={styles.viewAll} onClick={() => setShowAchievementsModal(true)}>
                View All ({unlockedAchievements}/{achievements.length})
              </span>
            </div>
            <div className={styles.achievementsGrid}>
              {achievements.filter(a => a.unlocked).slice(0, 3).map((ach) => (
                <div key={ach.id} className={`${styles.achievementItem} ${styles.unlocked}`} onClick={() => setShowAchievementsModal(true)}>
                  <div className={styles.achievementIcon}>{ach.icon}</div>
                  <div className={styles.achievementName}>{ach.name}</div>
                </div>
              ))}
              {Array(3 - achievements.filter(a => a.unlocked).slice(0, 3).length).fill(0).map((_, i) => (
                <div key={`locked-${i}`} className={styles.achievementItem}>
                  <div className={styles.achievementIcon}>🔒</div>
                  <div className={styles.achievementName}>Locked</div>
                </div>
              ))}
            </div>
          </div>

          {/* Tabs */}
          <div className={styles.profileTabs}>
            <div className={`${styles.profileTab} ${activeTab === 'posts' ? styles.activeTab : ''}`} onClick={() => setActiveTab('posts')}>
              Posts
            </div>
            <div className={`${styles.profileTab} ${activeTab === 'unities' ? styles.activeTab : ''}`} onClick={() => setActiveTab('unities')}>
              Unities
            </div>
          </div>

          {/* Posts Tab */}
          {activeTab === 'posts' && (
            <div className={styles.postsTab}>
              {posts.length === 0 ? (
                <div className={styles.emptyPosts}>
                  <i className="fas fa-camera"></i>
                  <p>No posts yet</p>
                </div>
              ) : (
                posts.map(post => (
                  <div key={post.id} className={styles.postCard}>
                    {/* Post content */}
                  </div>
                ))
              )}
            </div>
          )}

          {/* Unities Tab */}
          {activeTab === 'unities' && (
            <div className={styles.unitiesTab}>
              {unities.map(unity => (
                <div key={unity.id} className={styles.unityCard} onClick={() => showToastMessage(`${unity.name} • ${unity.members_count.toLocaleString()} members`)}>
                  <div className={styles.unityIcon}>{unity.icon}</div>
                  <div className={styles.unityInfo}>
                    <div className={styles.unityName}>{unity.name}</div>
                    <div className={styles.unityMeta}>{unity.members_count.toLocaleString()} members</div>
                  </div>
                  <i className="fas fa-chevron-right"></i>
                </div>
              ))}
            </div>
          )}
        </main>

        {/* Bottom Navigation */}
        <nav className="bottom-nav">
          <div className="nav-item" onClick={() => router.push('/feed')}>
            <i className="fas fa-home"></i>
            <span>Home</span>
          </div>
          <div className="nav-item" onClick={() => router.push('/discover')}>
            <i className="fas fa-compass"></i>
            <span>Discover</span>
          </div>
          <div className="nav-item active" onClick={() => router.push(`/profile/${profile.username}`)}>
            <i className="fas fa-user"></i>
            <span>Profile</span>
          </div>
        </nav>
      </div>

      {/* Tip Modal - uses global modal styles */}
      <div className={`modal ${showTipModal ? 'show' : ''}`}>
        <div className="modal-content">
          <div className="modal-header">
            <h3><i className="fas fa-coins"></i> Tip Creator</h3>
            <span className="close-modal" onClick={() => setShowTipModal(false)}>&times;</span>
          </div>
          <p>Support <strong>@{profile.username}</strong> with a tip!</p>
          <div className="tip-amount-selector">
            {[10, 50, 100, 250].map(amount => (
              <div
                key={amount}
                className={`tip-amount ${selectedTipAmount === amount ? 'selected' : ''}`}
                onClick={() => setSelectedTipAmount(amount)}
              >
                {amount} 🪙
              </div>
            ))}
          </div>
          <input
            type="number"
            className="tip-custom-input"
            placeholder="Custom amount (min 5)"
            min="5"
            onChange={(e) => setSelectedTipAmount(parseInt(e.target.value) || 50)}
          />
          <button className="profile-btn primary" onClick={handleTip} style={{ marginTop: '16px' }}>
            Send Tip
          </button>
          <p className="tip-note">You have {visitorCoins} coins</p>
        </div>
      </div>

      {/* Achievements Modal */}
      <div className={`modal ${showAchievementsModal ? 'show' : ''}`}>
        <div className="modal-content">
          <div className="modal-header">
            <h3>🏆 All Achievements</h3>
            <span className="close-modal" onClick={() => setShowAchievementsModal(false)}>&times;</span>
          </div>
          <div className="achievements-list">
            {achievements.map(ach => (
              <div key={ach.id} className={`achievement-row ${ach.unlocked ? 'unlocked' : 'locked'}`}>
                <div className="achievement-icon-small">{ach.icon}</div>
                <div className="achievement-info">
                  <div className="achievement-name">{ach.name}</div>
                  <div className="achievement-desc">{ach.description}</div>
                </div>
                {ach.unlocked ? (
                  <i className="fas fa-check-circle" style={{ color: '#10b981' }}></i>
                ) : (
                  <i className="fas fa-lock" style={{ color: 'rgba(255,255,255,0.3)' }}></i>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Level Modal */}
      <div className={`modal ${showLevelModal ? 'show' : ''}`}>
        <div className="modal-content">
          <div className="modal-header">
            <h3>📊 Level Progression</h3>
            <span className="close-modal" onClick={() => setShowLevelModal(false)}>&times;</span>
          </div>
          <div className="level-grid-modal">
            {levelNames.slice(0, 11).map((name, i) => {
              const requiredXP = levelThresholds[i + 1];
              const isCurrent = i === level;
              return (
                <div key={i} className={`level-card-modal ${isCurrent ? 'current' : ''}`}>
                  <div className="level-number">Level {i}</div>
                  <div className="level-name">{name}</div>
                  <div className="level-xp">{requiredXP ? `${requiredXP.toLocaleString()} XP` : 'MAX'}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="toast">
          {toast}
        </div>
      )}
    </div>
  );
}