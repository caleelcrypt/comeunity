// comeunity/app/auth/components/LoginForm.tsx
'use client';
import React, { useState } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import { useRouter } from 'next/navigation';
import styles from '../Auth.module.css';

interface LoginFormProps {
  onSwitchToSignup: () => void;
}

const LoginForm = ({ onSwitchToSignup }: LoginFormProps) => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (signInError) throw signInError;
      
      if (data.user) {
        router.push('/feed');
      }
    } catch (err: any) {
      setError(err.message === 'Invalid login credentials' 
        ? 'Incorrect email or password' 
        : err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });
    
    if (error) {
      console.error('Google login error:', error);
      setError(error.message);
      setLoading(false);
    }
    // No need to set loading false on success because page will redirect
  };

  return (
    <div className={styles.formContainer}>
      <div className={styles.formHeader}>
        <div className={styles.logoIcon}>🎨</div>
        <h2>Welcome back</h2>
        <p>Log in to continue your creative journey</p>
      </div>
      
      {/* Google Login Button */}
      <button className={styles.googleBtn} onClick={handleGoogleLogin} disabled={loading}>
        <i className="fab fa-google"></i> Continue with Google
      </button>
      
      <div className={styles.divider}>
        <span>or log in with email</span>
      </div>
      
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        
        <div className={styles.formGroup}>
          <div className={styles.passwordField}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              className={styles.passwordToggle}
              onClick={() => setShowPassword(!showPassword)}
            >
              <i className={showPassword ? "fas fa-eye-slash" : "fas fa-eye"}></i>
            </button>
          </div>
        </div>
        
        <div className={styles.forgotLink}>
          <a href="#" onClick={(e) => { e.preventDefault(); }}>Forgot password?</a>
        </div>
        
        {error && <div className={styles.submitError}>{error}</div>}
        
        <button type="submit" className={styles.submitBtn} disabled={loading}>
          {loading ? 'Logging in...' : 'Log In →'}
        </button>
      </form>
      
      <div className={styles.switchLink}>
        Don't have an account? <button onClick={onSwitchToSignup}>Create one →</button>
      </div>
    </div>
  );
};

export default LoginForm;