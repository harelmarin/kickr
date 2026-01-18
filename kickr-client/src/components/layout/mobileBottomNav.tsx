import { Link, useLocation } from 'react-router-dom';
import { type ReactNode } from 'react';
import { motion } from 'framer-motion';

export const MobileBottomNav = () => {
    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-kickr-bg-primary/80 backdrop-blur-xl border-t border-white/5 z-50 pb-[env(safe-area-inset-bottom)] shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
            <div className="flex items-center justify-around h-14 px-2">
                <NavItem to="/feed" icon={<FeedIcon />} label="Feed" />
                <NavItem to="/matches" icon={<MatchesIcon />} label="Fixtures" />
                <NavItem to="/" icon={<HomeIcon />} label="Hub" />
                <NavItem to="/competitions" icon={<TrophyIcon />} label="Leagues" />
                <NavItem to="/community" icon={<CommunityIcon />} label="Community" />
            </div>
        </nav>
    );
};

const NavItem = ({ to, icon, label }: { to: string; icon: ReactNode; label: string }) => {
    const location = useLocation();
    const isActive = to === '/'
        ? location.pathname === '/'
        : location.pathname.startsWith(to);

    return (
        <Link to={to} className="relative flex flex-col items-center justify-center w-full h-full gap-0.5 transition-all active:scale-90 active:bg-black/5 group rounded-lg">
            <div className={`relative z-10 w-6 h-6 flex items-center justify-center transition-all duration-300 ${isActive ? 'text-kickr scale-110' : 'text-[#94a3b8] group-hover:text-main'}`}>
                {icon}
            </div>
            <span className={`relative z-10 text-[9px] font-black uppercase tracking-[0.1em] transition-all duration-300 ${isActive ? 'text-kickr' : 'text-[#64748b]'}`}>
                {label}
            </span>
            {isActive && (
                <motion.div
                    layoutId="activeNav"
                    className="absolute inset-x-2 top-0 h-0.5 bg-kickr shadow-[0_0_10px_var(--kickr-primary)]"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
            )}
        </Link>
    );
};

const HomeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
);

const MatchesIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
);

const TrophyIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
        <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
        <path d="M4 22h16" />
        <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
        <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
        <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
);

const CommunityIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
);

const FeedIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 11a9 9 0 0 1 9 9" />
        <path d="M4 4a16 16 0 0 1 16 16" />
        <circle cx="5" cy="19" r="1" />
    </svg>
);
