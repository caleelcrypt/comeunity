'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabaseClient';

// Component Imports
import ProfileHeader from '../components/profile/ProfileHeader';
import ProfileStats from '../components/profile/ProfileStats';
import LevelCard from '../components/profile/LevelCard';
import WalletCard from '../components/profile/WalletCard';
import AchievementsGrid from '../components/profile/AchievementsGrid';
import ProfileTabs from '../components/profile/ProfileTabs';
import UnityCard from '../components/profile/UnityCard';
import PostCard from '../components/profile/PostCard';
import EmptyState from '../components/profile/EmptyState';

// Modal Imports
import EditProfileModal from '../components/profile/modals/EditProfileModal';
import TransactionModal from '../components/profile/modals/TransactionModal';
import AchievementsModal from '../components/profile/modals/AchievementsModal';
import LevelModal from '../components/profile/modals/LevelModal';
import StreakModal from '../components/profile/modals/StreakModal';
import FollowersModal from '../components/profile/modals/FollowersModal';
import ReferralModal from '../components/profile/modals/ReferralModal';
import AvatarShopModal from '../components/profile/avatar-shop/AvatarShopModal';
import ConfirmModal from '../components/profile/ConfirmModal';

// Styles
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
  own_referral_code: string;
  verification_level: string;
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
  user_id: string;
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
  tag: 'founder' | 'contributor' | 'member';
  members: number;
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

type Follower = {
  id: string;
  username: string;
  avatar: string;
  display_name: string;
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
// AVATAR DATA
// ============================================

const FREE_AVATARS = [
  { emoji: "😎", name: "Cool Guy", price: 0, tier: "free" },
  { emoji: "😊", name: "Smiley", price: 0, tier: "free" },
  { emoji: "🦸", name: "Hero", price: 0, tier: "free" },
  { emoji: "🧙", name: "Wizard", price: 0, tier: "free" },
  { emoji: "🦊", name: "Fox", price: 0, tier: "free" }
];

const PREMIUM_AVATARS = [
  { emoji: "🥷", name: "Ninja", price: 50, tier: "common" },
  { emoji: "🤖", name: "Robot", price: 150, tier: "rare" },
  { emoji: "👽", name: "Alien", price: 250, tier: "rare" },
  { emoji: "🔥", name: "Phoenix", price: 600, tier: "epic" },
  { emoji: "👑", name: "Crown", price: 1000, tier: "legendary" },
  { emoji: "🐉", name: "Dragon", price: 400, tier: "epic" },
  { emoji: "👾", name: "Cybergirl", price: 100, tier: "rare" }
];

const STREAK_MILESTONES = [3, 7, 14, 21, 30, 50, 100];

// ============================================
// MAIN COMPONENT
// ============================================

export default function MyProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState<string | null>(null);
  
  // Data states
  const [posts, setPosts] = useState<Post[]>([]);
  const [unities, setUnities] = useState<Unity[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [ownedAvatars, setOwnedAvatars] = useState<string[]>([]);
  const [currentAvatar, setCurrentAvatar] = useState('😎');
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [followers, setFollowers] = useState<Follower[]>([]);
  const [following, setFollowing] = useState<Follower[]>([]);
  
  // Modal states
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAvatarShop, setShowAvatarShop] = useState(false);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [showAchievementsModal, setShowAchievementsModal] = useState(false);
  const [showLevelModal, setShowLevelModal] = useState(false);
  const [showStreakModal, setShowStreakModal] = useState(false);
  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [showFollowingModal, setShowFollowingModal] = useState(false);
  const [showReferralModal, setShowReferralModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingPurchase, setPendingPurchase] = useState<{ emoji: string; price: number; name: string } | null>(null);
  
  // Tab state
  const [activeTab, setActiveTab] = useState<'posts' | 'unities' | 'treasure'>('posts');
  
  // Referral stats
  const [referralInvites, setReferralInvites] = useState(0);
  const [referralXPEarned, setReferralXPEarned] = useState(0);
  
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
      setCurrentAvatar(profileData.avatar || '😎');
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
    
    if (unitiesData) {
      const formattedUnities = unitiesData.map(u => ({
        ...u,
        tag: u.unity_name === 'Digital Artists' ? 'founder' as const : 'contributor' as const,
        members: 12400
      }));
      setUnities(formattedUnities);
    }
    
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
      { id: 'level_5', name: 'Level 5', icon: '⭐', description: 'Reach Level 5', unlocked: xp >= 1600, category: 'Level' },
      { id: 'level_10', name: 'Level 10', icon: '⭐⭐', description: 'Reach Level 10', unlocked: xp >= 8100, category: 'Level' },
      { id: 'first_post', name: 'First Creation', icon: '🎨', description: 'Create your first post', unlocked: postsCount >= 1, category: 'Creator' },
      { id: 'streak_7', name: 'Week Warrior', icon: '📅', description: '7 day streak', unlocked: streak >= 7, category: 'Streak' },
      { id: 'streak_30', name: 'Monthly Master', icon: '🏆', description: '30 day streak', unlocked: streak >= 30, category: 'Streak' },
      { id: 'first_avatar', name: 'Collector', icon: '🛍️', description: 'Own 5 avatars', unlocked: avatarCount >= 5, category: 'Collector' },
    ];
    setAchievements(calculatedAchievements);
    
    // 7. Mock followers/following
    setFollowers([
      { id: '1', username: 'creator1', avatar: '🎨', display_name: 'Artist One' },
      { id: '2', username: 'creator2', avatar: '🎵', display_name: 'Music Maker' }
    ]);
    setFollowing([
      { id: '3', username: 'creator3', avatar: '🎮', display_name: 'Gamer Pro' }
    ]);
    
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
    
    const oldLevel = calculateLevel(profile.xp);
    const newLevel = calculateLevel(newXP);
    
    if (newLevel > oldLevel) {
      showToastMessage(`🎉 LEVEL UP! You're now Level ${newLevel} ${getLevelTitle(newLevel)}! 🎉`);
    }
    
    return newXP;
  };
  
  // ============================================
  // HANDLERS
  // ============================================
  
  const showToastMessage = (msg: string) => {
    setShowToast(msg);
    setTimeout(() => setShowToast(null), 2500);
  };
  
  const handleEditProfile = () => {
    setShowEditModal(true);
  };
  
  const handleSaveProfile = async (data: {
    first_name: string;
    last_name: string;
    bio: string;
    category: string;
    website: string;
    location: string;
  }) => {
    if (!profile) return;
    
    const { error } = await supabase
      .from("profiles")
      .update({
        first_name: data.first_name,
        last_name: data.last_name,
        full_name: `${data.first_name} ${data.last_name}`,
        bio: data.bio,
        category: data.category,
        website: data.website,
        location: data.location
      })
      .eq("id", profile.id);
    
    if (!error) {
      setProfile({
        ...profile,
        first_name: data.first_name,
        last_name: data.last_name,
        full_name: `${data.first_name} ${data.last_name}`,
        bio: data.bio,
        category: data.category,
        website: data.website,
        location: data.location
      });
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
  
  const handlePurchaseAvatar = (avatar: { emoji: string; price: number; name: string }) => {
    if (ownedAvatars.includes(avatar.emoji)) {
      handleSelectAvatar(avatar.emoji);
      return;
    }
    setPendingPurchase(avatar);
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
  
  const handleOpenFollowersModal = () => {
    setShowFollowersModal(true);
  };
  
  const handleOpenFollowingModal = () => {
    setShowFollowingModal(true);
  };
  
  const handleOpenReferralModal = () => {
    setShowReferralModal(true);
  };
  
  const handleCopyReferralCode = () => {
    if (profile?.own_referral_code) {
      navigator.clipboard.writeText(profile.own_referral_code);
      showToastMessage('Referral code copied!');
    }
  };
  
  const handleShareReferral = (platform: string) => {
    const referralCode = profile?.own_referral_code || '';
    const text = `Join ComeUnity with my referral code ${referralCode} and get 50 XP!`;
    const url = `https://comeunity.com/ref/${referralCode}`;
    
    let shareUrl = '';
    if (platform === 'whatsapp') shareUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    else if (platform === 'facebook') shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    else if (platform === 'twitter') shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    else if (platform === 'telegram') shareUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
    else if (platform === 'copy') {
      navigator.clipboard.writeText(text);
      showToastMessage('Referral link copied!');
      return;
    }
    
    if (shareUrl) window.open(shareUrl, '_blank');
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
  
  const handleFollowUser = async (userId: string) => {
    // Implement follow functionality
    showToastMessage('Follow feature coming soon!');
  };
  
  // ============================================
  // RENDER
  // ============================================
  
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
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
          <ProfileHeader
            avatar={currentAvatar}
            firstName={profile?.first_name || ''}
            lastName={profile?.last_name || ''}
            username={profile?.username || ''}
            category={profile?.category || 'Art'}
            bio={profile?.bio || "No bio yet. Tap Edit to add one!"}
            verificationLevel={profile?.verification_level || 'creator'}
            onAvatarClick={handleOpenAvatarShop}
            onEditProfile={handleEditProfile}
            onShareProfile={handleShareProfile}
          />
          
          {/* Profile Stats */}
          <ProfileStats
            followers={profile?.followers_count || 0}
            following={profile?.following_count || 0}
            onFollowersClick={handleOpenFollowersModal}
            onFollowingClick={handleOpenFollowingModal}
          />
          
          {/* Level & Streak Card */}
          <LevelCard
            level={level}
            levelTitle={levelTitle}
            xp={profile?.xp || 0}
            nextXP={nextXP}
            progress={progress}
            streak={profile?.streak || 0}
            onLevelClick={handleOpenLevelModal}
            onStreakClick={handleOpenStreakModal}
            onReferralClick={handleOpenReferralModal}
          />
          
          {/* Wallet Card */}
          <WalletCard
            coins={profile?.coins || 0}
            onWalletClick={handleOpenTransactionModal}
          />
          
          {/* Achievements Grid */}
          <AchievementsGrid
            achievements={achievements}
            onViewAll={handleOpenAchievementsModal}
          />
          
          {/* Tabs */}
          <ProfileTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
            postsCount={posts.length}
            unitiesCount={unities.length}
          />
          
          {/* Posts Tab */}
          {activeTab === 'posts' && (
            <div className={styles.postsTab}>
              {posts.length === 0 ? (
                <EmptyState
                  icon="fa-camera"
                  title="No Posts Yet"
                  message="Share your first link or thought!"
                  actionText="Create Post"
                  onAction={handleCreatePost}
                />
              ) : (
                posts.map(post => (
                  <PostCard
                    key={post.id}
                    avatar={currentAvatar}
                    author={`${profile?.first_name} ${profile?.last_name}`}
                    time={formatDate(post.created_at)}
                    content={post.content}
                    link={post.link ? {
                      url: post.link,
                      domain: post.link_domain || 'link',
                      title: post.link_title || 'View content'
                    } : undefined}
                    likes={post.likes_count}
                    comments={post.comments_count}
                    liked={post.liked_by_user}
                    onLike={() => handleLikePost(post.id)}
                    onComment={() => showToastMessage('Comment feature coming soon')}
                    onTip={() => handleTipPost(post.id, post.user_id)}
                  />
                ))
              )}
            </div>
          )}
          
          {/* Unities Tab */}
          {activeTab === 'unities' && (
            <div className={styles.unitiesTab}>
              {unities.length === 0 ? (
                <EmptyState
                  icon="fa-users"
                  title="No Unities Joined"
                  message="Explore and join communities that match your interests!"
                  actionText="Discover Unities"
                  onAction={handleDiscoverUnities}
                />
              ) : (
                unities.map(unity => (
                  <UnityCard
                    key={unity.id}
                    name={unity.unity_name}
                    icon={unity.unity_icon || '🎨'}
                    members={unity.members}
                    tag={unity.tag}
                    onView={() => router.push(`/unity/${unity.unity_name}`)}
                  />
                ))
              )}
            </div>
          )}
          
          {/* Treasure Tab */}
          {activeTab === 'treasure' && (
            <div className={styles.treasureTab}>
              <EmptyState
                icon="fa-box-open"
                title="No Saved Posts"
                message="Treasure posts you love to find them later!"
              />
            </div>
          )}
        </main>
      </div>
      
      {/* ============================================
          MODALS
      ============================================ */}
      
      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        profile={{
          first_name: profile?.first_name || '',
          last_name: profile?.last_name || '',
          username: profile?.username || '',
          bio: profile?.bio || '',
          category: profile?.category || 'Art',
          website: profile?.website || '',
          location: profile?.location || ''
        }}
        onSave={handleSaveProfile}
      />
      
      {/* Transaction Modal */}
      <TransactionModal
        isOpen={showTransactionModal}
        onClose={() => setShowTransactionModal(false)}
        transactions={transactions}
      />
      
      {/* Achievements Modal */}
      <AchievementsModal
        isOpen={showAchievementsModal}
        onClose={() => setShowAchievementsModal(false)}
        achievements={achievements}
      />
      
      {/* Level Modal */}
      <LevelModal
        isOpen={showLevelModal}
        onClose={() => setShowLevelModal(false)}
        currentLevel={level}
        levelNames={['Rookie', 'Newbie', 'Explorer', 'Adventurer', 'Master', 'Elite', 'Pro', 'Expert', 'Champion', 'Legend', 'Mythic']}
        levelThresholds={[0, 500, 1200, 2100, 3200, 4500, 6000, 7700, 9600, 11700, 14000]}
        getLevelTitle={getLevelTitle}
      />
      
      {/* Streak Modal */}
      <StreakModal
        isOpen={showStreakModal}
        onClose={() => setShowStreakModal(false)}
        currentStreak={profile?.streak || 0}
        streakMilestones={STREAK_MILESTONES}
      />
      
      {/* Followers Modal */}
      <FollowersModal
        isOpen={showFollowersModal}
        onClose={() => setShowFollowersModal(false)}
        title="Followers"
        users={followers}
        onFollow={handleFollowUser}
      />
      
      {/* Following Modal */}
      <FollowersModal
        isOpen={showFollowingModal}
        onClose={() => setShowFollowingModal(false)}
        title="Following"
        users={following}
        onFollow={handleFollowUser}
      />
      
      {/* Referral Modal */}
      <ReferralModal
        isOpen={showReferralModal}
        onClose={() => setShowReferralModal(false)}
        referralCode={profile?.own_referral_code || ''}
        referralInvites={referralInvites}
        referralXPEarned={referralXPEarned}
        onCopyCode={handleCopyReferralCode}
        onShare={handleShareReferral}
      />
      
      {/* Avatar Shop Modal */}
      <AvatarShopModal
        isOpen={showAvatarShop}
        onClose={() => setShowAvatarShop(false)}
        ownedAvatars={ownedAvatars}
        currentAvatar={currentAvatar}
        coins={profile?.coins || 0}
        freeAvatars={FREE_AVATARS}
        premiumAvatars={PREMIUM_AVATARS}
        onSelectAvatar={handleSelectAvatar}
        onPurchase={handlePurchaseAvatar}
      />
      
      {/* Confirm Purchase Modal */}
      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmPurchase}
        title="Confirm Purchase"
        message={`Buy ${pendingPurchase?.emoji} ${pendingPurchase?.name} avatar for ${pendingPurchase?.price} coins?`}
      />
      
      {/* Toast */}
      {showToast && (
        <div className="toast">
          {showToast}
        </div>
      )}
    </div>
  );
}