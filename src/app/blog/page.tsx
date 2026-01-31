'use client';

import { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ExternalLink, Calendar, User } from 'lucide-react';

interface BlogPost {
    title: string;
    pubDate: string;
    link: string;
    guid: string;
    author: string;
    thumbnail: string;
    description: string;
    background_image?: string; // Medium sometimes calls it this in RSS
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

    // Helper to strip HTML tags from description for preview
    const stripHtml = (html: string) => {
        const tmp = document.createElement("DIV");
        tmp.innerHTML = html;
        let text = tmp.textContent || tmp.innerText || "";
        return text.length > 150 ? text.substring(0, 150) + "..." : text;
    };

    return (
        <main className="bg-[#050510] min-h-screen">
            <Navbar />

            <div className="pt-32 pb-20 container px-6">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400">
                        Insights & Thoughts
                    </h1>
                    <p className="text-zinc-400 max-w-2xl mx-auto">
                        Deep dives into AI, Automation, and the business of building digital products.
                    </p>
                </div>

                {loading ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-96 rounded-2xl bg-white/5 animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {posts.map((post) => (
                            <Card key={post.guid} className="flex flex-col h-full bg-white/5 border-white/10 hover:border-cyan-500/30 transition-all group overflow-hidden">
                                {post.thumbnail && (
                                    <div className="h-48 w-full overflow-hidden relative">
                                        <img
                                            src={post.thumbnail}
                                            alt={post.title}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                                    </div>
                                )}
                                <CardHeader className="pb-2">
                                    <div className="flex items-center gap-3 text-xs text-zinc-500 mb-3">
                                        <span className="flex items-center gap-1"><Calendar size={12} /> {new Date(post.pubDate).toLocaleDateString()}</span>
                                        <span className="flex items-center gap-1"><User size={12} /> {post.author}</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors line-clamp-2">
                                        {post.title}
                                    </h3>
                                </CardHeader>
                                <CardContent className="flex-1 flex flex-col justify-between pt-0">
                                    <p className="text-sm text-zinc-400 mb-6 line-clamp-3">
                                        {stripHtml(post.description)}
                                    </p>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="w-full justify-between group/btn hover:bg-white hover:text-black hover:border-white"
                                        onClick={() => window.open(post.link, '_blank')}
                                    >
                                        Read on Medium <ExternalLink size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                {!loading && posts.length === 0 && (
                    <div className="text-center py-20 border border-dashed border-white/10 rounded-2xl">
                        <p className="text-zinc-500 mb-4">No recent posts found.</p>
                        <Button onClick={() => window.open('https://medium.com/@ameyakshirsagar02', '_blank')}>
                            Visit Medium Profile
                        </Button>
                    </div>
                )}
            </div>
            <Footer />
        </main>
    );
}
