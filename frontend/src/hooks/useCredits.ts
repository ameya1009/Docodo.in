'use client';

import { useState, useEffect } from 'react';

export function useCredits() {
    const [credits, setCredits] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchCredits = async () => {
        try {
            const res = await fetch('/api/user/credits');
            const data = await res.json();
            if (data.success) {
                setCredits(data.credits);
            }
        } catch (err) {
            console.error('Failed to fetch credits:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCredits();

        const handleUpdate = () => {
            fetchCredits();
        };

        window.addEventListener('credits-updated', handleUpdate);
        return () => window.removeEventListener('credits-updated', handleUpdate);
    }, []);

    const updateCredits = async (amount: number) => {
        // This is now predominantly handled by the server during tool execution or recharge.
        // We trigger a re-fetch to stay in sync.
        window.dispatchEvent(new Event('credits-updated'));
    };

    return { credits, loading, updateCredits, refreshCredits: fetchCredits };
}
