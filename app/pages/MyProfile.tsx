'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabaseClient';
import styles from './MyProfile.module.css';

// ============================================
// TYPES
// ============================================

type UserProfile = {
  id: string;
  first_name: string;
  last_name: string;
  full_name: string;
  username: string;
  email: string;
  xp: number;
  coins: number;
  streak: number;
  avatar: string;
  bio?: string;
  category?: string;
  website?: string;
  location?: string;
  followers_count: number;
  following_count: number;
  likes_given: number;
  created_at: string;
};

type Transaction = {
  id: string;
  type: string;
  amount: number;
  created_at: string;
};

type Post = {
  id: string;
  content: string;
  link?: string;
  link_domain?: string;
  link_title?: string;
  likes_count: number;
  comments_count: number;
  liked_by_user: boolean;
  created_at: string;
};

type Unity = {
  id: string;
  unity_name: string;
  unity_icon: string;
  joined_at: string;
};

type Achievement = {
  id: string;
  name: string;
  icon: string;
  description: string;
  unlocked: boolean;
  category: string;
};

// ============================================
// LEVEL SYSTEM
// ============================================

const calculateLevel = (xp: number): number => {
  return Math.floor(Math.sqrt(Math.max(0, xp) / 100)) + 1;
};

const getLevelTitle = (level: number): string => {
  const titles = ['Rookie', 'Newbie', 'Explorer', 'Adventurer', 'Master', 'Elite', 'Pro', 'Expert', 'Champion', 'Legend', 'Mythic', 'Godly'];
  return titles[Math.min(level - 1, titles.length - 1)] || 'Legend';
};

const getXPForNextLevel = (currentXP: number): number => {
  const level = calculateLevel(currentXP);
  return 100 * Math.pow(level, 2) - currentXP;
};

const getProgressToNextLevel = (currentXP: number): number => {
  const level = calculateLevel(currentXP);
  const currentLevelXP = 100 * Math.pow(level - 1, 2);
  const nextLevelXP = 100 * Math.pow(level, 2);
  const xpInLevel = currentXP - currentLevelXP;
  const xpNeeded = nextLevelXP - currentLevelXP;
  return (xpInLevel / xpNeeded) * 100;
};

// ============================================
// AVATAR DATA (from database)
// ============================================

const ALL_AVATARS = [
  // Free
  { emoji: "😎", name: "Cool Guy", price: 0, tier: "free" },
  { emoji: "😊", name: "Smiley", price: 0, tier: "free" },
  { emoji: "🦸", name: "Hero", price: 0, tier: "free" },
  { emoji: "🧙", name: "Wizard", price: 0, tier: "free" },
  { emoji: "🦊", name: "Fox", price: 0, tier: "free" },
  // Common
  { emoji: "🥷", name: "Ninja", price: 50, tier: "common" },
  { emoji: "🤠", name: "Cowboy", price: 50, tier: "common" },
  { emoji: "🐱", name: "Cat", price: 50, tier: "common" },
  { emoji: "🐶", name: "Dog", price: 50, tier: "common" },
  { emoji: "🦄", name: "Unicorn", price: 100, tier: "common" },
  // Rare
  { emoji: "🤖", name: "Robot", price: 150, tier: "rare" },
  { emoji: "👽", name: "Alien", price: 200, tier: "rare" },
  { emoji: "🐉", name: "Dragon", price: 300, tier: "rare" },
  // Epic
  { emoji: "🔥", name: "Phoenix", price: 600, tier: "epic" },
  { emoji: "👑", name: "Crown", price: 1000, tier: "legendary" },
];

// ============================================
// MAIN COMPONENT
// ============================================

export default function MyProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showToast, setShowToast] = useState<string | null>(null);
  
  // Data states
const [posts, setPosts] = useState<Post[]>([]);
const [unities, setUnities] = useState<Unity[]>([]);
const [transactions, setTransactions] = useState<Transaction[]>([]);
const [ownedAvatars, setOwnedAvatars] = useState<string[]>([]);
const [currentAvatar, setCurrentAvatar] = useState('😎'); // ← ADD THIS LINE
const [achievements, setAchievements] = useState<Achievement[]>([]);
  // Modal states
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAvatarShop, setShowAvatarShop] = useState(false);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [showAchievementsModal, setShowAchievementsModal] = useState(false);
  const [showLevelModal, setShowLevelModal] = useState(false);
  const [showStreakModal, setShowStreakModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  
  // Form states
  const [editForm, setEditForm] = useState({
    first_name: '',
    last_name: '',
    bio: '',
    category: 'Art',
    website: '',
    location: ''
  });
  
  const [pendingPurchase, setPendingPurchase] = useState<{ emoji: string; price: number; name: string } | null>(null);
  const [activeTab, setActiveTab] = useState<'posts' | 'unities' | 'treasure'>('posts');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // ============================================
  // DATA FETCHING
  // ============================================
  
  useEffect(() => {
    fetchAllData();
  }, []);
  
  const fetchAllData = async () => {
    setLoading(true);
    
    const { data: { user: authUser } } = await supabase.auth.getUser();
    
    if (!authUser) {
      router.push('/auth');
      return;
    }
    
    // 1. Fetch profile
    const { data: profileData } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", authUser.id)
      .single();
    
   if (profileData) {
  setProfile(profileData);
  setCurrentAvatar(profileData.avatar || '😎'); // ← ADD THIS LINE
  setEditForm({
    first_name: profileData.first_name,
    last_name: profileData.last_name,
    bio: profileData.bio || '',
    category: profileData.category || 'Art',
    website: profileData.website || '',
    location: profileData.location || ''
  });
}
    // 2. Fetch owned avatars
    const { data: avatarsData } = await supabase
      .from("user_avatars")
      .select("avatar_emoji")
      .eq("user_id", authUser.id);
    
    if (avatarsData && avatarsData.length > 0) {
      setOwnedAvatars(avatarsData.map(a => a.avatar_emoji));
    } else {
      setOwnedAvatars(['😎']);
    }
    
    // 3. Fetch posts
    const { data: postsData } = await supabase
      .from("posts")
      .select("*")
      .eq("user_id", authUser.id)
      .order("created_at", { ascending: false });
    
    if (postsData) {
      setPosts(postsData);
    }
    
    // 4. Fetch unities
    const { data: unitiesData } = await supabase
      .from("user_unities")
      .select("*")
      .eq("user_id", authUser.id);
    
    setUnities(unitiesData || []);
    
    // 5. Fetch transactions
    const { data: transactionsData } = await supabase
      .from("transactions")
      .select("*")
      .eq("user_id", authUser.id)
      .order("created_at", { ascending: false })
      .limit(20);
    
    setTransactions(transactionsData || []);
    
    // 6. Calculate achievements
    const xp = profileData?.xp || 0;
    const streak = profileData?.streak || 0;
    const postsCount = postsData?.length || 0;
    const avatarCount = avatarsData?.length || 1;
    
    const calculatedAchievements: Achievement[] = [
      { id: 'level_5', name: 'Level 5', icon: '⭐', description: 'Reach Level 5', unlocked: xp >= 1600, category: 'XP' },
      { id: 'level_10', name: 'Level 10', icon: '⭐⭐', description: 'Reach Level 10', unlocked: xp >= 8100, category: 'XP' },
      { id: 'first_post', name: 'First Creation', icon: '🎨', description: 'Create your first post', unlocked: postsCount >= 1, category: 'Creator' },
      { id: 'streak_7', name: 'Week Warrior', icon: '📅', description: '7 day streak', unlocked: streak >= 7, category: 'Streak' },
      { id: 'streak_30', name: 'Monthly Master', icon: '🏆', description: '30 day streak', unlocked: streak >= 30, category: 'Streak' },
      { id: 'first_avatar', name: 'Collector', icon: '🛍️', description: 'Own 5 avatars', unlocked: avatarCount >= 5, category: 'Collector' },
    ];
    setAchievements(calculatedAchievements);
    
    setLoading(false);
  };
  
  // ============================================
  // XP EARNING FUNCTION
  // ============================================
  
  const earnXP = async (amount: number, reason: string) => {
    if (!profile) return;
    
    const newXP = profile.xp + amount;
    
    await supabase
      .from("profiles")
      .update({ xp: newXP })
      .eq("id", profile.id);
    
    setProfile({ ...profile, xp: newXP });
    
    // Check level up
    const oldLevel = calculateLevel(profile.xp);
    const newLevel = calculateLevel(newXP);
    
    if (newLevel > oldLevel) {
      showToastMessage(`🎉 LEVEL UP! You're now Level ${newLevel} ${getLevelTitle(newLevel)}! 🎉`);
    }
    
    return newXP;
  };
  
  // ============================================
  // BUTTON HANDLERS
  // ============================================
  
  const showToastMessage = (msg: string) => {
    setShowToast(msg);
    setTimeout(() => setShowToast(null), 2500);
  };
  
  const handleEditProfile = () => {
    setShowEditModal(true);
  };
  
  const handleSaveProfile = async () => {
    if (!profile) return;
    setSaving(true);
    
    const { error } = await supabase
      .from("profiles")
      .update({
        first_name: editForm.first_name,
        last_name: editForm.last_name,
        full_name: `${editForm.first_name} ${editForm.last_name}`,
        bio: editForm.bio,
        category: editForm.category,
        website: editForm.website,
        location: editForm.location
      })
      .eq("id", profile.id);
    
    setSaving(false);
    
    if (!error) {
      setProfile({
        ...profile,
        first_name: editForm.first_name,
        last_name: editForm.last_name,
        full_name: `${editForm.first_name} ${editForm.last_name}`,
        bio: editForm.bio,
        category: editForm.category,
        website: editForm.website,
        location: editForm.location
      });
      setShowEditModal(false);
      showToastMessage('✅ Profile updated!');
    } else {
      showToastMessage('❌ Error updating profile');
    }
  };
  
  const handleShareProfile = () => {
    navigator.clipboard.writeText(`${window.location.origin}/profile/${profile?.username}`);
    showToastMessage('Profile link copied!');
  };
  
  const handleOpenAvatarShop = () => {
    setShowAvatarShop(true);
  };
  
  const handleSelectAvatar = async (emoji: string) => {
    if (!profile) return;
    
    if (ownedAvatars.includes(emoji)) {
      setCurrentAvatar(emoji);
      await supabase
        .from("profiles")
        .update({ avatar: emoji })
        .eq("id", profile.id);
      setProfile({ ...profile, avatar: emoji });
      setShowAvatarShop(false);
      showToastMessage(`Avatar changed to ${emoji}!`);
    } else {
      showToastMessage("You don't own this avatar yet!");
    }
  };
  
  const handleRequestPurchase = (emoji: string, price: number, name: string) => {
    if (ownedAvatars.includes(emoji)) {
      handleSelectAvatar(emoji);
      return;
    }
    setPendingPurchase({ emoji, price, name });
    setShowConfirmModal(true);
  };
  
  const handleConfirmPurchase = async () => {
    if (!profile || !pendingPurchase) return;
    
    if (profile.coins >= pendingPurchase.price) {
      const newCoins = profile.coins - pendingPurchase.price;
      
      await supabase
        .from("profiles")
        .update({ coins: newCoins })
        .eq("id", profile.id);
      
      await supabase
        .from("user_avatars")
        .insert({ user_id: profile.id, avatar_emoji: pendingPurchase.emoji });
      
      await supabase
        .from("transactions")
        .insert({
          user_id: profile.id,
          type: `Avatar Purchase: ${pendingPurchase.name}`,
          amount: pendingPurchase.price
        });
      
      setProfile({
        ...profile,
        coins: newCoins
      });
      setOwnedAvatars([...ownedAvatars, pendingPurchase.emoji]);
      setCurrentAvatar(pendingPurchase.emoji);
      
      setTransactions([
        {
          id: Date.now().toString(),
          type: `Avatar Purchase: ${pendingPurchase.name}`,
          amount: pendingPurchase.price,
          created_at: new Date().toISOString()
        },
        ...transactions
      ]);
      
      await earnXP(Math.floor(pendingPurchase.price / 10), `Purchased ${pendingPurchase.name} avatar`);
      
      setShowConfirmModal(false);
      setShowAvatarShop(false);
      showToastMessage(`✨ Purchased ${pendingPurchase.emoji} ${pendingPurchase.name}! +${Math.floor(pendingPurchase.price / 10)} XP`);
    } else {
      showToastMessage(`❌ Not enough coins! Need ${pendingPurchase.price - profile.coins} more.`);
    }
    setPendingPurchase(null);
  };
  
  const handleOpenLevelModal = () => {
    setShowLevelModal(true);
  };
  
  const handleOpenStreakModal = () => {
    setShowStreakModal(true);
  };
  
  const handleOpenAchievementsModal = () => {
    setShowAchievementsModal(true);
  };
  
  const handleOpenTransactionModal = () => {
    setShowTransactionModal(true);
  };
  
  const handleLikePost = async (postId: string) => {
    if (!profile) return;
    
    const post = posts.find(p => p.id === postId);
    if (!post) return;
    
    if (post.liked_by_user) {
      await supabase
        .from("likes")
        .delete()
        .eq("user_id", profile.id)
        .eq("post_id", postId);
      
      await supabase
        .from("posts")
        .update({ likes_count: post.likes_count - 1 })
        .eq("id", postId);
      
      setPosts(posts.map(p => 
        p.id === postId ? { ...p, likes_count: p.likes_count - 1, liked_by_user: false } : p
      ));
    } else {
      await supabase
        .from("likes")
        .insert({ user_id: profile.id, post_id: postId });
      
      await supabase
        .from("posts")
        .update({ likes_count: post.likes_count + 1 })
        .eq("id", postId);
      
      setPosts(posts.map(p => 
        p.id === postId ? { ...p, likes_count: p.likes_count + 1, liked_by_user: true } : p
      ));
      
      await earnXP(5, `Liked a post`);
      showToastMessage(`❤️ Liked post! +5 XP`);
    }
  };
  
  const handleTipPost = async (postId: string, postUserId: string) => {
    if (!profile) return;
    
    const tipAmount = 20;
    if (profile.coins >= tipAmount) {
      const newCoins = profile.coins - tipAmount;
      
      await supabase
        .from("profiles")
        .update({ coins: newCoins })
        .eq("id", profile.id);
      
      await supabase
        .from("profiles")
        .update({ coins: profile.coins + tipAmount })
        .eq("id", postUserId);
      
      await supabase
        .from("transactions")
        .insert({
          user_id: profile.id,
          type: 'Sent Tip',
          amount: tipAmount
        });
      
      setProfile({ ...profile, coins: newCoins });
      setTransactions([
        {
          id: Date.now().toString(),
          type: 'Sent Tip',
          amount: tipAmount,
          created_at: new Date().toISOString()
        },
        ...transactions
      ]);
      
      await earnXP(10, `Tipped a post`);
      showToastMessage(`💎 Tipped ${tipAmount} coins! +10 XP`);
    } else {
      showToastMessage(`❌ Insufficient coins! Need ${tipAmount - profile.coins} more.`);
    }
  };
  
  const handleCreatePost = () => {
    router.push('/create');
  };
  
  const handleDiscoverUnities = () => {
    router.push('/discover');
  };
  
  // ============================================
  // RENDER
  // ============================================
  
  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };
  
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };
  
  const categoryIcons: { [key: string]: string } = {
    Art: "🎨", Music: "🎵", Gaming: "🎮", Writing: "✍️", Photography: "📸",
    Fitness: "💪", Tech: "💻", Fashion: "👕", Food: "🍜", Dance: "💃", Comedy: "🎭", Travel: "✈️"
  };
  
  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.loadingSpinner}></div>
        <p>Loading your profile...</p>
      </div>
    );
  }
  
  const level = calculateLevel(profile?.xp || 0);
  const levelTitle = getLevelTitle(level);
  const nextXP = getXPForNextLevel(profile?.xp || 0);
  const progress = getProgressToNextLevel(profile?.xp || 0);
  const unlockedCount = achievements.filter(a => a.unlocked).length;
  
  return (
    <div className={styles.myProfilePage}>
      <div className={styles.container}>
        {/* Header */}
        <header className={styles.header}>
          <div className={styles.headerContent}>
            <div className={styles.leftGroup}>
              <div className={styles.menuIcon} onClick={() => router.push('/feed')}>
                <i className="fas fa-bars"></i>
              </div>
              <div className={styles.logo} onClick={() => router.push('/feed')}>
                <span>COME</span><span>UNITY</span>
              </div>
            </div>
            <div className={styles.headerActions}>
              <div className={styles.walletBadge} onClick={handleOpenTransactionModal}>
                <i className="fas fa-coins"></i> <span>{profile?.coins?.toLocaleString() || 0}</span>
              </div>
              <div className={styles.headerIcon}>
                <i className="far fa-bell"></i>
              </div>
            </div>
          </div>
        </header>
        
        <main className={styles.mainContent}>
          {/* Profile Header */}
          <div className={styles.profileHeader}>
            <div className={styles.profileCover}></div>
            <div className={styles.xpHeaderBadge} onClick={handleOpenLevelModal}>
              <i className="fas fa-star"></i> {profile?.xp || 0} XP
            </div>
            <div className={styles.profileInfo}>
              <div className={styles.avatarContainer} onClick={handleOpenAvatarShop}>
                <div className={styles.profileAvatarLarge}>{profile?.avatar || '😎'}</div>
                <div className={styles.avatarShopBadge}>
                  <i className="fas fa-shopping-cart"></i>
                </div>
              </div>
              <div className={styles.profileName}>
                {profile?.first_name} {profile?.last_name}
                <span className={`${styles.verificationBadge} ${styles.creator}`}>✓ Creator</span>
              </div>
              <div className={styles.profileHandle}>@{profile?.username}</div>
              <div className={styles.categoryTag}>
                {categoryIcons[profile?.category || 'Art']} {profile?.category || 'Art'}
              </div>
              <div className={styles.profileBio}>{profile?.bio || "No bio yet. Tap Edit to add one!"}</div>
              <div className={styles.profileStats}>
                <div className={styles.profileStat} onClick={() => showToastMessage(`${profile?.followers_count || 0} followers`)}>
                  <div className={styles.statNumber}>{formatNumber(profile?.followers_count || 0)}</div>
                  <div className={styles.statLabel}>Followers</div>
                </div>
                <div className={styles.profileStat} onClick={() => showToastMessage(`Following ${profile?.following_count || 0} creators`)}>
                  <div className={styles.statNumber}>{formatNumber(profile?.following_count || 0)}</div>
                  <div className={styles.statLabel}>Following</div>
                </div>
              </div>
              <div className={styles.profileActions}>
                <button className={`${styles.profileBtn} ${styles.primary}`} onClick={handleEditProfile}>
                  Edit Profile
                </button>
                <button className={styles.profileBtn} onClick={handleShareProfile}>
                  <i className="fas fa-share-alt"></i>
                </button>
              </div>
            </div>
          </div>
          
          {/* Player Status */}
          <div className={styles.playerStatus}>
            <div className={styles.statusRow}>
              <div className={styles.fameLevel}>
                <span className={styles.levelBadge} onClick={handleOpenLevelModal}>
                  Lvl {level} {levelTitle}
                </span>
                <div className={styles.levelProgress}>
                  <div className={styles.levelProgressFill} style={{ width: `${progress}%` }}></div>
                </div>
                <div className={styles.xpText}>{profile?.xp || 0} XP / {nextXP > 0 ? `${nextXP} to Lvl ${level + 1}` : 'MAX!'}</div>
              </div>
              <div className={styles.streakBadge} onClick={handleOpenStreakModal}>
                <i className="fas fa-fire"></i> {profile?.streak || 0} day streak
              </div>
            </div>
            <div className={styles.statsRowMini}>
              <div className={styles.statMini}>
                <div className={styles.statValueMini}>{posts.length}</div>
                <div className={styles.statLabel}>Posts</div>
              </div>
              <div className={styles.statMini}>
                <div className={styles.statValueMini}>{Math.floor((profile?.xp || 0) / 50)}</div>
                <div className={styles.statLabel}>Comments</div>
              </div>
              <div className={styles.statMini}>
                <div className={styles.statValueMini}>{profile?.likes_given || 0}</div>
                <div className={styles.statLabel}>Likes Given</div>
              </div>
            </div>
          </div>
          
          {/* Wallet Card */}
          <div className={styles.walletCard} onClick={handleOpenTransactionModal}>
            <div className={styles.walletBalance}>{profile?.coins?.toLocaleString() || 0} coins</div>
            <div className={styles.walletActions}>
              <div className={styles.walletBtn}>
                <i className="fas fa-history"></i> Transaction History
              </div>
            </div>
          </div>
          
          {/* Achievements Section */}
          <div className={styles.achievementsSection}>
            <div className={styles.achievementsHeader}>
              <h3>🏆 ACHIEVEMENTS</h3>
              <span className={styles.viewAll} onClick={handleOpenAchievementsModal}>
                {unlockedCount}/{achievements.length} Unlocked
              </span>
            </div>
            <div className={styles.achievementsGrid}>
              {achievements.filter(a => a.unlocked).slice(0, 3).map((ach) => (
                <div key={ach.id} className={`${styles.achievementItem} ${styles.unlocked}`} onClick={handleOpenAchievementsModal}>
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
            <div className={`${styles.profileTab} ${activeTab === 'posts' ? styles.active : ''}`} onClick={() => setActiveTab('posts')}>
              Posts ({posts.length})
            </div>
            <div className={`${styles.profileTab} ${activeTab === 'unities' ? styles.active : ''}`} onClick={() => setActiveTab('unities')}>
              Unities ({unities.length})
            </div>
            <div className={`${styles.profileTab} ${activeTab === 'treasure' ? styles.active : ''}`} onClick={() => setActiveTab('treasure')}>
              Treasure
            </div>
          </div>
          
          {/* Posts Tab */}
          {activeTab === 'posts' && (
            <div className={styles.postsTab}>
              {posts.length === 0 ? (
                <div className={styles.emptyPosts}>
                  <i className="fas fa-camera"></i>
                  <p>No posts yet. Create your first post!</p>
                  <button className={styles.createPostBtn} onClick={handleCreatePost}>
                    Create Post
                  </button>
                </div>
              ) : (
                posts.map(post => (
                  <div key={post.id} className={styles.postCard}>
                    <div className={styles.postHeader}>
                      <div className={styles.postAvatar}>{profile?.avatar || '😎'}</div>
                      <div>
                        <div className={styles.postAuthor}>{profile?.first_name} {profile?.last_name}</div>
                        <div className={styles.postTime}>{formatDate(post.created_at)}</div>
                      </div>
                    </div>
                    <div className={styles.postContent}>{post.content}</div>
                    {post.link && (
                      <div className={styles.linkPreview} onClick={() => window.open(post.link, '_blank')}>
                        <div className={styles.previewContent}>
                          <i className="fas fa-link"></i>
                          <div>
                            <div className={styles.previewDomain}>{post.link_domain}</div>
                            <div className={styles.previewTitle}>{post.link_title}</div>
                          </div>
                        </div>
                      </div>
                    )}
                    <div className={styles.postActions}>
                      <button className={`${styles.actionBtn} ${post.liked_by_user ? styles.liked : ''}`} onClick={() => handleLikePost(post.id)}>
                        <i className={`${post.liked_by_user ? 'fas' : 'far'} fa-heart`}></i> {post.likes_count}
                      </button>
                      <button className={styles.actionBtn} onClick={() => showToastMessage(`${post.comments_count} comments`)}>
                        <i className="far fa-comment"></i> {post.comments_count}
                      </button>
                      <button className={styles.actionBtn} onClick={() => handleTipPost(post.id, post.user_id)}>
                        <i className="fas fa-coins"></i> Tip
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
          
          {/* Unities Tab */}
          {activeTab === 'unities' && (
            <div className={styles.unitiesTab}>
              {unities.length === 0 ? (
                <div className={styles.emptyPosts}>
                  <i className="fas fa-users"></i>
                  <p>No unities joined yet. Explore and join some!</p>
                  <button className={styles.discoverBtn} onClick={handleDiscoverUnities}>
                    Discover Unities
                  </button>
                </div>
              ) : (
                unities.map(unity => (
                  <div key={unity.id} className={styles.unityCard} onClick={() => router.push(`/unity/${unity.unity_name}`)}>
                    <div className={styles.unityIcon}>{unity.unity_icon || '🎨'}</div>
                    <div className={styles.unityInfo}>
                      <div className={styles.unityName}>{unity.unity_name}</div>
                      <div className={styles.unityMeta}>Joined {formatDate(unity.joined_at)}</div>
                    </div>
                    <i className="fas fa-chevron-right"></i>
                  </div>
                ))
              )}
            </div>
          )}
          
          {/* Treasure Tab */}
          {activeTab === 'treasure' && (
            <div className={styles.treasureTab}>
              <div className={styles.emptyTreasure}>
                <i className="fas fa-box-open"></i>
                <p>No saved posts yet. Treasure posts you love!</p>
              </div>
            </div>
          )}
        </main>
      </div>
      
      {/* ============================================
          MODALS
      ============================================ */}
      
      {/* Edit Profile Modal */}
      <div className={`modal ${showEditModal ? 'show' : ''}`}>
        <div className="modal-content">
          <div className="modal-header">
            <h3>Edit Profile</h3>
            <span className="close-modal" onClick={() => setShowEditModal(false)}>&times;</span>
          </div>
          <input type="text" className="edit-input" placeholder="First Name" value={editForm.first_name} onChange={(e) => setEditForm({ ...editForm, first_name: e.target.value })} />
          <input type="text" className="edit-input" placeholder="Last Name" value={editForm.last_name} onChange={(e) => setEditForm({ ...editForm, last_name: e.target.value })} />
          <textarea className="edit-input" rows={3} placeholder="Bio" value={editForm.bio} onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })} />
          <select className="edit-input" value={editForm.category} onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}>
            <option value="Art">🎨 Art</option>
            <option value="Music">🎵 Music</option>
            <option value="Gaming">🎮 Gaming</option>
            <option value="Writing">✍️ Writing</option>
            <option value="Photography">📸 Photography</option>
            <option value="Fitness">💪 Fitness</option>
            <option value="Tech">💻 Tech</option>
            <option value="Fashion">👕 Fashion</option>
            <option value="Food">🍜 Food</option>
            <option value="Dance">💃 Dance</option>
            <option value="Comedy">🎭 Comedy</option>
            <option value="Travel">✈️ Travel</option>
          </select>
          <input type="text" className="edit-input" placeholder="Website" value={editForm.website} onChange={(e) => setEditForm({ ...editForm, website: e.target.value })} />
          <input type="text" className="edit-input" placeholder="Location" value={editForm.location} onChange={(e) => setEditForm({ ...editForm, location: e.target.value })} />
          <button className="save-btn" onClick={handleSaveProfile} disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
      
      {/* Transaction Modal */}
      <div className={`modal ${showTransactionModal ? 'show' : ''}`}>
        <div className="modal-content">
          <div className="modal-header">
            <h3>📜 Transaction History</h3>
            <span className="close-modal" onClick={() => setShowTransactionModal(false)}>&times;</span>
          </div>
          {transactions.length === 0 ? (
            <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.5)' }}>No transactions yet</p>
          ) : (
            transactions.map(t => (
              <div key={t.id} className="transaction-item">
                <span>{t.type}</span>
                <span>{t.amount} 🪙</span>
                <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>{formatDate(t.created_at)}</span>
              </div>
            ))
          )}
        </div>
      </div>
      
      {/* Achievements Modal */}
      <div className={`modal ${showAchievementsModal ? 'show' : ''}`}>
        <div className="modal-content">
          <div className="modal-header">
            <h3>🏆 All Achievements</h3>
            <span className="close-modal" onClick={() => setShowAchievementsModal(false)}>&times;</span>
          </div>
          <div className="achievement-categories">
            {['All', 'XP', 'Creator', 'Streak', 'Collector'].map(cat => (
              <div key={cat} className={`category-chip ${selectedCategory === cat ? 'active' : ''}`} onClick={() => setSelectedCategory(cat)}>
                {cat}
              </div>
            ))}
          </div>
          {achievements.filter(a => selectedCategory === 'All' || a.category === selectedCategory).map(ach => (
            <div key={ach.id} className="achievement-row" style={{ opacity: ach.unlocked ? 1 : 0.5, padding: '12px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div className="achievement-icon-small">{ach.icon}</div>
                <div>
                  <strong>{ach.name}</strong>
                  <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>{ach.description}</div>
                </div>
              </div>
              {ach.unlocked ? <i className="fas fa-check-circle" style={{ color: 'green' }}></i> : <i className="fas fa-lock"></i>}
            </div>
          ))}
        </div>
      </div>
      
      {/* Level Modal */}
      <div className={`modal ${showLevelModal ? 'show' : ''}`}>
        <div className="modal-content">
          <div className="modal-header">
            <h3>📊 Level Progression</h3>
            <span className="close-modal" onClick={() => setShowLevelModal(false)}>&times;</span>
          </div>
          <div className="level-grid">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(lvl => {
              const requiredXP = 100 * Math.pow(lvl - 1, 2);
              const isCurrent = lvl === level;
              return (
                <div key={lvl} className={`level-card-modal ${isCurrent ? 'current' : ''}`}>
                  <div>Level {lvl} {getLevelTitle(lvl)}</div>
                  <div style={{ fontSize: '11px' }}>{requiredXP.toLocaleString()} XP</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      {/* Streak Modal */}
      <div className={`modal ${showStreakModal ? 'show' : ''}`}>
        <div className="modal-content">
          <div className="modal-header">
            <h3>🔥 Streak Badges</h3>
            <span className="close-modal" onClick={() => setShowStreakModal(false)}>&times;</span>
          </div>
          <div className="streak-badges-grid">
            {[3, 7, 14, 21, 30, 50, 100].map(day => {
              const unlocked = (profile?.streak || 0) >= day;
              const icon = unlocked ? (day >= 30 ? "🏆" : "🔥") : "❄️";
              return (
                <div key={day} className="streak-badge-card" style={{ opacity: unlocked ? 1 : 0.5 }}>
                  <div className="streak-icon">{icon}</div>
                  <div>{unlocked ? '✅' : '🔒'} {day} Days</div>
                  <div style={{ fontSize: '10px' }}>{unlocked ? 'Earned' : 'Locked'}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      {/* Avatar Shop Modal */}
      <div className={`avatar-shop-modal ${showAvatarShop ? 'show' : ''}`}>
        <div className="shop-header">
          <h2>🎨 Avatar Shop</h2>
          <span className="close-modal" onClick={() => setShowAvatarShop(false)}>&times;</span>
        </div>
        <div style={{ padding: '0 20px' }}>
          <div className="wallet-badge" style={{ display: 'inline-flex' }}>
            <i className="fas fa-coins"></i> <span>{profile?.coins || 0}</span> coins
          </div>
        </div>
        <h3 style={{ padding: '0 20px', marginTop: '16px' }}>🎁 FREE AVATARS</h3>
        <div className="free-avatars-grid">
          {ALL_AVATARS.filter(a => a.price === 0).map(avatar => (
            <div key={avatar.emoji} className={`avatar-item ${profile?.avatar === avatar.emoji ? 'selected' : ''}`} onClick={() => handleSelectAvatar(avatar.emoji)}>
              <div className="avatar-preview">{avatar.emoji}</div>
              <div className="avatar-name">{avatar.name}</div>
              <div style={{ fontSize: '10px' }}>{ownedAvatars.includes(avatar.emoji) ? 'Owned' : 'Free'}</div>
            </div>
          ))}
        </div>
        <h3 style={{ padding: '0 20px' }}>✨ PREMIUM AVATARS</h3>
        <div className="premium-avatars-grid">
          {ALL_AVATARS.filter(a => a.price > 0).map(avatar => (
            <div key={avatar.emoji} className="premium-avatar-card" onClick={() => handleRequestPurchase(avatar.emoji, avatar.price, avatar.name)}>
              <div style={{ fontSize: '48px' }}>{avatar.emoji}</div>
              <div className="avatar-name">{avatar.name}</div>
              <div style={{ color: '#ffd700' }}>{avatar.price} 🪙</div>
              <button className="purchase-btn" style={ownedAvatars.includes(avatar.emoji) ? { opacity: 0.5 } : {}}>
                {ownedAvatars.includes(avatar.emoji) ? 'Owned' : 'Buy'}
              </button>
            </div>
          ))}
        </div>
      </div>
      
      {/* Confirm Purchase Modal */}
      <div className={`modal ${showConfirmModal ? 'show' : ''}`}>
        <div className="modal-content">
          <h3 style={{ marginBottom: '16px' }}>Confirm Purchase</h3>
          <p style={{ marginBottom: '20px' }}>Buy {pendingPurchase?.emoji} {pendingPurchase?.name} avatar for {pendingPurchase?.price} coins?</p>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="profile-btn primary" onClick={handleConfirmPurchase} style={{ background: 'linear-gradient(135deg, #ff4d6d, #4361ee)', color: 'white' }}>Yes</button>
            <button className="profile-btn" onClick={() => { setShowConfirmModal(false); setPendingPurchase(null); }}>No</button>
          </div>
        </div>
      </div>
      
      {/* Toast */}
      {showToast && (
        <div className="toast">
          {showToast}
        </div>
      )}
    </div>
  );
}