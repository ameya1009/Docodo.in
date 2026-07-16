import React from 'react';
import Link from 'next/link';
import { ArrowRight, Code, Layout, BarChart } from 'lucide-react';
import Hero3D from '@/components/Hero3D';
import styles from './page.module.css';

export default function Home() {
  return (
    <main className={styles.main}>
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className="bg-grid"></div>
        <div className={`container ${styles.heroContainer}`}>
          <div className={styles.heroContent}>
            <div className={`animate-fade-up ${styles.badge}`}>
              <span className={styles.badgeDot}></span>
              Next-Gen SaaS Solutions
            </div>
            <h1 className="animate-fade-up delay-100">
              Build <span className="text-gradient-primary">AI Agents</span> &amp; Digital Experiences
            </h1>
            <p className="animate-fade-up delay-200">
              Docodo is your premium partner for crafting intelligent dashboards, custom websites, and powerful AI-driven applications.
            </p>
            <div className={`animate-fade-up delay-300 ${styles.heroActions}`}>
              <Link href="/contact" className="btn btn-primary">
                Start a Project <ArrowRight size={18} style={{ marginLeft: '8px' }} />
              </Link>
              <Link href="/services" className="btn btn-outline">
                Explore Services
              </Link>
            </div>
          </div>
          
          <div className={`animate-fade-up delay-200 ${styles.heroVisual}`}>
            <Hero3D />
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="section">
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className="text-gradient">What We Build</h2>
            <p>Elevate your digital marketing brand with our bespoke technology suite.</p>
          </div>

          <div className={styles.servicesGrid}>
            <div className="card">
              <div className={styles.cardIconWrapper}>
                <Code className={styles.cardIcon} />
              </div>
              <h3>AI Agents</h3>
              <p>Custom intelligent agents that automate customer service, sales, and operations tailored to your business data.</p>
            </div>

            <div className="card">
              <div className={styles.cardIconWrapper}>
                <Layout className={styles.cardIcon} />
              </div>
              <h3>Premium Websites & Apps</h3>
              <p>Stunning, high-performance web applications and marketing sites designed to convert and dazzle.</p>
            </div>

            <div className="card">
              <div className={styles.cardIconWrapper}>
                <BarChart className={styles.cardIcon} />
              </div>
              <h3>SaaS Dashboards</h3>
              <p>Intuitive analytics and management dashboards that give you full control over your digital ecosystem.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
