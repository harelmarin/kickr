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
        <main className="min-h-screen bg-[#14181c] flex items-center justify-center p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] mix-blend-overlay"></div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-[420px] bg-white/[0.02] border border-white/5 rounded-sm p-12 relative overflow-hidden shadow-2xl"
            >
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-kickr/40 to-transparent"></div>

                <div className="mb-12 text-center">
                    <h3 className="text-[10px] font-black text-kickr uppercase tracking-[0.4em] mb-3 italic">Reset Password</h3>
                    <h1 className="text-3xl font-black text-white italic tracking-tighter uppercase mb-3">Update Access</h1>
                    <p className="text-[#445566] text-[11px] font-black uppercase tracking-widest italic leading-relaxed">Please choose a new secure password.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="space-y-6">
                        <div className="space-y-3">
                            <label className="text-[9px] font-black text-white/20 uppercase tracking-[0.4em] px-1 italic">New Password</label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full bg-[#14181c]/40 border border-white/5 rounded-sm px-5 py-4 text-sm font-black text-white placeholder-white/5 outline-none focus:border-kickr/20 transition-all italic"
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="text-[9px] font-black text-white/20 uppercase tracking-[0.4em] px-1 italic">Confirm Password</label>
                            <input
                                type="password"
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="••••••••"
                                className={`w-full bg-[#14181c]/40 border ${confirmPassword && !matches ? 'border-red-500/30' : 'border-white/5'} rounded-sm px-5 py-4 text-sm font-black text-white placeholder-white/5 outline-none focus:border-kickr/20 transition-all italic`}
                            />
                        </div>
                    </div>

                    <div className="pt-2">
                        <div className="grid grid-cols-4 gap-2">
                            <div className={`h-1 rounded-full transition-all duration-500 ${hasMinLength ? 'bg-kickr shadow-[0_0_8px_rgba(var(--kickr-rgb),0.5)]' : 'bg-white/5'}`}></div>
                            <div className={`h-1 rounded-full transition-all duration-500 ${hasUppercase ? 'bg-kickr shadow-[0_0_8px_rgba(var(--kickr-rgb),0.5)]' : 'bg-white/5'}`}></div>
                            <div className={`h-1 rounded-full transition-all duration-500 ${hasLowercase ? 'bg-kickr shadow-[0_0_8px_rgba(var(--kickr-rgb),0.5)]' : 'bg-white/5'}`}></div>
                            <div className={`h-1 rounded-full transition-all duration-500 ${hasNumber ? 'bg-kickr shadow-[0_0_8px_rgba(var(--kickr-rgb),0.5)]' : 'bg-white/5'}`}></div>
                        </div>
                        <div className="flex justify-between items-center mt-6">
                            <span className="text-[8px] font-black text-white/10 uppercase tracking-[0.4em] italic">Password strength</span>
                            <span className={`text-[8px] font-black uppercase tracking-[0.4em] transition-colors italic ${matches ? 'text-kickr' : 'text-white/10'}`}>
                                {matches ? 'MATCHES' : 'WAITING'}
                            </span>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading || !hasMinLength || !hasUppercase || !hasLowercase || !hasNumber || !matches}
                        className="w-full py-4 rounded-sm bg-kickr text-black text-[10px] font-black uppercase tracking-[0.3em] hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-20 shadow-lg shadow-kickr/5 italic"
                    >
                        {isLoading ? 'UPDATING...' : 'UPDATE PASSWORD'}
                    </button>
                </form>
            </motion.div>
        </main>
    );
};

