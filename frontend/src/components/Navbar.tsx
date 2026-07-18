'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Cpu } from 'lucide-react';
import styles from './Navbar.module.css';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`${styles.navbar} ${isScrolled ? styles.scrolled : ''}`}>
      <div className={`container ${styles.navContainer}`}>
        <Link href="/" className={styles.logo}>
          <img src="/logo.png" alt="Docodo Logo" className={styles.logoIcon} />
          <span>Docodo</span>
        </Link>

        <div className={`${styles.navLinks} ${mobileMenuOpen ? styles.mobileOpen : ''}`}>
          <Link href="/services" className={styles.link} onClick={() => setMobileMenuOpen(false)}>Services</Link>
          <Link href="/pricing" className={styles.link} onClick={() => setMobileMenuOpen(false)}>Pricing</Link>
          <Link href="/dashboard" className={styles.link} onClick={() => setMobileMenuOpen(false)}>Dashboard</Link>
          <Link href="/contact" className={`btn btn-primary ${styles.cta}`} onClick={() => setMobileMenuOpen(false)}>
            Get Started
          </Link>
        </div>

        <button className={styles.mobileToggle} onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>
    </nav>
  );
}
