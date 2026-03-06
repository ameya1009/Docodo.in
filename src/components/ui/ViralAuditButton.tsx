'use client';

import React from 'react';
import { Twitter } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface ViralAuditButtonProps {
    potential: string;
}

export function ViralAuditButton({ potential }: ViralAuditButtonProps) {
    const shareToTwitter = () => {
        const text = `Just got my free Docodo Growth Audit — +₹${potential}/month potential! Engineered scaling for Pune SMBs. 🚀 #PuneSMBGrowth #DocodoAI`;
        const url = 'https://docodo.in';
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
    };

    return (
        <Button
            onClick={shareToTwitter}
            variant="outline"
            className="gap-2 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10"
        >
            <Twitter size={16} fill="currentColor" /> Share Your Audit Result
        </Button>
    );
}
