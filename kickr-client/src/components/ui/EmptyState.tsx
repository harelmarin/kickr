import { motion } from 'framer-motion';

interface EmptyStateProps {
    icon?: string;
    title: string;
    description: string;
    actionLabel?: string;
    onAction?: () => void;
}

export const EmptyState = ({ icon = '📡', title, description, actionLabel, onAction }: EmptyStateProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="py-32 text-center flex flex-col items-center justify-center max-w-md mx-auto"
        >
            <div className="relative mb-8">
                <div className="text-6xl grayscale opacity-30 select-none">{icon}</div>
                <div className="absolute inset-0 bg-kickr/20 blur-3xl rounded-full -z-10 animate-pulse"></div>
            </div>

            <h3 className="text-xl font-black text-main italic uppercase tracking-tighter mb-4 display-font">
                {title}
            </h3>

            <p className="text-secondary text-sm font-medium tracking-tight mb-8 leading-relaxed">
                {description}
            </p>

            {actionLabel && onAction && (
                <button
                    onClick={onAction}
                    className="text-kickr text-[10px] font-black uppercase tracking-[0.3em] hover:text-main transition-all border border-kickr/20 px-6 py-2.5 rounded-sm hover:bg-kickr/5"
                >
                    {actionLabel}
                </button>
            )}
        </motion.div>
    );
};
