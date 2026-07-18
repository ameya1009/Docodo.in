import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Blog | Docodo',
  description: 'Insights and news from Docodo.',
};

export default function BlogPage() {
  return (
    <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 'var(--nav-height) 2rem 2rem 2rem' }}>
      <div>
        <h1 className="text-gradient" style={{ marginBottom: '1rem' }}>Coming Soon</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>We are currently crafting our first set of industry insights.</p>
        <Link href="/" className="btn btn-primary">Back to Home</Link>
      </div>
    </main>
  );
}
