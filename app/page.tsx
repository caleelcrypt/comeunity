'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../lib/supabaseClient';
import LandingPage from './components/Landing/LandingPage';
import FeedPage from './pages/Feed';

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

  // Handle redirect after loading
  useEffect(() => {
    if (!loading) {
      if (user) {
        router.push('/feed');
      }
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

  // If not logged in, show landing page
  return <LandingPage />;
}