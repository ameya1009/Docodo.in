'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { LayoutDashboard, Users, Activity, Settings, Bell, Search, ArrowLeft, Plus } from 'lucide-react';
import styles from './dashboard.module.css';

interface Lead {
  id: string;
  name: string;
  email: string;
  company: string | null;
  status: string;
  aiScore: number;
}

export default function DashboardPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  
  // New Lead Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const res = await fetch('/api/leads');
      if (res.ok) {
        const data = await res.json();
        setLeads(data);
      }
    } catch (error) {
      console.error('Failed to fetch leads', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, company })
      });
      if (res.ok) {
        const newLead = await res.json();
        setLeads([newLead, ...leads]);
        setShowForm(false);
        setName('');
        setEmail('');
        setCompany('');
      }
    } catch (error) {
      console.error('Failed to add lead', error);
    }
  };

  return (
    <main className={styles.main}>
      <div className={styles.sidebar}>
        <Link href="/" className={styles.logo} style={{ textDecoration: 'none' }}>
          <ArrowLeft size={18} style={{ marginRight: '8px' }} />
          <div className="textLogo" style={{ fontSize: '1.25rem' }}>Docodo<span className="textLogoDot">.</span></div>
        </Link>
        <nav className={styles.nav}>
          <Link href="/dashboard" className={styles.active}><LayoutDashboard size={20} /> Docodo CRM</Link>
          <Link href="/dashboard/agents"><Users size={20} /> AI Agents</Link>
          <Link href="/dashboard/campaigns"><Activity size={20} /> Campaigns</Link>
          <Link href="/dashboard/settings"><Settings size={20} /> Settings</Link>
        </nav>
      </div>
      
      <div className={styles.content}>
        <header className={styles.header}>
          <div className={styles.search}>
            <Search size={18} color="var(--text-secondary)" />
            <input type="text" placeholder="Search leads or ask AI..." />
          </div>
          <div className={styles.actions}>
            <button className={styles.iconBtn}><Bell size={20} /></button>
            <div className={styles.avatar}>A</div>
          </div>
        </header>

        <div className={styles.dashboardGrid}>
          <div className={`card ${styles.statCard}`}>
            <h3>Total Leads</h3>
            <div className={styles.statValue}>{leads.length}</div>
            <div className={styles.statChange}>Active CRM Pipeline</div>
          </div>
          <div className={`card ${styles.statCard}`}>
            <h3>Avg AI Score</h3>
            <div className={styles.statValue}>
              {leads.length > 0 ? Math.round(leads.reduce((sum, lead) => sum + lead.aiScore, 0) / leads.length) : 0}
            </div>
            <div className={styles.statChange}>Conversion Likelihood</div>
          </div>
          <div className={`card ${styles.statCard}`}>
            <h3>Active Agents</h3>
            <div className={styles.statValue}>2</div>
            <div className={styles.statChange}>Monitoring website</div>
          </div>
        </div>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2>CRM Pipeline</h2>
            <button className="btn btn-primary" style={{ padding: '0.5rem 1rem' }} onClick={() => setShowForm(!showForm)}>
              <Plus size={16} /> Add Lead
            </button>
          </div>

          {showForm && (
            <form onSubmit={handleAddLead} style={{ marginBottom: '2rem', padding: '1.5rem', background: 'rgba(0,0,0,0.2)', borderRadius: '12px', border: '1px solid var(--card-border)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <input type="text" placeholder="Full Name" required value={name} onChange={e => setName(e.target.value)} style={{ padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--card-border)', background: 'transparent', color: '#fff' }} />
                <input type="email" placeholder="Email Address" required value={email} onChange={e => setEmail(e.target.value)} style={{ padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--card-border)', background: 'transparent', color: '#fff' }} />
                <input type="text" placeholder="Company (Optional)" value={company} onChange={e => setCompany(e.target.value)} style={{ padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--card-border)', background: 'transparent', color: '#fff' }} />
              </div>
              <button type="submit" className="btn btn-primary" style={{ padding: '0.5rem 2rem' }}>Save Lead</button>
            </form>
          )}

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--card-border)' }}>
                  <th style={{ padding: '1rem 0', color: 'var(--text-secondary)' }}>Name</th>
                  <th style={{ padding: '1rem 0', color: 'var(--text-secondary)' }}>Email</th>
                  <th style={{ padding: '1rem 0', color: 'var(--text-secondary)' }}>Company</th>
                  <th style={{ padding: '1rem 0', color: 'var(--text-secondary)' }}>Status</th>
                  <th style={{ padding: '1rem 0', color: 'var(--text-secondary)' }}>AI Score</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={5} style={{ padding: '2rem 0', textAlign: 'center' }}>Loading CRM data...</td></tr>
                ) : leads.length === 0 ? (
                  <tr><td colSpan={5} style={{ padding: '2rem 0', textAlign: 'center', color: 'var(--text-secondary)' }}>No leads found. Add one above!</td></tr>
                ) : (
                  leads.map((lead) => (
                    <tr key={lead.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '1rem 0', fontWeight: '500' }}>{lead.name}</td>
                      <td style={{ padding: '1rem 0', color: 'var(--text-secondary)' }}>{lead.email}</td>
                      <td style={{ padding: '1rem 0', color: 'var(--text-secondary)' }}>{lead.company || '-'}</td>
                      <td style={{ padding: '1rem 0' }}>
                        <span style={{ padding: '0.25rem 0.75rem', background: 'rgba(43, 212, 172, 0.1)', color: 'var(--primary-color)', borderRadius: '9999px', fontSize: '0.85rem' }}>
                          {lead.status}
                        </span>
                      </td>
                      <td style={{ padding: '1rem 0' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <div style={{ width: '100px', height: '6px', background: 'var(--card-bg)', borderRadius: '3px', overflow: 'hidden' }}>
                            <div style={{ width: `${lead.aiScore}%`, height: '100%', background: lead.aiScore > 70 ? '#10b981' : lead.aiScore > 40 ? '#f59e0b' : '#ef4444' }}></div>
                          </div>
                          <span style={{ fontSize: '0.85rem' }}>{lead.aiScore}</span>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
