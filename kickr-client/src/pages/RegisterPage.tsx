import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useUIStore } from '../hooks/useUIStore';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const registerSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters").max(10, "Name must be less than 10 characters"),
    email: z.string().email("Please enter a valid tactical email"),
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

export const RegisterPage = () => {
    const { register: registerUser, isLoading } = useAuth();
    const { openAuthModal } = useUIStore();
    const navigate = useNavigate();

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

    // Real-time password feedback (for the UI bars)
    const hasMinLength = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);

    const onSubmit = async (data: RegisterFormData) => {
        try {
            await registerUser(data);
            // User is now logged in automatically by the hook
            navigate('/');
        } catch (err) {
            // Error handled in useAuth hook
        }
    };

    return (
        <main className="flex-1 flex flex-col lg:flex-row h-[calc(100vh-52px)] md:h-[calc(100vh-64px)] bg-[#0a0b0d] overflow-hidden">

            {/* Visual / Marketing Side (Left) */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center p-12 border-r border-white/5">
                {/* Background Atmosphere */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-kickr/20 via-black to-black opacity-60"></div>
                    <div
                        className="absolute inset-0 bg-cover bg-center grayscale opacity-30"
                        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=2000")' }}
                    ></div>
                    <div className="absolute inset-x-0 h-full opacity-5 flex items-center justify-center">
                        <div className="w-full h-full bg-gradient-to-br from-kickr/10 to-transparent"></div>
                    </div>
                </div>

                {/* Content */}
                <div className="relative z-10 max-w-lg">
                    <div className="mb-8 inline-flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2 rounded-2xl backdrop-blur-md">
                        <span className="text-[10px] font-black text-kickr uppercase tracking-[0.3em]">Season 2025/26 Live</span>
                    </div>

                    <h1 className="text-4xl xl:text-5xl font-black text-white italic tracking-tighter uppercase leading-[0.9] mb-6">
                        The Pitch <br />
                        Is Yours <br />
                        To <span className="text-kickr">Analyze.</span>
                    </h1>

                    <div className="space-y-6 mt-8">
                        <FeatureItem icon="📝" title="Tactical Diary" description="Log every match you watch with precise ratings and tactical notes." />
                        <FeatureItem icon="🤝" title="Tacticians Network" description="Follow analysts worldwide and discover their vision of the beautiful game." />
                        <FeatureItem icon="📊" title="Personal Stats" description="Visualize your watching habits and favorite teams across the leagues." />
                    </div>
                </div>
            </div>

            {/* Form Side (Right) */}
            <div className="flex-1 flex items-center justify-center p-6 md:p-12 lg:p-16 relative overflow-hidden overflow-y-auto">
                {/* Mobile-only background elements */}
                <div className="lg:hidden absolute inset-0 -z-10 bg-gradient-to-b from-kickr/10 to-transparent opacity-50"></div>

                <div className="w-full max-w-md animate-fade-in-up">
                    <div className="lg:hidden text-center mb-6">
                        <Link to="/" className="inline-flex items-center gap-2 mb-2">
                            <span className="text-xl font-black font-display tracking-tighter text-white">KICKR</span>
                        </Link>
                    </div>

                    <div className="mb-6">
                        <h2 className="text-2xl font-black text-white tracking-tight mb-1">Join the Tacticians</h2>
                        <p className="text-[#667788] text-[11px] font-medium">Create your credentials and start analyzing.</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="space-y-3">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-[#5c6470] uppercase tracking-[0.2em] pl-1">Identity</label>
                                <input
                                    type="text"
                                    placeholder="Your analyst name"
                                    {...register("name")}
                                    className={`w-full bg-[#1b2228]/50 border ${errors.name ? 'border-red-500/50' : 'border-white/5'} rounded-xl px-4 py-3 text-base sm:text-sm font-medium text-white placeholder-[#445566] focus:border-kickr/40 focus:bg-[#1b2228] transition-all outline-none`}
                                />
                                {errors.name && (
                                    <p className="text-[10px] text-red-500 font-bold mt-1 pl-1 uppercase tracking-tighter">{errors.name.message}</p>
                                )}
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-[#5c6470] uppercase tracking-[0.2em] pl-1">Email</label>
                                <input
                                    type="email"
                                    placeholder="name@example.com"
                                    {...register("email")}
                                    className={`w-full bg-[#1b2228]/50 border ${errors.email ? 'border-red-500/50' : 'border-white/5'} rounded-xl px-4 py-3 text-base sm:text-sm font-medium text-white placeholder-[#445566] focus:border-kickr/40 focus:bg-[#1b2228] transition-all outline-none`}
                                />
                                {errors.email && (
                                    <p className="text-[10px] text-red-500 font-bold mt-1 pl-1 uppercase tracking-tighter">{errors.email.message}</p>
                                )}
                            </div>

                            <div className="space-y-3">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-[#5c6470] uppercase tracking-[0.2em] pl-1">Secure Pass</label>
                                    <input
                                        type="password"
                                        placeholder="••••••••"
                                        {...register("password")}
                                        className={`w-full bg-[#1b2228]/50 border ${errors.password ? 'border-red-500/50' : 'border-white/5'} rounded-xl px-4 py-3 text-base sm:text-sm font-medium text-white placeholder-[#445566] focus:border-kickr/40 focus:bg-[#1b2228] transition-all outline-none`}
                                    />
                                    {errors.password && (
                                        <p className="text-[10px] text-red-500 font-bold mt-1 pl-1 uppercase tracking-tighter">{errors.password.message}</p>
                                    )}
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-[#5c6470] uppercase tracking-[0.2em] pl-1">Confirm Identity</label>
                                    <input
                                        type="password"
                                        placeholder="••••••••"
                                        {...register("confirmPassword")}
                                        className={`w-full bg-[#1b2228]/50 border ${errors.confirmPassword ? 'border-red-500/30' : 'border-white/5'} rounded-xl px-4 py-3 text-base sm:text-sm font-medium text-white placeholder-[#445566] outline-none`}
                                    />
                                    {errors.confirmPassword && (
                                        <p className="text-[10px] text-red-500 font-bold mt-1 pl-1 uppercase tracking-tighter">{errors.confirmPassword.message}</p>
                                    )}
                                </div>

                                {/* Password Checker with labels */}
                                <div className="space-y-2">
                                    <div className="grid grid-cols-4 gap-2">
                                        <div className={`h-1.5 rounded-full transition-all duration-300 ${hasMinLength ? 'bg-kickr' : 'bg-white/5'}`}></div>
                                        <div className={`h-1.5 rounded-full transition-all duration-300 ${hasUppercase ? 'bg-kickr' : 'bg-white/5'}`}></div>
                                        <div className={`h-1.5 rounded-full transition-all duration-300 ${hasLowercase ? 'bg-kickr' : 'bg-white/5'}`}></div>
                                        <div className={`h-1.5 rounded-full transition-all duration-300 ${hasNumber ? 'bg-kickr' : 'bg-white/5'}`}></div>
                                    </div>
                                    <div className="flex justify-between px-1">
                                        <span className={`text-[7px] font-bold uppercase tracking-tighter ${hasMinLength ? 'text-kickr' : 'text-[#445566]'}`}>8+ Chars</span>
                                        <span className={`text-[7px] font-bold uppercase tracking-tighter ${hasUppercase ? 'text-kickr' : 'text-[#445566]'}`}>Upper</span>
                                        <span className={`text-[7px] font-bold uppercase tracking-tighter ${hasLowercase ? 'text-kickr' : 'text-[#445566]'}`}>Lower</span>
                                        <span className={`text-[7px] font-bold uppercase tracking-tighter ${hasNumber ? 'text-kickr' : 'text-[#445566]'}`}>Number</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full btn-primary-kickr py-3.5 rounded-xl text-[11px] font-black uppercase tracking-[0.2em] hover:-translate-y-0.5 active:scale-[0.98] transition-all disabled:opacity-50 mt-2"
                        >
                            {isLoading ? 'Processing...' : 'Access the Field'}
                        </button>
                    </form>

                    <div className="mt-6 pt-4 border-t border-white/5 text-center">
                        <p className="text-[#5c6470] text-[11px] font-bold uppercase tracking-widest">
                            Found your credentials?{' '}
                            <button
                                onClick={() => openAuthModal('login')}
                                className="text-kickr hover:text-white transition-colors underline decoration-kickr/20 underline-offset-8 ml-1"
                            >
                                Sign In
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
};

const FeatureItem = ({ icon, title, description }: { icon: string; title: string; description: string }) => (
    <div className="flex gap-4 group">
        <div className="w-9 h-9 rounded-xl bg-white/5 flex-shrink-0 flex items-center justify-center text-base border border-white/10 group-hover:border-kickr/30 group-hover:bg-kickr/5 transition-all">
            {icon}
        </div>
        <div>
            <h3 className="text-white text-sm font-black uppercase tracking-wider mb-1 group-hover:text-kickr transition-colors">{title}</h3>
            <p className="text-[#667788] text-xs leading-relaxed max-w-xs">{description}</p>
        </div>
    </div>
);
