import React from 'react';
import { Shield, Zap, Users, Code } from 'lucide-react';
import styles from './about.module.css';

export const metadata = {
  title: 'About Us | Docodo',
  description: 'Learn more about Docodo, the premier digital marketing and AI SaaS development agency.',
};

export default function AboutPage() {
  return (
    <main className={styles.main}>
      <div className="container">
        <div className={styles.header}>
          <div className={styles.badge}>Our Mission</div>
          <h1 className="text-gradient">Architecting the Future of SaaS</h1>
          <p className="subtitle">
            At Docodo, we believe in empowering top-tier businesses with bleeding-edge AI integrations, robust web applications, and analytics dashboards that drive massive growth.
          </p>
        </div>

        <div className={styles.grid}>
          <div className="card glass">
            <Shield className={styles.icon} />
            <h3>Enterprise Security</h3>
            <p>Our solutions are built with enterprise-grade security protocols, ensuring your AI agents and user dashboards are impenetrable.</p>
          </div>
          <div className="card glass">
            <Zap className={styles.icon} />
            <h3>Unmatched Speed</h3>
            <p>We leverage Next.js and optimized infrastructure to deliver web applications that load instantly and perform flawlessly.</p>
          </div>
          <div className="card glass">
            <Users className={styles.icon} />
            <h3>User-Centric Design</h3>
            <p>Every pixel is meticulously crafted to ensure the highest conversion rates and a jaw-dropping user experience.</p>
          </div>
          <div className="card glass">
            <Code className={styles.icon} />
            <h3>Clean Architecture</h3>
            <p>We write highly maintainable, modular code that allows your business to scale aggressively without technical debt.</p>
          </div>
        </div>

        <div className={styles.story}>
          <h2>The Docodo Difference</h2>
          <p>
            Unlike traditional digital marketing agencies, Docodo acts as your elite technical partner. We don't just build websites; we engineer comprehensive digital ecosystems. From deploying autonomous AI agents that handle customer support, to crafting custom analytics dashboards that track your KPIs in real-time, our solutions put you in the top 1% of your industry.
          </p>
        </div>
      </div>
    </main>
  );
}
