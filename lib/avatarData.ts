// lib/avatarData.ts

export interface Avatar {
  emoji: string;
  name: string;
  price: number;
  tier: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary' | 'mythic' | 'limited';
  description: string;
  seasonal?: 'christmas' | 'halloween' | 'newyear' | 'valentine' | 'anniversary';
}

// ============================================
// TIER 1: FREE AVATARS (5) - 0 coins
// ============================================
export const FREE_AVATARS: Avatar[] = [
  { emoji: "😎", name: "Cool Guy", price: 0, tier: "free", rarity: "common", description: "Confident, stylish" },
  { emoji: "😊", name: "Smiley", price: 0, tier: "free", rarity: "common", description: "Friendly, approachable" },
  { emoji: "🦸", name: "Hero", price: 0, tier: "free", rarity: "common", description: "Ambitious, strong" },
  { emoji: "🧙", name: "Wizard", price: 0, tier: "free", rarity: "common", description: "Creative, mysterious" },
  { emoji: "🦊", name: "Fox", price: 0, tier: "free", rarity: "common", description: "Clever, quick" }
];

// ============================================
// TIER 2: COMMON AVATARS (10) - 50-100 coins
// ============================================
export const COMMON_AVATARS: Avatar[] = [
  { emoji: "🥷", name: "Ninja", price: 50, tier: "common", rarity: "common", description: "Silent but deadly" },
  { emoji: "🤠", name: "Cowboy", price: 50, tier: "common", rarity: "common", description: "Howdy partner" },
  { emoji: "🧛", name: "Vampire", price: 60, tier: "common", rarity: "common", description: "Eternal night" },
  { emoji: "🧟", name: "Zombie", price: 60, tier: "common", rarity: "common", description: "Brain eater" },
  { emoji: "👻", name: "Ghost", price: 70, tier: "common", rarity: "common", description: "Boo!" },
  { emoji: "🐱", name: "Cat", price: 50, tier: "common", rarity: "common", description: "Meow" },
  { emoji: "🐶", name: "Dog", price: 50, tier: "common", rarity: "common", description: "Woof" },
  { emoji: "🐼", name: "Panda", price: 70, tier: "common", rarity: "common", description: "Cuddly" },
  { emoji: "🐧", name: "Penguin", price: 60, tier: "common", rarity: "common", description: "Waddle" },
  { emoji: "🦄", name: "Unicorn", price: 100, tier: "common", rarity: "common", description: "Magical" }
];

// ============================================
// TIER 3: RARE AVATARS (10) - 150-300 coins
// ============================================
export const RARE_AVATARS: Avatar[] = [
  { emoji: "🤖", name: "Robot", price: 150, tier: "rare", rarity: "rare", description: "From the future" },
  { emoji: "👽", name: "Alien", price: 200, tier: "rare", rarity: "rare", description: "From another world" },
  { emoji: "🧝", name: "Elf", price: 180, tier: "rare", rarity: "rare", description: "Ancient wisdom" },
  { emoji: "🧜", name: "Mermaid", price: 200, tier: "rare", rarity: "rare", description: "Ocean's call" },
  { emoji: "🧞", name: "Genie", price: 250, tier: "rare", rarity: "rare", description: "Your wish is my command" },
  { emoji: "🐉", name: "Dragon", price: 300, tier: "rare", rarity: "rare", description: "Mythical beast" },
  { emoji: "🦅", name: "Eagle", price: 180, tier: "rare", rarity: "rare", description: "Soaring high" },
  { emoji: "🐺", name: "Wolf", price: 200, tier: "rare", rarity: "rare", description: "Lone hunter" },
  { emoji: "🐻‍❄️", name: "Polar Bear", price: 220, tier: "rare", rarity: "rare", description: "Arctic strength" },
  { emoji: "🦁", name: "Lion", price: 250, tier: "rare", rarity: "rare", description: "King of the jungle" }
];

// ============================================
// TIER 4: EPIC AVATARS (10) - 400-800 coins
// ============================================
export const EPIC_AVATARS: Avatar[] = [
  { emoji: "👾", name: "Cybergirl", price: 400, tier: "epic", rarity: "epic", description: "Digital dreamer" },
  { emoji: "🤖⚡", name: "Mech Warrior", price: 450, tier: "epic", rarity: "epic", description: "Powered armor" },
  { emoji: "🧙‍♂️", name: "Archmage", price: 500, tier: "epic", rarity: "epic", description: "Master of magic" },
  { emoji: "🗡️", name: "Samurai", price: 500, tier: "epic", rarity: "epic", description: "Honor bound" },
  { emoji: "🏹", name: "Archer", price: 450, tier: "epic", rarity: "epic", description: "Precision" },
  { emoji: "🛡️", name: "Paladin", price: 550, tier: "epic", rarity: "epic", description: "Holy protector" },
  { emoji: "🔥", name: "Phoenix", price: 600, tier: "epic", rarity: "epic", description: "Reborn from ashes" },
  { emoji: "🌊", name: "Leviathan", price: 650, tier: "epic", rarity: "epic", description: "Sea monster" },
  { emoji: "⚡", name: "Thunder God", price: 700, tier: "epic", rarity: "epic", description: "Storm bringer" },
  { emoji: "🌙", name: "Moon Guardian", price: 750, tier: "epic", rarity: "epic", description: "Night's watch" }
];

// ============================================
// TIER 5: LEGENDARY AVATARS (8) - 1000-2000 coins
// ============================================
export const LEGENDARY_AVATARS: Avatar[] = [
  { emoji: "👑", name: "Crown", price: 1000, tier: "legendary", rarity: "legendary", description: "Royalty" },
  { emoji: "🌟", name: "Star Child", price: 1100, tier: "legendary", rarity: "legendary", description: "Cosmic being" },
  { emoji: "🌀", name: "Void Walker", price: 1200, tier: "legendary", rarity: "legendary", description: "Reality bender" },
  { emoji: "🔱", name: "Poseidon", price: 1300, tier: "legendary", rarity: "legendary", description: "God of the sea" },
  { emoji: "⚔️", name: "Excalibur", price: 1400, tier: "legendary", rarity: "legendary", description: "Sword of kings" },
  { emoji: "🛸", name: "Star Commander", price: 1500, tier: "legendary", rarity: "legendary", description: "Galactic leader" },
  { emoji: "🕯️", name: "Eternal Flame", price: 1600, tier: "legendary", rarity: "legendary", description: "Undying spirit" },
  { emoji: "💀", name: "Death's Head", price: 1800, tier: "legendary", rarity: "legendary", description: "Reaper" }
];

// ============================================
// TIER 6: MYTHIC AVATARS (5) - 2500-5000 coins
// ============================================
export const MYTHIC_AVATARS: Avatar[] = [
  { emoji: "🌌", name: "Cosmic Being", price: 2500, tier: "mythic", rarity: "mythic", description: "Born from stars" },
  { emoji: "🔥👑", name: "Fire Emperor", price: 3000, tier: "mythic", rarity: "mythic", description: "Ruler of flames" },
  { emoji: "💎", name: "Diamond Heart", price: 3500, tier: "mythic", rarity: "mythic", description: "Unbreakable" },
  { emoji: "🕰️", name: "Time Lord", price: 4000, tier: "mythic", rarity: "mythic", description: "Master of time" },
  { emoji: "∞", name: "Infinite", price: 4500, tier: "mythic", rarity: "mythic", description: "Beyond limits" }
];

// ============================================
// TIER 7: LIMITED AVATARS (2) - Event Only
// ============================================
export const LIMITED_AVATARS: Avatar[] = [
  { emoji: "🎄", name: "Santa", price: 500, tier: "limited", rarity: "limited", description: "Ho ho ho", seasonal: "christmas" },
  { emoji: "🎃", name: "Pumpkin King", price: 500, tier: "limited", rarity: "limited", description: "Trick or treat", seasonal: "halloween" }
];

// ============================================
// COMPLETE COLLECTION (50 AVATARS TOTAL)
// ============================================
export const ALL_AVATARS: Avatar[] = [
  ...FREE_AVATARS,
  ...COMMON_AVATARS,
  ...RARE_AVATARS,
  ...EPIC_AVATARS,
  ...LEGENDARY_AVATARS,
  ...MYTHIC_AVATARS,
  ...LIMITED_AVATARS
];

// ============================================
// TIER CONFIGURATION
// ============================================
export const tierConfig = {
  free: { name: '🎁 FREE', color: '#6b7280', bg: 'rgba(107, 114, 128, 0.2)', order: 0 },
  common: { name: '🟢 COMMON', color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.2)', order: 1 },
  rare: { name: '🔵 RARE', color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.2)', order: 2 },
  epic: { name: '🟣 EPIC', color: '#a855f7', bg: 'rgba(168, 85, 247, 0.2)', order: 3 },
  legendary: { name: '🟠 LEGENDARY', color: '#f97316', bg: 'rgba(249, 115, 22, 0.2)', order: 4 },
  mythic: { name: '🔴 MYTHIC', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.2)', order: 5 },
  limited: { name: '⭐ LIMITED', color: '#ffd700', bg: 'rgba(255, 215, 0, 0.2)', order: 6 }
};

// ============================================
// COLLECTION BADGES (11 badges)
// ============================================
export interface CollectionBadge {
  threshold: number;
  name: string;
  icon: string;
  xpReward: number;
  description: string;
}

export const collectionBadges: CollectionBadge[] = [
  { threshold: 1, name: 'New Collector', icon: '🛍️', xpReward: 25, description: 'Buy your first avatar' },
  { threshold: 5, name: 'Collector', icon: '🌟', xpReward: 50, description: 'Own 5 avatars' },
  { threshold: 10, name: 'Avid Collector', icon: '💎', xpReward: 100, description: 'Own 10 avatars' },
  { threshold: 15, name: 'Serious Collector', icon: '🏆', xpReward: 200, description: 'Own 15 avatars' },
  { threshold: 20, name: 'Master Collector', icon: '👑', xpReward: 300, description: 'Own 20 avatars' },
  { threshold: 25, name: 'Rare Hunter', icon: '🦄', xpReward: 400, description: 'Own 25 avatars' },
  { threshold: 30, name: 'Epic Seeker', icon: '⚡', xpReward: 500, description: 'Own 30 avatars' },
  { threshold: 35, name: 'Legend Chaser', icon: '🔥', xpReward: 750, description: 'Own 35 avatars' },
  { threshold: 40, name: 'Mythic Lord', icon: '🌌', xpReward: 1000, description: 'Own 40 avatars' },
  { threshold: 45, name: 'Completionist', icon: '♾️', xpReward: 1500, description: 'Own 45 avatars' },
  { threshold: 50, name: 'Avatar God', icon: '👑', xpReward: 2500, description: 'Own ALL 50 avatars' }
];

// ============================================
// HELPER FUNCTIONS
// ============================================

export const getCompletionPercentage = (ownedAvatars: string[]): number => {
  return (ownedAvatars.length / ALL_AVATARS.length) * 100;
};

export const getNextAffordableAvatar = (ownedAvatars: string[], coins: number): Avatar | null => {
  const notOwned = ALL_AVATARS.filter(a => !ownedAvatars.includes(a.emoji) && a.price > 0);
  const affordable = notOwned.filter(a => a.price <= coins);
  return affordable.sort((a, b) => a.price - b.price)[0] || null;
};

export const getAvatarByEmoji = (emoji: string): Avatar | undefined => {
  return ALL_AVATARS.find(a => a.emoji === emoji);
};

export const getAvatarsByTier = (tier: string): Avatar[] => {
  return ALL_AVATARS.filter(a => a.tier === tier);
};

export const getCollectionBadge = (ownedCount: number): CollectionBadge | undefined => {
  return collectionBadges
    .filter(b => ownedCount >= b.threshold)
    .sort((a, b) => b.threshold - a.threshold)[0];
};

export const getNextBadge = (ownedCount: number): CollectionBadge | undefined => {
  return collectionBadges.find(b => b.threshold > ownedCount);
};

export const getSeasonalAvatars = (season: 'christmas' | 'halloween' | 'newyear' | 'valentine'): Avatar[] => {
  return ALL_AVATARS.filter(a => a.seasonal === season);
};

export const getTierStats = (ownedAvatars: string[]): Record<string, { owned: number; total: number }> => {
  const stats: Record<string, { owned: number; total: number }> = {};
  
  Object.keys(tierConfig).forEach(tier => {
    const total = ALL_AVATARS.filter(a => a.tier === tier).length;
    const owned = ALL_AVATARS.filter(a => a.tier === tier && ownedAvatars.includes(a.emoji)).length;
    stats[tier] = { owned, total };
  });
  
  return stats;
};

export const getTotalCollectionValue = (ownedAvatars: string[]): number => {
  return ownedAvatars.reduce((total, emoji) => {
    const avatar = getAvatarByEmoji(emoji);
    return total + (avatar?.price || 0);
  }, 0);
};

export const getRarestAvatar = (ownedAvatars: string[]): Avatar | undefined => {
  const rarityOrder = { mythic: 5, legendary: 4, epic: 3, rare: 2, common: 1, limited: 0 };
  const owned = ownedAvatars
    .map(emoji => getAvatarByEmoji(emoji))
    .filter(a => a) as Avatar[];
  return owned.sort((a, b) => rarityOrder[b.rarity] - rarityOrder[a.rarity])[0];
};

export const getNextAvatarRecommendation = (ownedAvatars: string[], coins: number): Avatar | null => {
  const notOwned = ALL_AVATARS.filter(a => !ownedAvatars.includes(a.emoji));
  const affordable = notOwned.filter(a => a.price <= coins);
  
  if (affordable.length === 0) {
    const cheapest = notOwned.sort((a, b) => a.price - b.price)[0];
    return cheapest || null;
  }
  
  return affordable.sort((a, b) => b.rarity === a.rarity ? a.price - b.price : (b.rarity === 'mythic' ? 1 : -1))[0];
};