import React from 'react';
import { ArrowUpRight, TrendingUp, Users, Target } from 'lucide-react';
import styles from './cases.module.css';

export const metadata = {
  title: 'Case Studies | Docodo',
  description: 'See how Docodo has transformed businesses with AI agents and premium SaaS solutions.',
};

export default function CasesPage() {
  return (
    <main className={styles.main}>
      <div className={styles.header}>
        <div className="container">
          <h1 className="text-gradient">Success Stories</h1>
          <p>Discover how leading digital marketing brands and startups scale with Docodo's tailored technology.</p>
        </div>
      </div>

      <div className="container">
        <div className={styles.casesList}>
          {/* Case Study 1 */}
          <div className="card glass">
            <div className={styles.caseGrid}>
              <div className={styles.caseInfo}>
                <div className={styles.tag}>AI Agent Integration</div>
                <h2>Acme Marketing Corp</h2>
                <p>Acme struggled with high customer support volume. We deployed a custom AI agent trained on their entire knowledge base, capable of handling 85% of tier-1 support queries instantly.</p>
                <div className={styles.metrics}>
                  <div className={styles.metric}>
                    <TrendingUp className={styles.metricIcon} />
                    <div className={styles.metricValue}>+45%</div>
                    <div className={styles.metricLabel}>Resolution Speed</div>
                  </div>
                  <div className={styles.metric}>
                    <Users className={styles.metricIcon} />
                    <div className={styles.metricValue}>-30%</div>
                    <div className={styles.metricLabel}>Support Costs</div>
                  </div>
                </div>
              </div>
              <div className={styles.caseVisual}>
                <div className={styles.visualPlaceholder}>
                  <div className={styles.floatingCard}>AI Agent Active</div>
                </div>
              </div>
            </div>
          </div>

          {/* Case Study 2 */}
          <div className="card glass">
            <div className={styles.caseGrid}>
              <div className={styles.caseInfo}>
                <div className={styles.tag}>SaaS Dashboard & Web App</div>
                <h2>Growthify SaaS</h2>
                <p>Growthify needed a complete overhaul of their user dashboard to improve retention. We built a stunning, highly responsive Next.js application with interactive 3D elements and real-time data visualization.</p>
                <div className={styles.metrics}>
                  <div className={styles.metric}>
                    <Target className={styles.metricIcon} />
                    <div className={styles.metricValue}>3x</div>
                    <div className={styles.metricLabel}>User Retention</div>
                  </div>
                  <div className={styles.metric}>
                    <ArrowUpRight className={styles.metricIcon} />
                    <div className={styles.metricValue}>+120%</div>
                    <div className={styles.metricLabel}>Feature Adoption</div>
                  </div>
                </div>
              </div>
              <div className={styles.caseVisual}>
                <div className={styles.visualPlaceholder2}>
                  <div className={styles.floatingCard}>Dashboard v2.0</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
