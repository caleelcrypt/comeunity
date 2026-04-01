// comeunity/app/App.tsx
import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient'; // Change from '../lib/supabase' to '../lib/supabaseClient'
import { Feed } from './components/feed/Feed';
import './styles/feed.css';

function App() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: 'var(--bg-primary)'
      }}>
        <i className="fas fa-spinner fa-spin" style={{ fontSize: '32px', color: 'var(--gradient-2)' }}></i>
      </div>
    );
  }

  if (!session) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: 'var(--bg-primary)',
        color: 'white'
      }}>
        <div style={{ textAlign: 'center' }}>
          <h1>ComeUnity</h1>
          <p>Please sign in to continue</p>
        </div>
      </div>
    );
  }

  return <Feed />;
}

export default App;