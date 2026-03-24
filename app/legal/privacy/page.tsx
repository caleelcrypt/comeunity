'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function PrivacyPage() {
  const router = useRouter();
  const [showToast, setShowToast] = useState<string | null>(null);

  const showToastMessage = (message: string) => {
    setShowToast(message);
    setTimeout(() => setShowToast(null), 2000);
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      showToastMessage(`Jumped to ${id.replace(/-/g, ' ')}`);
    }
  };

  return (
    <div className="policy-page">
      <div className="policy-container">
        {/* Header */}
        <div className="policy-header">
          <div className="policy-logo" onClick={() => router.push('/')}>
            <span>COME</span><span>UNITY</span>
          </div>
          <div className="tagline">Your data. Your work. Your rules.</div>
          <div className="subtagline">We don't sell your stuff. We don't track you. We don't play games with your privacy.</div>
          <div className="promise-badge">
            <i className="fas fa-shield-alt" style={{ color: '#ffd700' }}></i> Our Privacy Promise: "We collect what we need to run the platform. Nothing more. Nothing less. And we never, ever sell your data."
          </div>
        </div>

        {/* Table of Contents */}
        <div className="toc-card">
          <div className="toc-title"><i className="fas fa-list-ul"></i> Table of Contents</div>
          <div className="toc-grid">
            {[
              { id: 'promise', icon: 'fa-heart', label: 'Our Privacy Promise' },
              { id: 'what-data', icon: 'fa-database', label: 'What Data We Collect' },
              { id: 'not-collect', icon: 'fa-ban', label: 'What We DON\'T Collect' },
              { id: 'how-use', icon: 'fa-cogs', label: 'How We Use Data' },
              { id: 'who-sees', icon: 'fa-eye', label: 'Who Sees Your Data' },
              { id: 'your-rights', icon: 'fa-gavel', label: 'Your Rights' },
              { id: 'security', icon: 'fa-lock', label: 'Data Security' },
              { id: 'cookies', icon: 'fa-cookie-bite', label: 'Cookies & Tracking' },
              { id: 'children', icon: 'fa-child', label: 'Children\'s Privacy' },
              { id: 'international', icon: 'fa-globe', label: 'International Transfers' },
              { id: 'retention', icon: 'fa-clock', label: 'How Long We Keep Data' },
              { id: 'delete', icon: 'fa-trash-alt', label: 'Deleting Your Account' },
              { id: 'changes', icon: 'fa-edit', label: 'Changes to Policy' },
              { id: 'contact', icon: 'fa-envelope', label: 'Contact Us' }
            ].map((item) => (
              <div key={item.id} className="toc-item" onClick={() => scrollToSection(item.id)}>
                <i className={`fas ${item.icon}`}></i> {item.label}
              </div>
            ))}
          </div>
        </div>

        {/* Privacy Promise */}
        <div className="section-card" id="promise">
          <div className="section-title"><i className="fas fa-heart" style={{ color: '#ffd700' }}></i> Our Privacy Promise</div>
          <div className="privacy-shield">
            <div className="shield-icon"><i className="fas fa-shield-alt"></i></div>
            <p style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px' }}>"We collect what we need to run the platform. Nothing more. Nothing less. And we never, ever sell your data."</p>
            <div className="data-flow">
              <div className="flow-node"><i className="fas fa-user"></i><br />Your Name</div>
              <div className="flow-arrow"><i className="fas fa-arrow-right"></i></div>
              <div className="flow-node"><i className="fas fa-coffee"></i><br />ComeUnity Coffee Shop</div>
              <div className="flow-arrow"><i className="fas fa-arrow-right"></i></div>
              <div className="flow-node"><i className="fas fa-heart"></i><br />Safe & Valued</div>
            </div>
            <p className="glowing-text">Think of it like your local coffee shop. They know your name, your usual order. They don't follow you home. They don't sell your info. They just want you to feel welcome. That's ComeUnity.</p>
          </div>
        </div>

        {/* What Data We Collect */}
        <div className="section-card" id="what-data">
          <div className="section-title"><i className="fas fa-database"></i> What Data We Collect & Why</div>
          
          <div className="section-subtitle"><i className="fas fa-id-card"></i> 1. Account Information</div>
          <div className="data-table">
            <div className="data-row header">
              <div>Data</div>
              <div>Why We Collect It</div>
              <div>Legal Basis</div>
            </div>
            <div className="data-row"><div><i className="fas fa-envelope"></i> Email address</div><div>To log you in, send important updates, recover your account</div><div>Contract (you need this to use the platform)</div></div>
            <div className="data-row"><div><i className="fas fa-user"></i> Username</div><div>Your identity on ComeUnity</div><div>Contract (you need a name)</div></div>
            <div className="data-row"><div><i className="fas fa-lock"></i> Password</div><div>To secure your account</div><div>Contract (encrypted, we can't see it)</div></div>
          </div>

          <div className="section-subtitle"><i className="fas fa-user-circle"></i> 2. Profile Information</div>
          <div className="data-table">
            <div className="data-row header"><div>Data</div><div>Why We Collect It</div><div>Legal Basis</div></div>
            <div className="data-row"><div><i className="fas fa-smile"></i> Avatar emoji</div><div>Your visual identity</div><div>Contract (you choose how you appear)</div></div>
            <div className="data-row"><div><i className="fas fa-file-alt"></i> Bio</div><div>Tell others about yourself</div><div>Contract (your choice)</div></div>
            <div className="data-row"><div><i className="fas fa-link"></i> Linked social accounts</div><div>To verify you're really you</div><div>Consent (you choose to link)</div></div>
          </div>

          <div className="section-subtitle"><i className="fas fa-file-alt"></i> 3. Content You Create</div>
          <div className="data-table">
            <div className="data-row header"><div>Data</div><div>Why We Collect It</div><div>Legal Basis</div></div>
            <div className="data-row"><div><i className="fas fa-pen"></i> Posts</div><div>To share with the community</div><div>Contract (this is the platform)</div></div>
            <div className="data-row"><div><i className="fas fa-comment"></i> Comments</div><div>To enable conversations</div><div>Contract</div></div>
            <div className="data-row"><div><i className="fas fa-heart"></i> Likes</div><div>To show appreciation</div><div>Contract</div></div>
            <div className="data-row"><div><i className="fas fa-coins"></i> Tips</div><div>To transfer value between users</div><div>Contract (we need to track coins)</div></div>
          </div>

          <div className="section-subtitle"><i className="fas fa-microchip"></i> 4. Technical Data</div>
          <div className="data-table">
            <div className="data-row header"><div>Data</div><div>Why We Collect It</div><div>Legal Basis</div></div>
            <div className="data-row"><div><i className="fas fa-network-wired"></i> IP address</div><div>To prevent spam and abuse</div><div>Legitimate interest (keeping the platform safe)</div></div>
            <div className="data-row"><div><i className="fas fa-mobile-alt"></i> Device type</div><div>To optimize the app for you</div><div>Legitimate interest</div></div>
            <div className="data-row"><div><i className="fas fa-globe"></i> Browser type</div><div>To fix bugs</div><div>Legitimate interest</div></div>
            <div className="data-row"><div><i className="fas fa-clock"></i> Time zone</div><div>To show accurate timestamps</div><div>Contract (so you know when posts were made)</div></div>
          </div>
        </div>

        {/* What We DON'T Collect */}
        <div className="section-card" id="not-collect">
          <div className="section-title"><i className="fas fa-ban" style={{ color: '#10b981' }}></i> What Data We DO NOT Collect</div>
          <div className="rights-grid">
            <div className="right-card"><div className="right-icon"><i className="fas fa-user-secret"></i></div><div>Real name</div><div className="domain-tag">You choose your username</div></div>
            <div className="right-card"><div className="right-icon"><i className="fas fa-phone-alt"></i></div><div>Phone number</div><div className="domain-tag">We don't need it</div></div>
            <div className="right-card"><div className="right-icon"><i className="fas fa-map-marker-alt"></i></div><div>Address</div><div className="domain-tag">We're not sending you anything</div></div>
            <div className="right-card"><div className="right-icon"><i className="fas fa-credit-card"></i></div><div>Credit card info</div><div className="domain-tag">Stripe handles payments</div></div>
            <div className="right-card"><div className="right-icon"><i className="fas fa-history"></i></div><div>Browsing history</div><div className="domain-tag">None of our business</div></div>
            <div className="right-card"><div className="right-icon"><i className="fas fa-map-pin"></i></div><div>Exact location</div><div className="domain-tag">Only time zone needed</div></div>
            <div className="right-card"><div className="right-icon"><i className="fas fa-address-book"></i></div><div>Contacts</div><div className="domain-tag">We don't access your phone contacts</div></div>
            <div className="right-card"><div className="right-icon"><i className="fas fa-images"></i></div><div>Photos</div><div className="domain-tag">You upload what you choose</div></div>
          </div>
        </div>

        {/* How We Use Your Data */}
        <div className="section-card" id="how-use">
          <div className="section-title"><i className="fas fa-cogs"></i> How We Use Your Data</div>
          <div className="rights-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
            <div className="right-card"><i className="fas fa-play-circle"></i><br />To run the platform<br /><small>Show posts, track XP, process tips</small></div>
            <div className="right-card"><i className="fas fa-shield-alt"></i><br />To keep you safe<br /><small>Detect spam, block impersonators</small></div>
            <div className="right-card"><i className="fas fa-bug"></i><br />To improve the app<br /><small>Fix bugs, make things faster</small></div>
            <div className="right-card"><i className="fas fa-envelope"></i><br />To communicate with you<br /><small>Send important updates, respond to support</small></div>
          </div>
          <div className="warning-box">
            <i className="fas fa-times-circle" style={{ color: '#ef4444' }}></i> <strong>What we DON'T use your data for:</strong>
            <div className="compliance-grid" style={{ marginTop: '8px' }}>
              <div className="compliance-badge"><i className="fas fa-ban"></i> Selling to advertisers (we have no ads)</div>
              <div className="compliance-badge"><i className="fas fa-ban"></i> Targeted marketing (we don't track you)</div>
              <div className="compliance-badge"><i className="fas fa-ban"></i> Profiling</div>
              <div className="compliance-badge"><i className="fas fa-ban"></i> AI training (your art is yours)</div>
            </div>
          </div>
        </div>

        {/* Who Sees Your Data */}
        <div className="section-card" id="who-sees">
          <div className="section-title"><i className="fas fa-eye"></i> Who Sees Your Data</div>
          <div className="section-subtitle">Public Information (Everyone Sees)</div>
          <div className="compliance-grid">
            <div className="compliance-badge"><i className="fas fa-user"></i> Username</div>
            <div className="compliance-badge"><i className="fas fa-smile"></i> Avatar emoji</div>
            <div className="compliance-badge"><i className="fas fa-file-alt"></i> Bio</div>
            <div className="compliance-badge"><i className="fas fa-pen"></i> Posts</div>
            <div className="compliance-badge"><i className="fas fa-comment"></i> Comments</div>
            <div className="compliance-badge"><i className="fas fa-heart"></i> Likes</div>
            <div className="compliance-badge"><i className="fas fa-chart-line"></i> XP level</div>
            <div className="compliance-badge"><i className="fas fa-medal"></i> Badges</div>
          </div>
          <div className="section-subtitle">Private Information (Only You & ComeUnity)</div>
          <div className="compliance-grid">
            <div className="compliance-badge"><i className="fas fa-envelope"></i> Email address</div>
            <div className="compliance-badge"><i className="fas fa-network-wired"></i> IP address</div>
            <div className="compliance-badge"><i className="fas fa-coins"></i> Tip history</div>
            <div className="compliance-badge"><i className="fas fa-envelope"></i> Support emails</div>
          </div>
          <div className="section-subtitle">Third Parties (Limited)</div>
          <div className="compliance-grid">
            <div className="compliance-badge"><i className="fas fa-database"></i> Supabase - hosts database (encrypted)</div>
            <div className="compliance-badge"><i className="fas fa-credit-card"></i> Stripe/Paystack - processes payments</div>
            <div className="compliance-badge"><i className="fas fa-cloud"></i> Vercel - hosts website</div>
          </div>
          <p style={{ marginTop: '16px' }}><strong>We have NO advertisers. We have NO data brokers. We do NOT sell your data.</strong></p>
        </div>

        {/* Your Rights */}
        <div className="section-card" id="your-rights">
          <div className="section-title"><i className="fas fa-gavel"></i> Your Rights</div>
          <div className="rights-grid">
            <div className="right-card" onClick={() => showToastMessage('Right to know')}><i className="fas fa-question-circle"></i><br />Right to know<br /><small>Ask what data we have</small></div>
            <div className="right-card" onClick={() => showToastMessage('Settings → Download My Data')}><i className="fas fa-download"></i><br />Right to access<br /><small>Download all your data</small></div>
            <div className="right-card" onClick={() => showToastMessage('Edit your profile')}><i className="fas fa-edit"></i><br />Right to correct<br /><small>Fix wrong information</small></div>
            <div className="right-card" onClick={() => showToastMessage('Settings → Delete Account')}><i className="fas fa-trash-alt"></i><br />Right to delete<br /><small>Delete your account</small></div>
          </div>
          <p>All requests are free. We respond within 30 days.</p>
        </div>

        {/* Continue with remaining sections... */}
        <div className="section-card" id="security">
          <div className="section-title"><i className="fas fa-lock"></i> Data Security</div>
          <div className="rights-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
            <div className="right-card"><i className="fas fa-lock"></i><br />Encryption in transit<br /><small>HTTPS everywhere</small></div>
            <div className="right-card"><i className="fas fa-database"></i><br />Encryption at rest<br /><small>Your data is encrypted</small></div>
            <div className="right-card"><i className="fas fa-hash"></i><br />Password hashing<br /><small>We don't store your password</small></div>
            <div className="right-card"><i className="fas fa-chart-line"></i><br />Regular audits<br /><small>We check security regularly</small></div>
          </div>
        </div>

        {/* Bottom Line */}
        <div className="section-card">
          <div className="section-title"><i className="fas fa-star" style={{ color: '#ffd700' }}></i> The Bottom Line</div>
          <div className="privacy-shield" style={{ background: 'linear-gradient(145deg, rgba(255,77,109,0.1), rgba(67,97,238,0.1))' }}>
            <p style={{ fontSize: '20px', fontWeight: 600, marginBottom: '16px' }}>"We collect what we need to make ComeUnity work. We protect what you trust us with. We don't sell, share, or trade your data. Ever."</p>
            <p>Think of us like your local coffee shop. They know your name, your usual order. They don't sell your coffee preferences. They just want you to feel welcome.</p>
            <p style={{ marginTop: '16px' }}><strong>That's ComeUnity. Welcome home.</strong></p>
          </div>
        </div>

        {/* Back to Top */}
        <div className="back-to-top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <i className="fas fa-arrow-up"></i>
        </div>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div className="policy-toast">
          <i className="fas fa-info-circle"></i> {showToast}
        </div>
      )}
    </div>
  );
}