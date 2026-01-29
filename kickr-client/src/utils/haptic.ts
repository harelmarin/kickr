// Haptic feedback utility for mobile devices
export const triggerHaptic = (type: 'light' | 'medium' | 'heavy' = 'light') => {
    if ('vibrate' in navigator) {
        const patterns = {
            light: 10,
            medium: 20,
            heavy: 30,
        };
        navigator.vibrate(patterns[type]);
    }
};

// Check if device supports haptic feedback
export const supportsHaptic = () => 'vibrate' in navigator;
