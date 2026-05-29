'use client';

import { useEffect, useRef } from 'react';
import styles from './Starfield.module.css';

export function Starfield() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let stars: { x: number; y: number; size: number; speed: number; opacity: number }[] = [];

        let mouseX = 0;
        let mouseY = 0;
        let targetX = 0;
        let targetY = 0;

        // Higher z = deeper in space (slower movement)
        // We can simulate depth by Z index

        const handleMouseMove = (e: MouseEvent) => {
            mouseX = (e.clientX - window.innerWidth / 2) * 0.1; // Scale factor
            mouseY = (e.clientY - window.innerHeight / 2) * 0.1;
        };

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initStars();
        };

        const initStars = () => {
            const starCount = Math.floor((canvas.width * canvas.height) / 3000);
            stars = [];
            for (let i = 0; i < starCount; i++) {
                stars.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    size: Math.random() * 1.5,
                    speed: Math.random() * 0.2 + 0.05,
                    opacity: Math.random(),
                });
            }
        };

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#FFF';

            // Smooth interpolation for mouse movement
            targetX += (mouseX - targetX) * 0.05;
            targetY += (mouseY - targetY) * 0.05;

            stars.forEach((star) => {
                ctx.globalAlpha = star.opacity;
                ctx.beginPath();

                // Parallax effect: foreground moves faster than background
                // We'll use size as a proxy for depth/closeness (larger = closer)
                const parallaxX = targetX * star.size * 0.5;
                const parallaxY = targetY * star.size * 0.5;

                ctx.arc(star.x + parallaxX, star.y + parallaxY, star.size, 0, Math.PI * 2);
                ctx.fill();

                // Move star upward
                star.y -= star.speed;

                // Reset if off screen (accounting for parallax offset)
                if (star.y < -100) {
                    star.y = canvas.height + 100;
                    star.x = Math.random() * canvas.width;
                }
            });

            animationFrameId = requestAnimationFrame(draw);
        };

        window.addEventListener('resize', resize);
        window.addEventListener('mousemove', handleMouseMove);
        resize();
        draw();

        return () => {
            window.removeEventListener('resize', resize);
            window.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return <canvas ref={canvasRef} className={styles.canvas} />;
}
