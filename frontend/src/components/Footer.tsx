import React from 'react';
import Link from 'next/link';
import { Cpu, MessageSquare, Share2, Globe } from 'lucide-react';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.container}`}>
        <div className={styles.brand}>
          <Link href="/" className={styles.logo}>
            <img src="/logo.png" alt="Docodo Logo" className={styles.logoIcon} />
            <span>Docodo</span>
          </Link>
          <p className={styles.description}>
            Empowering SaaS brands with next-gen AI agents, premium websites, and custom dashboards.
          </p>
          <div className={styles.socials}>
            <a href="#" className={styles.socialLink}><MessageSquare size={20} /></a>
            <a href="#" className={styles.socialLink}><Share2 size={20} /></a>
            <a href="#" className={styles.socialLink}><Globe size={20} /></a>
          </div>
        </div>

        <div className={styles.linksSection}>
          <h4 className={styles.linksTitle}>Product</h4>
          <ul className={styles.linksList}>
            <li><Link href="/services">AI Agents</Link></li>
            <li><Link href="/services">Websites</Link></li>
            <li><Link href="/services">Dashboards</Link></li>
            <li><Link href="/pricing">Pricing</Link></li>
          </ul>
        </div>

        <div className={styles.linksSection}>
          <h4 className={styles.linksTitle}>Company</h4>
          <ul className={styles.linksList}>
            <li><Link href="/about">About Us</Link></li>
            <li><Link href="/cases">Case Studies</Link></li>
            <li><Link href="/blog">Blog</Link></li>
            <li><Link href="/contact">Contact</Link></li>
          </ul>
        </div>
      </div>
      <div className={styles.bottomBar}>
        <div className="container">
          <p>&copy; {new Date().getFullYear()} Docodo. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
