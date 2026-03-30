'use client';
import React, { useState, useEffect } from 'react';
import TipModal from './Modals/TipModal';
import { supabase } from '../../../lib/supabaseClient';
import Toast from './Toast/Toast';
import ConfirmModal from './Modals/ConfirmModal';
import LevelModal from './Modals/LevelModal';
import AchievementsModal from './Modals/AchievementsModal';
import StreakModal from './Modals/StreakModal';

interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  full_name: string;
  username: string;
  bio: string;
  avatar: string;
  category?: string;
  xp: number;
  coins: number;
  followers_count: number;
  following_count: number;
  streak: number;
  created_at: string;
}

interface Post {
  id: string;
  content: string;
  media_url: string | null;
  likes_count: number;
  comments_count: number;
  created_at: string;
}

interface Unity {
  id: string;
  name: string;
  description: string;
  member_count: number;
}

interface Achievement {
  id: number;
  name: string;
  icon: string;
  description: string;
  requirement_type: string;
  requirement_value: number;
  unlocked: boolean;
}

interface PublicProfileProps {
  username: string;
}

const levelThresholds = [0, 500, 1200, 2100, 3200, 4500, 6000, 7700, 9600, 11700, 14000];
const levelNames = ["Rookie", "Newbie", "Explorer", "Adventurer", "Master", "Elite", "Pro", "Expert", "Champion", "Legend", "Grandmaster"];
const streakMilestones = [3, 7, 14, 21, 30, 50, 100];

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

const categoryIcons: Record<string, string> = {
  Art: "🎨", Music: "🎵", Gaming: "🎮", Writing: "✍️",
  Photography: "📸", Fitness: "💪", Tech: "💻", Fashion: "👕",
  Food: "🍜", Dance: "💃", Comedy: "🎭", Travel: "✈️"
};

const avatarCategories: Record<string, string> = {
  "😎": "Legendary", "🎨": "Mythical", "🚀": "Rare",
  "✨": "Epic", "👑": "Legendary", "🔥": "Mythical"
};

const PublicProfile: React.FC<PublicProfileProps> = ({ username }) => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [unities, setUnities] = useState<Unity[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [currentUserCoins, setCurrentUserCoins] = useState(0);
  const [activeTab, setActiveTab] = useState<'posts' | 'unities'>('posts');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showTipModal, setShowTipModal] = useState(false);
  const [showLevelModal, setShowLevelModal] = useState(false);
  const [showAchievementsModal, setShowAchievementsModal] = useState(false);
  const [showStreakModal, setShowStreakModal] = useState(false);
  const [toast, setToast] = useState<{ title: string; message: string; xpGain?: number; isError?: boolean } | null>(null);

  // ========== JWT AUTO-REFRESH HANDLING ==========
  
  // Session refresh on mount
  useEffect(() => {
    const refreshSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error && error.message === 'JWT expired') {
        console.log('Token expired, refreshing...');
        const { data, error: refreshError } = await supabase.auth.refreshSession();
        if (refreshError) {
          console.error('Failed to refresh token:', refreshError);
        } else {
          console.log('Token refreshed successfully');
        }
      }
    };
    
    refreshSession();
    
    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'TOKEN_REFRESHED') {
          console.log('Token refreshed');
        } else if (event === 'SIGNED_OUT') {
          console.log('User signed out');
          setCurrentUserId(null);
          setIsFollowing(false);
        }
      }
    );
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  
  // Auto-refresh token every 50 minutes
  useEffect(() => {
    const interval = setInterval(async () => {
      console.log('Auto-refreshing session...');
      const { data, error } = await supabase.auth.refreshSession();
      if (error) {
        console.error('Auto-refresh failed:', error);
      } else {
        console.log('Session auto-refreshed');
      }
    }, 50 * 60 * 1000); // 50 minutes
    
    return () => clearInterval(interval);
  }, []);

  // ========== END JWT AUTO-REFRESH ==========

  useEffect(() => {
    getCurrentUser();
  }, []);

  useEffect(() => {
    if (username) {
      console.log('🔄 Username changed, fetching profile...');
      fetchProfile();
    }
  }, [username, currentUserId]);

  const getCurrentUser = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error && error.message === 'JWT expired') {
        console.log('Token expired, refreshing...');
        const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
        if (refreshError) {
          console.error('Failed to refresh:', refreshError);
          return;
        }
        if (refreshData.session?.user) {
          setCurrentUserId(refreshData.session.user.id);
          const { data: userProfile } = await supabase
            .from('profiles')
            .select('coins')
            .eq('id', refreshData.session.user.id)
            .single();
          if (userProfile) {
            setCurrentUserCoins(userProfile.coins || 0);
          }
        }
        return;
      }
      
      if (session?.user) {
        setCurrentUserId(session.user.id);
        const { data: userProfile } = await supabase
          .from('profiles')
          .select('coins')
          .eq('id', session.user.id)
          .single();
        if (userProfile) {
          setCurrentUserCoins(userProfile.coins || 0);
        }
      }
    } catch (err) {
      console.error('Error getting user:', err);
    }
  };

  const fetchAchievements = async (userId: string) => {
    try {
      console.log('🏆 Fetching achievements for user:', userId);
      
      const { data: allAchievementsData, error: allError } = await supabase
        .from('achievements')
        .select('*')
        .order('id');
      
      if (allError) {
        console.error('❌ Error fetching all achievements:', allError);
        return;
      }
      
      console.log('📋 Total achievements in DB:', allAchievementsData?.length);
      
      const { data: userAchievementsData, error: userError } = await supabase
        .from('user_achievements')
        .select('achievement_id')
        .eq('user_id', userId);
      
      if (userError) {
        console.error('❌ Error fetching user achievements:', userError);
        if (userError.code === '42P01') {
          console.log('⚠️ user_achievements table not found, creating empty achievements');
          setAchievements([]);
          return;
        }
      }
      
      const unlockedIds = userAchievementsData?.map(ua => ua.achievement_id) || [];
      console.log('🔓 Unlocked achievement IDs:', unlockedIds);
      
      const achievementsWithStatus: Achievement[] = (allAchievementsData || []).map(achievement => ({
        id: achievement.id,
        name: achievement.name,
        icon: achievement.icon,
        description: achievement.description,
        requirement_type: achievement.requirement_type,
        requirement_value: achievement.requirement_value,
        unlocked: unlockedIds.includes(achievement.id)
      }));
      
      console.log('🏆 Achievements loaded:', achievementsWithStatus.length);
      console.log('🏆 Unlocked count:', achievementsWithStatus.filter(a => a.unlocked).length);
      
      setAchievements(achievementsWithStatus);
      
    } catch (error) {
      console.error('❌ Error in fetchAchievements:', error);
      setAchievements([]);
    }
  };

  const fetchProfile = async () => {
    console.log('🚀 FETCHING PROFILE FOR USERNAME:', username);
    setLoading(true);
    
    try {
      // Check token before making request
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        const { data: refreshData } = await supabase.auth.refreshSession();
        if (!refreshData.session) {
          console.log('No session, user may need to log in');
          setError('Please log in to view profiles');
          setLoading(false);
          return;
        }
      }
      
      const { data: profileData, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', username)
        .maybeSingle();
      
      if (fetchError) {
        if (fetchError.message === 'JWT expired') {
          console.log('JWT expired, refreshing...');
          await supabase.auth.refreshSession();
          return fetchProfile();
        }
        console.error('❌ Supabase error:', fetchError);
        setError(`Error: ${fetchError.message}`);
        setLoading(false);
        return;
      }
      
      if (!profileData) {
        console.log('❌ No profile found for username:', username);
        setError(`Profile "${username}" not found`);
        setLoading(false);
        return;
      }
      
      console.log('✅ Profile loaded:', profileData);
      setProfile(profileData);
      
      await fetchAchievements(profileData.id);
      
      const { data: postsData } = await supabase
        .from('posts')
        .select('*')
        .eq('user_id', profileData.id)
        .order('created_at', { ascending: false });
      setPosts(postsData || []);
      
      const { data: unityMembers } = await supabase
        .from('unity_members')
        .select('unity_id')
        .eq('user_id', profileData.id);
      
      if (unityMembers && unityMembers.length > 0) {
        const unityIds = unityMembers.map(um => um.unity_id);
        const { data: unitiesData } = await supabase
          .from('unities')
          .select('*')
          .in('id', unityIds);
        setUnities(unitiesData || []);
      }
      
      if (currentUserId) {
        console.log('🔍 Checking if user', currentUserId, 'follows', profileData.id);
        
        const { data: followData, error: followError } = await supabase
          .from('follows')
          .select('*')
          .eq('follower_id', currentUserId)
          .eq('following_id', profileData.id)
          .maybeSingle();
        
        console.log('🔍 Follow check result:', { followData, followError });
        
        if (followError) {
          console.error('❌ Error checking follow status:', followError);
        } else {
          setIsFollowing(!!followData);
          console.log('✅ Is following:', !!followData);
        }
      } else {
        console.log('⚠️ No currentUserId, cannot check follow status');
      }
      
    } catch (err) {
      console.error('❌ Unexpected error:', err);
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };
  
  const handleFollowToggle = async () => {
    if (!currentUserId || !profile) {
      console.log('❌ Cannot follow: missing currentUserId or profile');
      return;
    }
    
    console.log('🔄 Toggle follow for:', profile.username);
    console.log('Current follow state:', isFollowing);
    
    if (isFollowing) {
      console.log('📡 Attempting to unfollow...');
      const { data, error } = await supabase
        .from('follows')
        .delete()
        .eq('follower_id', currentUserId)
        .eq('following_id', profile.id)
        .select();
      
      console.log('📡 Unfollow result:', { data, error });
      
      if (!error) {
        setIsFollowing(false);
        setProfile(prev => ({ 
          ...prev!, 
          followers_count: Math.max(0, (prev!.followers_count || 0) - 1)
        }));
        showToast('Unfollowed', `You unfollowed ${profile.first_name}`);
      } else {
        console.error('❌ Unfollow error:', error);
        showToast('Error', 'Failed to unfollow', undefined, true);
      }
    } else {
      console.log('📡 Attempting to follow...');
      const { data, error } = await supabase
        .from('follows')
        .insert({ 
          follower_id: currentUserId, 
          following_id: profile.id 
        })
        .select();
      
      console.log('📡 Follow result:', { data, error });
      
      if (!error) {
        setIsFollowing(true);
        setProfile(prev => ({ 
          ...prev!, 
          followers_count: (prev!.followers_count || 0) + 1
        }));
        showToast('Followed', `You're now following ${profile.first_name}!`);
      } else {
        console.error('❌ Follow error:', error);
        showToast('Error', 'Failed to follow', undefined, true);
      }
    }
    setShowConfirmModal(false);
  };

  const createConfetti = () => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;
    for (let i = 0; i < 30; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti-particle';
      confetti.innerHTML = ['🎉', '✨', '💖', '⭐', '🪙', '🎊'][Math.floor(Math.random() * 6)];
      confetti.style.left = Math.random() * 100 + '%';
      confetti.style.bottom = '0px';
      confetti.style.fontSize = (Math.random() * 16 + 12) + 'px';
      confetti.style.animationDelay = Math.random() * 0.5 + 's';
      document.body.appendChild(confetti);
      setTimeout(() => confetti.remove(), 1500);
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const showToast = (title: string, message: string, xpGain?: number, isError?: boolean) => {
    setToast({ title, message, xpGain, isError });
    setTimeout(() => setToast(null), 3000);
  };

  const getAvatarCategory = (avatar: string) => avatarCategories[avatar] || "Common";

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="text-white">Loading profile...</div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="text-white text-center">
          <div className="text-6xl mb-4">😕</div>
          <p className="mb-4">{error || 'Profile not found'}</p>
          <a href="/feed" className="text-[#ff4d6d]">Go to Feed</a>
        </div>
      </div>
    );
  }

  const level = getLevel(profile.xp);
  const nextXP = getNextLevelXP(profile.xp);
  const currentXP = levelThresholds[level];
  const progress = nextXP ? ((profile.xp - currentXP) / (nextXP - currentXP)) * 100 : 0;
  const unlockedAchievements = achievements.filter(a => a.unlocked);
  const unlockedCount = unlockedAchievements.length;

  return (
    <div className="app-container">
      <div className="app-wrapper">
        <header className="app-header">
          <div className="header-content">
            <div className="left-group">
              <div className="back-icon" onClick={() => window.history.back()}>
                <i className="fas fa-arrow-left"></i>
              </div>
              <div className="logo"><span>COME</span><span>UNITY</span></div>
            </div>
            <div className="header-actions">
              <div className="header-icon"><i className="far fa-bell"></i></div>
              <div className="header-icon"><i className="fas fa-ellipsis-v"></i></div>
            </div>
          </div>
        </header>

        <main className="main-content">
          {/* Profile Header */}
          <div className="profile-header">
            <div className="profile-cover"></div>
            <div className="profile-info">
              <div className="avatar-container" onClick={() => showToast('Avatar Rarity', `✨ ${getAvatarCategory(profile.avatar)} ✨`)}>
                <div className="profile-avatar-large">{profile.avatar || '😎'}</div>
              </div>
              <div className="profile-name">
                {profile.first_name} {profile.last_name}
                <span className="verification-badge creator">Creator</span>
              </div>
              <div className="profile-handle">@{profile.username}</div>
              <div className="profile-handle">@{profile.username}</div>
<div className="category-tag">
  {profile.category && categoryIcons[profile.category as keyof typeof categoryIcons] 
    ? categoryIcons[profile.category as keyof typeof categoryIcons] 
    : '🎨'} 
  {profile.category || 'Creator'}
</div>
<div className="profile-bio">{profile.bio || 'No bio yet'}</div>
              <div className="profile-bio">{profile.bio || 'No bio yet'}</div>
              <div className="profile-stats">
                <div className="profile-stat" onClick={() => showToast('Followers', `${profile.followers_count.toLocaleString()} followers`)}>
                  <div className="stat-number">{formatNumber(profile.followers_count || 0)}</div>
                  <div className="stat-label">Followers</div>
                </div>
                <div className="profile-stat" onClick={() => showToast('Following', `Following ${profile.following_count} creators`)}>
                  <div className="stat-number">{formatNumber(profile.following_count || 0)}</div>
                  <div className="stat-label">Following</div>
                </div>
              </div>
              <div className="profile-actions">
                <button 
                  className={`profile-btn ${isFollowing ? 'following' : 'primary'}`}
                  onClick={() => setShowConfirmModal(true)}
                >
                  {isFollowing ? (
                    <><i className="fas fa-check"></i> Following</>
                  ) : (
                    <><i className="fas fa-plus"></i> Follow</>
                  )}
                </button>
                <button className="profile-btn" onClick={() => setShowTipModal(true)}>
                  <i className="fas fa-coins"></i> Tip
                </button>
                <button className="profile-btn" onClick={() => showToast('Share', 'Profile shared!')}>
                  <i className="fas fa-share-alt"></i>
                </button>
              </div>
            </div>
          </div>

          {/* Level Card */}
          <div className="level-card" onClick={() => setShowLevelModal(true)}>
            <div className="level-info">
              <div className="level-badge">Lvl {level} {levelNames[level]}</div>
              <div className="level-progress-container">
                <div className="level-progress-bar">
                  <div className="level-progress-fill" style={{ width: `${Math.min(100, progress)}%` }}></div>
                </div>
                <div className="xp-text">{profile.xp} / {nextXP || 'MAX'} XP</div>
              </div>
            </div>
            <i className="fas fa-chevron-right" style={{ color: 'var(--text-tertiary)' }}></i>
          </div>

          {/* Stats Banner */}
          <div className="stats-banner">
            <div className="banner-stat">
              <div className="banner-value">{posts.length}</div>
              <div className="banner-label">Posts</div>
            </div>
            <div className="banner-stat streak-badge" onClick={() => setShowStreakModal(true)}>
              <div className="banner-value"><i className="fas fa-fire" style={{ color: '#ff4d6d' }}></i> {profile.streak}</div>
              <div className="banner-label">Day Streak</div>
            </div>
            <div className="banner-stat">
              <div className="banner-value">🏆 {unlockedCount}</div>
              <div className="banner-label">Achievements</div>
            </div>
          </div>

          {/* Achievements Section */}
          <div className="achievements-section">
            <div className="achievements-header">
              <h3>🏆 ACHIEVEMENTS</h3>
              <span style={{ color: 'var(--gradient-2)', cursor: 'pointer' }} onClick={() => setShowAchievementsModal(true)}>
                View All ({unlockedCount}/{achievements.length})
              </span>
            </div>
            <div className="achievements-grid">
              {unlockedAchievements.slice(0, 3).map(achievement => (
                <div key={achievement.id} className="achievement-item unlocked" onClick={() => setShowAchievementsModal(true)}>
                  <div className="achievement-icon">{achievement.icon}</div>
                  <div className="achievement-name">{achievement.name}</div>
                </div>
              ))}
              {unlockedAchievements.length < 3 && Array(3 - unlockedAchievements.length).fill(0).map((_, i) => (
                <div key={`locked-${i}`} className="achievement-item">
                  <div className="achievement-icon">🔒</div>
                  <div className="achievement-name">Locked</div>
                </div>
              ))}
            </div>
          </div>

          {/* Tabs */}
          <div className="profile-tabs">
            <div className={`profile-tab ${activeTab === 'posts' ? 'active' : ''}`} onClick={() => setActiveTab('posts')}>Posts</div>
            <div className={`profile-tab ${activeTab === 'unities' ? 'active' : ''}`} onClick={() => setActiveTab('unities')}>Unities</div>
          </div>

          {/* Content */}
          {activeTab === 'posts' ? (
            posts.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon"><i className="fas fa-file-alt"></i></div>
                <div className="empty-text">No posts</div>
                <div className="empty-sub">This creator hasn't shared anything yet</div>
              </div>
            ) : (
              <div className="posts-container">
                {posts.map(post => (
                  <div key={post.id} className="post-card">
                    <p className="post-content">{post.content}</p>
                    {post.media_url && (
                      <img src={post.media_url} alt="Post" className="post-media" />
                    )}
                    <div className="post-stats">
                      <span><i className="far fa-heart"></i> {post.likes_count || 0}</span>
                      <span><i className="far fa-comment"></i> {post.comments_count || 0}</span>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            unities.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon"><i className="fas fa-users"></i></div>
                <div className="empty-text">No unities joined</div>
                <div className="empty-sub">This creator hasn't joined any unities</div>
              </div>
            ) : (
              <div className="unities-container">
                {unities.map(unity => (
                  <div key={unity.id} className="unity-card">
                    <h4 className="unity-name">{unity.name}</h4>
                    <p className="unity-description">{unity.description}</p>
                    <div className="unity-stats">
                      <i className="fas fa-users"></i> {unity.member_count || 0} members
                    </div>
                  </div>
                ))}
              </div>
            )
          )}
        </main>

        <nav className="bottom-nav">
          <div className="nav-item"><i className="fas fa-home"></i><span>Home</span></div>
          <div className="nav-item"><i className="fas fa-compass"></i><span>Discover</span></div>
          <div className="nav-item active"><i className="fas fa-user"></i><span>Profile</span></div>
        </nav>
      </div>

      {/* Modals */}
      {showConfirmModal && (
        <ConfirmModal
          isOpen={showConfirmModal}
          creatorName={profile.first_name}
          isFollowing={isFollowing}
          onConfirm={handleFollowToggle}
          onClose={() => setShowConfirmModal(false)}
        />
      )}

      {showTipModal && (
  <TipModal
    isOpen={showTipModal}
    onClose={() => setShowTipModal(false)}
    creatorId={profile.id}
    creatorName={profile.first_name}
    creatorAvatar={profile.avatar}
    currentUserId={currentUserId!}
    currentUserCoins={currentUserCoins}
    onTipSuccess={() => {
      fetchProfile();
      fetchAchievements(currentUserId!);
    }}
  />
)}

      {showLevelModal && (
        <LevelModal
          isOpen={showLevelModal}
          currentXP={profile.xp}
          currentLevel={level}
          levelNames={levelNames}
          levelThresholds={levelThresholds}
          onClose={() => setShowLevelModal(false)}
        />
      )}

      {showAchievementsModal && (
        <AchievementsModal
          isOpen={showAchievementsModal}
          achievements={achievements}
          onClose={() => setShowAchievementsModal(false)}
        />
      )}

      {showStreakModal && (
        <StreakModal
          isOpen={showStreakModal}
          currentStreak={profile.streak}
          streakMilestones={streakMilestones}
          onClose={() => setShowStreakModal(false)}
        />
      )}

      {toast && (
        <Toast
          title={toast.title}
          message={toast.message}
          xpGain={toast.xpGain}
          isError={toast.isError}
        />
      )}

      <style jsx>{`
        @keyframes confetti-fall {
          0% { transform: translateY(-20px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100px) rotate(360deg); opacity: 0; }
        }
        .confetti-particle {
          position: fixed;
          pointer-events: none;
          z-index: 10001;
          animation: confetti-fall 1.5s ease-out forwards;
        }
        
        .posts-container { display: flex; flex-direction: column; gap: 16px; }
        .post-card { background: rgba(255,255,255,0.05); border-radius: 16px; padding: 16px; border: 1px solid rgba(255,255,255,0.05); }
        .post-content { color: rgba(255,255,255,0.9); margin-bottom: 12px; }
        .post-media { border-radius: 12px; margin-bottom: 12px; max-height: 256px; width: 100%; object-fit: cover; }
        .post-stats { display: flex; gap: 16px; color: rgba(255,255,255,0.4); font-size: 14px; }
        
        .unities-container { display: flex; flex-direction: column; gap: 12px; }
        .unity-card { background: rgba(255,255,255,0.05); border-radius: 16px; padding: 16px; border: 1px solid rgba(255,255,255,0.05); }
        .unity-name { font-weight: 600; color: white; margin-bottom: 4px; }
        .unity-description { color: rgba(255,255,255,0.6); font-size: 14px; margin-bottom: 8px; }
        .unity-stats { color: rgba(255,255,255,0.4); font-size: 12px; }
        
        .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
        .modal-close { font-size: 24px; cursor: pointer; color: rgba(255,255,255,0.4); }
        .modal-message { margin-bottom: 16px; }
        
        .levels-list { display: flex; flex-direction: column; gap: 8px; max-height: 400px; overflow-y: auto; }
        .level-item { display: flex; justify-content: space-between; padding: 12px; border-radius: 12px; background: rgba(255,255,255,0.03); }
        .level-item.current { background: rgba(255,77,109,0.1); border: 1px solid rgba(255,77,109,0.3); }
        .level-name { font-weight: 700; }
        .level-xp { font-size: 11px; color: rgba(255,255,255,0.6); }
        
        .achievements-list { display: flex; flex-direction: column; gap: 12px; max-height: 400px; overflow-y: auto; }
        .achievement-item-modal { display: flex; align-items: center; gap: 12px; padding: 12px; border-radius: 12px; background: rgba(255,255,255,0.03); border-bottom: 1px solid rgba(255,255,255,0.05); }
        .achievement-item-modal.unlocked { background: rgba(255,77,109,0.05); }
        .achievement-item-modal.locked { opacity: 0.5; }
        .achievement-icon-modal { width: 44px; height: 44px; background: linear-gradient(135deg, var(--gradient-1), var(--gradient-3)); border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 22px; }
        .achievement-info { flex: 1; }
        .achievement-name-modal { font-weight: 600; font-size: 14px; }
        .achievement-desc { font-size: 11px; color: rgba(255,255,255,0.4); }
        .unlocked-icon { color: #4ade80; font-size: 18px; }
        .locked-icon { color: rgba(255,255,255,0.3); font-size: 18px; }
        
        .streak-badges-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
        .streak-badge-card { background: rgba(255,255,255,0.03); border-radius: 16px; padding: 16px; text-align: center; }
        .streak-badge-card.unlocked { background: rgba(255,77,109,0.1); border: 1px solid rgba(255,77,109,0.3); }
        .streak-badge-card.locked { opacity: 0.5; }
        .streak-icon { font-size: 32px; margin-bottom: 8px; }
        .streak-day { font-size: 14px; }
        
        .tip-modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
        .tip-modal-header h2 { font-size: 20px; margin: 0; }
        .tip-footer { text-align: center; margin-top: 16px; }
        .tip-footer p { font-size: 12px; color: rgba(255,255,255,0.4); }
      `}</style>
    </div>
  );
};

export default PublicProfile;