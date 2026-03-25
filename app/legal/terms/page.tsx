'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

export default function TermsPage() {
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
    <div className={styles.termsPage}>
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
          <div className={styles.tagline}>The rules of the road. Read them. Love them. Follow them.</div>
          <div className={styles.subtagline}>Last updated: March 2026</div>
          <div className={styles.updateBadge}>
            <i className="fas fa-file-contract"></i> Terms of Service
          </div>
        </div>

        {/* Table of Contents */}
        <div className={styles.tocCard}>
          <div className={styles.tocTitle}>
            <i className="fas fa-list-ul"></i> Table of Contents
          </div>
          <div className={styles.tocGrid}>
            {[
              { id: 'welcome', icon: 'fa-gift', label: 'Welcome' },
              { id: 'who-can-use', icon: 'fa-user-check', label: 'Who Can Use' },
              { id: 'account', icon: 'fa-id-card', label: 'Your Account' },
              { id: 'content-ownership', icon: 'fa-copyright', label: 'Your Content' },
              { id: 'what-we-own', icon: 'fa-building', label: 'What We Own' },
              { id: 'coins', icon: 'fa-coins', label: 'Coins & Tipping' },
              { id: 'prohibited', icon: 'fa-ban', label: 'Prohibited Conduct' },
              { id: 'moderation', icon: 'fa-gavel', label: 'Moderation' },
              { id: 'termination', icon: 'fa-trash-alt', label: 'Termination' },
              { id: 'intellectual-property', icon: 'fa-copyright', label: 'Intellectual Property' },
              { id: 'disclaimer', icon: 'fa-exclamation-triangle', label: 'Disclaimer' },
              { id: 'liability', icon: 'fa-shield-alt', label: 'Limitation of Liability' },
              { id: 'indemnification', icon: 'fa-handshake', label: 'Indemnification' },
              { id: 'dispute-resolution', icon: 'fa-gavel', label: 'Dispute Resolution' },
              { id: 'governing-law', icon: 'fa-globe', label: 'Governing Law' },
              { id: 'changes', icon: 'fa-edit', label: 'Changes' },
              { id: 'contact', icon: 'fa-envelope', label: 'Contact' }
            ].map((item) => (
              <div key={item.id} className={styles.tocItem} onClick={() => scrollToSection(item.id)}>
                <i className={`fas ${item.icon}`}></i> {item.label}
              </div>
            ))}
          </div>
        </div>

        {/* Welcome */}
        <div className={styles.sectionCard} id="welcome">
          <div className={styles.sectionTitle}>
            <i className="fas fa-gift"></i> Welcome to ComeUnity
          </div>
          <p style={{ color: 'rgba(255,255,255,0.8)' }}>ComeUnity is where creators find their people AND get paid.</p>
          <p style={{ marginTop: '12px', color: 'rgba(255,255,255,0.8)' }}>These Terms of Service ("Terms") are the contract between you and ComeUnity. By using our platform, you agree to these Terms.</p>
          <div className={styles.ownershipCard} style={{ marginTop: '20px' }}>
            <div className={styles.ownershipIcon}><i className="fas fa-home"></i></div>
            <p style={{ fontSize: '16px', fontWeight: 500, color: 'white' }}>Think of it like this: You're entering a creative community. We're the hosts. These are the house rules. Follow them, and everyone has a great time. Break them, and we might have to ask you to leave.</p>
          </div>
        </div>

        {/* Who Can Use */}
        <div className={styles.sectionCard} id="who-can-use">
          <div className={styles.sectionTitle}>
            <i className="fas fa-user-check"></i> Who Can Use ComeUnity
          </div>
          <div className={styles.termsTable}>
            <div className={`${styles.termsRow} ${styles.termsRowHeader}`}>
              <div>Requirement</div>
              <div>Why</div>
            </div>
            <div className={styles.termsRow}><div>You're at least 13 years old</div><div>International law requires this</div></div>
            <div className={styles.termsRow}><div>You're not a convicted sex offender</div><div>For community safety</div></div>
            <div className={styles.termsRow}><div>You're not banned from ComeUnity</div><div>If we've asked you to leave, don't come back</div></div>
            <div className={styles.termsRow}><div>You can form a binding contract</div><div>You're legally able to agree to these terms</div></div>
          </div>
          <div className={styles.subsectionTitle}><i className="fas fa-child"></i> If You're Under 18</div>
          <div className={styles.domainTags}>
            <span className={styles.domainTag} onClick={() => showToastMessage('Parent or guardian permission required')}><i className="fas fa-user-friends"></i> Parent or guardian permission</span>
            <span className={styles.domainTag} onClick={() => showToastMessage('Parental supervision recommended')}><i className="fas fa-eye"></i> Parental supervision</span>
          </div>
          <p style={{ marginTop: '12px' }}><i className="fas fa-gavel"></i> We comply with COPPA, GDPR-K, and similar laws protecting minors. If you're under 13, we'll delete your account. No exceptions.</p>
        </div>

        {/* Your Account */}
        <div className={styles.sectionCard} id="account">
          <div className={styles.sectionTitle}>
            <i className="fas fa-id-card"></i> Your Account & Responsibilities
          </div>
          <div className={styles.termsTable}>
            <div className={`${styles.termsRow} ${styles.termsRowHeader}`}>
              <div>Responsibility</div>
              <div>What It Means</div>
            </div>
            <div className={styles.termsRow}><div>You are who you say you are</div><div>Don't impersonate others</div></div>
            <div className={styles.termsRow}><div>You keep your password safe</div><div>We can't recover it if you lose it</div></div>
            <div className={styles.termsRow}><div>You don't share your account</div><div>One person, one account</div></div>
            <div className={styles.termsRow}><div>You're responsible for what you post</div><div>If you post it, you own it</div></div>
            <div className={styles.termsRow}><div>You don't create multiple accounts</div><div>One is enough. More is spam.</div></div>
          </div>
          <div className={styles.stepsContainer}>
            <div className={styles.step}><div className={styles.stepNumber}>1</div><div>Change password immediately</div><div className={styles.domainTag}>Settings → Security</div></div>
            <div className={styles.step}><div className={styles.stepNumber}>2</div><div>Email us</div><div className={styles.domainTag}>security@comeunity.com</div></div>
          </div>
          <p><i className="fas fa-exclamation-triangle"></i> We're not responsible for what happens if you share your password. That's like giving someone your house keys and being surprised they came in.</p>
        </div>

        {/* Your Content (You Own It) */}
        <div className={styles.sectionCard} id="content-ownership">
          <div className={styles.sectionTitle}>
            <i className="fas fa-copyright"></i> Your Content (You Own It)
          </div>
          <div className={styles.ownershipCard} style={{ background: 'linear-gradient(145deg, rgba(16,185,129,0.1), rgba(59,130,246,0.1))' }}>
            <div className={styles.ownershipIcon}><i className="fas fa-palette"></i></div>
            <p style={{ fontSize: '20px', fontWeight: 700, color: '#10b981' }}>"You own everything you post on ComeUnity. We don't claim ownership. We don't sell your work. We don't train AI on your art."</p>
          </div>
          <div className={styles.subsectionTitle}><i className="fas fa-check-circle"></i> What You Own</div>
          <div className={styles.domainTags}>
            <span className={styles.domainTag}><i className="fas fa-file-alt"></i> Your posts</span>
            <span className={styles.domainTag}><i className="fas fa-palette"></i> Your art</span>
            <span className={styles.domainTag}><i className="fas fa-comment"></i> Your comments</span>
            <span className={styles.domainTag}><i className="fas fa-id-card"></i> Your profile</span>
          </div>
          
          <div className={styles.subsectionTitle}><i className="fas fa-handshake"></i> What We Need From You</div>
          <div className={styles.domainTags}>
            <span className={styles.domainTag}><i className="fas fa-eye"></i> To display your content</span>
            <span className={styles.domainTag}><i className="fas fa-database"></i> To store your content</span>
            <span className={styles.domainTag}><i className="fas fa-share-alt"></i> To share your content</span>
          </div>
          <p style={{ marginTop: '12px' }}>That's it. We don't sell your content. We don't license it to third parties. We don't use it to train AI. We don't claim ownership.</p>
          
          <div className={styles.subsectionTitle}><i className="fas fa-trash-alt"></i> What Happens When You Delete Content</div>
          <div className={styles.domainTags}>
            <span className={styles.domainTag}>Delete a post → Gone from public view</span>
            <span className={styles.domainTag}>Delete your account → Content removed within 90 days</span>
          </div>
          <p>We keep backups for 30 days in case you change your mind. After that, it's permanently deleted.</p>
        </div>

        {/* What We Own */}
        <div className={styles.sectionCard} id="what-we-own">
          <div className={styles.sectionTitle}>
            <i className="fas fa-building"></i> What We Own
          </div>
          <div className={styles.domainTags}>
            <span className={styles.domainTag}><i className="fas fa-trademark"></i> The ComeUnity brand (Logo, name, design)</span>
            <span className={styles.domainTag}><i className="fas fa-code"></i> The platform code</span>
            <span className={styles.domainTag}><i className="fas fa-paint-bucket"></i> The design (Layout, colors, UI)</span>
            <span className={styles.domainTag}><i className="fas fa-users"></i> The name "Unities" and "Units"</span>
          </div>
          <p style={{ marginTop: '16px' }}><i className="fas fa-ban"></i> You can't: Copy our code, Use our logo without permission, Pretend to be ComeUnity</p>
          <p><i className="fas fa-check-circle"></i> You CAN: Screenshot your profile, Share links to ComeUnity, Tell people you're a proud Unit</p>
        </div>

        {/* Coins & Tipping */}
        <div className={styles.sectionCard} id="coins">
          <div className={styles.sectionTitle}>
            <i className="fas fa-coins" style={{ color: '#ffd700' }}></i> Coins, Tipping & Virtual Economy
          </div>
          <div className={styles.subsectionTitle}><i className="fas fa-question-circle"></i> What Are Coins?</div>
          <p>Coins are virtual currency on ComeUnity. They have no real-world value until you cash them out (when we enable that feature).</p>
          <div className={styles.termsTable}>
            <div className={`${styles.termsRow} ${styles.termsRowHeader}`}>
              <div><i className="fas fa-check-circle"></i> You Can</div>
              <div><i className="fas fa-ban"></i> You Cannot</div>
            </div>
            <div className={styles.termsRow}><div>Earn coins by engaging</div><div>Sell coins for real money (not yet)</div></div>
            <div className={styles.termsRow}><div>Tip creators with coins</div><div>Use coins outside ComeUnity</div></div>
            <div className={styles.termsRow}><div>Buy avatars with coins</div><div></div></div>
          </div>
          <div className={styles.subsectionTitle}><i className="fas fa-hand-holding-heart"></i> Tipping</div>
          <div className={styles.domainTags}>
            <span className={styles.domainTag}><i className="fas fa-percent"></i> 100% of your tip goes to the creator — We don't take a cut. Ever.</span>
            <span className={styles.domainTag}><i className="fas fa-lock"></i> Tips are final — You can't take them back</span>
            <span className={styles.domainTag}><i className="fas fa-globe"></i> Tips are public — Everyone can see you tipped</span>
          </div>
        </div>

        {/* Prohibited Conduct */}
        <div className={styles.sectionCard} id="prohibited">
          <div className={styles.sectionTitle}>
            <i className="fas fa-ban" style={{ color: '#ef4444' }}></i> Prohibited Conduct (The "Don't Be a Jerk" Section)
          </div>
          <div className={styles.termsTable}>
            <div className={`${styles.termsRow} ${styles.termsRowHeader}`}>
              <div>Category</div>
              <div>Examples</div>
              <div>Consequence</div>
            </div>
            <div className={styles.termsRow}><div>Impersonation</div><div>Pretending to be someone else</div><div className={styles.badgeNo}>Permanent ban</div></div>
            <div className={styles.termsRow}><div>Spam</div><div>Posting {'>'}3x/hour, bots</div><div>Warning → Temp ban → Permanent ban</div></div>
            <div className={styles.termsRow}><div>Harassment</div><div>Bullying, threats, doxxing</div><div className={styles.badgeNo}>Permanent ban</div></div>
            <div className={styles.termsRow}><div>Illegal content</div><div>Child exploitation, terrorism</div><div className={styles.badgeNo}>Permanent ban + reported</div></div>
            <div className={styles.termsRow}><div>Hate speech</div><div>Attacking based on race, religion, etc.</div><div className={styles.badgeNo}>Permanent ban</div></div>
            <div className={styles.termsRow}><div>Copyright infringement</div><div>Posting work that isn't yours</div><div>DMCA takedown → Ban</div></div>
          </div>
        </div>

        {/* Moderation */}
        <div className={styles.sectionCard} id="moderation">
          <div className={styles.sectionTitle}>
            <i className="fas fa-gavel"></i> Moderation & Enforcement
          </div>
          <div className={styles.reportFlow}>
            <div className={styles.flowItem}><i className="fas fa-flag"></i> 1 report<br />Manual review</div>
            <div className={styles.flowArrow}><i className="fas fa-arrow-right"></i></div>
            <div className={styles.flowItem}><i className="fas fa-eye-slash"></i> 3 reports<br />Content hidden</div>
            <div className={styles.flowArrow}><i className="fas fa-arrow-right"></i></div>
            <div className={styles.flowItem}><i className="fas fa-exclamation-triangle"></i> 5 reports<br />Account flagged</div>
            <div className={styles.flowArrow}><i className="fas fa-arrow-right"></i></div>
            <div className={styles.flowItem}><i className="fas fa-hourglass-half"></i> 10 reports<br />Temporary ban</div>
            <div className={styles.flowArrow}><i className="fas fa-arrow-right"></i></div>
            <div className={styles.flowItem}><i className="fas fa-skull"></i> 20+ reports<br />Permanent ban</div>
          </div>
          <div className={styles.subsectionTitle}><i className="fas fa-balance-scale"></i> Our Moderation Principles</div>
          <div className={styles.domainTags}>
            <span className={styles.domainTag}><i className="fas fa-eye"></i> Transparency — We'll tell you why something was removed</span>
            <span className={styles.domainTag}><i className="fas fa-balance-scale"></i> Fairness — We apply rules consistently</span>
            <span className={styles.domainTag}><i className="fas fa-gavel"></i> Appeals — You can challenge our decisions</span>
            <span className={styles.domainTag}><i className="fas fa-chart-line"></i> Proportionality — Small violations get warnings; big ones get bans</span>
          </div>
        </div>

        {/* Termination */}
        <div className={styles.sectionCard} id="termination">
          <div className={styles.sectionTitle}>
            <i className="fas fa-trash-alt"></i> Termination (How You Lose Your Account)
          </div>
          <div className={styles.stepsContainer}>
            <div className={styles.step}><div className={styles.stepNumber}>1</div><div>Violate Terms</div><div>We'll tell you why</div></div>
            <div className={styles.step}><div className={styles.stepNumber}>2</div><div>Illegal activity</div><div>Ban + may report you</div></div>
            <div className={styles.step}><div className={styles.stepNumber}>3</div><div>Repeated violations</div><div>Permanent ban</div></div>
            <div className={styles.step}><div className={styles.stepNumber}>4</div><div>Spam/Bot account</div><div>Immediate ban</div></div>
          </div>
          <div className={styles.subsectionTitle}><i className="fas fa-door-open"></i> You May Terminate Your Account</div>
          <div className={styles.domainTags}>
            <span className={styles.domainTag}><i className="fas fa-cog"></i> Settings → Delete Account — Any time</span>
            <span className={styles.domainTag}><i className="fas fa-envelope"></i> Email us — We'll process within 7 days</span>
          </div>
          <p style={{ marginTop: '12px' }}><i className="fas fa-trash-alt"></i> What happens: Your content removed within 90 days, Coins forfeited, XP gone, Streak gone, Username released</p>
        </div>

        {/* Intellectual Property */}
        <div className={styles.sectionCard} id="intellectual-property">
          <div className={styles.sectionTitle}>
            <i className="fas fa-copyright"></i> Intellectual Property
          </div>
          <div className={styles.subsectionTitle}><i className="fas fa-user-astronaut"></i> Your Copyright</div>
          <p>You keep your copyright. We don't claim ownership of your work.</p>
          <div className={styles.domainTag} onClick={() => showToastMessage('copyright@comeunity.com')}><i className="fas fa-envelope"></i> Report infringement: copyright@comeunity.com</div>
          <div className={styles.subsectionTitle}><i className="fas fa-building"></i> Our Copyright</div>
          <p>We own the platform. Don't copy it.</p>
          <div className={styles.domainTags}>
            <span className={styles.domainTag}><i className="fas fa-code"></i> Copy our code → No</span>
            <span className={styles.domainTag}><i className="fas fa-trademark"></i> Use our logo → No</span>
            <span className={styles.domainTag}><i className="fas fa-database"></i> Scrape data → No</span>
          </div>
        </div>

        {/* Disclaimer */}
        <div className={styles.sectionCard} id="disclaimer">
          <div className={styles.sectionTitle}>
            <i className="fas fa-exclamation-triangle"></i> Disclaimer of Warranties
          </div>
          <div className={styles.ownershipCard}>
            <p style={{ fontSize: '18px', fontWeight: 600, color: 'white' }}>"ComeUnity is provided 'as is.' We're building this with love, but we can't promise it'll be perfect."</p>
          </div>
          <div className={styles.domainTags}>
            <span className={styles.domainTag}><i className="fas fa-plug"></i> Uninterrupted service — Sometimes servers go down</span>
            <span className={styles.domainTag}><i className="fas fa-bug"></i> Bug-free experience — We're human; we make mistakes</span>
            <span className={styles.domainTag}><i className="fas fa-chart-line"></i> That you'll make money — Tipping is voluntary</span>
            <span className={styles.domainTag}><i className="fas fa-chart-bar"></i> That your content will go viral — We can't predict it</span>
          </div>
        </div>

        {/* Limitation of Liability */}
        <div className={styles.sectionCard} id="liability">
          <div className={styles.sectionTitle}>
            <i className="fas fa-shield-alt"></i> Limitation of Liability
          </div>
          <p>"We're not liable for what you post or what happens because of it."</p>
          <div className={styles.domainTags}>
            <span className={styles.domainTag}><i className="fas fa-users"></i> User-generated content — Someone posts something offensive</span>
            <span className={styles.domainTag}><i className="fas fa-coins"></i> Lost earnings — You didn't get the tips you expected</span>
            <span className={styles.domainTag}><i className="fas fa-link"></i> Third-party links — You click a link and get scammed</span>
            <span className={styles.domainTag}><i className="fas fa-database"></i> Data loss — Servers fail (we have backups, but still)</span>
          </div>
          <p style={{ marginTop: '12px' }}>Maximum liability: The total amount you paid us in the last 12 months. Which is probably $0 because it's free.</p>
        </div>

        {/* Indemnification */}
        <div className={styles.sectionCard} id="indemnification">
          <div className={styles.sectionTitle}>
            <i className="fas fa-handshake"></i> Indemnification
          </div>
          <p>If you do something dumb, you pay for it.</p>
          <div className={styles.domainTags}>
            <span className={styles.domainTag}><i className="fas fa-file-contract"></i> Violate these Terms → Pay for legal costs</span>
            <span className={styles.domainTag}><i className="fas fa-copyright"></i> Infringe someone's copyright → Pay for the lawsuit</span>
            <span className={styles.domainTag}><i className="fas fa-comment-dots"></i> Harass someone → Pay for their lawyer</span>
          </div>
          <p>Basically: Don't be a jerk. We'll defend ourselves if we have to, and you'll cover it.</p>
        </div>

        {/* Dispute Resolution */}
        <div className={styles.sectionCard} id="dispute-resolution">
          <div className={styles.sectionTitle}>
            <i className="fas fa-gavel"></i> Dispute Resolution
          </div>
          <div className={styles.stepsContainer}>
            <div className={styles.step}><div className={styles.stepNumber}>1</div><div>Email us first</div><div className={styles.domainTag}>support@comeunity.com</div></div>
            <div className={styles.step}><div className={styles.stepNumber}>2</div><div>Wait 30 days</div><div>Give us time to respond</div></div>
            <div className={styles.step}><div className={styles.stepNumber}>3</div><div>Arbitration</div><div>Binding arbitration (not court)</div></div>
          </div>
          <p><i className="fas fa-gavel"></i> No class actions. You agree to resolve disputes individually.</p>
        </div>

        {/* Governing Law */}
        <div className={styles.sectionCard} id="governing-law">
          <div className={styles.sectionTitle}>
            <i className="fas fa-globe"></i> Governing Law
          </div>
          <div className={styles.domainTags}>
            <span className={styles.domainTag}><i className="fas fa-flag-usa"></i> United States → California law</span>
            <span className={styles.domainTag}><i className="fas fa-euro-sign"></i> European Union → Irish law</span>
            <span className={styles.domainTag}><i className="fas fa-flag"></i> Nigeria → Nigerian law</span>
            <span className={styles.domainTag}><i className="fas fa-globe"></i> Other → Laws of your country, where applicable</span>
          </div>
        </div>

        {/* Changes */}
        <div className={styles.sectionCard} id="changes">
          <div className={styles.sectionTitle}>
            <i className="fas fa-edit"></i> Changes to These Terms
          </div>
          <div className={styles.domainTags}>
            <span className={styles.domainTag}><i className="fas fa-pen"></i> Minor changes → In-app notification</span>
            <span className={styles.domainTag}><i className="fas fa-envelope"></i> Major changes → Email + in-app popup (30 days notice)</span>
          </div>
          <p>If you don't agree to changes, you can delete your account. Continuing to use ComeUnity means you accept the new Terms.</p>
        </div>

        {/* Contact */}
        <div className={styles.sectionCard} id="contact">
          <div className={styles.sectionTitle}>
            <i className="fas fa-envelope"></i> Contact Us
          </div>
          <div className={styles.supportGrid}>
            <div className={styles.supportItem} onClick={() => showToastMessage('support@comeunity.com')}><i className="fas fa-question-circle"></i> General questions: support@comeunity.com</div>
            <div className={styles.supportItem} onClick={() => showToastMessage('legal@comeunity.com')}><i className="fas fa-gavel"></i> Legal matters: legal@comeunity.com</div>
            <div className={styles.supportItem} onClick={() => showToastMessage('copyright@comeunity.com')}><i className="fas fa-copyright"></i> Copyright claims: copyright@comeunity.com</div>
            <div className={styles.supportItem} onClick={() => showToastMessage('privacy@comeunity.com')}><i className="fas fa-lock"></i> Privacy questions: privacy@comeunity.com</div>
            <div className={styles.supportItem} onClick={() => showToastMessage('security@comeunity.com')}><i className="fas fa-shield-alt"></i> Security concerns: security@comeunity.com</div>
          </div>
        </div>

        {/* Final Word */}
        <div className={styles.sectionCard}>
          <div className={styles.sectionTitle}>
            <i className="fas fa-star" style={{ color: '#ffd700' }}></i> The Final Word
          </div>
          <div className={styles.ownershipCard} style={{ background: 'linear-gradient(145deg, rgba(255,77,109,0.1), rgba(67,97,238,0.1))' }}>
            <div className={styles.ownershipIcon}><i className="fas fa-rocket"></i></div>
            <p style={{ fontSize: '18px', fontWeight: 600, color: 'white' }}>ComeUnity is your space. A place where creators find their people and get paid. Where your work is seen. Where you're valued.</p>
            <p style={{ marginTop: '16px', color: 'rgba(255,255,255,0.8)' }}>These Terms exist to protect that space. Not to trap you. Not to limit you. To make sure everyone can create, connect, and collab without fear.</p>
            <p style={{ marginTop: '16px', fontWeight: 600, color: 'white' }}>Welcome to ComeUnity. <i className="fas fa-rocket"></i></p>
            <p style={{ marginTop: '12px', fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>Last updated: March 2026</p>
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