'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ExternalLink, Calendar, User, ArrowRight, Rss } from 'lucide-react';
import styles from './Blog.module.css';

interface BlogPost {
    title: string;
    pubDate: string;
    link: string;
    guid: string;
    author: string;
    thumbnail: string;
    description: string;
}

export default function BlogPage() {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                // Using RSS2JSON to fetch Medium feed
                const res = await fetch('https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@ameyakshirsagar02');
                const data = await res.json();
                if (data.status === 'ok') {
                    setPosts(data.items);
                }
            } catch (error) {
                console.error('Error fetching Medium posts:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    // Improved HTML stripping to preserve spacing between elements
    const formatPreview = (html: string) => {
        const tmp = document.createElement("DIV");
        // Replace block elements with spaces to prevent word mashing
        const spacedHtml = html.replace(/<\/p>|<\/h\d>|<br\s*\/?>/gi, ' ');
        tmp.innerHTML = spacedHtml;
        const text = tmp.textContent || tmp.innerText || "";
        const cleanText = text.replace(/\s+/g, ' ').trim();
        return cleanText.length > 160 ? cleanText.substring(0, 160) + "..." : cleanText;
    };

    return (
        <main className={styles.blogMain}>
            <Navbar />

            <div className="container">
                <header className={styles.header}>
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <span className={styles.label}>Growth Intelligence</span>
                        <h1 className={styles.title}>Insights & <span className="text-gradient">Systems.</span></h1>
                        <p className={styles.subtitle}>
                            Deep dives into the intersection of AI, automation, and strategic growth.
                            We share our playbooks, not just our opinions.
                        </p>
                    </motion.div>
                </header>

                <section className={styles.postsSection}>
                    {loading ? (
                        <div className={styles.grid}>
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div key={i} className={`${styles.skeleton} glass`} />
                            ))}
                        </div>
                    ) : (
                        <div className={styles.grid}>
                            {posts.map((post, index) => (
                                <motion.div
                                    key={post.guid}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <Card className={`${styles.blogCard} glass glass-hover`}>
                                        <div className={styles.imageWrapper}>
                                            {post.thumbnail ? (
                                                <img src={post.thumbnail} alt={post.title} className={styles.thumb} />
                                            ) : (
                                                <div className={styles.placeholderThumb}>
                                                    <Rss className="w-8 h-8 opacity-20" />
                                                </div>
                                            )}
                                            <div className={styles.metadataOverlay}>
                                                <span className={styles.metaItem}><Calendar size={12} /> {new Date(post.pubDate).toLocaleDateString()}</span>
                                            </div>
                                        </div>

                                        <CardContent className={styles.cardContent}>
                                            <div className={styles.authorLine}>
                                                <User size={12} className="text-primary" />
                                                <span>{post.author}</span>
                                            </div>
                                            <h3 className={styles.postTitle}>{post.title}</h3>
                                            <p className={styles.postDesc}>
                                                {formatPreview(post.description)}
                                            </p>

                                            <Button
                                                variant="ghost"
                                                className={styles.readBtn}
                                                onClick={() => window.open(post.link, '_blank')}
                                            >
                                                Read Entry <ArrowRight size={16} className="ml-2" />
                                            </Button>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    )}

                    {!loading && posts.length === 0 && (
                        <div className={styles.emptyState}>
                            <Rss className="w-12 h-12 text-zinc-700 mb-4" />
                            <h3>No broadcasts yet.</h3>
                            <p>Our feed is currently being refreshed. Check back shortly.</p>
                            <Button variant="outline" onClick={() => window.open('https://medium.com/@ameyakshirsagar02', '_blank')}>
                                Visit Medium Directly
                            </Button>
                        </div>
                    )}
                </section>
            </div>

            <Footer />
        </main>
    );
}
