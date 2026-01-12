import { type FC, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import axiosInstance from '../../services/axios';
import toast from 'react-hot-toast';

const loginSchema = z.object({
    username: z.string().min(1, "Identity is required"),
    password: z.string().min(1, "Security pass is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginDropdownProps {
    onSuccess?: () => void;
}

export const LoginDropdown: FC<LoginDropdownProps> = ({ onSuccess }) => {
    const { login, isLoading } = useAuth();
    const [isForgot, setIsForgot] = useState(false);
    const [forgotEmail, setForgotEmail] = useState('');
    const [isForgotLoading, setIsForgotLoading] = useState(false);
    const [isForgotSent, setIsForgotSent] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema)
    });

    const onSubmit = async (data: LoginFormData) => {
        try {
            await login(data);
            onSuccess?.();
        } catch (err) { }
    };

    const handleForgotSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsForgotLoading(true);
        try {
            await axiosInstance.post('/auth/forgot-password', { email: forgotEmail });
            setIsForgotSent(true);
            toast.success('Reset link sent!');
        } catch (err) {
            toast.error('Failed to send reset link');
        } finally {
            setIsForgotLoading(false);
        }
    };

    return (
        <div className="w-[320px] bg-[#0d0f12] border border-white/5 rounded-3xl shadow-2xl relative overflow-hidden">
            <AnimatePresence mode="wait">
                {!isForgot ? (
                    <motion.form
                        key="login"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        onSubmit={handleSubmit(onSubmit)}
                        className="p-8 flex flex-col gap-6"
                    >
                        <div>
                            <h3 className="text-[10px] font-bold text-kickr uppercase tracking-[0.4em] mb-1">Tactical Access</h3>
                            <p className="text-white text-xl font-black tracking-tighter italic uppercase">Welcome</p>
                        </div>

                        <div className="space-y-3">
                            <div className="relative group">
                                <input
                                    type="text"
                                    placeholder="Identity"
                                    {...register("username")}
                                    className={`w-full bg-black/40 border ${errors.username ? 'border-red-500/30' : 'border-white/5'} rounded-2xl px-5 py-3.5 text-xs font-bold text-white placeholder-[#334455] outline-none`}
                                />
                            </div>
                            {errors.username && <p className="text-[9px] text-red-500 font-bold pl-1 uppercase tracking-tighter">{errors.username.message}</p>}

                            <div className="relative group">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Security Pass"
                                    {...register("password")}
                                    className={`w-full bg-black/40 border ${errors.password ? 'border-red-500/30' : 'border-white/5'} rounded-2xl px-5 py-3.5 pr-12 text-xs font-bold text-white placeholder-[#334455] outline-none`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 opacity-30 hover:opacity-100 transition-opacity"
                                >
                                    {showPassword ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                                    )}
                                </button>
                            </div>
                            {errors.password && <p className="text-[9px] text-red-500 font-bold pl-1 uppercase tracking-tighter">{errors.password.message}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-4 rounded-2xl bg-kickr text-white text-[10px] font-black uppercase tracking-[0.3em] hover:brightness-110 transition-all disabled:opacity-30"
                        >
                            {isLoading ? 'Verifying...' : 'Authenticate'}
                        </button>

                        <button
                            type="button"
                            onClick={() => setIsForgot(true)}
                            className="text-[9px] font-black text-[#334455] hover:text-kickr uppercase tracking-[0.2em] transition-colors pt-2"
                        >
                            Forgot Details?
                        </button>
                    </motion.form>
                ) : (
                    <motion.div
                        key="forgot"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        className="p-8 flex flex-col gap-6"
                    >
                        <div>
                            <h3 className="text-[10px] font-bold text-kickr uppercase tracking-[0.4em] mb-1">Recovery</h3>
                            <p className="text-white text-xl font-black tracking-tighter italic uppercase">Restore</p>
                        </div>

                        {!isForgotSent ? (
                            <form onSubmit={handleForgotSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[9px] font-bold text-[#334455] uppercase tracking-[0.2em] pl-1 text-center block">Enter your email</label>
                                    <input
                                        type="email"
                                        required
                                        value={forgotEmail}
                                        onChange={(e) => setForgotEmail(e.target.value)}
                                        placeholder="name@example.com"
                                        className="w-full bg-black/40 border border-white/5 rounded-2xl px-5 py-3.5 text-xs font-bold text-white placeholder-[#334455] outline-none"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isForgotLoading}
                                    className="w-full py-4 rounded-2xl bg-kickr text-white text-[10px] font-black uppercase tracking-[0.3em] hover:brightness-110 transition-all disabled:opacity-30"
                                >
                                    {isForgotLoading ? 'Processing...' : 'Send Link'}
                                </button>
                            </form>
                        ) : (
                            <div className="text-center space-y-6 py-4">
                                <div className="text-2xl">✉️</div>
                                <p className="text-[#99aabb] text-[11px] leading-relaxed font-medium uppercase tracking-wider">
                                    Secure link dispatched. Check your transmission.
                                </p>
                            </div>
                        )}

                        <button
                            type="button"
                            onClick={() => {
                                setIsForgot(false);
                                setIsForgotSent(false);
                            }}
                            className="text-[9px] font-black text-[#334455] hover:text-kickr uppercase tracking-[0.2em] transition-colors"
                        >
                            Back to Login
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const registerSchema = z.object({
    name: z.string().min(3, "Min 3 chars").max(20, "Max 20 chars"),
    email: z.string().email("Invalid tactical email"),
    password: z.string()
        .min(8, "Min 8 chars")
        .regex(/[A-Z]/, "One uppercase")
        .regex(/[a-z]/, "One lowercase")
        .regex(/[0-9]/, "One number"),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export const RegisterDropdown: FC = () => {
    const { register: registerUser, isLoading } = useAuth();

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors }
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
        mode: "onChange"
    });

    const password = watch("password", "");

    // Real-time password validation
    const hasMinLength = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);

    const onSubmit = async (data: RegisterFormData) => {
        try {
            await registerUser(data);
            // Auto-login and toast handled by useAuth
        } catch (err) { }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="p-8 flex flex-col gap-6 bg-[#1b2228] border border-white/5 rounded-xl shadow-2xl">
            <div className="mb-2">
                <h3 className="text-[11px] font-black text-[#667788] uppercase tracking-[0.3em] mb-1">Join the Community</h3>
                <p className="text-white text-xl font-black tracking-tight">Create your Kickr account</p>
            </div>

            <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                    <label className="text-[9px] font-black text-[#445566] uppercase tracking-[0.2em] pl-1">Username</label>
                    <input
                        type="text"
                        placeholder="Choose a username"
                        {...register("name")}
                        className={`bg-[#14181c] border ${errors.name ? 'border-red-500/50' : 'border-white/10'} rounded-lg px-4 py-3.5 text-sm font-medium text-white placeholder-[#445566] focus:border-kickr/40 focus:ring-2 focus:ring-kickr/20 transition-all outline-none`}
                    />
                    {errors.name && <p className="text-[9px] text-red-500 font-bold pl-1 uppercase italic tracking-tighter">{errors.name.message}</p>}
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-[9px] font-black text-[#445566] uppercase tracking-[0.2em] pl-1">Email</label>
                    <input
                        type="email"
                        placeholder="your.email@example.com"
                        {...register("email")}
                        className={`bg-[#14181c] border ${errors.email ? 'border-red-500/50' : 'border-white/10'} rounded-lg px-4 py-3.5 text-sm font-medium text-white placeholder-[#445566] focus:border-kickr/40 focus:ring-2 focus:ring-kickr/20 transition-all outline-none`}
                    />
                    {errors.email && <p className="text-[9px] text-red-500 font-bold pl-1 uppercase italic tracking-tighter">{errors.email.message}</p>}
                </div>

                <div className="flex flex-col gap-3">
                    <label className="text-[9px] font-black text-[#445566] uppercase tracking-[0.2em] pl-1">Security Code</label>
                    <input
                        type="password"
                        placeholder="Create a strong password"
                        {...register("password")}
                        className={`bg-[#14181c] border ${errors.password ? 'border-red-500/30' : 'border-white/5'} rounded-lg px-4 py-3.5 text-sm font-medium text-white placeholder-[#445566] focus:border-kickr/40 transition-all outline-none`}
                    />
                    {errors.password && <p className="text-[9px] text-red-500 font-bold pl-1 uppercase italic tracking-tighter">{errors.password.message}</p>}
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-[9px] font-black text-[#445566] uppercase tracking-[0.2em] pl-1">Confirm Identity</label>
                    <input
                        type="password"
                        placeholder="Repeat your password"
                        {...register("confirmPassword")}
                        className={`bg-[#14181c] border ${errors.confirmPassword ? 'border-red-500/30' : 'border-white/5'} rounded-lg px-4 py-3.5 text-sm font-medium text-white placeholder-[#445566] focus:border-kickr/40 transition-all outline-none`}
                    />
                    {errors.confirmPassword && <p className="text-[9px] text-red-500 font-bold pl-1 uppercase italic tracking-tighter">{errors.confirmPassword.message}</p>}

                    {password.length > 0 && (
                        <div className="bg-white/[0.02] border border-white/5 rounded-lg p-4 space-y-2">
                            <div className="flex items-center gap-2">
                                <span className={`text-sm transition-colors ${hasMinLength ? 'text-kickr' : 'text-[#445566]'}`}>
                                    {hasMinLength ? '✓' : '○'}
                                </span>
                                <span className={`text-[10px] font-bold uppercase tracking-wider transition-colors ${hasMinLength ? 'text-[#99aabb]' : 'text-[#445566]'}`}>
                                    At least 8 characters
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className={`text-sm transition-colors ${hasUppercase ? 'text-kickr' : 'text-[#445566]'}`}>
                                    {hasUppercase ? '✓' : '○'}
                                </span>
                                <span className={`text-[10px] font-bold uppercase tracking-wider transition-colors ${hasUppercase ? 'text-[#99aabb]' : 'text-[#445566]'}`}>
                                    One uppercase letter
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className={`text-sm transition-colors ${hasLowercase ? 'text-kickr' : 'text-[#445566]'}`}>
                                    {hasLowercase ? '✓' : '○'}
                                </span>
                                <span className={`text-[10px] font-bold uppercase tracking-wider transition-colors ${hasLowercase ? 'text-[#99aabb]' : 'text-[#445566]'}`}>
                                    One lowercase letter
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className={`text-sm transition-colors ${hasNumber ? 'text-kickr' : 'text-[#445566]'}`}>
                                    {hasNumber ? '✓' : '○'}
                                </span>
                                <span className={`text-[10px] font-bold uppercase tracking-wider transition-colors ${hasNumber ? 'text-[#99aabb]' : 'text-[#445566]'}`}>
                                    One number
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <button
                type="submit"
                disabled={isLoading}
                className="btn-primary-kickr py-3.5 rounded-lg text-[11px] font-black uppercase tracking-[0.2em] hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
                {isLoading ? 'Creating account...' : 'Create Account'}
            </button>
        </form>
    );
};
