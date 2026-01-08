import { type FC } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

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

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="p-7 flex flex-col gap-5 bg-[#1b2228]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8)] relative overflow-hidden">
            {/* Top Shine */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-kickr/40 to-transparent"></div>

            <div className="mb-1">
                <h3 className="text-[10px] font-black text-kickr uppercase tracking-[0.4em] mb-1">Scout Access</h3>
                <p className="text-white text-lg font-black tracking-tight italic">Welcome Back</p>
            </div>

            <div className="space-y-3">
                <div className="relative group">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs opacity-40 group-focus-within:opacity-100 group-focus-within:text-kickr transition-all">👤</span>
                    <input
                        type="text"
                        placeholder="Username"
                        {...register("username")}
                        className={`w-full bg-black/40 border ${errors.username ? 'border-red-500/50' : 'border-white/5'} rounded-xl pl-11 pr-4 py-3 text-xs font-bold text-white placeholder-[#445566] focus:border-kickr/40 focus:bg-black/60 transition-all outline-none`}
                    />
                </div>
                {errors.username && <p className="text-[10px] text-red-500 font-bold -mt-3 pl-1 uppercase">{errors.username.message}</p>}

                <div className="relative group">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs opacity-40 group-focus-within:opacity-100 group-focus-within:text-kickr transition-all">🔑</span>
                    <input
                        type="password"
                        placeholder="Password"
                        {...register("password")}
                        className={`w-full bg-black/40 border ${errors.password ? 'border-red-500/50' : 'border-white/5'} rounded-xl pl-11 pr-4 py-3 text-xs font-bold text-white placeholder-[#445566] focus:border-kickr/40 focus:bg-black/60 transition-all outline-none`}
                    />
                </div>
                {errors.password && <p className="text-[10px] text-red-500 font-bold -mt-3 pl-1 uppercase">{errors.password.message}</p>}
            </div>

            <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 rounded-xl bg-kickr text-white text-[10px] font-black uppercase tracking-[0.3em] shadow-lg shadow-kickr/20 hover:brightness-110 active:scale-[0.97] transition-all disabled:opacity-50 mt-1"
            >
                {isLoading ? 'Verifying...' : 'Sign In'}
            </button>

            <div className="text-center">
                <button type="button" className="text-[9px] font-bold text-[#445566] hover:text-[#99aabb] uppercase tracking-widest transition-colors" tabIndex={-1}>
                    Forgot details?
                </button>
            </div>
        </form>
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
            setTimeout(() => {
                onSuccess?.();
                onSwitchToLogin?.();
            }, 2000);
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
                    <label className="text-[9px] font-black text-[#445566] uppercase tracking-[0.2em] pl-1">Password</label>
                    <input
                        type="password"
                        placeholder="Create a strong password"
                        {...register("password")}
                        className={`bg-[#14181c] border ${errors.password ? 'border-red-500/50' : 'border-white/10'} rounded-lg px-4 py-3.5 text-sm font-medium text-white placeholder-[#445566] focus:border-kickr/40 focus:ring-2 focus:ring-kickr/20 transition-all outline-none`}
                    />
                    {errors.password && <p className="text-[9px] text-red-500 font-bold pl-1 uppercase italic tracking-tighter">{errors.password.message}</p>}

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
