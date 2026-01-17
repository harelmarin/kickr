import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export const MatchCardPosterSkeleton = () => (
    <div className="flex flex-col gap-3">
        <div className="aspect-[2.5/1] rounded-sm overflow-hidden shadow-2xl">
            <Skeleton height="100%" baseColor="#1b2228" highlightColor="#252a31" />
        </div>
        <div className="flex justify-between items-center px-1 mt-1">
            <Skeleton width={80} height={10} baseColor="#1b2228" highlightColor="#252a31" />
            <Skeleton width={40} height={10} baseColor="#1b2228" highlightColor="#252a31" />
        </div>
    </div>
);

export const MatchCardSkeleton = () => (
    <div className="flex items-center gap-4 p-4 bg-kickr-bg-primary border border-white/5 rounded-sm">
        <div className="flex flex-col gap-1 w-[65px]">
            <Skeleton width={40} height={12} baseColor="#1b2228" highlightColor="#252a31" />
            <Skeleton width={30} height={8} baseColor="#1b2228" highlightColor="#252a31" />
        </div>
        <div className="flex-1 flex items-center justify-center gap-4">
            <div className="flex items-center gap-2 flex-1 justify-end">
                <Skeleton width={60} height={10} baseColor="#1b2228" highlightColor="#252a31" className="hidden md:block" />
                <Skeleton circle width={32} height={32} baseColor="#1b2228" highlightColor="#252a31" />
            </div>
            <div className="w-[60px] flex justify-center">
                <Skeleton width={40} height={20} baseColor="#1b2228" highlightColor="#252a31" />
            </div>
            <div className="flex items-center gap-2 flex-1">
                <Skeleton circle width={32} height={32} baseColor="#1b2228" highlightColor="#252a31" />
                <Skeleton width={60} height={10} baseColor="#1b2228" highlightColor="#252a31" className="hidden md:block" />
            </div>
        </div>
        <div className="w-[90px] flex justify-end">
            <Skeleton width={50} height={10} baseColor="#1b2228" highlightColor="#252a31" />
        </div>
    </div>
);

export const ReviewCardSkeleton = () => (
    <div className="flex gap-5">
        <div className="w-32 h-20 rounded-sm overflow-hidden flex-shrink-0">
            <Skeleton height="100%" baseColor="#1b2228" highlightColor="#252a31" />
        </div>
        <div className="flex flex-col flex-1 gap-2 pt-1">
            <Skeleton width="60%" height={14} baseColor="#1b2228" highlightColor="#252a31" />
            <Skeleton width="40%" height={10} baseColor="#1b2228" highlightColor="#252a31" />
            <Skeleton width="100%" height={30} baseColor="#1b2228" highlightColor="#252a31" className="mt-2" />
        </div>
    </div>
);

export const UserCardSkeleton = () => (
    <div className="bg-kickr-bg-primary/60 backdrop-blur-xl border border-white/5 rounded-sm p-8 flex flex-col items-center gap-6">
        <div className="w-24 h-24 rounded-sm overflow-hidden">
            <Skeleton height="100%" baseColor="#1b2228" highlightColor="#252a31" />
        </div>
        <div className="flex flex-col items-center gap-2 w-full text-center">
            <Skeleton width="70%" height={24} baseColor="#1b2228" highlightColor="#252a31" />
            <Skeleton width="40%" height={10} baseColor="#1b2228" highlightColor="#252a31" />
        </div>
        <div className="w-full h-px bg-black/5 mt-4"></div>
        <div className="grid grid-cols-2 gap-8 w-full">
            <div className="flex flex-col items-center gap-2">
                <Skeleton width={30} height={20} baseColor="#1b2228" highlightColor="#252a31" />
                <Skeleton width={40} height={8} baseColor="#1b2228" highlightColor="#252a31" />
            </div>
            <div className="flex flex-col items-center gap-2">
                <Skeleton width={30} height={20} baseColor="#1b2228" highlightColor="#252a31" />
                <Skeleton width={40} height={8} baseColor="#1b2228" highlightColor="#252a31" />
            </div>
        </div>
    </div>
);

export const LeagueCardSkeleton = () => (
    <div className="flex flex-col gap-4">
        <div className="aspect-square bg-kickr-bg-primary rounded-sm border border-white/5 p-8 flex items-center justify-center relative overflow-hidden">
            <div className="w-full h-full rounded-sm overflow-hidden">
                <Skeleton height="100%" baseColor="#1b2228" highlightColor="#252a31" />
            </div>
        </div>
        <div className="flex flex-col items-center gap-1">
            <Skeleton width="60%" height={10} baseColor="#1b2228" highlightColor="#252a31" />
        </div>
    </div>
);
