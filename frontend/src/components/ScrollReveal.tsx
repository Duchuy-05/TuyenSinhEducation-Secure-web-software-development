import { useEffect, useRef, useState, type ReactNode } from 'react';

interface ScrollRevealProps {
    children: ReactNode;
    className?: string;
}

const shouldShowImmediately = () => {
    if (typeof window === 'undefined') {
        return true;
    }

    return !('IntersectionObserver' in window)
        || window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

const ScrollReveal = ({ children, className = '' }: ScrollRevealProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        if (shouldShowImmediately() || !containerRef.current) {
            return;
        }

        setIsVisible(false);

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (!entry.isIntersecting) {
                    return;
                }

                setIsVisible(true);
                observer.disconnect();
            },
            {
                threshold: 0.15,
                rootMargin: '0px 0px -10% 0px',
            },
        );

        observer.observe(containerRef.current);

        return () => observer.disconnect();
    }, []);

    const classes = [
        'scroll-reveal',
        isVisible ? 'scroll-reveal--visible' : '',
        className,
    ].filter(Boolean).join(' ');

    return (
        <div ref={containerRef} className={classes}>
            {children}
        </div>
    );
};

export default ScrollReveal;
