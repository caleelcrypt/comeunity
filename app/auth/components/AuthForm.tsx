// comeunity/app/auth/components/AuthForm.tsx
'use client';
import React, { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import styles from '../Auth.module.css';

interface AuthFormProps {
  mode?: 'login' | 'signup';
  referralCode?: string;
  onSuccess?: (user: any) => void;
  onSwitchMode?: () => void;
}

const AuthForm = ({ mode: initialMode = 'login', referralCode: initialReferralCode, onSuccess, onSwitchMode }: AuthFormProps) => {
  const router = useRouter();
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  
  // Login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  
  // Signup state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [referralCode, setReferralCode] = useState(initialReferralCode || '');
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [signupError, setSignupError] = useState('');
  const [signupLoading, setSignupLoading] = useState(false);

  const generateUsername = (firstName: string, lastName: string) => {
    const base = (firstName + lastName).toLowerCase().replace(/\s/g, '');
    const random = Math.floor(Math.random() * 1000);
    return `${base}${random}`;
  };

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validateSignup = () => {
    if (!firstName.trim()) {
      setSignupError('First name is required');
      return false;
    }
    if (!lastName.trim()) {
      setSignupError('Last name is required');
      return false;
    }
    if (!signupEmail.trim()) {
      setSignupError('Email is required');
      return false;
    }
    if (!isValidEmail(signupEmail)) {
      setSignupError('Invalid email format');
      return false;
    }
    if (!signupPassword) {
      setSignupError('Password is required');
      return false;
    }
    if (signupPassword.length < 6) {
      setSignupError('Password must be at least 6 characters');
      return false;
    }
    return true;
  };

  const handleGoogleAuth = async () => {
    setLoginLoading(true);
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
      console.error('Google auth error:', error);
      setLoginError(error.message);
      setLoginLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      setLoginError('Please enter both email and password');
      return;
    }
    
    setLoginLoading(true);
    setLoginError('');
    
    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: loginPassword,
      });
      
      if (signInError) throw signInError;
      
      if (data.user) {
        router.push('/feed');
      }
    } catch (err: any) {
      setLoginError(err.message === 'Invalid login credentials' 
        ? 'Incorrect email or password' 
        : err.message);
    } finally {
      setLoginLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateSignup()) return;
    
    setSignupLoading(true);
    setSignupError('');
    
    try {
      const username = generateUsername(firstName, lastName);
      const fullName = `${firstName} ${lastName}`;
      
      console.log('Attempting signup with:', signupEmail);
      
      // Sign up with Supabase Auth
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: signupEmail,
        password: signupPassword,
        options: {
          data: {
            username,
            full_name: fullName,
          }
        }
      });
      
      if (signUpError) {
        console.error('Signup error details:', signUpError);
        throw signUpError;
      }
      
      console.log('Signup response:', authData);
      
      if (!authData.user) {
        throw new Error('No user returned from signup');
      }
      
      // Check if referral code exists
      let referrerId = null;
      if (referralCode) {
        const { data: referrer } = await supabase
          .from('profiles')
          .select('id')
          .eq('username', referralCode.toLowerCase())
          .single();
        
        if (referrer) {
          referrerId = referrer.id;
        }
      }
      
      // Calculate XP (50 base + 50 referral bonus)
      const totalXP = referrerId ? 100 : 50;
      
      // Create profile with all matching columns
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          username: username,
          full_name: fullName,
          avatar_url: `https://ui-avatars.com/api/?background=ff4d6d&color=fff&name=${firstName}+${lastName}`,
          bio: null,
          xp: totalXP,
          coins: 0,
          level: 1,
          followers_count: 0,
          following_count: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
      
      if (profileError) {
        console.error('Profile creation error:', profileError);
        throw profileError;
      }
      
      // Award referrer bonus if applicable
      if (referrerId) {
        const { data: referrerProfile } = await supabase
          .from('profiles')
          .select('xp')
          .eq('id', referrerId)
          .single();
        
        if (referrerProfile) {
          await supabase
            .from('profiles')
            .update({ xp: (referrerProfile.xp || 0) + 50 })
            .eq('id', referrerId);
        }
      }
      
      if (onSuccess) {
        onSuccess(authData.user);
      } else {
        router.push('/feed');
      }
      
    } catch (err: any) {
      console.error('Signup error:', err);
      setSignupError(err.message || 'Failed to sign up. Please try again.');
    } finally {
      setSignupLoading(false);
    }
  };

  const switchMode = () => {
    setMode(mode === 'login' ? 'signup' : 'login');
    setLoginError('');
    setSignupError('');
    if (onSwitchMode) onSwitchMode();
  };

  return (
    <div className={styles.formContainer}>
      {mode === 'login' ? (
        // LOGIN FORM
        <>
          <div className={styles.formHeader}>
            <div className={styles.logoIcon}>🎨</div>
            <h2>Welcome back</h2>
            <p>Log in to continue your creative journey</p>
          </div>
          
          <button className={styles.googleBtn} onClick={handleGoogleAuth} disabled={loginLoading}>
            <i className="fab fa-google"></i> Continue with Google
          </button>
          
          <div className={styles.divider}>
            <span>or log in with email</span>
          </div>
          
          <form onSubmit={handleLogin} className={styles.form}>
            <div className={styles.formGroup}>
              <input
                type="email"
                placeholder="Email address"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
              />
            </div>
            
            <div className={styles.formGroup}>
              <div className={styles.passwordField}>
                <input
                  type={showLoginPassword ? "text" : "password"}
                  placeholder="Password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                />
                <button
                  type="button"
                  className={styles.passwordToggle}
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                >
                  <i className={showLoginPassword ? "fas fa-eye-slash" : "fas fa-eye"}></i>
                </button>
              </div>
            </div>
            
            <div className={styles.forgotLink}>
              <a href="#" onClick={(e) => { e.preventDefault(); }}>Forgot password?</a>
            </div>
            
            {loginError && <div className={styles.submitError}>{loginError}</div>}
            
            <button type="submit" className={styles.submitBtn} disabled={loginLoading}>
              {loginLoading ? 'Logging in...' : 'Log In →'}
            </button>
          </form>
          
          <div className={styles.switchLink}>
            Don't have an account? <button onClick={switchMode}>Create one →</button>
          </div>
        </>
      ) : (
        // SIGNUP FORM
        <>
          <div className={styles.formHeader}>
            <h2>Create your account</h2>
            <p>Join the creator movement</p>
          </div>
          
          <button className={styles.googleBtn} onClick={handleGoogleAuth} disabled={signupLoading}>
            <i className="fab fa-google"></i> Continue with Google
          </button>
          
          <div className={styles.divider}>
            <span>or sign up with email</span>
          </div>
          
          <form onSubmit={handleSignup} className={styles.form}>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <input
                  type="text"
                  placeholder="First name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div className={styles.formGroup}>
                <input
                  type="text"
                  placeholder="Last name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>
            
            <div className={styles.formGroup}>
              <input
                type="email"
                placeholder="Email address"
                value={signupEmail}
                onChange={(e) => setSignupEmail(e.target.value)}
              />
            </div>
            
            <div className={styles.formGroup}>
              <div className={styles.passwordField}>
                <input
                  type={showSignupPassword ? "text" : "password"}
                  placeholder="Password (6+ characters)"
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                />
                <button
                  type="button"
                  className={styles.passwordToggle}
                  onClick={() => setShowSignupPassword(!showSignupPassword)}
                >
                  <i className={showSignupPassword ? "fas fa-eye-slash" : "fas fa-eye"}></i>
                </button>
              </div>
            </div>
            
            <div className={styles.formGroup}>
              <input
                type="text"
                placeholder="Referral code (optional)"
                value={referralCode}
                onChange={(e) => setReferralCode(e.target.value.toLowerCase())}
              />
              <div className={styles.referralHint}>
                <i className="fas fa-gift"></i> Have a friend's code? Enter their username. Both get +50 XP!
              </div>
            </div>
            
            {signupError && <div className={styles.submitError}>{signupError}</div>}
            
            <button type="submit" className={styles.submitBtn} disabled={signupLoading}>
              {signupLoading ? 'Creating account...' : 'Join ComeUnity →'}
            </button>
          </form>
          
          <div className={styles.switchLink}>
            Already have an account? <button onClick={switchMode}>Log in →</button>
          </div>
        </>
      )}
    </div>
  );
};

export default AuthForm;