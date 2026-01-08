import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../services/adminService';
import { authService } from '../services/authService';
import { isAdminFromToken } from '../utils/jwtUtils';
import type { User } from '../types/User';
import { NotFoundPage } from './NotFoundPage';
import './AdminPage.css';

export default function AdminPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');
    const currentUser = authService.getUser();

    useEffect(() => {
        console.log('[AdminPage] Current user:', currentUser);
        console.log('[AdminPage] Is admin from token:', isAdminFromToken());
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
        if (!confirm('Promote this user to ADMIN?')) return;
        try {
            await adminService.promoteUser(userId);
            await loadUsers();
        } catch (err: any) {
            alert(err.response?.data?.message || 'Failed to promote user');
        }
    };

    const handleDemote = async (userId: string) => {
        if (!confirm('Demote this user to USER?')) return;
        try {
            await adminService.demoteUser(userId);
            await loadUsers();
        } catch (err: any) {
            alert(err.response?.data?.message || 'Failed to demote user');
        }
    };

    const handleDelete = async (userId: string) => {
        if (!confirm('DELETE this user? This cannot be undone!')) return;
        try {
            await adminService.deleteUser(userId);
            await loadUsers();
        } catch (err: any) {
            alert(err.response?.data?.message || 'Failed to delete user');
        }
    };

    const filteredUsers = useMemo(() => {
        let result = users;

        // Filter by search query
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            result = result.filter(user =>
                user.name.toLowerCase().includes(query) ||
                user.email.toLowerCase().includes(query)
            );
        }

        // Filter by date
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
            <div className="admin-page">
                <div className="loading">
                    <div className="loading-spinner"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="admin-page">
                <div className="error-message">{error}</div>
            </div>
        );
    }

    const stats = {
        total: users.length,
        admins: users.filter(u => u.role === 'ADMIN').length,
    };

    return (
        <div className="admin-page">
            <div className="admin-header">
                <div className="admin-header-content">
                    <div>
                        <h1 className="admin-title">Administration</h1>
                        <p className="admin-subtitle">{stats.total} users · {stats.admins} admins</p>
                    </div>

                    <div className="admin-filters">
                        <div className="date-filters">
                            <button
                                className={`filter-btn ${dateFilter === 'all' ? 'active' : ''}`}
                                onClick={() => setDateFilter('all')}
                            >
                                All
                            </button>
                            <button
                                className={`filter-btn ${dateFilter === 'today' ? 'active' : ''}`}
                                onClick={() => setDateFilter('today')}
                            >
                                Today
                            </button>
                            <button
                                className={`filter-btn ${dateFilter === 'week' ? 'active' : ''}`}
                                onClick={() => setDateFilter('week')}
                            >
                                Week
                            </button>
                            <button
                                className={`filter-btn ${dateFilter === 'month' ? 'active' : ''}`}
                                onClick={() => setDateFilter('month')}
                            >
                                Month
                            </button>
                        </div>

                        <div className="search-container">
                            <input
                                type="text"
                                placeholder="Search users..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="search-input"
                            />
                            {searchQuery && (
                                <button
                                    className="search-clear"
                                    onClick={() => setSearchQuery('')}
                                >
                                    ✕
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="users-table-container">
                <table className="users-table">
                    <thead>
                        <tr>
                            <th>User</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Joined</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="no-results">
                                    No users found
                                </td>
                            </tr>
                        ) : (
                            filteredUsers.map(user => (
                                <tr key={user.id} className={user.id === currentUser.id ? 'current-user' : ''}>
                                    <td>
                                        <div className="user-cell">
                                            <div className="user-avatar">
                                                {user.name.charAt(0).toUpperCase()}
                                            </div>
                                            <Link to={`/user/${user.id}`} className="user-name-link">
                                                {user.name}
                                                {user.id === currentUser.id && <span className="badge-you">You</span>}
                                            </Link>
                                        </div>
                                    </td>
                                    <td className="email-cell">{user.email}</td>
                                    <td>
                                        <span className={`role-badge role-${user.role.toLowerCase()}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="date-cell">
                                        {new Date(user.createdAt).toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric'
                                        })}
                                    </td>
                                    <td>
                                        {user.id !== currentUser.id ? (
                                            <div className="action-buttons">
                                                {user.role === 'USER' ? (
                                                    <button
                                                        className="btn-action"
                                                        onClick={() => handlePromote(user.id)}
                                                    >
                                                        Promote
                                                    </button>
                                                ) : (
                                                    <button
                                                        className="btn-action"
                                                        onClick={() => handleDemote(user.id)}
                                                    >
                                                        Demote
                                                    </button>
                                                )}
                                                <button
                                                    className="btn-action btn-delete"
                                                    onClick={() => handleDelete(user.id)}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        ) : (
                                            <span className="text-muted">—</span>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
