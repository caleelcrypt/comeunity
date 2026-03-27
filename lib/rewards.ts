// comeunity/lib/rewards.ts
import { supabase } from './supabaseClient';

export const rewardActions = {
  CREATE_POST: { xp: 5, coins: 2, type: 'Post Created' },
  LIKE_POST: { xp: 2, coins: 0, type: 'Like Given' },
  RECEIVE_LIKE: { xp: 3, coins: 0, type: 'Like Received' },
  COMMENT: { xp: 2, coins: 1, type: 'Comment Given' },
  RECEIVE_COMMENT: { xp: 5, coins: 0, type: 'Comment Received' },
  SHARE_POST: { xp: 3, coins: 1, type: 'Share Given' },
  RECEIVE_SHARE: { xp: 15, coins: 0, type: 'Share Received' },
  DAILY_LOGIN: { xp: 10, coins: 5, type: 'Daily Login' },
  REFERRAL: { xp: 50, coins: 0, type: 'Referral' },
  TIP_SENT: { xp: 10, coins: 0, type: 'Tip Sent' },
  TIP_RECEIVED: { xp: 5, coins: 20, type: 'Tip Received' },
};

export interface RewardResult {
  success: boolean;
  xpGained?: number;
  coinsGained?: number;
  newXP?: number;
  newCoins?: number;
  levelUp?: boolean;
  newLevel?: number;
  oldLevel?: number;
  error?: string;
}

export const awardRewards = async (
  userId: string, 
  action: keyof typeof rewardActions, 
  metadata?: any
): Promise<RewardResult> => {
  const reward = rewardActions[action];
  if (!reward) return { success: false, error: 'Invalid action' };

  try {
    // Get current values
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('xp, coins, total_xp_earned, total_coins_earned')
      .eq('id', userId)
      .single();
    
    if (profileError || !profile) {
      console.error('Profile fetch error:', profileError);
      return { success: false, error: 'User not found' };
    }

    const oldLevel = Math.floor(Math.sqrt(Math.max(0, profile.xp) / 100)) + 1;
    const newXP = profile.xp + reward.xp;
    const newCoins = profile.coins + reward.coins;
    const newLevel = Math.floor(Math.sqrt(Math.max(0, newXP) / 100)) + 1;
    
    // Update profile
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ 
        xp: newXP, 
        coins: newCoins,
        total_xp_earned: (profile.total_xp_earned || 0) + reward.xp,
        total_coins_earned: (profile.total_coins_earned || 0) + reward.coins,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);
    
    if (updateError) {
      console.error('Update error:', updateError);
      return { success: false, error: updateError.message };
    }
    
    // Create transaction record
    const { error: transactionError } = await supabase
      .from('transactions')
      .insert({
        user_id: userId,
        type: reward.type,
        amount: reward.coins,
        metadata: { 
          xp_gained: reward.xp, 
          coins_gained: reward.coins, 
          action,
          ...metadata 
        }
      });
    
    if (transactionError) {
      console.error('Transaction error:', transactionError);
      // Don't return error here, transaction is secondary
    }
    
    return {
      success: true,
      xpGained: reward.xp,
      coinsGained: reward.coins,
      newXP,
      newCoins,
      levelUp: newLevel > oldLevel,
      newLevel,
      oldLevel
    };
    
 // lib/rewards.ts
} catch (error) {
  console.error('Error awarding rewards:', error);
  const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
  return { success: false, error: errorMessage };
}
};