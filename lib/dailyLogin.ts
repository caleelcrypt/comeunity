// comeunity/lib/dailyLogin.ts
import { supabase } from './supabaseClient';
import { awardRewards } from './rewards';

export interface DailyLoginResult {
  claimed: boolean;
  xp?: number;
  coins?: number;
  streak?: number;
  streakBonus?: boolean;
  streakMessage?: string;
  message?: string;
  error?: string;
}

export const checkDailyLogin = async (userId: string): Promise<DailyLoginResult> => {
  try {
    // Get last login date and streak
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('last_activity_date, streak, longest_streak')
      .eq('id', userId)
      .single();
    
    if (profileError) {
      console.error('Profile fetch error:', profileError);
      return { claimed: false, error: profileError.message };
    }
    
    const today = new Date().toISOString().split('T')[0];
    const lastLogin = profile?.last_activity_date;
    
    // If already logged in today
    if (lastLogin === today) {
      return { 
        claimed: false, 
        message: 'Already claimed today!', 
        streak: profile?.streak || 0 
      };
    }
    
    // Check if consecutive day
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    
    const isConsecutive = lastLogin === yesterdayStr;
    let newStreak = isConsecutive ? (profile?.streak || 0) + 1 : 1;
    
    // Calculate streak bonuses
    let streakBonusXP = 0;
    let streakBonusCoins = 0;
    let streakMessage = '';
    
    if (newStreak === 3) {
      streakBonusXP = 20;
      streakBonusCoins = 10;
      streakMessage = '3-day streak!';
    } else if (newStreak === 5) {
      streakBonusXP = 50;
      streakBonusCoins = 20;
      streakMessage = '5-day streak!';
    } else if (newStreak === 7) {
      streakBonusXP = 100;
      streakBonusCoins = 50;
      streakMessage = '7-day streak!';
    } else if (newStreak === 14) {
      streakBonusXP = 200;
      streakBonusCoins = 100;
      streakMessage = '14-day streak!';
    } else if (newStreak === 30) {
      streakBonusXP = 500;
      streakBonusCoins = 200;
      streakMessage = '30-day streak!';
    }
    
    // Update streak and last activity
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        streak: newStreak,
        last_activity_date: today,
        longest_streak: Math.max(profile?.longest_streak || 0, newStreak)
      })
      .eq('id', userId);
    
    if (updateError) {
      console.error('Update error:', updateError);
      return { claimed: false, error: updateError.message };
    }
    
    // Award daily login bonus
    const dailyResult = await awardRewards(userId, 'DAILY_LOGIN');
    
    let totalXP = dailyResult.xpGained || 0;
    let totalCoins = dailyResult.coinsGained || 0;
    
    // Award streak bonus if applicable
    if (streakBonusXP > 0) {
      // Manually add streak bonus
      const { data: currentProfile } = await supabase
        .from('profiles')
        .select('xp, coins')
        .eq('id', userId)
        .single();
      
      if (currentProfile) {
        const { error: bonusError } = await supabase
          .from('profiles')
          .update({ 
            xp: currentProfile.xp + streakBonusXP,
            coins: currentProfile.coins + streakBonusCoins
          })
          .eq('id', userId);
        
        if (!bonusError) {
          totalXP += streakBonusXP;
          totalCoins += streakBonusCoins;
          
          // Create transaction for streak bonus
          await supabase
            .from('transactions')
            .insert({
              user_id: userId,
              type: `Streak Bonus - ${streakMessage}`,
              amount: streakBonusCoins,
              metadata: { 
                xp_gained: streakBonusXP, 
                coins_gained: streakBonusCoins,
                streak_days: newStreak
              }
            });
        }
      }
    }
    
    let message = `🎉 +${totalXP} XP & +${totalCoins} coins!`;
    if (streakMessage) message += ` ${streakMessage}`;
    message += ` 🔥 ${newStreak} day streak!`;
    
    return {
      claimed: true,
      xp: totalXP,
      coins: totalCoins,
      streak: newStreak,
      streakBonus: streakBonusXP > 0,
      streakMessage,
      message
    };
    
  } catch (error) {
    console.error('Error checking daily login:', error);
    return { claimed: false, error: error.message };
  }
};