// comeunity/app/auth/components/SignupForm.tsx
'use client';
import React, { useState } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import styles from '../Auth.module.css';

interface SignupFormProps {
  referralCode?: string;
  onSuccess: (user: any) => void;
  onSwitchToLogin: () => void;
}

const SignupForm = ({ referralCode: initialReferralCode, onSuccess, onSwitchToLogin }: SignupFormProps) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [referralCode, setReferralCode] = useState(initialReferralCode || '');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<{ hasLength: boolean; hasLetter: boolean; hasNumber: boolean; hasSpecial: boolean }>({
    hasLength: false,
    hasLetter: false,
    hasNumber: false,
    hasSpecial: false
  });

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!firstName.trim()) newErrors.firstName = 'First name is required';
    if (!lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = 'Invalid email format';
    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    else if (!/[A-Za-z]/.test(password)) newErrors.password = 'Password must contain at least one letter';
    else if (!/[0-9]/.test(password)) newErrors.password = 'Password must contain at least one number';
    else if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) newErrors.password = 'Password must contain at least one special character';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const checkPasswordStrength = (pwd: string) => {
    setPasswordStrength({
      hasLength: pwd.length >= 8 && pwd.length <= 16,
      hasLetter: /[A-Za-z]/.test(pwd),
      hasNumber: /[0-9]/.test(pwd),
      hasSpecial: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd)
    });
  };

  const handlePasswordChange = (pwd: string) => {
    setPassword(pwd);
    checkPasswordStrength(pwd);
  };

  const generateUsername = (firstName: string, lastName: string) => {
    const base = (firstName + lastName).toLowerCase().replace(/\s/g, '');
    const random = Math.floor(Math.random() * 1000);
    return `${base}${random}`;
  };

  const handleGoogleSignup = async () => {
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });
    
    if (error) {
      console.error('Google signup error:', error);
      setErrors({ submit: error.message });
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      const username = generateUsername(firstName, lastName);
      const ownReferralCode = username.toUpperCase();
      
      // Sign up with Supabase
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            username,
          }
        }
      });
      
      if (signUpError) throw signUpError;
      
      if (!authData.user) throw new Error('Signup failed');
      
      // Check if referral code exists
      let referrerId = null;
      let referrerUsername = null;
      if (referralCode) {
        const { data: referrer } = await supabase
          .from('profiles')
          .select('id, username')
          .eq('own_referral_code', referralCode.toUpperCase())
          .single();
        
        if (referrer) {
          referrerId = referrer.id;
          referrerUsername = referrer.username;
        }
      }
      
      // Calculate XP (50 base + 50 referral bonus if applicable)
      const totalXP = referrerId ? 100 : 50;
      
      // Create profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          first_name: firstName,
          last_name: lastName,
          full_name: `${firstName} ${lastName}`,
          username,
          email,
          xp: totalXP,
          coins: 0,
          own_referral_code: ownReferralCode,
          referred_by: referrerId,
          referred_by_username: referrerUsername,
          referral_invites: 0,
          referral_xp_earned: 0,
          onboarding_completed: false,
        });
      
      if (profileError) throw profileError;
      
      // Award referrer bonus if applicable
      if (referrerId) {
        const { data: referrerProfile } = await supabase
          .from('profiles')
          .select('xp, referral_invites, referral_xp_earned')
          .eq('id', referrerId)
          .single();
        
        if (referrerProfile) {
          await supabase
            .from('profiles')
            .update({
              xp: (referrerProfile.xp || 0) + 50,
              referral_invites: (referrerProfile.referral_invites || 0) + 1,
              referral_xp_earned: (referrerProfile.referral_xp_earned || 0) + 50
            })
            .eq('id', referrerId);
          
          // Create notification for referrer
          await supabase
            .from('notifications')
            .insert({
              user_id: referrerId,
              type: 'referral',
              actor_id: authData.user.id,
              read: false,
              data: {
                message: `${firstName} ${lastName} joined using your referral link! +50 XP`,
                username: username
              }
            });
        }
      }
      
      // Create welcome transaction
      await supabase
        .from('transactions')
        .insert({
          user_id: authData.user.id,
          type: 'Welcome Bonus',
          amount: 0,
          metadata: { xp_gained: totalXP, referral_code_used: referralCode || null }
        });
      
      onSuccess({
        id: authData.user.id,
        firstName,
        lastName,
        username,
        email,
        ownReferralCode,
        xp: totalXP,
        referredBy: referrerId,
        onboardingCompleted: false
      });
      
    } catch (err: any) {
      console.error('Signup error:', err);
      setErrors({ submit: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.formContainer}>
      <div className={styles.formHeader}>
        <h2>Create your account</h2>
        <p>Join the creator movement</p>
      </div>
      
      {/* Google Sign Up Button */}
      <button className={styles.googleBtn} onClick={handleGoogleSignup} disabled={loading}>
        <i className="fab fa-google"></i> Continue with Google
      </button>
      
      <div className={styles.divider}>
        <span>or sign up with email</span>
      </div>
      
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <input
              type="text"
              placeholder="First name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className={errors.firstName ? styles.error : ''}
            />
            {errors.firstName && <span className={styles.errorMsg}>{errors.firstName}</span>}
          </div>
          <div className={styles.formGroup}>
            <input
              type="text"
              placeholder="Last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className={errors.lastName ? styles.error : ''}
            />
            {errors.lastName && <span className={styles.errorMsg}>{errors.lastName}</span>}
          </div>
        </div>
        
        <div className={styles.formGroup}>
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={errors.email ? styles.error : ''}
          />
          {errors.email && <span className={styles.errorMsg}>{errors.email}</span>}
        </div>
        
        <div className={styles.formGroup}>
          <div className={styles.passwordField}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password (8+ characters with letter, number & symbol)"
              value={password}
              onChange={(e) => handlePasswordChange(e.target.value)}
              className={errors.password ? styles.error : ''}
            />
            <button
              type="button"
              className={styles.passwordToggle}
              onClick={() => setShowPassword(!showPassword)}
            >
              <i className={showPassword ? "fas fa-eye-slash" : "fas fa-eye"}></i>
            </button>
          </div>
          {password && (
            <div className={styles.passwordStrength}>
              <span className={passwordStrength.hasLength ? styles.valid : ''}>
                <i className={passwordStrength.hasLength ? "fas fa-check-circle" : "fas fa-circle"}></i> 8-16 chars
              </span>
              <span className={passwordStrength.hasLetter ? styles.valid : ''}>
                <i className={passwordStrength.hasLetter ? "fas fa-check-circle" : "fas fa-circle"}></i> Letter
              </span>
              <span className={passwordStrength.hasNumber ? styles.valid : ''}>
                <i className={passwordStrength.hasNumber ? "fas fa-check-circle" : "fas fa-circle"}></i> Number
              </span>
              <span className={passwordStrength.hasSpecial ? styles.valid : ''}>
                <i className={passwordStrength.hasSpecial ? "fas fa-check-circle" : "fas fa-circle"}></i> Special
              </span>
            </div>
          )}
          {errors.password && <span className={styles.errorMsg}>{errors.password}</span>}
        </div>
        
        <div className={styles.formGroup}>
          <input
            type="text"
            placeholder="Referral code (optional)"
            value={referralCode}
            onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
          />
          <div className={styles.referralHint}>
            <i className="fas fa-gift"></i> Have a friend's code? Enter it here. Both get +50 XP!
          </div>
        </div>
        
        {errors.submit && <div className={styles.submitError}>{errors.submit}</div>}
        
        <button type="submit" className={styles.submitBtn} disabled={loading}>
          {loading ? 'Creating account...' : 'Join ComeUnity →'}
        </button>
      </form>
      
      <div className={styles.switchLink}>
        Already have an account? <button onClick={onSwitchToLogin}>Log in →</button>
      </div>
    </div>
  );
};

export default SignupForm;