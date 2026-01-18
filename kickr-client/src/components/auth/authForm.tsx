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
        <div className="w-full sm:w-[350px] bg-kickr-bg-primary border-x border-b sm:border border-white/10 rounded-b-sm sm:rounded-sm shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-kickr/40 to-transparent"></div>
            <AnimatePresence mode="wait">
                {!isForgot ? (
                    <motion.form
                        key="login"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        onSubmit={handleSubmit(onSubmit)}
                        className="p-6 sm:p-8 flex flex-col gap-6"
                    >
                        <div>
                            <h3 className="text-[11px] font-black text-kickr uppercase tracking-[0.4em] mb-2 italic px-0.5">Kickr Access</h3>
                            <p className="text-main text-2xl font-black tracking-tighter italic uppercase leading-none display-font">Authorization</p>
                        </div>

                        <div className="space-y-4">
                            <div className="relative group">
                                <input
                                    type="text"
                                    placeholder="Username"
                                    {...register("username")}
                                    className={`w-full bg-black/[0.02] border ${errors.username ? 'border-red-500/30' : 'border-white/5'} rounded-sm px-5 py-4 text-xs font-black text-main placeholder-white/30 outline-none focus:border-kickr/20 transition-all italic`}
                                />
                            </div>
                            {errors.username && <p className="text-[11px] text-red-500 font-black pl-1 uppercase tracking-tighter italic">{errors.username.message}</p>}

                            <div className="relative group">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Password"
                                    {...register("password")}
                                    className={`w-full bg-black/[0.02] border ${errors.password ? 'border-red-500/30' : 'border-white/5'} rounded-sm px-5 py-4 pr-12 text-xs font-black text-main placeholder-white/30 outline-none focus:border-kickr/20 transition-all italic`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 opacity-20 hover:opacity-100 transition-opacity"
                                >
                                    {showPassword ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                                    )}
                                </button>
                            </div>
                            {errors.password && <p className="text-[9px] text-red-500 font-black pl-1 uppercase tracking-tighter italic">{errors.password.message}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-4 rounded-sm bg-kickr text-black text-[12px] font-black uppercase tracking-[0.3em] hover:brightness-110 transition-all disabled:opacity-30 italic shadow-lg shadow-kickr/5"
                        >
                            {isLoading ? 'VERIFYING...' : 'AUTHENTICATE'}
                        </button>

                        <button
                            type="button"
                            onClick={() => setIsForgot(true)}
                            className="text-[11px] font-black text-main/40 hover:text-kickr uppercase tracking-[0.3em] transition-all pt-2 italic"
                        >
                            [ FORGOT DETAILS? ]
                        </button>
                    </motion.form>
                ) : (
                    <motion.div
                        key="forgot"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="p-8 flex flex-col gap-6"
                    >
                        <div>
                            <h3 className="text-[12px] font-black text-kickr uppercase tracking-[0.4em] mb-2 italic">Forgot Password</h3>
                            <p className="text-main text-xl font-black tracking-tighter italic uppercase leading-none">Reset Access</p>
                        </div>

                        {!isForgotSent ? (
                            <form onSubmit={handleForgotSubmit} className="space-y-6">
                                <div className="space-y-3">
                                    <label className="text-[11px] font-black text-main/40 uppercase tracking-[0.3em] pl-1 block italic">Email Adress</label>
                                    <input
                                        type="email"
                                        required
                                        value={forgotEmail}
                                        onChange={(e) => setForgotEmail(e.target.value)}
                                        placeholder="Enter your email"
                                        className="w-full bg-black/[0.02] border border-white/5 rounded-sm px-5 py-4 text-xs font-black text-main placeholder-white/30 outline-none focus:border-kickr/20 transition-all italic"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isForgotLoading}
                                    className="w-full py-4 rounded-sm bg-kickr text-black text-[12px] font-black uppercase tracking-[0.3em] hover:brightness-110 transition-all disabled:opacity-30 italic shadow-lg shadow-kickr/5"
                                >
                                    {isForgotLoading ? 'PROCESSING...' : 'SEND RESET LINK'}
                                </button>
                            </form>
                        ) : (
                            <div className="text-center space-y-6 py-6 border border-dashed border-kickr/20 bg-kickr/[0.02] rounded-sm">
                                <div className="text-3xl animate-bounce">✉️</div>
                                <p className="text-kickr/60 text-[10px] leading-relaxed font-black uppercase tracking-[0.2em] italic px-4">
                                    Reset link sent. Please check your inbox.
                                </p>
                            </div>
                        )}

                        <button
                            type="button"
                            onClick={() => {
                                setIsForgot(false);
                                setIsForgotSent(false);
                            }}
                            className="text-[11px] font-black text-main/40 hover:text-kickr uppercase tracking-[0.3em] transition-all italic"
                        >
                            [ BACK TO LOGIN ]
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

interface RegisterDropdownProps {
    onSuccess?: () => void;
    onSwitchToLogin?: () => void;
}

export const RegisterDropdown: FC<RegisterDropdownProps> = ({ onSuccess, onSwitchToLogin }) => {
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
            onSuccess?.();
            // Auto-login and toast handled by useAuth
        } catch (err) { }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="w-full sm:w-[450px] p-6 sm:p-10 flex flex-col gap-8 bg-kickr-bg-primary border-x border-b sm:border border-white/10 rounded-b-sm sm:rounded-sm shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-kickr/40 to-transparent"></div>

            <div className="mb-4">
                <h3 className="text-[11px] font-black text-kickr uppercase tracking-[0.4em] mb-2 italic px-0.5">System Enrollment</h3>
                <p className="text-main text-3xl font-black tracking-tighter italic uppercase leading-none display-font">New Member</p>
            </div>

            <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-3">
                    <label className="text-[11px] font-black text-main/40 uppercase tracking-[0.4em] pl-1 italic">Username</label>
                    <input
                        type="text"
                        placeholder="CHOOSE_IDENTITY"
                        {...register("name")}
                        className={`bg-black/[0.02] border ${errors.name ? 'border-red-500/30' : 'border-white/5'} rounded-sm px-5 py-4 text-xs font-black text-main placeholder-white/30 outline-none focus:border-kickr/20 transition-all italic`}
                    />
                    {errors.name && <p className="text-[11px] text-red-500 font-black pl-1 uppercase tracking-tighter italic">{errors.name.message}</p>}
                </div>

                <div className="flex flex-col gap-3">
                    <label className="text-[11px] font-black text-main/40 uppercase tracking-[0.4em] pl-1 italic">Communication Link</label>
                    <input
                        type="email"
                        placeholder="ENCRYPTED@SIGNAL.MAIL"
                        {...register("email")}
                        className={`bg-black/[0.02] border ${errors.email ? 'border-red-500/30' : 'border-white/5'} rounded-sm px-5 py-4 text-xs font-black text-main placeholder-white/30 outline-none focus:border-kickr/20 transition-all italic`}
                    />
                    {errors.email && <p className="text-[11px] text-red-500 font-black pl-1 uppercase tracking-tighter italic">{errors.email.message}</p>}
                </div>

                <div className="flex flex-col gap-3">
                    <label className="text-[11px] font-black text-main/40 uppercase tracking-[0.4em] pl-1 italic">Security Pass</label>
                    <input
                        type="password"
                        placeholder="CREATE_ENCRYPTION_PASS"
                        {...register("password")}
                        className={`bg-black/[0.02] border ${errors.password ? 'border-red-500/30' : 'border-white/5'} rounded-sm px-5 py-4 text-xs font-black text-main placeholder-white/30 outline-none focus:border-kickr/20 transition-all italic`}
                    />
                    {errors.password && <p className="text-[11px] text-red-500 font-black pl-1 uppercase tracking-tighter italic">{errors.password.message}</p>}
                </div>

                <div className="flex flex-col gap-3">
                    <label className="text-[11px] font-black text-main/40 uppercase tracking-[0.4em] pl-1 italic">Confirm Security</label>
                    <input
                        type="password"
                        placeholder="VERIFY_ENCRYPTION_PASS"
                        {...register("confirmPassword")}
                        className={`bg-black/[0.02] border ${errors.confirmPassword ? 'border-red-500/30' : 'border-white/5'} rounded-sm px-5 py-4 text-xs font-black text-main placeholder-white/30 outline-none focus:border-kickr/20 transition-all italic`}
                    />
                    {errors.confirmPassword && <p className="text-[11px] text-red-500 font-black pl-1 uppercase tracking-tighter italic">{errors.confirmPassword.message}</p>}

                    {password.length > 0 && (
                        <div className="bg-white/[0.01] border border-white/5 rounded-sm p-6 space-y-3 mt-2">
                            <div className="text-[10px] font-black text-main/30 uppercase tracking-[0.3em] mb-2 italic">Security Checklist</div>
                            <div className="flex items-center gap-3">
                                <div className={`w-1.5 h-1.5 rounded-full ${hasMinLength ? 'bg-kickr' : 'bg-black/10'}`}></div>
                                <span className={`text-[11px] font-black uppercase tracking-widest italic transition-colors ${hasMinLength ? 'text-main/60' : 'text-main/20'}`}>
                                    Minimum 8 Characters
                                </span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className={`w-1.5 h-1.5 rounded-full ${hasUppercase ? 'bg-kickr' : 'bg-black/10'}`}></div>
                                <span className={`text-[11px] font-black uppercase tracking-widest italic transition-colors ${hasUppercase ? 'text-main/60' : 'text-main/20'}`}>
                                    Alpha-Upper Requirement
                                </span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className={`w-1.5 h-1.5 rounded-full ${hasLowercase ? 'bg-kickr' : 'bg-black/10'}`}></div>
                                <span className={`text-[11px] font-black uppercase tracking-widest italic transition-colors ${hasLowercase ? 'text-main/60' : 'text-main/20'}`}>
                                    Alpha-Lower Requirement
                                </span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className={`w-1.5 h-1.5 rounded-full ${hasNumber ? 'bg-kickr' : 'bg-black/10'}`}></div>
                                <span className={`text-[11px] font-black uppercase tracking-widest italic transition-colors ${hasNumber ? 'text-main/60' : 'text-main/20'}`}>
                                    Numeric Requirement
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 rounded-sm bg-kickr text-black text-[12px] font-black uppercase tracking-[0.3em] hover:brightness-110 transition-all disabled:opacity-30 italic shadow-lg shadow-kickr/5 mt-4"
            >
                {isLoading ? 'ENROLLING...' : 'INITIALIZE ACCOUNT'}
            </button>

            {onSwitchToLogin && (
                <button
                    type="button"
                    onClick={onSwitchToLogin}
                    className="text-[11px] font-black text-main/40 hover:text-kickr uppercase tracking-[0.3em] transition-all pt-2 mx-auto italic"
                >
                    [ ALREADY AUTHORIZED? LOGIN ]
                </button>
            )}
        </form>
    );
};
