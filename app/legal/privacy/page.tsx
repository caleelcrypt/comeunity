'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

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
    <div className={styles.privacyPage}>
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
          <div className={styles.tagline}>Your data. Your work. Your rules.</div>
          <div className={styles.subtagline}>We don't sell your stuff. We don't track you. We don't play games with your privacy.</div>
          <div className={styles.promiseBadge}>
            <i className="fas fa-shield-alt" style={{ color: '#ffd700' }}></i> Our Privacy Promise: "We collect what we need to run the platform. Nothing more. Nothing less. And we never, ever sell your data."
          </div>
        </div>

        {/* Table of Contents */}
        <div className={styles.tocCard}>
          <div className={styles.tocTitle}>
            <i className="fas fa-list-ul"></i> Table of Contents
          </div>
          <div className={styles.tocGrid}>
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
              <div key={item.id} className={styles.tocItem} onClick={() => scrollToSection(item.id)}>
                <i className={`fas ${item.icon}`}></i> {item.label}
              </div>
            ))}
          </div>
        </div>

        {/* Our Privacy Promise */}
        <div className={styles.sectionCard} id="promise">
          <div className={styles.sectionTitle}>
            <i className="fas fa-heart" style={{ color: '#ffd700' }}></i> Our Privacy Promise
          </div>
          <div className={styles.privacyShield}>
            <div className={styles.shieldIcon}><i className="fas fa-shield-alt"></i></div>
            <p style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px', color: 'white' }}>"We collect what we need to run the platform. Nothing more. Nothing less. And we never, ever sell your data."</p>
            <div className={styles.dataFlow}>
              <div className={styles.flowNode}><i className="fas fa-user"></i><br />Your Name</div>
              <div className={styles.flowArrow}><i className="fas fa-arrow-right"></i></div>
              <div className={styles.flowNode}><i className="fas fa-coffee"></i><br />ComeUnity Coffee Shop</div>
              <div className={styles.flowArrow}><i className="fas fa-arrow-right"></i></div>
              <div className={styles.flowNode}><i className="fas fa-heart"></i><br />Safe & Valued</div>
            </div>
            <p className={styles.glowingText}>Think of it like your local coffee shop. They know your name, your usual order. They don't follow you home. They don't sell your info. They just want you to feel welcome. That's ComeUnity.</p>
          </div>
        </div>

        {/* What Data We Collect */}
        <div className={styles.sectionCard} id="what-data">
          <div className={styles.sectionTitle}>
            <i className="fas fa-database"></i> What Data We Collect & Why
          </div>
          
          <div className={styles.subsectionTitle}><i className="fas fa-id-card"></i> 1. Account Information</div>
          <div className={styles.dataTable}>
            <div className={`${styles.dataRow} ${styles.dataRowHeader}`}>
              <div>Data</div>
              <div>Why We Collect It</div>
              <div>Legal Basis</div>
            </div>
            <div className={styles.dataRow}>
              <div><i className="fas fa-envelope"></i> Email address</div>
              <div>To log you in, send important updates, recover your account</div>
              <div>Contract (you need this to use the platform)</div>
            </div>
            <div className={styles.dataRow}>
              <div><i className="fas fa-user"></i> Username</div>
              <div>Your identity on ComeUnity</div>
              <div>Contract (you need a name)</div>
            </div>
            <div className={styles.dataRow}>
              <div><i className="fas fa-lock"></i> Password</div>
              <div>To secure your account</div>
              <div>Contract (encrypted, we can't see it)</div>
            </div>
          </div>

          <div className={styles.subsectionTitle}><i className="fas fa-user-circle"></i> 2. Profile Information</div>
          <div className={styles.dataTable}>
            <div className={`${styles.dataRow} ${styles.dataRowHeader}`}>
              <div>Data</div>
              <div>Why We Collect It</div>
              <div>Legal Basis</div>
            </div>
            <div className={styles.dataRow}>
              <div><i className="fas fa-smile"></i> Avatar emoji</div>
              <div>Your visual identity</div>
              <div>Contract (you choose how you appear)</div>
            </div>
            <div className={styles.dataRow}>
              <div><i className="fas fa-file-alt"></i> Bio</div>
              <div>Tell others about yourself</div>
              <div>Contract (your choice)</div>
            </div>
            <div className={styles.dataRow}>
              <div><i className="fas fa-link"></i> Linked social accounts</div>
              <div>To verify you're really you</div>
              <div>Consent (you choose to link)</div>
            </div>
          </div>

          <div className={styles.subsectionTitle}><i className="fas fa-file-alt"></i> 3. Content You Create</div>
          <div className={styles.dataTable}>
            <div className={`${styles.dataRow} ${styles.dataRowHeader}`}>
              <div>Data</div>
              <div>Why We Collect It</div>
              <div>Legal Basis</div>
            </div>
            <div className={styles.dataRow}>
              <div><i className="fas fa-pen"></i> Posts</div>
              <div>To share with the community</div>
              <div>Contract (this is the platform)</div>
            </div>
            <div className={styles.dataRow}>
              <div><i className="fas fa-comment"></i> Comments</div>
              <div>To enable conversations</div>
              <div>Contract</div>
            </div>
            <div className={styles.dataRow}>
              <div><i className="fas fa-heart"></i> Likes</div>
              <div>To show appreciation</div>
              <div>Contract</div>
            </div>
            <div className={styles.dataRow}>
              <div><i className="fas fa-coins"></i> Tips</div>
              <div>To transfer value between users</div>
              <div>Contract (we need to track coins)</div>
            </div>
          </div>

          <div className={styles.subsectionTitle}><i className="fas fa-microchip"></i> 4. Technical Data</div>
          <div className={styles.dataTable}>
            <div className={`${styles.dataRow} ${styles.dataRowHeader}`}>
              <div>Data</div>
              <div>Why We Collect It</div>
              <div>Legal Basis</div>
            </div>
            <div className={styles.dataRow}>
              <div><i className="fas fa-network-wired"></i> IP address</div>
              <div>To prevent spam and abuse</div>
              <div>Legitimate interest (keeping the platform safe)</div>
            </div>
            <div className={styles.dataRow}>
              <div><i className="fas fa-mobile-alt"></i> Device type</div>
              <div>To optimize the app for you</div>
              <div>Legitimate interest</div>
            </div>
            <div className={styles.dataRow}>
              <div><i className="fas fa-globe"></i> Browser type</div>
              <div>To fix bugs</div>
              <div>Legitimate interest</div>
            </div>
            <div className={styles.dataRow}>
              <div><i className="fas fa-clock"></i> Time zone</div>
              <div>To show accurate timestamps</div>
              <div>Contract (so you know when posts were made)</div>
            </div>
          </div>
        </div>

        {/* What We DO NOT Collect */}
        <div className={styles.sectionCard} id="not-collect">
          <div className={styles.sectionTitle}>
            <i className="fas fa-ban" style={{ color: '#10b981' }}></i> What Data We DO NOT Collect
          </div>
          <div className={styles.rightsGrid}>
            <div className={styles.rightCard}><div className={styles.rightIcon}><i className="fas fa-user-secret"></i></div><div>Real name</div><div className={styles.domainTag}>You choose your username</div></div>
            <div className={styles.rightCard}><div className={styles.rightIcon}><i className="fas fa-phone-alt"></i></div><div>Phone number</div><div className={styles.domainTag}>We don't need it</div></div>
            <div className={styles.rightCard}><div className={styles.rightIcon}><i className="fas fa-map-marker-alt"></i></div><div>Address</div><div className={styles.domainTag}>We're not sending you anything</div></div>
            <div className={styles.rightCard}><div className={styles.rightIcon}><i className="fas fa-credit-card"></i></div><div>Credit card info</div><div className={styles.domainTag}>Stripe handles payments</div></div>
            <div className={styles.rightCard}><div className={styles.rightIcon}><i className="fas fa-history"></i></div><div>Browsing history</div><div className={styles.domainTag}>None of our business</div></div>
            <div className={styles.rightCard}><div className={styles.rightIcon}><i className="fas fa-map-pin"></i></div><div>Exact location</div><div className={styles.domainTag}>Only time zone needed</div></div>
            <div className={styles.rightCard}><div className={styles.rightIcon}><i className="fas fa-address-book"></i></div><div>Contacts</div><div className={styles.domainTag}>We don't access your phone contacts</div></div>
            <div className={styles.rightCard}><div className={styles.rightIcon}><i className="fas fa-images"></i></div><div>Photos</div><div className={styles.domainTag}>You upload what you choose</div></div>
          </div>
        </div>

        {/* How We Use Your Data */}
        <div className={styles.sectionCard} id="how-use">
          <div className={styles.sectionTitle}>
            <i className="fas fa-cogs"></i> How We Use Your Data
          </div>
          <div className={styles.rightsGrid} style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
            <div className={styles.rightCard}><i className="fas fa-play-circle"></i><br />To run the platform<br /><small>Show posts, track XP, process tips</small></div>
            <div className={styles.rightCard}><i className="fas fa-shield-alt"></i><br />To keep you safe<br /><small>Detect spam, block impersonators</small></div>
            <div className={styles.rightCard}><i className="fas fa-bug"></i><br />To improve the app<br /><small>Fix bugs, make things faster</small></div>
            <div className={styles.rightCard}><i className="fas fa-envelope"></i><br />To communicate with you<br /><small>Send important updates, respond to support</small></div>
          </div>
          <div className={styles.warningBox}>
            <i className="fas fa-times-circle" style={{ color: '#ef4444' }}></i> <strong>What we DON'T use your data for:</strong>
            <div className={styles.complianceGrid} style={{ marginTop: '8px' }}>
              <div className={styles.complianceBadge}><i className="fas fa-ban"></i> Selling to advertisers (we have no ads)</div>
              <div className={styles.complianceBadge}><i className="fas fa-ban"></i> Targeted marketing (we don't track you)</div>
              <div className={styles.complianceBadge}><i className="fas fa-ban"></i> Profiling</div>
              <div className={styles.complianceBadge}><i className="fas fa-ban"></i> AI training (your art is yours)</div>
            </div>
          </div>
        </div>

        {/* Who Sees Your Data */}
        <div className={styles.sectionCard} id="who-sees">
          <div className={styles.sectionTitle}>
            <i className="fas fa-eye"></i> Who Sees Your Data
          </div>
          <div className={styles.subsectionTitle}>Public Information (Everyone Sees)</div>
          <div className={styles.complianceGrid}>
            <div className={styles.complianceBadge}><i className="fas fa-user"></i> Username</div>
            <div className={styles.complianceBadge}><i className="fas fa-smile"></i> Avatar emoji</div>
            <div className={styles.complianceBadge}><i className="fas fa-file-alt"></i> Bio</div>
            <div className={styles.complianceBadge}><i className="fas fa-pen"></i> Posts</div>
            <div className={styles.complianceBadge}><i className="fas fa-comment"></i> Comments</div>
            <div className={styles.complianceBadge}><i className="fas fa-heart"></i> Likes</div>
            <div className={styles.complianceBadge}><i className="fas fa-chart-line"></i> XP level</div>
            <div className={styles.complianceBadge}><i className="fas fa-medal"></i> Badges</div>
          </div>
          <div className={styles.subsectionTitle}>Private Information (Only You & ComeUnity)</div>
          <div className={styles.complianceGrid}>
            <div className={styles.complianceBadge}><i className="fas fa-envelope"></i> Email address</div>
            <div className={styles.complianceBadge}><i className="fas fa-network-wired"></i> IP address</div>
            <div className={styles.complianceBadge}><i className="fas fa-coins"></i> Tip history</div>
            <div className={styles.complianceBadge}><i className="fas fa-envelope"></i> Support emails</div>
          </div>
          <div className={styles.subsectionTitle}>Third Parties (Limited)</div>
          <div className={styles.complianceGrid}>
            <div className={styles.complianceBadge}><i className="fas fa-database"></i> Supabase - hosts database (encrypted)</div>
            <div className={styles.complianceBadge}><i className="fas fa-credit-card"></i> Stripe/Paystack - processes payments</div>
            <div className={styles.complianceBadge}><i className="fas fa-cloud"></i> Vercel - hosts website</div>
          </div>
          <p style={{ marginTop: '16px' }}><strong>We have NO advertisers. We have NO data brokers. We do NOT sell your data.</strong></p>
        </div>

        {/* Your Rights */}
        <div className={styles.sectionCard} id="your-rights">
          <div className={styles.sectionTitle}>
            <i className="fas fa-gavel"></i> Your Rights
          </div>
          <div className={styles.rightsGrid}>
            <div className={styles.rightCard} onClick={() => showToastMessage('Right to know')}><i className="fas fa-question-circle"></i><br />Right to know<br /><small>Ask what data we have</small></div>
            <div className={styles.rightCard} onClick={() => showToastMessage('Settings → Download My Data')}><i className="fas fa-download"></i><br />Right to access<br /><small>Download all your data</small></div>
            <div className={styles.rightCard} onClick={() => showToastMessage('Edit your profile')}><i className="fas fa-edit"></i><br />Right to correct<br /><small>Fix wrong information</small></div>
            <div className={styles.rightCard} onClick={() => showToastMessage('Settings → Delete Account')}><i className="fas fa-trash-alt"></i><br />Right to delete<br /><small>Delete your account</small></div>
          </div>
          <p>All requests are free. We respond within 30 days.</p>
        </div>

        {/* Data Security */}
        <div className={styles.sectionCard} id="security">
          <div className={styles.sectionTitle}>
            <i className="fas fa-lock"></i> Data Security
          </div>
          <div className={styles.rightsGrid} style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
            <div className={styles.rightCard}><i className="fas fa-lock"></i><br />Encryption in transit<br /><small>HTTPS everywhere</small></div>
            <div className={styles.rightCard}><i className="fas fa-database"></i><br />Encryption at rest<br /><small>Your data is encrypted</small></div>
            <div className={styles.rightCard}><i className="fas fa-hash"></i><br />Password hashing<br /><small>We don't store your password</small></div>
            <div className={styles.rightCard}><i className="fas fa-chart-line"></i><br />Regular audits<br /><small>We check security regularly</small></div>
          </div>
          <p><strong>If we have a data breach:</strong> We'll notify you within 72 hours.</p>
        </div>

        {/* Cookies & Tracking */}
        <div className={styles.sectionCard} id="cookies">
          <div className={styles.sectionTitle}>
            <i className="fas fa-cookie-bite"></i> Cookies & Tracking
          </div>
          <div className={styles.complianceGrid}>
            <div className={styles.complianceBadge}><i className="fas fa-cookie"></i> Session cookie - Keeps you logged in</div>
            <div className={styles.complianceBadge}><i className="fas fa-cookie"></i> Preferences cookie - Remembers your theme</div>
            <div className={styles.complianceBadge}><i className="fas fa-cookie"></i> Security cookie - Helps prevent spam</div>
          </div>
          <div className={styles.warningBox} style={{ marginTop: '16px' }}>
            <i className="fas fa-check-circle" style={{ color: '#10b981' }}></i> <strong>What We DON'T Use:</strong>
            <div className={styles.complianceGrid} style={{ marginTop: '8px' }}>
              <div className={styles.complianceBadge}><i className="fas fa-ban"></i> Third-party cookies</div>
              <div className={styles.complianceBadge}><i className="fas fa-ban"></i> Google Analytics (we use privacy-friendly analytics)</div>
              <div className={styles.complianceBadge}><i className="fas fa-ban"></i> Facebook Pixel</div>
              <div className={styles.complianceBadge}><i className="fas fa-ban"></i> Ad trackers (we have no ads)</div>
            </div>
          </div>
        </div>

        {/* Children's Privacy */}
        <div className={styles.sectionCard} id="children">
          <div className={styles.sectionTitle}>
            <i className="fas fa-child"></i> Children's Privacy
          </div>
          <div className={styles.rightsGrid} style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
            <div className={styles.rightCard}><i className="fas fa-ban"></i><br />Under 13<br /><small>Cannot create an account</small></div>
            <div className={styles.rightCard}><i className="fas fa-check-circle"></i><br />13-18<br /><small>Can join with parental permission</small></div>
          </div>
          <p>If we discover you're under 13, we'll delete your account immediately. We comply with COPPA (US), GDPR-K (Europe), and similar laws worldwide.</p>
        </div>

        {/* International Transfers */}
        <div className={styles.sectionCard} id="international">
          <div className={styles.sectionTitle}>
            <i className="fas fa-globe"></i> International Data Transfers
          </div>
          <div className={styles.complianceGrid}>
            <div className={styles.complianceBadge}><i className="fas fa-euro-sign"></i> Europe → EU servers (GDPR)</div>
            <div className={styles.complianceBadge}><i className="fas fa-flag-usa"></i> North America → US servers (Privacy Shield)</div>
            <div className={styles.complianceBadge}><i className="fas fa-map-marker-alt"></i> Africa → EU servers (Adequacy)</div>
            <div className={styles.complianceBadge}><i className="fas fa-globe-asia"></i> Asia → EU/US servers (Standard clauses)</div>
          </div>
        </div>

        {/* How Long We Keep Data */}
        <div className={styles.sectionCard} id="retention">
          <div className={styles.sectionTitle}>
            <i className="fas fa-clock"></i> How Long We Keep Your Data
          </div>
          <div className={styles.dataTable}>
            <div className={styles.dataRow}><div><i className="fas fa-user"></i> Active account data</div><div>As long as your account exists</div></div>
            <div className={styles.dataRow}><div><i className="fas fa-trash-alt"></i> Deleted posts/comments</div><div>30 days (in case you change your mind)</div></div>
            <div className={styles.dataRow}><div><i className="fas fa-user-slash"></i> Deleted account</div><div>90 days (for recovery), then permanently deleted</div></div>
            <div className={styles.dataRow}><div><i className="fas fa-network-wired"></i> IP logs</div><div>30 days, then anonymized</div></div>
            <div className={styles.dataRow}><div><i className="fas fa-envelope"></i> Support emails</div><div>90 days, then deleted</div></div>
          </div>
        </div>

        {/* Deleting Your Account */}
        <div className={styles.sectionCard} id="delete">
          <div className={styles.sectionTitle}>
            <i className="fas fa-trash-alt"></i> Deleting Your Account
          </div>
          <div className={styles.stepsContainer}>
            <div className={styles.step}><div className={styles.stepNumber}>1</div><div>Settings → Account</div></div>
            <div className={styles.step}><div className={styles.stepNumber}>2</div><div>Click "Delete Account"</div></div>
            <div className={styles.step}><div className={styles.stepNumber}>3</div><div>Confirm deletion</div></div>
            <div className={styles.step}><div className={styles.stepNumber}>4</div><div>Wait 90 days</div></div>
          </div>
          <p style={{ marginTop: '16px' }}>What gets deleted: Posts, Comments, Likes, XP, Streak, Badges, Avatars, Email. Anonymous transaction logs kept for accounting (no identifying info).</p>
        </div>

        {/* Changes to Policy */}
        <div className={styles.sectionCard} id="changes">
          <div className={styles.sectionTitle}>
            <i className="fas fa-edit"></i> Changes to This Policy
          </div>
          <div className={styles.complianceGrid}>
            <div className={styles.complianceBadge}><i className="fas fa-pen"></i> Minor changes: Updated on this page, we'll notify you via app</div>
            <div className={styles.complianceBadge}><i className="fas fa-envelope"></i> Major changes: We'll email you, require you to accept before continuing</div>
          </div>
          <p>Last updated: March 2026</p>
        </div>

        {/* Contact Us */}
        <div className={styles.sectionCard} id="contact">
          <div className={styles.sectionTitle}>
            <i className="fas fa-envelope"></i> Contact Us
          </div>
          <div className={styles.supportGrid}>
            <div className={styles.supportItem} onClick={() => showToastMessage('privacy@comeunity.com')}><i className="fas fa-lock"></i> Privacy questions: privacy@comeunity.com</div>
            <div className={styles.supportItem} onClick={() => showToastMessage('privacy@comeunity.com')}><i className="fas fa-database"></i> Data requests: privacy@comeunity.com</div>
            <div className={styles.supportItem} onClick={() => showToastMessage('security@comeunity.com')}><i className="fas fa-shield-alt"></i> Security concerns: security@comeunity.com</div>
            <div className={styles.supportItem} onClick={() => showToastMessage('legal@comeunity.com')}><i className="fas fa-gavel"></i> Law enforcement: legal@comeunity.com</div>
          </div>
        </div>

        {/* The Bottom Line */}
        <div className={styles.sectionCard}>
          <div className={styles.sectionTitle}>
            <i className="fas fa-star" style={{ color: '#ffd700' }}></i> The Bottom Line
          </div>
          <div className={styles.privacyShield} style={{ background: 'linear-gradient(145deg, rgba(255,77,109,0.1), rgba(67,97,238,0.1))' }}>
            <p style={{ fontSize: '20px', fontWeight: 600, marginBottom: '16px', color: 'white' }}>"We collect what we need to make ComeUnity work. We protect what you trust us with. We don't sell, share, or trade your data. Ever."</p>
            <p style={{ color: 'rgba(255,255,255,0.8)' }}>Think of us like your local coffee shop. They know your name, your usual order. They don't sell your coffee preferences. They just want you to feel welcome.</p>
            <p style={{ marginTop: '16px', fontWeight: 600, color: 'white' }}>That's ComeUnity. Welcome home.</p>
          </div>
        </div>

        {/* Regulatory Compliance */}
        <div className={styles.sectionCard}>
          <div className={styles.sectionTitle}>
            <i className="fas fa-file-contract"></i> Regulatory Compliance References
          </div>
          <div className={styles.complianceGrid}>
            <div className={styles.complianceBadge}><i className="fas fa-euro-sign"></i> GDPR (EU)</div>
            <div className={styles.complianceBadge}><i className="fas fa-flag-usa"></i> CCPA/CPRA (California)</div>
            <div className={styles.complianceBadge}><i className="fas fa-child"></i> COPPA (USA)</div>
            <div className={styles.complianceBadge}><i className="fas fa-maple-leaf"></i> PIPEDA (Canada)</div>
            <div className={styles.complianceBadge}><i className="fas fa-flag"></i> LGPD (Brazil)</div>
            <div className={styles.complianceBadge}><i className="fas fa-flag"></i> Nigeria Data Protection Act 2023</div>
            <div className={styles.complianceBadge}><i className="fas fa-flag"></i> POPIA (South Africa)</div>
          </div>
          <p style={{ marginTop: '16px' }}>We comply with data protection laws wherever our users are. If your country has specific requirements, email privacy@comeunity.com and we'll help.</p>
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