'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function GuidelinesPage() {
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
    <div className="guidelines-page">
      <div className="guidelines-container">
        {/* Header */}
        <div className="guidelines-header">
          <div className="guidelines-logo" onClick={() => router.push('/')}>
            <span>COME</span><span>UNITY</span>
          </div>
          <div className="header-badge">
            <i className="fas fa-gavel"></i> Official Guidelines
          </div>
          <div className="read-time">
            <i className="fas fa-clock"></i> Please read these guidelines carefully. It'll take 8 minutes—about the same time you spend typing a message, deleting it, retyping it, then sending something completely different. We promise it's worth it.
          </div>
        </div>

        {/* Welcome Section */}
        <div className="section-card" id="welcome">
          <div className="section-title">
            <i className="fas fa-globe"></i> Welcome to ComeUnity!
          </div>
          <p style={{ fontSize: '18px', fontWeight: 500, marginBottom: '12px' }}>
            Where creators find their people and get paid.
          </p>
          <p>We're building the kindest, safest, most rewarding community on the internet.</p>
        </div>

        {/* Table of Contents */}
        <div className="toc-card">
          <div className="toc-title">
            <i className="fas fa-list-ul"></i> Table of Contents
          </div>
          <div className="toc-grid">
            {[
              { id: 'mission', icon: 'fa-bullseye', label: 'Our Mission' },
              { id: 'golden-rule', icon: 'fa-balance-scale', label: 'Golden Rule' },
              { id: 'do', icon: 'fa-check-circle', label: 'What You CAN Do' },
              { id: 'dont', icon: 'fa-ban', label: 'What You CANNOT Do' },
              { id: 'identity', icon: 'fa-id-card', label: 'Identity & Verification' },
              { id: 'content', icon: 'fa-file-alt', label: 'Content Guidelines' },
              { id: 'links', icon: 'fa-link', label: 'Links & Sharing' },
              { id: 'tipping', icon: 'fa-coins', label: 'Tipping & Coins' },
              { id: 'xp', icon: 'fa-chart-line', label: 'XP, Levels & Gamification' },
              { id: 'unities', icon: 'fa-users', label: 'Unities & Units' },
              { id: 'reporting', icon: 'fa-flag', label: 'Reporting & Moderation' },
              { id: 'consequences', icon: 'fa-gavel', label: 'Consequences' },
              { id: 'legal', icon: 'fa-file-contract', label: 'Legal Stuff' },
              { id: 'appeals', icon: 'fa-envelope', label: 'Appeals & Support' }
            ].map((item) => (
              <div key={item.id} className="toc-item" onClick={() => scrollToSection(item.id)}>
                <i className={`fas ${item.icon}`}></i> {item.label}
              </div>
            ))}
          </div>
        </div>

        {/* Mission Section */}
        <div className="section-card" id="mission">
          <div className="section-title">
            <i className="fas fa-bullseye"></i> Our Mission & Promise
          </div>
          <p>ComeUnity is where creators find their people AND get paid.<br />We're building a space where:</p>
          <div className="mission-grid">
            <div className="mission-tag"><i className="fas fa-palette"></i> Artists share their work and get tipped</div>
            <div className="mission-tag"><i className="fas fa-music"></i> Musicians find fans who support them directly</div>
            <div className="mission-tag"><i className="fas fa-gamepad"></i> Gamers connect with teammates who appreciate them</div>
            <div className="mission-tag"><i className="fas fa-pen-fancy"></i> Writers build audiences who value their words</div>
            <div className="mission-tag"><i className="fas fa-globe-americas"></i> Everyone finds their community and feels valued</div>
          </div>
          <p>Our promise to you:</p>
          <div className="domains-grid">
            <div className="domain-tag"><i className="fas fa-chart-line"></i> No algorithm hiding your posts</div>
            <div className="domain-tag"><i className="fas fa-ad"></i> No ads manipulating your attention</div>
            <div className="domain-tag"><i className="fas fa-building"></i> No corporate middlemen taking your money</div>
            <div className="domain-tag"><i className="fas fa-clock"></i> A chronological feed where your work stands on its own</div>
            <div className="domain-tag"><i className="fas fa-heart"></i> Direct support from people who love what you do</div>
          </div>
        </div>

        {/* Golden Rule */}
        <div className="section-card" id="golden-rule">
          <div className="section-title">
            <i className="fas fa-balance-scale"></i> The Golden Rule
          </div>
          <div className="golden-rule-box">
            <i className="fas fa-quote-left"></i>
            <p>"Treat others how you want to be treated."</p>
            <span>It's that simple. If you wouldn't say it to someone's face, don't post it. If you wouldn't want it done to you, don't do it to others. This is a community, not a battlefield.</span>
          </div>
        </div>

        {/* What You CAN Do */}
        <div className="section-card" id="do">
          <div className="section-title">
            <i className="fas fa-check-circle" style={{ color: '#10b981' }}></i> What You CAN Do
          </div>
          <div className="subsection-title">
            <i className="fas fa-share-alt"></i> Create & Share
          </div>
          <div className="domains-grid">
            <div className="domain-tag"><i className="fas fa-file-alt"></i> Post text about your work, thoughts, or questions</div>
            <div className="domain-tag"><i className="fas fa-link"></i> Share links to your work on trusted platforms</div>
            <div className="domain-tag"><i className="fas fa-smile"></i> Upload profile emoji avatars (free and paid)</div>
            <div className="domain-tag"><i className="fas fa-comment"></i> Comment on other creators' work</div>
            <div className="domain-tag"><i className="fas fa-heart"></i> Like posts that inspire you</div>
            <div className="domain-tag"><i className="fas fa-coins"></i> Tip creators you love with coins</div>
            <div className="domain-tag"><i className="fas fa-gem"></i> Treasure posts to save for later</div>
          </div>
          <div className="subsection-title">
            <i className="fas fa-id-card"></i> Build Your Identity
          </div>
          <div className="domains-grid">
            <div className="domain-tag"><i className="fas fa-user"></i> Choose a username that represents you</div>
            <div className="domain-tag"><i className="fas fa-check-circle"></i> Get verified by linking your social media</div>
            <div className="domain-tag"><i className="fas fa-chart-line"></i> Earn XP, level up, and collect badges</div>
            <div className="domain-tag"><i className="fas fa-crown"></i> Buy rare emoji avatars with coins</div>
            <div className="domain-tag"><i className="fas fa-chart-bar"></i> Compete on weekly leaderboards</div>
            <div className="domain-tag"><i className="fas fa-star"></i> Become a Top Contributor in your Unities</div>
          </div>
          <div className="subsection-title">
            <i className="fas fa-users"></i> Join Communities
          </div>
          <div className="domains-grid">
            <div className="domain-tag"><i className="fas fa-globe"></i> Join up to 5 Unities (communities)</div>
            <div className="domain-tag"><i className="fas fa-handshake"></i> Become a "Unit" (member) of your favorite Unities</div>
            <div className="domain-tag"><i className="fas fa-bullhorn"></i> Post in Unities that match your interests</div>
            <div className="domain-tag"><i className="fas fa-medal"></i> Earn Unity-specific badges and recognition</div>
          </div>
        </div>

        {/* What You CANNOT Do */}
        <div className="section-card" id="dont">
          <div className="section-title">
            <i className="fas fa-ban" style={{ color: '#ef4444' }}></i> What You CANNOT Do
          </div>
          <div className="subsection-title">
            <i className="fas fa-user-secret"></i> Impersonation & Identity Fraud
          </div>
          <div className="rule-table">
            <div className="rule-row header">
              <div>What You CANNOT Do</div>
              <div>Why</div>
            </div>
            <div className="rule-row"><div><i className="fas fa-mask"></i> Pretend to be someone you're not</div><div>This is fraud. It harms real creators.</div></div>
            <div className="rule-row"><div><i className="fas fa-star"></i> Use a famous name without verification</div><div>If you're not the real Ronaldo, don't use @ronaldo.</div></div>
            <div className="rule-row"><div><i className="fas fa-camera"></i> Post someone else's work as your own</div><div>This is theft. Respect creators.</div></div>
            <div className="rule-row"><div><i className="fas fa-link"></i> Link to content that isn't yours</div><div>Share YOUR work, not others'.</div></div>
          </div>
          <div className="warning-box">
            <i className="fas fa-exclamation-triangle"></i> <strong>Real Talk:</strong> If you impersonate a creator, we will: Permanently ban your account, Transfer the username to the real creator, Report you to relevant authorities if fraud is involved
          </div>
          
          <div className="subsection-title">
            <i className="fas fa-bomb"></i> Spam & Abuse
          </div>
          <div className="rule-table">
            <div className="rule-row"><div><i className="fas fa-rocket"></i> Post more than 3 times per hour</div><div>This is spam. It buries real content.</div></div>
            <div className="rule-row"><div><i className="fas fa-chart-line"></i> Post more than 10 times per day</div><div>We want quality, not quantity.</div></div>
            <div className="rule-row"><div><i className="fas fa-repeat"></i> Post the same link repeatedly</div><div>Your work deserves fresh attention.</div></div>
            <div className="rule-row"><div><i className="fas fa-robot"></i> Use bots or automation</div><div>This violates our human-first principle.</div></div>
            <div className="rule-row"><div><i className="fas fa-users"></i> Create multiple accounts</div><div>One person, one account.</div></div>
          </div>
          
          <div className="subsection-title">
            <i className="fas fa-skull"></i> Harmful Content
          </div>
          <div className="rule-table">
            <div className="rule-row"><div><i className="fas fa-ban"></i> Post sexually explicit content</div><div>This is a platform for creators of all ages.</div></div>
            <div className="rule-row"><div><i className="fas fa-bomb"></i> Post violent or gory content</div><div>This is a safe space, not a shock site.</div></div>
            <div className="rule-row"><div><i className="fas fa-skull-crossbones"></i> Link to pirated content</div><div>Support creators. Don't steal from them.</div></div>
            <div className="rule-row"><div><i className="fas fa-angry"></i> Promote hate speech or violence</div><div>This violates international law and our values.</div></div>
            <div className="rule-row"><div><i className="fas fa-comment-slash"></i> Harass, bully, or intimidate others</div><div>This destroys communities.</div></div>
          </div>
        </div>

        {/* Identity & Verification */}
        <div className="section-card" id="identity">
          <div className="section-title">
            <i className="fas fa-id-card"></i> Identity & Verification
          </div>
          <div className="verification-grid">
            <div className="verification-card" onClick={() => showToastMessage('Basic verification')}>
              <div className="verification-icon"><i className="fas fa-user"></i></div>
              <div className="verification-level">Basic</div>
              <div>Sign up with email</div>
            </div>
            <div className="verification-card" onClick={() => showToastMessage('Verified Artist')}>
              <div className="verification-icon"><i className="fas fa-check-circle" style={{ color: '#10b981' }}></i></div>
              <div className="verification-level">Verified Artist</div>
              <div>Link Instagram OR YouTube</div>
            </div>
            <div className="verification-card" onClick={() => showToastMessage('Verified Creator')}>
              <div className="verification-icon"><i className="fas fa-check-double"></i></div>
              <div className="verification-level">Verified Creator</div>
              <div>Link 2+ platforms</div>
            </div>
            <div className="verification-card" onClick={() => showToastMessage('Verified Pro')}>
              <div className="verification-icon"><i className="fas fa-crown"></i></div>
              <div className="verification-level">Verified Pro</div>
              <div>Link 3+ platforms + 1000 XP</div>
            </div>
            <div className="verification-card" onClick={() => showToastMessage('Verified Legend')}>
              <div className="verification-icon"><i className="fas fa-crown" style={{ color: '#ffd700' }}></i></div>
              <div className="verification-level">Verified Legend</div>
              <div>Invite only (top 1%)</div>
            </div>
          </div>
          <div className="subsection-title">
            <i className="fas fa-steps"></i> How to Get Verified
          </div>
          <div className="steps-container">
            <div className="step"><div className="step-number">1</div><div>Settings → Verification</div></div>
            <div className="step"><div className="step-number">2</div><div>Link your social accounts</div></div>
            <div className="step"><div className="step-number">3</div><div>Ensure username matches</div></div>
            <div className="step"><div className="step-number">4</div><div>Click "Verify"</div></div>
            <div className="step"><div className="step-number">5</div><div>Wait 24-48 hours</div></div>
          </div>
        </div>

        {/* Content Guidelines */}
        <div className="section-card" id="content">
          <div className="section-title">
            <i className="fas fa-file-alt"></i> Content Guidelines
          </div>
          <div className="subsection-title">What's Allowed</div>
          <div className="rule-table">
            <div className="rule-row header"><div>Category</div><div>Allowed?</div><div>Notes</div></div>
            <div className="rule-row"><div>Original art</div><div className="badge-yes"><i className="fas fa-check"></i> Yes</div><div>Paintings, drawings, digital art</div></div>
            <div className="rule-row"><div>Original music</div><div className="badge-yes"><i className="fas fa-check"></i> Yes</div><div>Your songs, beats, productions</div></div>
            <div className="rule-row"><div>Original videos</div><div className="badge-yes"><i className="fas fa-check"></i> Yes</div><div>Your dance, comedy, gaming clips</div></div>
            <div className="rule-row"><div>Original writing</div><div className="badge-yes"><i className="fas fa-check"></i> Yes</div><div>Your stories, poems, articles</div></div>
            <div className="rule-row"><div>Photography</div><div className="badge-yes"><i className="fas fa-check"></i> Yes</div><div>Your photos</div></div>
          </div>
          <div className="subsection-title">What's NOT Allowed</div>
          <div className="rule-table">
            <div className="rule-row header"><div>Category</div><div>Allowed?</div><div>Why</div></div>
            <div className="rule-row"><div>Pornography</div><div className="badge-no"><i className="fas fa-times"></i> No</div><div>This is a creator platform</div></div>
            <div className="rule-row"><div>Violence/gore</div><div className="badge-no"><i className="fas fa-times"></i> No</div><div>This is a safe space</div></div>
            <div className="rule-row"><div>Hate speech</div><div className="badge-no"><i className="fas fa-times"></i> No</div><div>Illegal in most countries</div></div>
            <div className="rule-row"><div>Harassment</div><div className="badge-no"><i className="fas fa-times"></i> No</div><div>Destroys communities</div></div>
            <div className="rule-row"><div>Spam</div><div className="badge-no"><i className="fas fa-times"></i> No</div><div>Buries real content</div></div>
            <div className="rule-row"><div>Copyright infringement</div><div className="badge-no"><i className="fas fa-times"></i> No</div><div>Stealing is wrong</div></div>
          </div>
        </div>

        {/* Links & Sharing */}
        <div className="section-card" id="links">
          <div className="section-title">
            <i className="fas fa-link"></i> Links & Sharing
          </div>
          <div className="subsection-title">What Links Are Allowed?</div>
          <div className="domains-grid">
            <div className="domain-tag"><i className="fas fa-camera"></i> instagram.com</div>
            <div className="domain-tag"><i className="fas fa-palette"></i> deviantart.com</div>
            <div className="domain-tag"><i className="fas fa-palette"></i> behance.net</div>
            <div className="domain-tag"><i className="fas fa-palette"></i> artstation.com</div>
            <div className="domain-tag"><i className="fas fa-music"></i> soundcloud.com</div>
            <div className="domain-tag"><i className="fas fa-music"></i> spotify.com</div>
            <div className="domain-tag"><i className="fas fa-video"></i> youtube.com</div>
            <div className="domain-tag"><i className="fas fa-video"></i> tiktok.com</div>
            <div className="domain-tag"><i className="fas fa-pen-fancy"></i> medium.com</div>
            <div className="domain-tag"><i className="fas fa-gamepad"></i> twitch.tv</div>
            <div className="domain-tag"><i className="fas fa-link"></i> linktr.ee</div>
          </div>
          <div className="subsection-title">Link Posting Rules</div>
          <div className="rule-table">
            <div className="rule-row"><div>Posts per hour</div><div>3</div></div>
            <div className="rule-row"><div>Posts per day</div><div>10</div></div>
            <div className="rule-row"><div>Links per post</div><div>1</div></div>
            <div className="rule-row"><div>Time between posts</div><div>5 minutes</div></div>
            <div className="rule-row"><div>Same link repost</div><div>Once per week</div></div>
          </div>
        </div>

        {/* Tipping & Coins */}
        <div className="section-card" id="tipping">
          <div className="section-title">
            <i className="fas fa-coins" style={{ color: '#ffd700' }}></i> Tipping & Coins
          </div>
          <div className="subsection-title">How Tipping Works</div>
          <div className="tip-grid">
            <div className="tip-card"><i className="fas fa-coins"></i><div className="tip-amount">20 coins</div><div>$0.20</div><div>"I appreciate this"</div></div>
            <div className="tip-card"><i className="fas fa-coins"></i><i className="fas fa-coins"></i><div className="tip-amount">50 coins</div><div>$0.50</div><div>"This is good!"</div></div>
            <div className="tip-card"><i className="fas fa-coins"></i><i className="fas fa-coins"></i><i className="fas fa-coins"></i><div className="tip-amount">100 coins</div><div>$1.00</div><div>"Love this!"</div></div>
            <div className="tip-card"><i className="fas fa-coins"></i><i className="fas fa-coins"></i><i className="fas fa-coins"></i><i className="fas fa-coins"></i><div className="tip-amount">500 coins</div><div>$5.00</div><div>"Amazing work!"</div></div>
          </div>
          <p style={{ textAlign: 'center', margin: '16px 0' }}><strong>100% of your tip goes to the creator.</strong> (We don't take a cut. Ever.)</p>
          
          <div className="subsection-title">How to Earn Coins</div>
          <div className="rule-table">
            <div className="rule-row"><div><i className="fas fa-user-plus"></i> Sign up</div><div>100</div></div>
            <div className="rule-row"><div><i className="fas fa-heart"></i> Like a post</div><div>2</div></div>
            <div className="rule-row"><div><i className="fas fa-comment"></i> Comment</div><div>3</div></div>
            <div className="rule-row"><div><i className="fas fa-pen"></i> Create a post</div><div>5</div></div>
            <div className="rule-row"><div><i className="fas fa-fire"></i> 7-day streak</div><div>50</div></div>
            <div className="rule-row"><div><i className="fas fa-calendar"></i> 30-day streak</div><div>200</div></div>
            <div className="rule-row"><div><i className="fas fa-user-friends"></i> Refer a friend</div><div>50</div></div>
          </div>
        </div>

        {/* XP, Levels & Gamification */}
        <div className="section-card" id="xp">
          <div className="section-title">
            <i className="fas fa-chart-line"></i> XP, Levels & Gamification
          </div>
          <div className="leaderboard-visual">
            <div className="rank-row"><div className="rank-number">10</div><div className="rank-bar"><div className="rank-fill" style={{ width: '100%' }}>Legend</div></div><div>8,100 XP</div></div>
            <div className="rank-row"><div className="rank-number">9</div><div className="rank-bar"><div className="rank-fill" style={{ width: '85%' }}>Champion</div></div><div>6,400 XP</div></div>
            <div className="rank-row"><div className="rank-number">1</div><div className="rank-bar"><div className="rank-fill" style={{ width: '15%' }}>Rookie</div></div><div>0 XP</div></div>
          </div>
          <div className="subsection-title">Streak Rewards</div>
          <div className="rule-table">
            <div className="rule-row"><div>3 days</div><div>+20 XP</div></div>
            <div className="rule-row"><div>7 days</div><div>+100 XP</div></div>
            <div className="rule-row"><div>14 days</div><div>+200 XP</div></div>
            <div className="rule-row"><div>30 days</div><div>+500 XP</div></div>
          </div>
        </div>

        {/* Unities & Units */}
        <div className="section-card" id="unities">
          <div className="section-title">
            <i className="fas fa-users"></i> Unities & Units
          </div>
          <div className="domains-grid">
            <div className="domain-tag"><i className="fas fa-palette"></i> Digital Artists</div>
            <div className="domain-tag"><i className="fas fa-music"></i> Music Makers</div>
            <div className="domain-tag"><i className="fas fa-gamepad"></i> Gaming Hub</div>
            <div className="domain-tag"><i className="fas fa-camera"></i> Photography Masters</div>
            <div className="domain-tag"><i className="fas fa-pen-fancy"></i> Writers' Corner</div>
            <div className="domain-tag"><i className="fas fa-dumbbell"></i> Fitness Tribe</div>
            <div className="domain-tag"><i className="fas fa-utensils"></i> Foodies & Chefs</div>
            <div className="domain-tag"><i className="fas fa-laugh"></i> Comedy Central</div>
          </div>
          <p><strong>Units</strong> are members of Unities. <em>"I'm a Unit in Digital Artists"</em></p>
          <div className="rule-table">
            <div className="rule-row"><div>Unities per user</div><div>Max 5</div></div>
            <div className="rule-row"><div>Can non-members view?</div><div>Yes (read-only)</div></div>
            <div className="rule-row"><div>Can non-members post?</div><div>No (must join)</div></div>
          </div>
        </div>

        {/* Reporting & Moderation */}
        <div className="section-card" id="reporting">
          <div className="section-title">
            <i className="fas fa-flag"></i> Reporting & Moderation
          </div>
          <div className="domains-grid">
            <div className="domain-tag"><i className="fas fa-envelope"></i> Spam</div>
            <div className="domain-tag"><i className="fas fa-comment-dots"></i> Harassment</div>
            <div className="domain-tag"><i className="fas fa-mask"></i> Impersonation</div>
            <div className="domain-tag"><i className="fas fa-angry"></i> Hate speech</div>
            <div className="domain-tag"><i className="fas fa-ban"></i> Inappropriate content</div>
            <div className="domain-tag"><i className="fas fa-copyright"></i> Copyright infringement</div>
          </div>
          <div className="leaderboard-visual">
            <div className="rank-row"><div className="rank-number">1</div><div className="rank-bar"><div className="rank-fill" style={{ width: '20%' }}>Manual review</div></div><div>1 report</div></div>
            <div className="rank-row"><div className="rank-number">3</div><div className="rank-bar"><div className="rank-fill" style={{ width: '60%' }}>Content hidden</div></div><div>3 reports</div></div>
            <div className="rank-row"><div className="rank-number">10</div><div className="rank-bar"><div className="rank-fill" style={{ width: '100%', background: '#ef4444' }}>Temporary ban</div></div><div>10+ reports</div></div>
          </div>
        </div>

        {/* Consequences */}
        <div className="section-card" id="consequences">
          <div className="section-title">
            <i className="fas fa-gavel"></i> Consequences
          </div>
          <div className="steps-container">
            <div className="step"><div className="step-number">1</div><div>Warning notification<br />Posting limit<br />-50 XP</div></div>
            <div className="step"><div className="step-number">2</div><div>7-day ban<br />Loss of streak<br />-200 XP</div></div>
            <div className="step"><div className="step-number">3</div><div>Permanent ban<br />All content removed</div></div>
          </div>
          <div className="warning-box instant-ban">
            <i className="fas fa-skull"></i> <strong>INSTANT Permanent Ban:</strong> Child exploitation, Terrorism promotion, Impersonation of real creators, Malware links, Doxxing
          </div>
        </div>

        {/* Legal Stuff */}
        <div className="section-card" id="legal">
          <div className="section-title">
            <i className="fas fa-file-contract"></i> Legal Stuff
          </div>
          <div className="legal-grid">
            <div className="legal-card"><i className="fas fa-flag-usa"></i><br />Section 230, DMCA</div>
            <div className="legal-card"><i className="fas fa-euro-sign"></i><br />Digital Services Act</div>
            <div className="legal-card"><i className="fas fa-gavel"></i><br />Online Safety Bill</div>
            <div className="legal-card"><i className="fas fa-lock"></i><br />GDPR</div>
          </div>
          <p><strong>Copyright & DMCA:</strong> copyright@comeunity.com</p>
          <p><strong>Data Privacy:</strong> We DO NOT sell your data. We DO NOT have ads.</p>
          <p><strong>Age Restrictions:</strong> Minimum age 13 years.</p>
        </div>

        {/* Appeals & Support */}
        <div className="section-card" id="appeals">
          <div className="section-title">
            <i className="fas fa-envelope"></i> Appeals & Support
          </div>
          <div className="support-grid">
            <div className="support-item"><i className="fas fa-envelope"></i> General support: support@comeunity.com</div>
            <div className="support-item"><i className="fas fa-gavel"></i> Appeals: appeals@comeunity.com</div>
            <div className="support-item"><i className="fas fa-copyright"></i> Copyright: copyright@comeunity.com</div>
            <div className="support-item"><i className="fas fa-shield-alt"></i> Law enforcement: legal@comeunity.com</div>
          </div>
          <p style={{ marginTop: '16px' }}>Response time: Usually 24-48 hours.</p>
        </div>

        {/* The ComeUnity Promise */}
        <div className="section-card promise-card">
          <div className="section-title">
            <i className="fas fa-heart" style={{ color: '#ffd700' }}></i> The ComeUnity Promise
          </div>
          <div className="promise-grid">
            <div className="promise-item"><i className="fas fa-shield-alt"></i> Protect your identity and work</div>
            <div className="promise-item"><i className="fas fa-ban"></i> Keep the platform free of ads and algorithms</div>
            <div className="promise-item"><i className="fas fa-chart-line"></i> Let your work stand on its own merit</div>
            <div className="promise-item"><i className="fas fa-coins"></i> Support creators with direct tipping</div>
            <div className="promise-item"><i className="fas fa-heart"></i> Build a community where everyone belongs</div>
          </div>
          <div className="promise-footer">
            <p><i className="fas fa-rocket"></i> Welcome to ComeUnity</p>
            <p>You are now a Unit. You belong to Unities. Your work matters. Your voice matters.</p>
            <p>Now go create. Go connect. Go collab.</p>
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginTop: '16px' }}>Last updated: March 2026</p>
          </div>
        </div>

        {/* Back to Top Button */}
        <div className="back-to-top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <i className="fas fa-arrow-up"></i>
        </div>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div className="guidelines-toast">
          <i className="fas fa-info-circle"></i> {showToast}
        </div>
      )}
    </div>
  );
}