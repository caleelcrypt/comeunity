'use client'

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';
import LandingPage from './components/Landing/LandingPage';
import AuthForm from './components/Auth/AuthForm';
import { supabase } from '../lib/supabaseClient';

// Dynamically import components
const MainLayout = dynamic(() => import('./components/Navigation/MainLayout'), { ssr: false });
const PublicProfilePage = dynamic(() => import('./pages/PublicProfile'), { ssr: false });

export default function Page() {
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    };
    
    checkAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  if (!isClient || isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-pink-800 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  // Root path - show landing page
  if (pathname === '/') {
    return <LandingPage />;
  }

  // Auth path - show auth form
  if (pathname === '/auth') {
    return <AuthForm />;
  }

  // Profile path - check if it's a profile URL like /profile/username
  if (pathname.startsWith('/profile/')) {
    return <PublicProfilePage />;
  }

  // Feed path and other protected routes
  if (isAuthenticated) {
    return <MainLayout />;
  }

  // If not authenticated and trying to access protected route, redirect to landing
  if (typeof window !== 'undefined') {
    window.location.href = '/';
  }
  
  return <LandingPage />;
}