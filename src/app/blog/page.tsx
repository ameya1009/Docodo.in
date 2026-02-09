'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { Calendar, ArrowRight, Clock, Tag } from 'lucide-react';
import styles from './Blog.module.css';

interface BlogPost {
    title: string;
    pubDate: string;
    link: string;
    guid: string;
    author: string;
    thumbnail: string;
    description: string;
    categories?: string[];
}

export default function BlogPage() {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
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

    const formatPreview = (html: string) => {
        const tmp = document.createElement("DIV");
        const spacedHtml = html.replace(/<\/p>|<\/h\d>|<br\s*\/?>/gi, ' ');
        tmp.innerHTML = spacedHtml;
        const text = tmp.textContent || tmp.innerText || "";
        const cleanText = text.replace(/\s+/g, ' ').trim();
        return cleanText.length > 200 ? cleanText.substring(0, 200) + "..." : cleanText;
    };

    const firstPost = posts[0];
    const remainingPosts = posts.slice(1);

    return (
        <main className={styles.blogPage}>
            <Navbar />

            <div className="container">
                {/* Editorial Header */}
                <header className={styles.header}>
                    <motion.span
                        className={styles.kicker}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        Growth Broadcaster
                    </motion.span>
                    <h1 className={styles.pageTitle}>Engineering <span className="text-gradient">Insights.</span></h1>
                    <p className={styles.pageSubtitle}>
                        Direct reports from the frontlines of AI, SaaS GTM, and technical growth architecture.
                    </p>
                </header>

                {loading ? (
                    <div className={styles.skeletonContainer}>
                        <div className={styles.featuredSkeleton} />
                        <div className={styles.masonryGrid}>
                            {[1, 2, 3, 4].map(i => <div key={i} className={styles.cardSkeleton} />)}
                        </div>
                    </div>
                ) : (
                    <section className={styles.feedWrapper}>
                        {/* Featured High-End Header */}
                        {firstPost && (
                            <motion.div
                                className={styles.featuredEntry}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <div className={styles.featuredImage}>
                                    <img src={firstPost.thumbnail} alt={firstPost.title} />
                                    <div className={styles.imageOverlay} />
                                </div>
                                <div className={styles.featuredContent}>
                                    <span className={styles.featuredLabel}>Featured Report</span>
                                    <h2 className={styles.featuredTitle}>{firstPost.title}</h2>
                                    <p className={styles.featuredDesc}>{formatPreview(firstPost.description)}</p>
                                    <div className={styles.metaLine}>
                                        <span className={styles.metaItem}><Clock size={14} /> 8 min read</span>
                                        <span className={styles.metaItem}><Calendar size={14} /> {new Date(firstPost.pubDate).toLocaleDateString()}</span>
                                    </div>
                                    <Button
                                        size="lg"
                                        className={styles.primaryReadBtn}
                                        onClick={() => window.open(firstPost.link, '_blank')}
                                    >
                                        Read Full Insight <ArrowRight className="ml-2" />
                                    </Button>
                                </div>
                            </motion.div>
                        )}

                        {/* Masonry-inspired Grid */}
                        <div className={styles.masonryGrid}>
                            {remainingPosts.map((post, idx) => (
                                <motion.div
                                    key={post.guid}
                                    className={`${styles.blogCard} ${idx % 3 === 0 ? styles.wide : ''}`}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                >
                                    {post.thumbnail && (
                                        <div className={styles.cardThumb}>
                                            <img src={post.thumbnail} alt={post.title} />
                                        </div>
                                    )}
                                    <div className={styles.cardBody}>
                                        <div className={styles.cardHeader}>
                                            <span className={styles.tag}><Tag size={12} /> Systems</span>
                                            <span className={styles.date}>{new Date(post.pubDate).toLocaleDateString()}</span>
                                        </div>
                                        <h3 className={styles.cardTitle}>{post.title}</h3>
                                        <p className={styles.cardDesc}>{formatPreview(post.description)}</p>
                                        <button
                                            className={styles.ghostLink}
                                            onClick={() => window.open(post.link, '_blank')}
                                        >
                                            View Report <ArrowRight size={14} />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </section>
                )}
            </div>

            <Footer />
        </main>
    );
}
