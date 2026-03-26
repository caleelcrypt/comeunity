// lib/avatarData.ts

export interface Avatar {
  emoji: string;
  name: string;
  price: number;
  tier: string;
  rarity: string;
  description?: string;
}

export const FREE_AVATARS: Avatar[] = [
  { emoji: "😎", name: "Cool Guy", price: 0, tier: "free", rarity: "common", description: "Confident and stylish" },
  { emoji: "😊", name: "Smiley", price: 0, tier: "free", rarity: "common", description: "Friendly and approachable" },
  { emoji: "🦸", name: "Hero", price: 0, tier: "free", rarity: "common", description: "Ambitious and strong" },
  { emoji: "🧙", name: "Wizard", price: 0, tier: "free", rarity: "common", description: "Creative and mysterious" },
  { emoji: "🦊", name: "Fox", price: 0, tier: "free", rarity: "common", description: "Clever and quick" }
];

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

export const RARE_AVATARS: Avatar[] = [
  { emoji: "🤖", name: "Robot", price: 150, tier: "rare", rarity: "rare", description: "From the future" },
  { emoji: "👽", name: "Alien", price: 200, tier: "rare", rarity: "rare", description: "From another world" },
  { emoji: "🧝", name: "Elf", price: 180, tier: "rare", rarity: "rare", description: "Ancient wisdom" },
  { emoji: "🧜", name: "Mermaid", price: 200, tier: "rare", rarity: "rare", description: "Ocean's call" },
  { emoji: "🧞", name: "Genie", price: 250, tier: "rare", rarity: "rare", description: "Your wish is my command" },
  { emoji: "🐉", name: "Dragon", price: 300, tier: "rare", rarity: "rare", description: "Mythical beast" }
];

export const EPIC_AVATARS: Avatar[] = [
  { emoji: "👾", name: "Cybergirl", price: 400, tier: "epic", rarity: "epic", description: "Digital dreamer" },
  { emoji: "🔥", name: "Phoenix", price: 600, tier: "epic", rarity: "epic", description: "Reborn from ashes" }
];

export const LEGENDARY_AVATARS: Avatar[] = [
  { emoji: "👑", name: "Crown", price: 1000, tier: "legendary", rarity: "legendary", description: "Royalty" },
  { emoji: "🌟", name: "Star Child", price: 1100, tier: "legendary", rarity: "legendary", description: "Cosmic being" }
];

export const MYTHIC_AVATARS: Avatar[] = [
  { emoji: "🌌", name: "Cosmic Being", price: 2500, tier: "mythic", rarity: "mythic", description: "Born from stars" }
];

export const LIMITED_AVATARS: Avatar[] = [
  { emoji: "🎄", name: "Santa", price: 500, tier: "limited", rarity: "limited", description: "Christmas exclusive" }
];

export const ALL_AVATARS: Avatar[] = [
  ...FREE_AVATARS,
  ...COMMON_AVATARS,
  ...RARE_AVATARS,
  ...EPIC_AVATARS,
  ...LEGENDARY_AVATARS,
  ...MYTHIC_AVATARS,
  ...LIMITED_AVATARS
];

export const tierConfig = {
  free: { name: '🎁 FREE', color: '#6b7280', bg: 'rgba(107, 114, 128, 0.2)', order: 0 },
  common: { name: '🟢 COMMON', color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.2)', order: 1 },
  rare: { name: '🔵 RARE', color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.2)', order: 2 },
  epic: { name: '🟣 EPIC', color: '#a855f7', bg: 'rgba(168, 85, 247, 0.2)', order: 3 },
  legendary: { name: '🟠 LEGENDARY', color: '#f97316', bg: 'rgba(249, 115, 22, 0.2)', order: 4 },
  mythic: { name: '🔴 MYTHIC', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.2)', order: 5 },
  limited: { name: '⭐ LIMITED', color: '#ffd700', bg: 'rgba(255, 215, 0, 0.2)', order: 6 }
};

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