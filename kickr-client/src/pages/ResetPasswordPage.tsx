import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axiosInstance from '../services/axios';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

export const ResetPasswordPage = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            toast.error('Invalid reset link');
            navigate('/');
        }
    }, [token, navigate]);

    // Validation patterns
    const hasMinLength = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const matches = password === confirmPassword && password.length > 0;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        setIsLoading(true);
        try {
            await axiosInstance.post('/auth/reset-password', {
                token,
                newPassword: password
            });
            toast.success('Password reset successful! You can now log in.');
            navigate('/');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to reset password');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-[#050607] flex items-center justify-center p-6">
            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-[400px] bg-[#0d0f12] border border-white/5 rounded-3xl p-10 shadow-2xl relative overflow-hidden"
            >
                <div className="mb-10 text-center">
                    <h3 className="text-[10px] font-bold text-kickr uppercase tracking-[0.4em] mb-1">Security Update</h3>
                    <h1 className="text-2xl font-black text-white italic tracking-tighter uppercase mb-2">Secure Access</h1>
                    <p className="text-[#556677] text-xs font-medium">Verify your identity with a new tactical password.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-[#445566] uppercase tracking-[0.2em] pl-1">New Password</label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full bg-black/40 border border-white/5 rounded-2xl px-5 py-4 text-sm font-bold text-white placeholder-[#334455] outline-none"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-[#445566] uppercase tracking-[0.2em] pl-1">Confirm Access</label>
                            <input
                                type="password"
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="••••••••"
                                className={`w-full bg-black/40 border ${confirmPassword && !matches ? 'border-red-500/30' : 'border-white/5'} rounded-2xl px-5 py-4 text-sm font-bold text-white placeholder-[#334455] outline-none`}
                            />
                        </div>
                    </div>

                    <div className="pt-2 pb-1">
                        <div className="grid grid-cols-4 gap-1.5 px-1">
                            <div className={`h-1.5 rounded-full transition-colors duration-500 ${hasMinLength ? 'bg-kickr' : 'bg-white/5'}`}></div>
                            <div className={`h-1.5 rounded-full transition-colors duration-500 ${hasUppercase ? 'bg-kickr' : 'bg-white/5'}`}></div>
                            <div className={`h-1.5 rounded-full transition-colors duration-500 ${hasLowercase ? 'bg-kickr' : 'bg-white/5'}`}></div>
                            <div className={`h-1.5 rounded-full transition-colors duration-500 ${hasNumber ? 'bg-kickr' : 'bg-white/5'}`}></div>
                        </div>
                        <div className="flex justify-between mt-3 px-1">
                            <span className="text-[9px] font-black text-[#556677] uppercase tracking-widest">Strength Matrix</span>
                            <span className={`text-[9px] font-black uppercase tracking-widest transition-colors ${matches ? 'text-kickr' : 'text-[#334455]'}`}>
                                {matches ? 'Synchronized' : 'Waiting'}
                            </span>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading || !hasMinLength || !hasUppercase || !hasLowercase || !hasNumber || !matches}
                        className="w-full py-4 rounded-2xl bg-kickr text-white text-[10px] font-black uppercase tracking-[0.3em] hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-30"
                    >
                        {isLoading ? 'Updating...' : 'Update Password'}
                    </button>
                </form>
            </motion.div>
        </main>
    );
};

const ValidationItem = ({ active, label }: { active: boolean; label: string }) => (
    <div className="flex items-center gap-1.5">
        <span className={`text-[10px] ${active ? 'text-kickr' : 'text-[#445566]'}`}>{active ? '✓' : '○'}</span>
        <span className={`text-[9px] font-bold uppercase tracking-widest ${active ? 'text-[#99aabb]' : 'text-[#445566]'}`}>{label}</span>
    </div>
);
