import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../services/adminService';
import { authService } from '../services/authService';
import { reportService } from '../services/reportService';
import type { Report } from '../services/reportService';
import { adminDashboardService } from '../services/adminDashboardService';
import type { DashboardStats } from '../services/adminDashboardService';
import axiosInstance from '../services/axios';
import { NotFoundPage } from './NotFoundPage';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

type Tab = 'dashboard' | 'users' | 'reports';

export default function AdminPage() {
    const [activeTab, setActiveTab] = useState<Tab>('dashboard');
    const currentUser = authService.getUser();

    if (!currentUser || currentUser.role !== 'ADMIN') {
        return <NotFoundPage />;
    }

    return (
        <div className="min-h-[calc(100vh-4rem)] bg-kickr-bg-primary pt-12 px-4 sm:px-8 pb-8 max-w-[1400px] mx-auto">
            {/* Header */}
            <header className="mb-10 border-b border-white/5 pb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
                <div>
                    <h1 className="display-font text-[28px] text-white mb-2 uppercase tracking-tight">Admin Dashboard</h1>
                    <p className="text-[10px] text-kickr uppercase tracking-widest font-bold">System Dashboard · Authorization Level 4</p>
                </div>

                <div className="flex p-1 bg-white/5 rounded-sm w-full md:w-auto overflow-x-auto no-scrollbar">
                    {(['dashboard', 'users', 'reports'] as Tab[]).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`flex-1 md:flex-none px-4 sm:px-6 py-2 rounded-sm text-[9px] sm:text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap italic active:scale-95 ${activeTab === tab
                                ? 'bg-kickr text-white shadow-[0_0_15px_rgba(93,139,255,0.3)]'
                                : 'text-secondary hover:text-main'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </header>

            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                >
                    {activeTab === 'dashboard' && <DashboardTab />}
                    {activeTab === 'users' && <UsersTab />}
                    {activeTab === 'reports' && <ReportsTab />}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}

// --- SUB-COMPONENTS ---

const DashboardTab = () => {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        adminDashboardService.getStats().then(setStats).finally(() => setLoading(false));
    }, []);

    if (loading || !stats) return <LoadingSpinner />;

    return (
        <div className="space-y-10">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard label="Total Users" value={stats.totalUsers} trend={stats.userGrowthTrend} />
                <StatCard label="Total Reviews" value={stats.totalReviews} trend={stats.reviewVolumeTrend} />
                <StatCard label="Resolved Reports" value={stats.totalReports - stats.pendingReports} />
                <StatCard label="Pending Reports" value={stats.pendingReports} warning={stats.pendingReports > 0} />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <ChartSection
                    title="User Acquisition"
                    subtitle="New registrations last 30 days"
                    data={stats.userGrowth}
                    color="#4B7BEC"
                />
                <ChartSection
                    title="Review Activity"
                    subtitle="Match logs volume per day"
                    data={stats.reviewVolume}
                    color="#00D1FF"
                />
            </div>

            {/* Existing Data Management */}
            <section className="bg-kickr-bg-secondary border border-white/5 rounded-sm p-8 poster-shadow">
                <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-kickr mb-8">System Sync Utilities</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <DataSyncCard
                        title="Match Sync"
                        description="Update scores and outcome (±7 days)"
                        endpoint="/matchs/save"
                        params={{}}
                        buttonLabel="Sync"
                        estimatedTime="30s"
                    />
                    <DataSyncCard
                        title="Standings Refresh"
                        description="Recalculate league points and ranking"
                        endpoint="/matchs/save"
                        params={{ allStandings: true }}
                        buttonLabel="Refresh"
                        estimatedTime="2m"
                    />
                    <DataSyncCard
                        title="Historical Backfill"
                        description="Deep sync from start of season"
                        endpoint="/matchs/backfill"
                        params={{}}
                        buttonLabel="Run Backfill"
                        estimatedTime="10m"
                        warning
                    />
                </div>
            </section>
        </div>
    );
};

const UsersTab = () => {
    // Current UsersTab logic from AdminPage.tsx
    // I'll re-implement the user list logic here
    const [pageData, setPageData] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(0);

    useEffect(() => {
        loadUsers(currentPage);
    }, [currentPage]);

    const loadUsers = async (page: number) => {
        setLoading(true);
        try {
            const data = await adminService.getAllUsers(page, 20);
            setPageData(data);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <LoadingSpinner />;

    const users = pageData?.content || [];
    const filteredUsers = users.filter((u: any) =>
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="bg-kickr-bg-secondary border border-white/5 rounded-md overflow-hidden shadow-xl poster-shadow">
            <div className="p-6 border-b border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
                <h2 className="text-[11px] font-bold uppercase tracking-widest text-kickr">User Directory</h2>
                <input
                    type="text"
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-kickr-bg-primary/40 border border-white/10 rounded-md px-4 py-2 text-xs text-white focus:outline-none focus:border-kickr w-full sm:w-64 uppercase italic tracking-widest"
                />
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-kickr-bg-primary/10 text-[#445566] text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em]">
                        <tr>
                            <th className="px-3 md:px-6 py-2 md:py-4">User</th>
                            <th className="px-3 md:px-6 py-2 md:py-4">Status</th>
                            <th className="px-3 md:px-6 py-2 md:py-4 hidden md:table-cell">Auth Level</th>
                            <th className="px-3 md:px-6 py-2 md:py-4 text-right">Sequence</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.03]">
                        {filteredUsers.map((user: any) => (
                            <tr key={user.id} className="hover:bg-white/[0.01] transition-colors">
                                <td className="px-3 md:px-6 py-2 md:py-4">
                                    <Link to={`/user/${user.id}`} className="flex items-center gap-2 md:gap-3 group/user">
                                        <div className="w-6 h-6 md:w-8 md:h-8 rounded-sm bg-kickr/10 border border-kickr/20 flex items-center justify-center font-black text-[10px] md:text-xs text-kickr overflow-hidden group-hover/user:border-kickr/50 transition-colors">
                                            {user.avatarUrl ? (
                                                <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                                            ) : (
                                                user.name[0].toUpperCase()
                                            )}
                                        </div>
                                        <div>
                                            <div className="text-[10px] md:text-sm font-black text-white group-hover/user:text-kickr transition-colors">{user.name}</div>
                                            <div className="text-[8px] md:text-[10px] text-[#445566] font-medium hidden md:block">{user.email}</div>
                                        </div>
                                    </Link>
                                </td>
                                <td className="px-3 md:px-6 py-2 md:py-4">
                                    <span className="inline-flex items-center px-1.5 md:px-2 py-0.5 rounded-sm text-[8px] md:text-[10px] font-black uppercase tracking-tighter bg-rating/10 text-rating border border-rating/20">
                                        Active
                                    </span>
                                </td>
                                <td className="px-3 md:px-6 py-2 md:py-4 hidden md:table-cell">
                                    <span className={`text-[8px] md:text-[10px] font-black uppercase tracking-widest ${user.role === 'ADMIN' ? 'text-kickr' : 'text-secondary'}`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-3 md:px-6 py-2 md:py-4 text-right">
                                    <div className="flex justify-end gap-1 md:gap-2">
                                        {user.role === 'USER' ? (
                                            <button onClick={() => adminService.promoteUser(user.id).then(() => loadUsers(currentPage))} className="p-1.5 md:p-2 hover:bg-kickr/10 rounded-sm text-kickr transition-all">↑</button>
                                        ) : (
                                            <button onClick={() => adminService.demoteUser(user.id).then(() => loadUsers(currentPage))} className="p-1.5 md:p-2 hover:bg-kickr/10 rounded-sm text-kickr transition-all">↓</button>
                                        )}
                                        <button onClick={() => adminService.deleteUser(user.id).then(() => loadUsers(currentPage))} className="p-1.5 md:p-2 hover:bg-red-500/10 rounded-sm text-red-500 transition-all">×</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {pageData && pageData.totalPages > 1 && (
                <div className="p-6 border-t border-white/5 flex items-center justify-between bg-black/[0.1]">
                    <div className="text-[10px] text-[#445566] font-black uppercase tracking-widest italic">
                        Page {pageData.number + 1} / {pageData.totalPages}
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                            disabled={pageData.first}
                            className="group flex items-center gap-2 px-6 py-2.5 bg-kickr-bg-secondary border border-white/5 rounded-sm text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] text-secondary hover:text-kickr hover:border-kickr/40 disabled:opacity-5 transition-all italic active:scale-95"
                        >
                            <span className="text-sm group-hover:-translate-x-1 transition-transform leading-none mb-0.5">←</span>
                            PREV
                        </button>
                        <button
                            onClick={() => setCurrentPage(prev => Math.min(pageData.totalPages - 1, prev + 1))}
                            disabled={pageData.last}
                            className="group flex items-center gap-2 px-6 py-2.5 bg-kickr text-white rounded-sm text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] hover:brightness-110 disabled:opacity-5 transition-all italic shadow-[0_0_20px_rgba(93,139,255,0.2)] active:scale-95"
                        >
                            NEXT
                            <span className="text-sm group-hover:translate-x-1 transition-transform leading-none mb-0.5">→</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

const ReportsTab = () => {
    const [reports, setReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState(true);

    const loadReports = async () => {
        setLoading(true);
        try {
            const data = await reportService.getAllReports();
            setReports(data);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadReports();
    }, []);

    const handleAction = async (reportId: string, status: 'RESOLVED' | 'REJECTED') => {
        await reportService.updateStatus(reportId, status);
        toast.success(`Report marked as ${status}`);
        loadReports();
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
                {reports.length === 0 ? (
                    <div className="bg-kickr-bg-primary border border-white/5 rounded-sm p-32 text-center">
                        <p className="text-kickr text-[24px] mb-4">🛡️</p>
                        <p className="text-[#445566] text-[10px] font-black uppercase tracking-[0.4em]">Sector Secured</p>
                        <p className="text-secondary text-[11px] font-bold uppercase mt-2 italic">Zero active incidents detected in current buffer</p>
                    </div>
                ) : (
                    reports.map(report => (
                        <div key={report.id} className="bg-kickr-bg-secondary border border-white/5 rounded-sm p-4 md:p-8 hover:border-kickr/20 transition-all poster-shadow">
                            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 md:gap-8">
                                <div className="space-y-4 md:space-y-6 flex-1">
                                    <div className="flex items-center gap-2 md:gap-3 flex-wrap">
                                        <span className={`px-2 py-0.5 rounded-sm text-[8px] md:text-[9px] font-black uppercase tracking-widest ${report.status === 'PENDING' ? 'bg-kickr/10 text-kickr border border-kickr/20' :
                                            report.status === 'RESOLVED' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' :
                                                'bg-white/5 text-[#445566] border border-white/10'
                                            }`}>
                                            {report.status}
                                        </span>
                                        <span className="text-[9px] md:text-[10px] font-black text-kickr uppercase tracking-[0.2em] italic">{report.targetType}</span>
                                        <span className="text-[9px] md:text-[10px] font-black text-main/40 uppercase tracking-[0.2em]">REASON: <span className="text-white">{report.reason}</span></span>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                        <div>
                                            <div className="flex items-center justify-between mb-2">
                                                <p className="text-[8px] md:text-[9px] text-[#445566] uppercase tracking-[0.3em] font-black italic">REPORTED CONTENT</p>
                                                <Link
                                                    to={report.targetType === 'MATCH_REVIEW' ? `/reviews/${report.targetId}` : `/reviews/${report.targetId}`} // Assuming comments also live on reviews for now, or need specific linking
                                                    target="_blank"
                                                    className="text-[8px] md:text-[9px] font-black text-kickr hover:underline uppercase tracking-widest italic"
                                                >
                                                    View Source ↗
                                                </Link>
                                            </div>
                                            <div className="text-[10px] md:text-[12px] text-main/80 leading-relaxed bg-white/[0.02] border border-white/5 p-3 md:p-4 rounded-sm italic">
                                                {report.targetType === 'MATCH_REVIEW' ? 'Review content encrypted in external node...' : 'Target comment trace found...'}
                                                <p className="mt-2 text-[8px] md:text-[10px] text-[#445566] non-italic font-medium">// ID: {report.targetId}</p>
                                            </div>
                                        </div>

                                        <div>
                                            <p className="text-[8px] md:text-[9px] text-[#445566] uppercase tracking-[0.3em] font-black italic mb-2">REPORTER JUSTIFICATION</p>
                                            <p className="text-[10px] md:text-[12px] text-[#99aabb] leading-relaxed bg-kickr-bg-primary/40 border border-white/5 p-3 md:p-4 rounded-sm italic h-full">
                                                "{report.description || 'No additional intelligence provided'}"
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 md:gap-4 text-[9px] md:text-[10px] pt-3 md:pt-4 border-t border-white/5">
                                        <span className="text-secondary font-bold uppercase tracking-widest text-[7px] md:text-[8px]">Origin: <span className="text-white italic">{report.reporter.name}</span></span>
                                        <span className="text-[#445566]">●</span>
                                        <span className="text-secondary font-bold uppercase tracking-widest text-[7px] md:text-[8px]">{new Date(report.createdAt).toLocaleString().toUpperCase()}</span>
                                    </div>
                                </div>

                                <div className="flex flex-row sm:flex-col gap-2 w-full sm:w-auto">
                                    <button
                                        onClick={() => handleAction(report.id, 'RESOLVED')}
                                        className="flex-1 sm:w-32 py-2 md:py-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[9px] md:text-[10px] font-black uppercase tracking-widest rounded-sm hover:bg-emerald-500/20 transition-all italic"
                                    >
                                        Resolve
                                    </button>
                                    <button
                                        onClick={() => handleAction(report.id, 'REJECTED')}
                                        className="flex-1 sm:w-32 py-2 md:py-3 bg-white/5 border border-white/10 text-secondary text-[9px] md:text-[10px] font-black uppercase tracking-widest rounded-sm hover:bg-white/10 transition-all italic"
                                    >
                                        Reject
                                    </button>
                                    <button
                                        onClick={() => reportService.deleteReport(report.id).then(loadReports)}
                                        className="flex-1 sm:w-32 py-2 md:py-3 bg-red-500/10 border border-red-500/20 text-red-500 text-[9px] md:text-[10px] font-black uppercase tracking-widest rounded-sm hover:bg-red-500/20 transition-all italic"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

// --- UTILS ---

const StatCard = ({ label, value, trend, warning }: any) => (
    <div className={`bg-kickr-bg-secondary border rounded-sm p-3 md:p-6 poster-shadow ${warning ? 'border-kickr/40' : 'border-white/5'}`}>
        <p className="text-[10px] font-black text-secondary uppercase tracking-widest mb-4 italic">// {label}</p>
        <div className="flex items-end justify-between">
            <h3 className={`text-2xl md:text-4xl font-black italic tracking-tighter ${warning ? 'text-kickr' : 'text-white'}`}>{value}</h3>
            {trend && <span className="text-emerald-500 text-[10px] font-bold mb-1">{trend}</span>}
        </div>
    </div>
);

const ChartSection = ({ title, subtitle, data, color }: any) => {
    const maxVal = Math.max(...data.map((d: any) => d.count), 1);

    return (
        <div className="bg-kickr-bg-secondary border border-white/5 rounded-sm p-4 md:p-8 poster-shadow">
            <div className="mb-6 md:mb-10">
                <h3 className="text-lg md:text-xl font-black text-white uppercase italic tracking-tighter mb-1">{title}</h3>
                <p className="text-[8px] md:text-[10px] text-[#445566] uppercase tracking-[0.2em] font-black italic">{subtitle}</p>
            </div>

            <div className="h-48 md:h-60 flex items-end gap-1 md:gap-2 px-1 md:px-2">
                {data.map((d: any, i: number) => (
                    <div key={i} className="flex-1 group relative">
                        <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: `${(d.count / maxVal) * 100}%` }}
                            className="w-full rounded-t-sm transition-all duration-500 group-hover:opacity-80"
                            style={{ backgroundColor: color, opacity: 0.3 + (d.count / maxVal) * 0.7 }}
                        />
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-white text-black text-[7px] md:text-[9px] font-black px-1.5 py-0.5 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity">
                            {d.count}
                        </div>
                    </div>
                ))}
            </div>
            {data.length === 0 && (
                <div className="h-48 md:h-60 flex items-center justify-center border border-dashed border-white/5 rounded-sm">
                    <p className="text-[8px] md:text-[10px] text-[#445566] uppercase tracking-widest font-black">Data acquisition in progress...</p>
                </div>
            )}
            <div className="mt-4 md:mt-6 flex justify-between border-t border-white/5 pt-3 md:pt-4">
                <span className="text-[7px] md:text-[9px] font-black text-[#445566] uppercase tracking-widest">T-30 Days</span>
                <span className="text-[7px] md:text-[9px] font-black text-[#445566] uppercase tracking-widest">Present</span>
            </div>
        </div>
    );
};

const LoadingSpinner = () => (
    <div className="py-20 flex flex-col items-center justify-center gap-4">
        <div className="w-10 h-10 border-2 border-white/5 border-t-kickr rounded-full animate-spin" />
        <p className="text-[10px] text-kickr/40 font-bold uppercase tracking-widest animate-pulse">Loading Admin Data</p>
    </div>
);

// RE-USE existing components
interface DataSyncCardProps {
    title: string;
    description: string;
    endpoint: string;
    params: Record<string, any>;
    buttonLabel: string;
    estimatedTime: string;
    warning?: boolean;
}

const DataSyncCard = ({ title, description, endpoint, params, buttonLabel, estimatedTime, warning }: DataSyncCardProps) => {
    const [syncing, setSyncing] = useState(false);

    const handleSync = async () => {
        if (warning && !window.confirm(`Action critical. Estimated duration: ${estimatedTime}. Confirm execution?`)) return;
        setSyncing(true);
        const toastId = toast.loading(`${title} initializing...`);
        try {
            await axiosInstance.get(endpoint, { params });
            toast.success(`${title} payload deployed!`, { id: toastId });
        } catch (error: any) {
            toast.error(error.response?.data?.message || `${title} failure`, { id: toastId });
        } finally {
            setSyncing(false);
        }
    };

    return (
        <div className="bg-kickr-bg-primary/20 border border-white/5 rounded-sm p-4 md:p-6 hover:bg-white/[0.02] transition-all group">
            <h3 className="text-xs md:text-sm font-black text-white uppercase italic tracking-tight mb-2 group-hover:text-kickr transition-colors">{title}</h3>
            <p className="text-[10px] md:text-[11px] text-secondary font-medium mb-4 md:mb-6 leading-relaxed">{description}</p>
            <div className="flex items-center justify-between">
                <span className="text-[8px] md:text-[9px] text-[#445566] font-black uppercase tracking-widest">{estimatedTime}</span>
                <button
                    onClick={handleSync}
                    disabled={syncing}
                    className={`py-1.5 md:py-2 px-3 md:px-5 rounded-sm text-[8px] md:text-[10px] font-black uppercase tracking-widest transition-all ${warning
                        ? 'bg-kickr/10 border border-kickr/20 text-kickr hover:bg-kickr/20'
                        : 'bg-white/5 border border-white/10 text-white hover:bg-white/10'
                        }`}
                >
                    {syncing ? 'Running...' : buttonLabel}
                </button>
            </div>
        </div>
    );
};
