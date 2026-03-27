'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../lib/supabaseClient';
import LandingPage from './components/Landing/LandingPage';

export default function HomePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    let isMounted = true;
    
    const checkUser = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session error:', error);
          if (isMounted) {
            setUser(null);
            setLoading(false);
          }
          return;
        }
        
        if (isMounted) {
          setUser(session?.user || null);
          setLoading(false);
        }
      } catch (error) {
        console.error('Auth check error:', error);
        if (isMounted) {
          setUser(null);
          setLoading(false);
        }
      }
    };

    checkUser();
    
    return () => {
      isMounted = false;
    };
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

  // If not logged in, show landing page
  return <LandingPage />;
}