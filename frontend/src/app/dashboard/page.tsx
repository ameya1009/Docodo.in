'use client';

import React from 'react';
import Link from 'next/link';
import { LayoutDashboard, Users, Activity, Settings, Bell, Search, ArrowLeft } from 'lucide-react';
import styles from './dashboard.module.css';

export default function DashboardPage() {
  return (
    <main className={styles.main}>
      <div className={styles.sidebar}>
        <Link href="/" className={styles.logo}>
          <ArrowLeft size={18} /> Back to Website
        </Link>
        <nav className={styles.nav}>
          <a href="#" className={styles.active}><LayoutDashboard size={20} /> Dashboard</a>
          <a href="#"><Users size={20} /> Audience</a>
          <a href="#"><Activity size={20} /> Analytics</a>
          <a href="#"><Settings size={20} /> Settings</a>
        </nav>
      </div>

      <div className={styles.content}>
        <header className={styles.header}>
          <div className={styles.search}>
            <Search size={18} />
            <input type="text" placeholder="Search insights..." />
          </div>
          <div className={styles.actions}>
            <button className={styles.iconBtn}><Bell size={20} /></button>
            <div className={styles.avatar}>A</div>
          </div>
        </header>

        <div className={styles.dashboardGrid}>
          <div className={`card ${styles.statCard}`}>
            <h3>Total Users</h3>
            <div className={styles.statValue}>12,450</div>
            <div className={styles.statChange}>+14% this month</div>
          </div>
          <div className={`card ${styles.statCard}`}>
            <h3>AI Interactions</h3>
            <div className={styles.statValue}>8,230</div>
            <div className={styles.statChange}>+22% this month</div>
          </div>
          <div className={`card ${styles.statCard}`}>
            <h3>Conversion Rate</h3>
            <div className={styles.statValue}>4.8%</div>
            <div className={styles.statChange}>+1.2% this month</div>
          </div>

          <div className={`card ${styles.mainChart}`}>
            <h3>Activity Overview</h3>
            <div className={styles.chartPlaceholder}>
              {/* Mock chart bars */}
              {[40, 70, 45, 90, 65, 85, 100].map((height, i) => (
                <div key={i} className={styles.barWrapper}>
                  <div className={styles.bar} style={{ height: `${height}%` }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
