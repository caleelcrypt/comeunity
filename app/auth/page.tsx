'use client';
import React from 'react';
import AuthForm from '../components/Auth/AuthForm';

export default function AuthPage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0a0f 0%, #12121a 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '500px',
        height: '90vh',
        maxHeight: '800px',
        background: 'linear-gradient(145deg, #12121a, #0a0a0f)',
        borderRadius: '44px',
        border: '1px solid rgba(255, 77, 109, 0.3)',
        boxShadow: '0 30px 50px -20px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.02)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        <AuthForm />
      </div>
    </div>
  );
}