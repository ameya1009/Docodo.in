import React from 'react';
import { Bot, AppWindow, LineChart, Cpu, Database, Cloud } from 'lucide-react';
import styles from './services.module.css';

export const metadata = {
  title: 'Services | Docodo',
  description: 'Explore our AI agent development, website creation, and custom dashboard services.',
};

export default function ServicesPage() {
  return (
    <main className={styles.main}>
      <div className={styles.header}>
        <div className="container">
          <h1 className="text-gradient">Our Expertise</h1>
          <p>We combine cutting-edge technology with premium design to accelerate your business growth.</p>
        </div>
      </div>

      <div className="container">
        <div className={styles.grid}>
          {/* Service 1 */}
          <div className="card glass">
            <div className={styles.iconWrapper}><Bot size={32} /></div>
            <h2>AI Agents</h2>
            <p>Deploy intelligent conversational agents that understand context, learn from your data, and automate complex workflows seamlessly.</p>
            <ul className={styles.featureList}>
              <li><Database size={16}/> Knowledge Base Integration</li>
              <li><Cloud size={16}/> 24/7 Automation</li>
              <li><Cpu size={16}/> Custom LLM Tuning</li>
            </ul>
          </div>

          {/* Service 2 */}
          <div className="card glass">
            <div className={styles.iconWrapper}><AppWindow size={32} /></div>
            <h2>Premium Websites</h2>
            <p>Immersive, high-performance web applications built with modern frameworks and stunning interactive 3D visuals.</p>
            <ul className={styles.featureList}>
              <li><Database size={16}/> Next.js & React Ecosystem</li>
              <li><Cloud size={16}/> WebGL & 3D Elements</li>
              <li><Cpu size={16}/> SEO Optimized</li>
            </ul>
          </div>

          {/* Service 3 */}
          <div className="card glass">
            <div className={styles.iconWrapper}><LineChart size={32} /></div>
            <h2>SaaS Dashboards</h2>
            <p>Data-rich, intuitive control panels giving you real-time insights and administrative power over your digital assets.</p>
            <ul className={styles.featureList}>
              <li><Database size={16}/> Real-time Analytics</li>
              <li><Cloud size={16}/> User Management</li>
              <li><Cpu size={16}/> API Integrations</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
