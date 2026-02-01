import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Linkedin, Newspaper, Headphones } from 'lucide-react';
import styles from './Footer.module.css';

export function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.grid}>
                    <div className={styles.brand}>
                        <Link href="/" className={styles.logo}>
                            Docodo<span className={styles.dot}>.</span>
                        </Link>
                        <p className={styles.tagline}>
                            Marketing-as-a-Service for the AI era.
                            <br />Automated. Intelligent. Scalable.
                        </p>
                    </div>

                    <div className={styles.links}>
                        <h4>Platform</h4>
                        <Link href="/services">Services</Link>
                        <Link href="/ai-tools">AI Tools</Link>
                        <Link href="/pricing">Pricing</Link>
                    </div>

                    <div className={styles.links}>
                        <h4>Company</h4>
                        <Link href="/about">About</Link>
                        <Link href="/blog">Blog</Link>
                        <Link href="/contact">Contact</Link>
                    </div>

                    <div className={styles.newsletter}>
                        <h4>Stay Updated</h4>
                        <div className={styles.inputGroup}>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className={styles.input}
                            />
                            <Button size="sm">Subscribe</Button>
                        </div>
                    </div>
                </div>

                <div className={styles.bottom}>
                    <p>&copy; {new Date().getFullYear()} Docodo. All rights reserved.</p>
                    <div className={styles.socials}>
                        <a href="https://www.linkedin.com/in/ameya-kshirsagar-1002" target="_blank" rel="noopener noreferrer" className={styles.socialIcon} title="Founder Profile">
                            <Linkedin size={20} />
                        </a>
                        <a href="https://medium.com/@ameyakshirsagar02" target="_blank" rel="noopener noreferrer" className={styles.socialIcon} title="Writings on AI & Growth">
                            <Newspaper size={20} />
                        </a>
                        {/* Featured Audio Content */}
                        <a href="https://open.spotify.com/episode/1ycc6RT0WXrw8yGM6yzcJk" target="_blank" rel="noopener noreferrer" className={styles.socialIcon} title="Audio Discussions">
                            <Headphones size={20} />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
