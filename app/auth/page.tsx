// comeunity/app/auth/page.tsx
'use client';
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import LandingPreview from './components/LandingPreview';
import AuthForm from './components/AuthForm';
import styles from './Auth.module.css';

export default function AuthPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<'signup' | 'login'>('signup');
  const [referralCode, setReferralCode] = useState<string>('');
  const [redirectTo, setRedirectTo] = useState<string>('/feed');

  // Check if user is already logged in
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.push('/feed');
      }
    };
    checkSession();

    // Get referral code from URL
    const ref = searchParams.get('ref');
    if (ref) setReferralCode(ref);

    // Get redirect path from URL
    const redirect = searchParams.get('redirect');
    if (redirect) setRedirectTo(redirect);
  }, [router, searchParams]);

  const handleSignupSuccess = (user: any) => {
    router.push('/feed');
  };

  return (
    <div className={styles.authPage}>
      {/* Background Animation */}
      <div className={styles.bgAnimation}>
        <div className={styles.bgGradient}></div>
        <div className={styles.bgNoise}></div>
        <div className={styles.floatingOrb} style={{ top: '10%', left: '-5%' }}></div>
        <div className={styles.floatingOrb} style={{ bottom: '10%', right: '-5%', width: '400px', height: '400px', animationDelay: '-5s' }}></div>
      </div>

      {/* Auth Toggle */}
      <div className={styles.authToggle}>
        <button
          className={`${styles.toggleBtn} ${mode === 'signup' ? styles.active : ''}`}
          onClick={() => setMode('signup')}
        >
          Sign Up
        </button>
        <button
          className={`${styles.toggleBtn} ${mode === 'login' ? styles.active : ''}`}
          onClick={() => setMode('login')}
        >
          Log In
        </button>
      </div>

      {/* Main Container */}
      <div className={styles.appContainer}>
        <div className={styles.contentWrapper}>
          {/* Left Side - Preview */}
          <LandingPreview />

          {/* Right Side - Auth Form */}
          <div className={styles.authCard}>
            <AuthForm
              mode={mode}
              referralCode={referralCode}
              onSuccess={handleSignupSuccess}
              onSwitchMode={() => setMode(mode === 'login' ? 'signup' : 'login')}
            />
          </div>
        </div>
      </div>
    </div>
  );
}