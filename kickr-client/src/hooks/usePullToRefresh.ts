import { useState, useEffect, useCallback } from 'react';

interface PullToRefreshOptions {
    onRefresh: () => Promise<void>;
    threshold?: number;
    maxPullDistance?: number;
}

export const usePullToRefresh = ({
    onRefresh,
    threshold = 80,
    maxPullDistance = 120,
}: PullToRefreshOptions) => {
    const [pullDistance, setPullDistance] = useState(0);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [startY, setStartY] = useState(0);

    const handleTouchStart = useCallback((e: TouchEvent) => {
        if (window.scrollY === 0) {
            setStartY(e.touches[0].clientY);
        }
    }, []);

    const handleTouchMove = useCallback((e: TouchEvent) => {
        if (window.scrollY !== 0 || isRefreshing) return;

        const currentY = e.touches[0].clientY;
        const distance = currentY - startY;

        if (distance > 0) {
            e.preventDefault();
            const dampedDistance = Math.min(distance * 0.5, maxPullDistance);
            setPullDistance(dampedDistance);
        }
    }, [startY, isRefreshing, maxPullDistance]);

    const handleTouchEnd = useCallback(async () => {
        if (pullDistance >= threshold && !isRefreshing) {
            setIsRefreshing(true);
            try {
                await onRefresh();
            } finally {
                setIsRefreshing(false);
                setPullDistance(0);
            }
        } else {
            setPullDistance(0);
        }
    }, [pullDistance, threshold, isRefreshing, onRefresh]);

    useEffect(() => {
        const element = document.body;
        element.addEventListener('touchstart', handleTouchStart, { passive: true });
        element.addEventListener('touchmove', handleTouchMove, { passive: false });
        element.addEventListener('touchend', handleTouchEnd);

        return () => {
            element.removeEventListener('touchstart', handleTouchStart);
            element.removeEventListener('touchmove', handleTouchMove);
            element.removeEventListener('touchend', handleTouchEnd);
        };
    }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

    return {
        pullDistance,
        isRefreshing,
        isTriggered: pullDistance >= threshold,
    };
};
