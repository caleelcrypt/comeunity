'use client';
import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import PublicProfile from '../components/PublicProfile/PublicProfile';

// Create a separate component that uses useSearchParams
function PublicProfileContent() {
  const searchParams = useSearchParams();
  const username = searchParams.get('username');
  
  if (!username) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="text-white text-center">
          <p className="mb-4">No username specified</p>
          <a href="/feed" className="text-[#ff4d6d]">Go to Feed</a>
        </div>
      </div>
    );
  }
  
  return <PublicProfile username={username} />;
}

// Main page component with Suspense boundary
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