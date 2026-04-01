// app/page.tsx
'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import LandingPreview from './auth/components/LandingPreview';
import AuthForm from './auth/components/AuthForm';
import styles from './auth/Auth.module.css';

export default function HomePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
      setLoading(false);
    };
    checkUser();
  }, []);

  useEffect(() => {
    if (!loading && user) {
      router.push('/feed');
    }
  }, [loading, user, router]);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: '#0a0a0f'
      }}>
        <div className="loading-spinner"></div>
      </div>
    );
  }

  // If not logged in, show landing page with auth
  return (
    <div className={styles.authPage}>
      <div className={styles.bgAnimation}>
        <div className={styles.bgGradient}></div>
        <div className={styles.bgNoise}></div>
      </div>
      <div className={styles.appContainer}>
        <div className={styles.contentWrapper}>
          <LandingPreview />
          <div className={styles.authCard}>
            <AuthForm mode="signup" />
          </div>
        </div>
      </div>
    </div>
  );
}