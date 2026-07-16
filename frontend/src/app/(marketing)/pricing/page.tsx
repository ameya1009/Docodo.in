'use client';

import React, { useState } from 'react';
import { Check } from 'lucide-react';
import styles from './pricing.module.css';

export default function PricingPage() {
  const [annual, setAnnual] = useState(false);

  return (
    <main className={styles.main}>
      <div className={styles.header}>
        <div className="container">
          <h1 className="text-gradient">Simple, Transparent Pricing</h1>
          <p>Choose the perfect plan for your SaaS scaling needs.</p>
          
          <div className={styles.toggleContainer}>
            <span className={!annual ? styles.activeText : ''}>Monthly</span>
            <div className={styles.toggle} onClick={() => setAnnual(!annual)}>
              <div className={`${styles.toggleKnob} ${annual ? styles.knobActive : ''}`} />
            </div>
            <span className={annual ? styles.activeText : ''}>Annually (Save 20%)</span>
          </div>
        </div>
      </div>

      <div className="container">
        <div className={styles.pricingGrid}>
          {/* Starter Plan */}
          <div className="card glass">
            <h3>Starter</h3>
            <div className={styles.price}>
              <span className={styles.currency}>$</span>
              <span className={styles.amount}>{annual ? '1,500' : '1,800'}</span>
              <span className={styles.period}>/mo</span>
            </div>
            <p className={styles.planDesc}>Perfect for early-stage startups.</p>
            <button className={`btn btn-outline ${styles.fullWidth}`}>Get Started</button>
            <ul className={styles.features}>
              <li><Check size={18} /> Custom Next.js Website</li>
              <li><Check size={18} /> Basic SEO Setup</li>
              <li><Check size={18} /> Contact Form Integration</li>
            </ul>
          </div>

          {/* Pro Plan */}
          <div className={`card glass ${styles.popular}`}>
            <div className={styles.popularBadge}>Most Popular</div>
            <h3>Growth</h3>
            <div className={styles.price}>
              <span className={styles.currency}>$</span>
              <span className={styles.amount}>{annual ? '3,500' : '4,200'}</span>
              <span className={styles.period}>/mo</span>
            </div>
            <p className={styles.planDesc}>For scaling SaaS companies.</p>
            <button className={`btn btn-primary ${styles.fullWidth}`}>Get Started</button>
            <ul className={styles.features}>
              <li><Check size={18} /> Premium Interactive 3D Web App</li>
              <li><Check size={18} /> 1 Custom AI Agent</li>
              <li><Check size={18} /> Basic Dashboard Access</li>
              <li><Check size={18} /> Advanced SEO Optimization</li>
            </ul>
          </div>

          {/* Enterprise Plan */}
          <div className="card glass">
            <h3>Enterprise</h3>
            <div className={styles.price}>
              <span className={styles.amount}>Custom</span>
            </div>
            <p className={styles.planDesc}>Full-scale digital transformation.</p>
            <button className={`btn btn-outline ${styles.fullWidth}`}>Contact Sales</button>
            <ul className={styles.features}>
              <li><Check size={18} /> Multiple Complex AI Agents</li>
              <li><Check size={18} /> Dedicated SaaS Dashboard</li>
              <li><Check size={18} /> SLA & 24/7 Support</li>
              <li><Check size={18} /> Dedicated Account Manager</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
