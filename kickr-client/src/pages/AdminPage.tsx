import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../services/adminService';
import { authService } from '../services/authService';
import type { User } from '../types/User';
import { NotFoundPage } from './NotFoundPage';
import toast from 'react-hot-toast';

export default function AdminPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');
    const currentUser = authService.getUser();

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            setLoading(true);
            const data = await adminService.getAllUsers();
            setUsers(data);
            setError(null);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    const handlePromote = async (userId: string) => {
        if (!window.confirm('Promote this user to ADMIN?')) return;

        toast.promise(
            adminService.promoteUser(userId).then(() => loadUsers()),
            {
                loading: 'Promoting user...',
                success: 'User promoted to ADMIN',
                error: (err) => err.response?.data?.message || 'Failed to promote user'
            }
        );
    };

    const handleDemote = async (userId: string) => {
        if (!window.confirm('Demote this user to USER?')) return;

        toast.promise(
            adminService.demoteUser(userId).then(() => loadUsers()),
            {
                loading: 'Demoting user...',
                success: 'User demoted to USER',
                error: (err) => err.response?.data?.message || 'Failed to demote user'
            }
        );
    };

    const handleDelete = async (userId: string) => {
        if (!window.confirm('DELETE this user? This cannot be undone!')) return;

        toast.promise(
            adminService.deleteUser(userId).then(() => loadUsers()),
            {
                loading: 'Deleting user...',
                success: 'User deleted successfully',
                error: (err) => err.response?.data?.message || 'Failed to delete user'
            }
        );
    };

    const filteredUsers = useMemo(() => {
        let result = users;

        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            result = result.filter(user =>
                user.name.toLowerCase().includes(query) ||
                user.email.toLowerCase().includes(query)
            );
        }

        if (dateFilter !== 'all') {
            const now = new Date();
            const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

            result = result.filter(user => {
                const userDate = new Date(user.createdAt);

                switch (dateFilter) {
                    case 'today':
                        return userDate >= today;
                    case 'week':
                        const weekAgo = new Date(today);
                        weekAgo.setDate(weekAgo.getDate() - 7);
                        return userDate >= weekAgo;
                    case 'month':
                        const monthAgo = new Date(today);
                        monthAgo.setMonth(monthAgo.getMonth() - 1);
                        return userDate >= monthAgo;
                    default:
                        return true;
                }
            });
        }

        return result;
    }, [users, searchQuery, dateFilter]);

    if (!currentUser || currentUser.role !== 'ADMIN') {
        return <NotFoundPage />;
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0a0b0d] pt-12 px-8">
                <div className="flex flex-col items-center justify-center pt-24 gap-6">
                    <div className="w-8 h-8 border-2 border-white/5 border-t-kickr rounded-full animate-spin"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#0a0b0d] pt-12 px-8">
                <div className="text-center py-16 text-[#ef4444] text-[13px] font-semibold">{error}</div>
            </div>
        );
    }

    const stats = {
        total: users.length,
        admins: users.filter(u => u.role === 'ADMIN').length,
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] bg-[#0a0b0d] pt-12 px-8 pb-8 max-w-[1400px] mx-auto">
            {/* Header */}
            <header className="mb-10 border-b border-white/5 pb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
                <div>
                    <h1 className="display-font text-[28px] text-white mb-2 uppercase italic tracking-tighter">Administration</h1>
                    <p className="text-[10px] text-[#667788] uppercase tracking-[0.2em] font-extrabold">
                        {stats.total} users · {stats.admins} admins
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-6 w-full md:w-auto">
                    {/* Date Filters */}
                    <div className="flex gap-1.5 w-full sm:w-auto">
                        {(['all', 'today', 'week', 'month'] as const).map((filter) => (
                            <button
                                key={filter}
                                onClick={() => setDateFilter(filter)}
                                className={`flex-1 sm:flex-none py-2 px-3.5 rounded border text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${dateFilter === filter
                                    ? 'bg-kickr/15 border-kickr/30 text-kickr'
                                    : 'bg-transparent border-white/5 text-[#667788] hover:border-white/10 hover:bg-white/[0.02] hover:text-[#99aabb]'
                                    }`}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>

                    {/* Search */}
                    <div className="relative w-full sm:w-[320px]">
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-[#14181c] border border-white/5 rounded-md py-3 pr-10 pl-4 text-white text-[13px] font-medium focus:outline-none focus:border-white/10 focus:bg-white/[0.02] transition-all placeholder:text-[#667788] placeholder:font-normal"
                        />
                        {searchQuery && (
                            <button
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#667788] hover:text-white transition-colors text-sm w-6 h-6 flex items-center justify-center"
                                onClick={() => setSearchQuery('')}
                            >
                                ✕
                            </button>
                        )}
                    </div>
                </div>
            </header>

            {/* Table Container */}
            <div className="bg-[#14181c] border border-white/5 rounded-lg overflow-hidden shadow-2xl">
                <div className="overflow-x-auto no-scrollbar">
                    <table className="w-full border-collapse min-w-[700px]">
                        <thead className="bg-black/20 border-b border-white/5">
                            <tr>
                                <th className="py-3.5 px-5 text-left text-[10px] font-black uppercase tracking-[0.15em] text-[#667788]">User</th>
                                <th className="py-3.5 px-5 text-left text-[10px] font-black uppercase tracking-[0.15em] text-[#667788]">Email</th>
                                <th className="py-3.5 px-5 text-left text-[10px] font-black uppercase tracking-[0.15em] text-[#667788]">Role</th>
                                <th className="py-3.5 px-5 text-left text-[10px] font-black uppercase tracking-[0.15em] text-[#667788]">Joined</th>
                                <th className="py-3.5 px-5 text-right text-[10px] font-black uppercase tracking-[0.15em] text-[#667788]"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.03]">
                            {filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="text-center py-10 text-[#667788] text-[12px] font-semibold italic">
                                        No users found
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map(user => (
                                    <tr
                                        key={user.id}
                                        className={`group transition-colors ${user.id === currentUser.id
                                            ? 'bg-kickr/5 hover:bg-kickr/8'
                                            : 'hover:bg-white/[0.02]'
                                            }`}
                                    >
                                        <td className="py-3.5 px-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-7 h-7 rounded bg-kickr/15 border border-kickr/20 text-kickr flex items-center justify-center font-black text-[11px] flex-shrink-0">
                                                    {user.name.charAt(0).toUpperCase()}
                                                </div>
                                                <Link to={`/user/${user.id}`} className="flex items-center gap-6 flex-1 font-bold text-[13px] text-white hover:text-kickr transition-colors">
                                                    {user.name}
                                                    {user.id === currentUser.id && (
                                                        <span className="bg-kickr text-black py-0.5 px-1.5 rounded-[3px] text-[9px] font-black uppercase tracking-tight">You</span>
                                                    )}
                                                </Link>
                                            </div>
                                        </td>
                                        <td className="py-3.5 px-5 text-[#99aabb] text-[12px] font-medium">{user.email}</td>
                                        <td className="py-3.5 px-5 focus-within:ring-0">
                                            <span className={`inline-flex px-2.5 py-1 rounded-[3px] text-[9px] font-black uppercase tracking-widest border ${user.role === 'ADMIN'
                                                ? 'bg-kickr/15 text-kickr border-kickr/20'
                                                : 'bg-white/[0.03] text-[#99aabb] border-white/5'
                                                }`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="py-3.5 px-5 text-[#667788] text-[12px] font-medium">
                                            {new Date(user.createdAt).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric'
                                            })}
                                        </td>
                                        <td className="py-3.5 px-5">
                                            {user.id !== currentUser.id ? (
                                                <div className="flex gap-2 justify-end">
                                                    {user.role === 'USER' ? (
                                                        <button
                                                            className="py-1.5 px-3 border border-white/5 rounded-md text-[10px] font-black uppercase tracking-widest bg-white/[0.02] text-[#99aabb] hover:bg-white/[0.08] hover:border-white/15 hover:text-white hover:-translate-y-px transition-all cursor-pointer"
                                                            onClick={() => handlePromote(user.id)}
                                                        >
                                                            Promote
                                                        </button>
                                                    ) : (
                                                        <button
                                                            className="py-1.5 px-3 border border-white/5 rounded-md text-[10px] font-black uppercase tracking-widest bg-white/[0.02] text-[#99aabb] hover:bg-white/[0.08] hover:border-white/15 hover:text-white hover:-translate-y-px transition-all cursor-pointer"
                                                            onClick={() => handleDemote(user.id)}
                                                        >
                                                            Demote
                                                        </button>
                                                    )}
                                                    <button
                                                        className="py-1.5 px-3 border border-red-500/10 rounded-md text-[10px] font-black uppercase tracking-widest bg-white/[0.02] text-red-500/50 hover:bg-red-500/15 hover:border-red-500 hover:text-red-500 hover:-translate-y-px transition-all cursor-pointer"
                                                        onClick={() => handleDelete(user.id)}
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="text-right pr-4">
                                                    <span className="text-[#667788] text-[12px]">——</span>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
