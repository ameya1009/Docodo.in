'use client';

import { useState, useEffect } from 'react';

export function useCredits() {
    const [credits, setCredits] = useState<number>(50);

    useEffect(() => {
        const saved = localStorage.getItem('docodo_credits');
        if (saved !== null) {
            setCredits(parseInt(saved, 10));
        } else {
            localStorage.setItem('docodo_credits', '50');
        }

        const handleUpdate = () => {
            const current = localStorage.getItem('docodo_credits');
            if (current !== null) setCredits(parseInt(current, 10));
        };

        window.addEventListener('credits-updated', handleUpdate);
        return () => window.removeEventListener('credits-updated', handleUpdate);
    }, []);

    const updateCredits = (amount: number) => {
        const newTotal = credits + amount;
        localStorage.setItem('docodo_credits', newTotal.toString());
        setCredits(newTotal);
        window.dispatchEvent(new Event('credits-updated'));
    };

    return { credits, updateCredits };
}
