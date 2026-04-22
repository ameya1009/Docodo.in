import styles from './InfiniteMarquee.module.css';

const items = [
    "AI GROWTH ENGINES",
    "GTM STRATEGY",
    "REVENUE OPERATIONS",
    "SAAS SCALING",
    "ACCOUNT-BASED MARKETING",
    "CONVERSION ARCHITECTURE",
    "FOUNDER-LED GROWTH",
    "DATA-DRIVEN DESIGN"
];

export function InfiniteMarquee() {
    return (
        <div className={styles.container}>
            <div className={styles.scroll}>
                <div className={styles.track}>
                    {/* Double the items for seamless loop */}
                    {[...items, ...items].map((item, index) => (
                        <div key={index} className={styles.item}>
                            <span className={styles.text}>{item}</span>
                            <span className={styles.dot}>•</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
