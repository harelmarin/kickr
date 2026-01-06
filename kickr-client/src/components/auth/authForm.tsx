import { type FC, useState, type FormEvent } from 'react';
import { useAuth } from '../../hooks/useAuth';

interface LoginDropdownProps {
    onSuccess?: () => void;
}

export const LoginDropdown: FC<LoginDropdownProps> = ({ onSuccess }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { login, isLoading, error } = useAuth();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        try {
            await login({ username, password });
            onSuccess?.();
        } catch (err) {
            // Error is handled by the useAuth hook
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
            <h3 className="text-[10px] font-black text-[#5c6470] uppercase tracking-[0.3em] mb-2">Sign In</h3>

            {error && (
                <div className="text-[10px] font-bold text-[#ff4b4b] bg-[#ff4b4b]/10 p-3 rounded border border-[#ff4b4b]/20 uppercase tracking-widest">
                    {error}
                </div>
            )}

            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="bg-[#14181c] border border-white/10 rounded px-4 py-3 text-[11px] font-bold uppercase tracking-widest text-white placeholder-[#445566] focus:border-white/30 transition-all"
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-[#14181c] border border-white/10 rounded px-4 py-3 text-[11px] font-bold uppercase tracking-widest text-white placeholder-[#445566] focus:border-white/30 transition-all"
            />
            <button
                type="submit"
                disabled={isLoading}
                className="bg-[var(--color-green-primary)] text-black py-3 rounded text-[10px] font-black uppercase tracking-[0.2em] hover:bg-[#3ef87b] transition-all disabled:opacity-50"
            >
                {isLoading ? 'Verifying...' : 'Log in'}
            </button>
        </form>
    );
};

interface RegisterDropdownProps {
    onSuccess?: () => void;
    onSwitchToLogin?: () => void;
}

export const RegisterDropdown: FC<RegisterDropdownProps> = ({ onSuccess, onSwitchToLogin }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { register, isLoading, error } = useAuth();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        try {
            await register({ name, email, password });
            setName('');
            setEmail('');
            setPassword('');
            setTimeout(() => {
                onSuccess?.();
                onSwitchToLogin?.();
            }, 2000);
        } catch (err) { }
    };

    return (
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
            <h3 className="text-[10px] font-black text-[#5c6470] uppercase tracking-[0.3em] mb-2">Create Account</h3>

            {error && (
                <div className="text-[10px] font-bold text-[#ff4b4b] bg-[#ff4b4b]/10 p-3 rounded border border-[#ff4b4b]/20 uppercase tracking-widest">
                    {error}
                </div>
            )}

            <input
                type="text"
                placeholder="Username"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="bg-[#14181c] border border-white/10 rounded px-4 py-3 text-[11px] font-bold uppercase tracking-widest text-white placeholder-[#445566] focus:border-white/30 transition-all"
            />
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-[#14181c] border border-white/10 rounded px-4 py-3 text-[11px] font-bold uppercase tracking-widest text-white placeholder-[#445566] focus:border-white/30 transition-all"
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="bg-[#14181c] border border-white/10 rounded px-4 py-3 text-[11px] font-bold uppercase tracking-widest text-white placeholder-[#445566] focus:border-white/30 transition-all"
            />
            <button
                type="submit"
                disabled={isLoading}
                className="bg-[var(--color-green-primary)] text-black py-3 rounded text-[10px] font-black uppercase tracking-[0.2em] hover:bg-[#3ef87b] transition-all disabled:opacity-50"
            >
                {isLoading ? 'Processing...' : 'Sign up'}
            </button>
        </form>
    );
};
