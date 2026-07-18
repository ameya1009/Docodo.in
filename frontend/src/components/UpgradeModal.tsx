import React from 'react';
import { X, Lock, CheckCircle2 } from 'lucide-react';
import styles from './UpgradeModal.module.css';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  featureName: string;
}

export default function UpgradeModal({ isOpen, onClose, featureName }: UpgradeModalProps) {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button className={styles.closeBtn} onClick={onClose}>
          <X size={24} />
        </button>
        
        <div className={styles.iconWrapper}>
          <Lock size={32} />
        </div>
        
        <h2 className={styles.title}>Unlock Premium Features</h2>
        <p className={styles.description}>
          You've built a fantastic prototype for <strong>{featureName}</strong>! 
          To deploy this live and access our full suite of AI capabilities, upgrade to Docodo Premium.
        </p>

        <div className={styles.featuresList}>
          <div className={styles.feature}>
            <CheckCircle2 size={18} className={styles.checkIcon} />
            <span>Unlimited AI Agent Deployments</span>
          </div>
          <div className={styles.feature}>
            <CheckCircle2 size={18} className={styles.checkIcon} />
            <span>Advanced CRM Integrations</span>
          </div>
          <div className={styles.feature}>
            <CheckCircle2 size={18} className={styles.checkIcon} />
            <span>High-Volume Email Campaigns</span>
          </div>
        </div>

        <button className={styles.upgradeBtn} onClick={() => alert('Stripe checkout would open here!')}>
          Upgrade to Premium ($49/mo)
        </button>
        <button className={styles.cancelBtn} onClick={onClose}>
          Continue Prototype
        </button>
      </div>
    </div>
  );
}
