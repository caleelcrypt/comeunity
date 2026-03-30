'use client';
import React, { Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import PublicProfile from '../components/PublicProfile/PublicProfile';

function PublicProfileContent() {
  const searchParams = useSearchParams();
  const username = searchParams.get('username');
  
  useEffect(() => {
    console.log('🔗 PublicProfileContent mounted');
    console.log('🔗 Full URL:', window.location.href);
    console.log('🔗 Username from params:', username);
    console.log('🔗 All search params:', Object.fromEntries(searchParams.entries()));
  }, [username, searchParams]);
  
  if (!username) {
    console.log('❌ No username in URL params');
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="text-white text-center">
          <p className="mb-4">No username specified</p>
          <p className="text-sm text-white/40 mb-4">URL should be: /publicprofile?username=yourusername</p>
          <a href="/feed" className="text-[#ff4d6d]">Go to Feed</a>
        </div>
      </div>
    );
  }
  
  console.log('✅ Rendering PublicProfile for username:', username);
  return <PublicProfile username={username} />;
}

export default function PublicProfilePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="text-white">Loading profile...</div>
      </div>
    }>
      <PublicProfileContent />
    </Suspense>
  );
}