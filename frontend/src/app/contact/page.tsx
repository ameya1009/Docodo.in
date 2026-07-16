import React from 'react';
import { Mail, MapPin, Phone } from 'lucide-react';
import styles from './contact.module.css';

export const metadata = {
  title: 'Contact Us | Docodo',
  description: 'Get in touch with Docodo for custom SaaS and AI solutions.',
};

export default function ContactPage() {
  return (
    <main className={styles.main}>
      <div className="container">
        <div className={styles.contactWrapper}>
          <div className={styles.contactInfo}>
            <h1 className="text-gradient">Let's build the future together.</h1>
            <p>Ready to elevate your digital marketing brand? Reach out to our team of experts to discuss AI agents, custom websites, or SaaS dashboards.</p>
            
            <div className={styles.infoBlocks}>
              <div className={styles.infoBlock}>
                <Mail className={styles.infoIcon} />
                <div>
                  <h4>Email</h4>
                  <span>hello@docodo.in</span>
                </div>
              </div>
              <div className={styles.infoBlock}>
                <Phone className={styles.infoIcon} />
                <div>
                  <h4>Phone</h4>
                  <span>+1 (555) 123-4567</span>
                </div>
              </div>
              <div className={styles.infoBlock}>
                <MapPin className={styles.infoIcon} />
                <div>
                  <h4>Office</h4>
                  <span>123 Innovation Drive, Tech City, TC 90210</span>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.contactFormWrapper}>
            <form className={`card glass ${styles.form}`}>
              <h2>Send a Message</h2>
              <div className={styles.formGroup}>
                <label htmlFor="name">Full Name</label>
                <input type="text" id="name" placeholder="John Doe" />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="email">Email Address</label>
                <input type="email" id="email" placeholder="john@example.com" />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="interest">Primary Interest</label>
                <select id="interest">
                  <option>AI Agents</option>
                  <option>Premium Websites</option>
                  <option>SaaS Dashboards</option>
                  <option>Other</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="message">Message</label>
                <textarea id="message" rows={5} placeholder="Tell us about your project..."></textarea>
              </div>
              <button type="button" className="btn btn-primary" style={{ width: '100%' }}>
                Submit Inquiry
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
