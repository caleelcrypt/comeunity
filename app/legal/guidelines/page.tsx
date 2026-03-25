'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

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
    <div className={styles.guidelinesPage}>
      <div className={styles.container}>
        {/* Back Button */}
        <button className={styles.backBtn} onClick={() => router.back()}>
          <i className="fas fa-arrow-left"></i> Back
        </button>

        {/* Header */}
        <div className={styles.header}>
          <div className={styles.logo} onClick={() => router.push('/')}>
            <span>COME</span><span>UNITY</span>
          </div>
          <div className={styles.headerBadge}>
            <i className="fas fa-gavel"></i> Official Guidelines
          </div>
          <div className="landing-read-time" style={{ marginTop: '16px' }}>
            <i className="fas fa-clock"></i>
            <span>Please read these guidelines carefully. It'll take 8 minutes—about the same time you spend typing a message, deleting it, retyping it, then sending something completely different. We promise it's worth it.</span>
          </div>
        </div>

        {/* Welcome Section */}
        <div className={styles.sectionCard} id="welcome">
          <div className={styles.sectionTitle}>
            <i className="fas fa-globe"></i> Welcome to ComeUnity!
          </div>
          <p style={{ fontSize: '18px', fontWeight: 500, marginBottom: '12px', color: 'white' }}>
            Where creators find their people and get paid.
          </p>
          <p style={{ color: 'rgba(255,255,255,0.7)' }}>We're building the kindest, safest, most rewarding community on the internet.</p>
        </div>

        {/* Table of Contents */}
        <div className={styles.tocCard}>
          <div className={styles.tocTitle}>
            <i className="fas fa-list-ul"></i> Table of Contents
          </div>
          <div className={styles.tocGrid}>
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
              <div key={item.id} className={styles.tocItem} onClick={() => scrollToSection(item.id)}>
                <i className={`fas ${item.icon}`}></i> {item.label}
              </div>
            ))}
          </div>
        </div>

        {/* Mission & Promise */}
        <div className={styles.sectionCard} id="mission">
          <div className={styles.sectionTitle}>
            <i className="fas fa-bullseye"></i> Our Mission & Promise
          </div>
          <p style={{ color: 'rgba(255,255,255,0.8)' }}>ComeUnity is where creators find their people AND get paid.<br />We're building a space where:</p>
          <div className="mission-grid" style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', margin: '20px 0' }}>
            <div style={{ background: 'rgba(255,77,109,0.1)', padding: '12px 20px', borderRadius: '20px' }}><i className="fas fa-palette"></i> Artists share their work and get tipped</div>
            <div style={{ background: 'rgba(181,23,158,0.1)', padding: '12px 20px', borderRadius: '20px' }}><i className="fas fa-music"></i> Musicians find fans who support them directly</div>
            <div style={{ background: 'rgba(67,97,238,0.1)', padding: '12px 20px', borderRadius: '20px' }}><i className="fas fa-gamepad"></i> Gamers connect with teammates who appreciate them</div>
            <div style={{ background: 'rgba(16,185,129,0.1)', padding: '12px 20px', borderRadius: '20px' }}><i className="fas fa-pen-fancy"></i> Writers build audiences who value their words</div>
            <div style={{ background: 'rgba(245,158,11,0.1)', padding: '12px 20px', borderRadius: '20px' }}><i className="fas fa-globe-americas"></i> Everyone finds their community and feels valued</div>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.8)', marginTop: '16px' }}>Our promise to you:</p>
          <div className={styles.domainsGrid}>
            <span className={styles.domainTag}><i className="fas fa-chart-line"></i> No algorithm hiding your posts</span>
            <span className={styles.domainTag}><i className="fas fa-ad"></i> No ads manipulating your attention</span>
            <span className={styles.domainTag}><i className="fas fa-building"></i> No corporate middlemen taking your money</span>
            <span className={styles.domainTag}><i className="fas fa-clock"></i> A chronological feed where your work stands on its own</span>
            <span className={styles.domainTag}><i className="fas fa-heart"></i> Direct support from people who love what you do</span>
          </div>
        </div>

        {/* Golden Rule */}
        <div className={styles.sectionCard} id="golden-rule">
          <div className={styles.sectionTitle}>
            <i className="fas fa-balance-scale"></i> The Golden Rule
          </div>
          <div className={styles.goldenRuleBox}>
            <i className="fas fa-quote-left" style={{ fontSize: '32px', opacity: 0.5, color: '#ffd700' }}></i>
            <p>"Treat others how you want to be treated."</p>
            <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px' }}>It's that simple. If you wouldn't say it to someone's face, don't post it. If you wouldn't want it done to you, don't do it to others. This is a community, not a battlefield.</span>
          </div>
        </div>

        {/* What You CAN Do */}
        <div className={styles.sectionCard} id="do">
          <div className={styles.sectionTitle}>
            <i className="fas fa-check-circle" style={{ color: '#10b981' }}></i> What You CAN Do
          </div>
          <div className={styles.subsectionTitle}>
            <i className="fas fa-share-alt"></i> Create & Share
          </div>
          <div className={styles.domainsGrid}>
            <span className={styles.domainTag}><i className="fas fa-file-alt"></i> Post text about your work, thoughts, or questions</span>
            <span className={styles.domainTag}><i className="fas fa-link"></i> Share links to your work on trusted platforms</span>
            <span className={styles.domainTag}><i className="fas fa-smile"></i> Upload profile emoji avatars (free and paid)</span>
            <span className={styles.domainTag}><i className="fas fa-comment"></i> Comment on other creators' work</span>
            <span className={styles.domainTag}><i className="fas fa-heart"></i> Like posts that inspire you</span>
            <span className={styles.domainTag}><i className="fas fa-coins"></i> Tip creators you love with coins</span>
            <span className={styles.domainTag}><i className="fas fa-gem"></i> Treasure posts to save for later</span>
          </div>
          <div className={styles.subsectionTitle}>
            <i className="fas fa-id-card"></i> Build Your Identity
          </div>
          <div className={styles.domainsGrid}>
            <span className={styles.domainTag}><i className="fas fa-user"></i> Choose a username that represents you</span>
            <span className={styles.domainTag}><i className="fas fa-check-circle"></i> Get verified by linking your social media</span>
            <span className={styles.domainTag}><i className="fas fa-chart-line"></i> Earn XP, level up, and collect badges</span>
            <span className={styles.domainTag}><i className="fas fa-crown"></i> Buy rare emoji avatars with coins</span>
            <span className={styles.domainTag}><i className="fas fa-chart-bar"></i> Compete on weekly leaderboards</span>
            <span className={styles.domainTag}><i className="fas fa-star"></i> Become a Top Contributor in your Unities</span>
          </div>
          <div className={styles.subsectionTitle}>
            <i className="fas fa-users"></i> Join Communities
          </div>
          <div className={styles.domainsGrid}>
            <span className={styles.domainTag}><i className="fas fa-globe"></i> Join up to 5 Unities (communities)</span>
            <span className={styles.domainTag}><i className="fas fa-handshake"></i> Become a "Unit" (member) of your favorite Unities</span>
            <span className={styles.domainTag}><i className="fas fa-bullhorn"></i> Post in Unities that match your interests</span>
            <span className={styles.domainTag}><i className="fas fa-medal"></i> Earn Unity-specific badges and recognition</span>
          </div>
        </div>

        {/* What You CANNOT Do */}
        <div className={styles.sectionCard} id="dont">
          <div className={styles.sectionTitle}>
            <i className="fas fa-ban" style={{ color: '#ef4444' }}></i> What You CANNOT Do
          </div>
          <div className={styles.subsectionTitle}>
            <i className="fas fa-user-secret"></i> Impersonation & Identity Fraud
          </div>
          <div className={styles.ruleTable}>
            <div className={`${styles.ruleRow} ${styles.ruleRowHeader}`}>
              <div>What You CANNOT Do</div>
              <div>Why</div>
            </div>
            <div className={styles.ruleRow}>
              <div><i className="fas fa-mask"></i> Pretend to be someone you're not</div>
              <div>This is fraud. It harms real creators.</div>
            </div>
            <div className={styles.ruleRow}>
              <div><i className="fas fa-star"></i> Use a famous name without verification</div>
              <div>If you're not the real Ronaldo, don't use @ronaldo.</div>
            </div>
            <div className={styles.ruleRow}>
              <div><i className="fas fa-camera"></i> Post someone else's work as your own</div>
              <div>This is theft. Respect creators.</div>
            </div>
            <div className={styles.ruleRow}>
              <div><i className="fas fa-link"></i> Link to content that isn't yours</div>
              <div>Share YOUR work, not others'.</div>
            </div>
          </div>
          <div className={styles.warningBox}>
            <i className="fas fa-exclamation-triangle" style={{ color: '#ef4444' }}></i> <strong>Real Talk:</strong> If you impersonate a creator, we will: Permanently ban your account, Transfer the username to the real creator, Report you to relevant authorities if fraud is involved
          </div>

          <div className={styles.subsectionTitle}>
            <i className="fas fa-bomb"></i> Spam & Abuse
          </div>
          <div className={styles.ruleTable}>
            <div className={`${styles.ruleRow} ${styles.ruleRowHeader}`}>
              <div>What You CANNOT Do</div>
              <div>Why</div>
            </div>
            <div className={styles.ruleRow}>
              <div><i className="fas fa-rocket"></i> Post more than 3 times per hour</div>
              <div>This is spam. It buries real content.</div>
            </div>
            <div className={styles.ruleRow}>
              <div><i className="fas fa-chart-line"></i> Post more than 10 times per day</div>
              <div>We want quality, not quantity.</div>
            </div>
            <div className={styles.ruleRow}>
              <div><i className="fas fa-repeat"></i> Post the same link repeatedly</div>
              <div>Your work deserves fresh attention.</div>
            </div>
            <div className={styles.ruleRow}>
              <div><i className="fas fa-robot"></i> Use bots or automation</div>
              <div>This violates our human-first principle.</div>
            </div>
            <div className={styles.ruleRow}>
              <div><i className="fas fa-users"></i> Create multiple accounts</div>
              <div>One person, one account.</div>
            </div>
          </div>

          <div className={styles.subsectionTitle}>
            <i className="fas fa-skull"></i> Harmful Content
          </div>
          <div className={styles.ruleTable}>
            <div className={`${styles.ruleRow} ${styles.ruleRowHeader}`}>
              <div>What You CANNOT Do</div>
              <div>Why</div>
            </div>
            <div className={styles.ruleRow}>
              <div><i className="fas fa-ban"></i> Post sexually explicit content</div>
              <div>This is a platform for creators of all ages.</div>
            </div>
            <div className={styles.ruleRow}>
              <div><i className="fas fa-bomb"></i> Post violent or gory content</div>
              <div>This is a safe space, not a shock site.</div>
            </div>
            <div className={styles.ruleRow}>
              <div><i className="fas fa-skull-crossbones"></i> Link to pirated content</div>
              <div>Support creators. Don't steal from them.</div>
            </div>
            <div className={styles.ruleRow}>
              <div><i className="fas fa-angry"></i> Promote hate speech or violence</div>
              <div>This violates international law and our values.</div>
            </div>
            <div className={styles.ruleRow}>
              <div><i className="fas fa-comment-slash"></i> Harass, bully, or intimidate others</div>
              <div>This destroys communities.</div>
            </div>
          </div>
        </div>

        {/* Identity & Verification */}
        <div className={styles.sectionCard} id="identity">
          <div className={styles.sectionTitle}>
            <i className="fas fa-id-card"></i> Identity & Verification
          </div>
          <div className={styles.verificationGrid}>
            <div className={styles.verificationCard} onClick={() => showToastMessage('Basic verification')}>
              <div className={styles.verificationIcon}><i className="fas fa-user"></i></div>
              <div className={styles.verificationLevel}>Basic</div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>Sign up with email</div>
            </div>
            <div className={styles.verificationCard} onClick={() => showToastMessage('Verified Artist')}>
              <div className={styles.verificationIcon}><i className="fas fa-check-circle" style={{ color: '#10b981' }}></i></div>
              <div className={styles.verificationLevel}>Verified Artist</div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>Link Instagram OR YouTube</div>
            </div>
            <div className={styles.verificationCard} onClick={() => showToastMessage('Verified Creator')}>
              <div className={styles.verificationIcon}><i className="fas fa-crown"></i></div>
              <div className={styles.verificationLevel}>Verified Creator</div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>Link 2+ platforms</div>
            </div>
            <div className={styles.verificationCard} onClick={() => showToastMessage('Verified Pro')}>
              <div className={styles.verificationIcon}><i className="fas fa-crown"></i></div>
              <div className={styles.verificationLevel}>Verified Pro</div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>Link 3+ platforms + 1000 XP</div>
            </div>
            <div className={styles.verificationCard} onClick={() => showToastMessage('Verified Legend')}>
              <div className={styles.verificationIcon}><i className="fas fa-crown" style={{ color: '#ffd700' }}></i></div>
              <div className={styles.verificationLevel}>Verified Legend</div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>Invite only (top 1%)</div>
            </div>
          </div>
          <div className={styles.subsectionTitle}>
            <i className="fas fa-steps"></i> How to Get Verified
          </div>
          <div className={styles.stepsContainer}>
            <div className={styles.step}><div className={styles.stepNumber}>1</div><div>Settings → Verification</div></div>
            <div className={styles.step}><div className={styles.stepNumber}>2</div><div>Link your social accounts</div></div>
            <div className={styles.step}><div className={styles.stepNumber}>3</div><div>Ensure username matches</div></div>
            <div className={styles.step}><div className={styles.stepNumber}>4</div><div>Click "Verify"</div></div>
            <div className={styles.step}><div className={styles.stepNumber}>5</div><div>Wait 24-48 hours</div></div>
          </div>
        </div>

        {/* Content Guidelines */}
        <div className={styles.sectionCard} id="content">
          <div className={styles.sectionTitle}>
            <i className="fas fa-file-alt"></i> Content Guidelines
          </div>
          <div className={styles.subsectionTitle}>What's Allowed</div>
          <div className={styles.ruleTable}>
            <div className={`${styles.ruleRow} ${styles.ruleRowHeader}`}><div>Category</div><div>Allowed?</div><div>Notes</div></div>
            <div className={styles.ruleRow}><div>Original art</div><div className={styles.badgeYes}><i className="fas fa-check"></i> Yes</div><div>Paintings, drawings, digital art</div></div>
            <div className={styles.ruleRow}><div>Original music</div><div className={styles.badgeYes}><i className="fas fa-check"></i> Yes</div><div>Your songs, beats, productions</div></div>
            <div className={styles.ruleRow}><div>Original videos</div><div className={styles.badgeYes}><i className="fas fa-check"></i> Yes</div><div>Your dance, comedy, gaming clips</div></div>
            <div className={styles.ruleRow}><div>Original writing</div><div className={styles.badgeYes}><i className="fas fa-check"></i> Yes</div><div>Your stories, poems, articles</div></div>
            <div className={styles.ruleRow}><div>Photography</div><div className={styles.badgeYes}><i className="fas fa-check"></i> Yes</div><div>Your photos</div></div>
          </div>
          <div className={styles.subsectionTitle}>What's NOT Allowed</div>
          <div className={styles.ruleTable}>
            <div className={`${styles.ruleRow} ${styles.ruleRowHeader}`}><div>Category</div><div>Allowed?</div><div>Why</div></div>
            <div className={styles.ruleRow}><div>Pornography</div><div className={styles.badgeNo}><i className="fas fa-times"></i> No</div><div>This is a creator platform</div></div>
            <div className={styles.ruleRow}><div>Violence/gore</div><div className={styles.badgeNo}><i className="fas fa-times"></i> No</div><div>This is a safe space</div></div>
            <div className={styles.ruleRow}><div>Hate speech</div><div className={styles.badgeNo}><i className="fas fa-times"></i> No</div><div>Illegal in most countries</div></div>
            <div className={styles.ruleRow}><div>Harassment</div><div className={styles.badgeNo}><i className="fas fa-times"></i> No</div><div>Destroys communities</div></div>
            <div className={styles.ruleRow}><div>Copyright infringement</div><div className={styles.badgeNo}><i className="fas fa-times"></i> No</div><div>Stealing is wrong</div></div>
          </div>
        </div>

        {/* Links & Sharing */}
        <div className={styles.sectionCard} id="links">
          <div className={styles.sectionTitle}>
            <i className="fas fa-link"></i> Links & Sharing
          </div>
          <div className={styles.subsectionTitle}>What Links Are Allowed?</div>
          <div className={styles.domainsGrid}>
            <span className={styles.domainTag}><i className="fas fa-camera"></i> instagram.com</span>
            <span className={styles.domainTag}><i className="fas fa-palette"></i> deviantart.com</span>
            <span className={styles.domainTag}><i className="fas fa-palette"></i> behance.net</span>
            <span className={styles.domainTag}><i className="fas fa-palette"></i> artstation.com</span>
            <span className={styles.domainTag}><i className="fas fa-music"></i> soundcloud.com</span>
            <span className={styles.domainTag}><i className="fas fa-video"></i> youtube.com</span>
            <span className={styles.domainTag}><i className="fas fa-video"></i> tiktok.com</span>
            <span className={styles.domainTag}><i className="fas fa-pen-fancy"></i> medium.com</span>
            <span className={styles.domainTag}><i className="fas fa-gamepad"></i> twitch.tv</span>
            <span className={styles.domainTag}><i className="fas fa-link"></i> linktr.ee</span>
          </div>
          <div className={styles.subsectionTitle}>Link Posting Rules</div>
          <div className={styles.ruleTable}>
            <div className={styles.ruleRow}><div>Posts per hour</div><div>3</div></div>
            <div className={styles.ruleRow}><div>Posts per day</div><div>10</div></div>
            <div className={styles.ruleRow}><div>Links per post</div><div>1</div></div>
            <div className={styles.ruleRow}><div>Same link repost</div><div>Once per week</div></div>
          </div>
        </div>

        {/* Tipping & Coins */}
        <div className={styles.sectionCard} id="tipping">
          <div className={styles.sectionTitle}>
            <i className="fas fa-coins" style={{ color: '#ffd700' }}></i> Tipping & Coins
          </div>
          <div className={styles.subsectionTitle}>How Tipping Works</div>
          <div className="tip-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', margin: '20px 0' }}>
            <div style={{ background: 'rgba(255,215,0,0.1)', borderRadius: '20px', padding: '16px', textAlign: 'center' }}>
              <i className="fas fa-coins" style={{ fontSize: '24px', color: '#ffd700' }}></i>
              <div style={{ fontSize: '24px', fontWeight: 700, color: '#ffd700' }}>20 coins</div>
              <div>$0.20</div>
              <div>"I appreciate this"</div>
            </div>
            <div style={{ background: 'rgba(255,215,0,0.1)', borderRadius: '20px', padding: '16px', textAlign: 'center' }}>
              <i className="fas fa-coins" style={{ fontSize: '24px', color: '#ffd700' }}></i>
              <div style={{ fontSize: '24px', fontWeight: 700, color: '#ffd700' }}>50 coins</div>
              <div>$0.50</div>
              <div>"This is good!"</div>
            </div>
            <div style={{ background: 'rgba(255,215,0,0.1)', borderRadius: '20px', padding: '16px', textAlign: 'center' }}>
              <i className="fas fa-coins" style={{ fontSize: '24px', color: '#ffd700' }}></i>
              <div style={{ fontSize: '24px', fontWeight: 700, color: '#ffd700' }}>100 coins</div>
              <div>$1.00</div>
              <div>"Love this!"</div>
            </div>
            <div style={{ background: 'rgba(255,215,0,0.1)', borderRadius: '20px', padding: '16px', textAlign: 'center' }}>
              <i className="fas fa-coins" style={{ fontSize: '24px', color: '#ffd700' }}></i>
              <div style={{ fontSize: '24px', fontWeight: 700, color: '#ffd700' }}>500 coins</div>
              <div>$5.00</div>
              <div>"Amazing work!"</div>
            </div>
          </div>
          <p style={{ textAlign: 'center', margin: '16px 0' }}><strong>100% of your tip goes to the creator.</strong> (We don't take a cut. Ever.)</p>
          
          <div className={styles.subsectionTitle}>How to Earn Coins</div>
          <div className={styles.ruleTable}>
            <div className={styles.ruleRow}><div><i className="fas fa-user-plus"></i> Sign up</div><div>100</div></div>
            <div className={styles.ruleRow}><div><i className="fas fa-heart"></i> Like a post</div><div>2</div></div>
            <div className={styles.ruleRow}><div><i className="fas fa-comment"></i> Comment</div><div>3</div></div>
            <div className={styles.ruleRow}><div><i className="fas fa-pen"></i> Create a post</div><div>5</div></div>
            <div className={styles.ruleRow}><div><i className="fas fa-fire"></i> 7-day streak</div><div>50</div></div>
            <div className={styles.ruleRow}><div><i className="fas fa-user-friends"></i> Refer a friend</div><div>50</div></div>
          </div>
        </div>

        {/* XP, Levels & Gamification */}
        <div className={styles.sectionCard} id="xp">
          <div className={styles.sectionTitle}>
            <i className="fas fa-chart-line"></i> XP, Levels & Gamification
          </div>
          <div className="leaderboard-visual" style={{ background: 'linear-gradient(145deg, #1a1a24, #12121a)', borderRadius: '24px', padding: '20px', margin: '16px 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '12px' }}>
              <div style={{ width: '40px', fontWeight: 800, fontSize: '20px', color: '#ffd700' }}>10</div>
              <div style={{ flex: 1, height: '40px', background: 'rgba(255,255,255,0.05)', borderRadius: '20px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: '100%', background: 'linear-gradient(90deg, #ff4d6d, #4361ee)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: '12px', fontSize: '12px', color: 'white' }}>Legend</div>
              </div>
              <div style={{ color: 'white' }}>8,100 XP</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '12px' }}>
              <div style={{ width: '40px', fontWeight: 800, fontSize: '20px', color: '#ffd700' }}>1</div>
              <div style={{ flex: 1, height: '40px', background: 'rgba(255,255,255,0.05)', borderRadius: '20px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: '15%', background: 'linear-gradient(90deg, #ff4d6d, #4361ee)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: '12px', fontSize: '12px', color: 'white' }}>Rookie</div>
              </div>
              <div style={{ color: 'white' }}>0 XP</div>
            </div>
          </div>
          <div className={styles.subsectionTitle}>Streak Rewards</div>
          <div className={styles.ruleTable}>
            <div className={styles.ruleRow}><div>3 days</div><div>+20 XP</div></div>
            <div className={styles.ruleRow}><div>7 days</div><div>+100 XP</div></div>
            <div className={styles.ruleRow}><div>14 days</div><div>+200 XP</div></div>
            <div className={styles.ruleRow}><div>30 days</div><div>+500 XP</div></div>
          </div>
        </div>

        {/* Unities & Units */}
        <div className={styles.sectionCard} id="unities">
          <div className={styles.sectionTitle}>
            <i className="fas fa-users"></i> Unities & Units
          </div>
          <div className={styles.domainsGrid}>
            <span className={styles.domainTag}><i className="fas fa-palette"></i> Digital Artists</span>
            <span className={styles.domainTag}><i className="fas fa-music"></i> Music Makers</span>
            <span className={styles.domainTag}><i className="fas fa-gamepad"></i> Gaming Hub</span>
            <span className={styles.domainTag}><i className="fas fa-camera"></i> Photography Masters</span>
            <span className={styles.domainTag}><i className="fas fa-pen-fancy"></i> Writers' Corner</span>
            <span className={styles.domainTag}><i className="fas fa-dumbbell"></i> Fitness Tribe</span>
            <span className={styles.domainTag}><i className="fas fa-utensils"></i> Foodies & Chefs</span>
            <span className={styles.domainTag}><i className="fas fa-laugh"></i> Comedy Central</span>
          </div>
          <p style={{ marginTop: '16px' }}><strong>Units</strong> are members of Unities. <em>"I'm a Unit in Digital Artists"</em></p>
          <div className={styles.ruleTable}>
            <div className={styles.ruleRow}><div>Unities per user</div><div>Max 5</div></div>
            <div className={styles.ruleRow}><div>Can non-members view?</div><div>Yes (read-only)</div></div>
            <div className={styles.ruleRow}><div>Can non-members post?</div><div>No (must join)</div></div>
          </div>
        </div>

        {/* Reporting & Moderation */}
        <div className={styles.sectionCard} id="reporting">
          <div className={styles.sectionTitle}>
            <i className="fas fa-flag"></i> Reporting & Moderation
          </div>
          <div className={styles.domainsGrid}>
            <span className={styles.domainTag}><i className="fas fa-envelope"></i> Spam</span>
            <span className={styles.domainTag}><i className="fas fa-comment-dots"></i> Harassment</span>
            <span className={styles.domainTag}><i className="fas fa-mask"></i> Impersonation</span>
            <span className={styles.domainTag}><i className="fas fa-angry"></i> Hate speech</span>
            <span className={styles.domainTag}><i className="fas fa-ban"></i> Inappropriate content</span>
            <span className={styles.domainTag}><i className="fas fa-copyright"></i> Copyright infringement</span>
          </div>
          <div className="leaderboard-visual" style={{ background: 'linear-gradient(145deg, #1a1a24, #12121a)', borderRadius: '24px', padding: '20px', margin: '16px 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '12px' }}>
              <div style={{ width: '40px', fontWeight: 800, fontSize: '20px', color: '#ffd700' }}>1</div>
              <div style={{ flex: 1, height: '40px', background: 'rgba(255,255,255,0.05)', borderRadius: '20px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: '20%', background: 'linear-gradient(90deg, #ff4d6d, #4361ee)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: '12px', fontSize: '12px', color: 'white' }}>Manual review</div>
              </div>
              <div style={{ color: 'white' }}>1 report</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '12px' }}>
              <div style={{ width: '40px', fontWeight: 800, fontSize: '20px', color: '#ffd700' }}>3</div>
              <div style={{ flex: 1, height: '40px', background: 'rgba(255,255,255,0.05)', borderRadius: '20px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: '60%', background: 'linear-gradient(90deg, #ff4d6d, #4361ee)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: '12px', fontSize: '12px', color: 'white' }}>Content hidden</div>
              </div>
              <div style={{ color: 'white' }}>3 reports</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '12px' }}>
              <div style={{ width: '40px', fontWeight: 800, fontSize: '20px', color: '#ffd700' }}>10</div>
              <div style={{ flex: 1, height: '40px', background: 'rgba(255,255,255,0.05)', borderRadius: '20px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: '100%', background: '#ef4444', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: '12px', fontSize: '12px', color: 'white' }}>Temporary ban</div>
              </div>
              <div style={{ color: 'white' }}>10+ reports</div>
            </div>
          </div>
        </div>

        {/* Consequences */}
        <div className={styles.sectionCard} id="consequences">
          <div className={styles.sectionTitle}>
            <i className="fas fa-gavel"></i> Consequences
          </div>
          <div className={styles.stepsContainer}>
            <div className={styles.step}><div className={styles.stepNumber}>1</div><div>Warning notification<br />Posting limit<br />-50 XP</div></div>
            <div className={styles.step}><div className={styles.stepNumber}>2</div><div>7-day ban<br />Loss of streak<br />-200 XP</div></div>
            <div className={styles.step}><div className={styles.stepNumber}>3</div><div>Permanent ban<br />All content removed</div></div>
          </div>
          <div className={`${styles.warningBox} ${styles.instantBan}`} style={{ marginTop: '16px' }}>
            <i className="fas fa-skull"></i> <strong>INSTANT Permanent Ban:</strong> Child exploitation, Terrorism promotion, Impersonation of real creators, Malware links, Doxxing
          </div>
        </div>

        {/* Legal Stuff */}
        <div className={styles.sectionCard} id="legal">
          <div className={styles.sectionTitle}>
            <i className="fas fa-file-contract"></i> Legal Stuff
          </div>
          <div className={styles.legalGrid}>
            <div className={styles.legalCard}><i className="fas fa-flag-usa"></i><br />Section 230, DMCA</div>
            <div className={styles.legalCard}><i className="fas fa-euro-sign"></i><br />Digital Services Act</div>
            <div className={styles.legalCard}><i className="fas fa-gavel"></i><br />Online Safety Bill</div>
            <div className={styles.legalCard}><i className="fas fa-lock"></i><br />GDPR</div>
          </div>
          <p><strong>Copyright & DMCA:</strong> copyright@comeunity.com</p>
          <p><strong>Data Privacy:</strong> We DO NOT sell your data. We DO NOT have ads.</p>
          <p><strong>Age Restrictions:</strong> Minimum age 13 years.</p>
        </div>

        {/* Appeals & Support */}
        <div className={styles.sectionCard} id="appeals">
          <div className={styles.sectionTitle}>
            <i className="fas fa-envelope"></i> Appeals & Support
          </div>
          <div className={styles.supportGrid}>
            <div className={styles.supportItem}><i className="fas fa-envelope"></i> General support: support@comeunity.com</div>
            <div className={styles.supportItem}><i className="fas fa-gavel"></i> Appeals: appeals@comeunity.com</div>
            <div className={styles.supportItem}><i className="fas fa-copyright"></i> Copyright: copyright@comeunity.com</div>
            <div className={styles.supportItem}><i className="fas fa-shield-alt"></i> Law enforcement: legal@comeunity.com</div>
          </div>
          <p style={{ marginTop: '16px' }}>Response time: Usually 24-48 hours.</p>
        </div>

        {/* The ComeUnity Promise */}
        <div className={styles.sectionCard}>
          <div className={styles.sectionTitle}>
            <i className="fas fa-heart" style={{ color: '#ffd700' }}></i> The ComeUnity Promise
          </div>
          <div className={styles.promiseGrid}>
            <div className={styles.promiseItem}><i className="fas fa-shield-alt"></i> Protect your identity and work</div>
            <div className={styles.promiseItem}><i className="fas fa-ban"></i> Keep the platform free of ads and algorithms</div>
            <div className={styles.promiseItem}><i className="fas fa-chart-line"></i> Let your work stand on its own merit</div>
            <div className={styles.promiseItem}><i className="fas fa-coins"></i> Support creators with direct tipping</div>
            <div className={styles.promiseItem}><i className="fas fa-heart"></i> Build a community where everyone belongs</div>
          </div>
          <div className={styles.promiseFooter}>
            <p><i className="fas fa-rocket"></i> Welcome to ComeUnity</p>
            <p>You are now a Unit. You belong to Unities. Your work matters. Your voice matters.</p>
            <p>Now go create. Go connect. Go collab.</p>
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginTop: '16px' }}>Last updated: March 2026</p>
          </div>
        </div>

        {/* Back to Top */}
        <div className={styles.backToTop} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <i className="fas fa-arrow-up"></i>
        </div>
      </div>

      {/* Toast */}
      {showToast && (
        <div className={styles.toast}>
          {showToast}
        </div>
      )}
    </div>
  );
}