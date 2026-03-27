'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabaseClient';
import MyProfilePage from '../pages/MyProfile';

export default function ProfileRoute() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log('🔵 Profile route: Checking authentication...');
        
        // Get session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('🔴 Session error:', sessionError);
          router.push('/auth');
          return;
        }
        
        if (!session) {
          console.log('🔴 No session, redirecting to auth');
          router.push('/auth');
          return;
        }
        
        // Get user
        const { data: { user: authUser }, error: userError } = await supabase.auth.getUser();
        
        if (userError || !authUser) {
          console.error('🔴 User error:', userError);
          router.push('/auth');
          return;
        }
        
        console.log('🔵 User authenticated:', authUser.id);
        setUser(authUser);
        setLoading(false);
        
      } catch (error) {
        console.error('🔴 Auth check error:', error);
        router.push('/auth');
      }
    };
    
    checkAuth();
  }, [router]);

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

  if (!user) {
    return null;
  }

  return <MyProfilePage />;
}