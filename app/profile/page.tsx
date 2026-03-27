'use client';
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '../../lib/supabaseClient';
import MyProfilePage from '../pages/MyProfile';
import PublicProfile from '../components/PublicProfile/PublicProfile';

export default function ProfileRoute() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const username = searchParams.get('username');
  
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [profileData, setProfileData] = useState<any>(null);

  useEffect(() => {
    let isMounted = true;
    
    const checkAuth = async () => {
      try {
        // If viewing someone else's profile (username in URL), we don't need auth
        if (username) {
          console.log('🔵 Viewing public profile for:', username);
          // Fetch the profile data for the username
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('username', username)
            .single();
          
          if (error) {
            console.error('🔴 Profile not found:', error);
            if (isMounted) {
              router.push('/feed');
            }
            return;
          }
          
          if (isMounted) {
            setProfileData(profile);
            setLoading(false);
          }
          return;
        }
        
        // No username in URL - this is the current user's own profile
        // Check authentication
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('🔴 Session error:', sessionError);
          if (isMounted) {
            router.push('/auth');
          }
          return;
        }
        
        if (!session) {
          console.log('🔴 No session, redirecting to auth');
          if (isMounted) {
            router.push('/auth');
          }
          return;
        }
        
        // Session exists, user is authenticated
        console.log('🔵 User authenticated:', session.user.id);
        
        // Fetch the user's own profile
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        if (profileError) {
          console.error('🔴 Profile fetch error:', profileError);
          if (isMounted) {
            router.push('/auth');
          }
          return;
        }
        
        if (isMounted) {
          setUser(session.user);
          setProfileData(profile);
          setLoading(false);
        }
        
      } catch (error) {
        console.error('🔴 Auth check error:', error);
        if (isMounted) {
          router.push('/auth');
        }
      }
    };
    
    checkAuth();
    
    return () => {
      isMounted = false;
    };
  }, [router, username]);

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

  if (!profileData) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: '#0a0a0f',
        color: 'white'
      }}>
        <div>Profile not found</div>
      </div>
    );
  }

  // If we're viewing someone else's profile (username in URL)
  if (username && profileData) {
    // You'll need to create a PublicProfile component that displays a user's profile
    // For now, we'll use MyProfilePage but you should create a separate component
    return <MyProfilePage initialProfile={profileData} isOwnProfile={false} />;
  }

  // Viewing own profile
  return <MyProfilePage initialProfile={profileData} isOwnProfile={true} />;
}