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
        <form
            onSubmit={handleSubmit}
            className="absolute top-full mt-1 right-0 w-64 bg-primary border border-gray-700 rounded-md shadow-lg p-4 z-50 flex flex-col gap-3"
        >
            {error && (
                <div className="text-red-500 text-xs bg-red-500/10 p-2 rounded">
                    {error}
                </div>
            )}

            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="p-2 rounded bg-gray-800 text-white text-sm w-full border border-gray-700 focus:border-secondary outline-none transition"
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="p-2 rounded bg-gray-800 text-white text-sm w-full border border-gray-700 focus:border-secondary outline-none transition"
            />
            <button
                type="submit"
                disabled={isLoading}
                className="bg-secondary p-2 rounded text-sm hover:opacity-90 transition w-full disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
                {isLoading ? 'Logging in...' : 'Log in'}
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
            // After successful registration, reset form and switch to login
            setName('');
            setEmail('');
            setPassword('');

            // Wait a bit for the toast to show, then switch to login
            setTimeout(() => {
                onSuccess?.();
                onSwitchToLogin?.();
            }, 2000);
        } catch (err) {
            // Error is handled by the useAuth hook
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="absolute top-full mt-1 right-0 w-64 bg-primary border border-gray-700 rounded-md shadow-lg p-4 z-50 flex flex-col gap-3"
        >
            {error && (
                <div className="text-red-500 text-xs bg-red-500/10 p-2 rounded">
                    {error}
                </div>
            )}

            <input
                type="text"
                placeholder="Username"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="p-2 rounded bg-gray-800 text-white text-sm w-full border border-gray-700 focus:border-secondary outline-none transition"
            />
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="p-2 rounded bg-gray-800 text-white text-sm w-full border border-gray-700 focus:border-secondary outline-none transition"
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="p-2 rounded bg-gray-800 text-white text-sm w-full border border-gray-700 focus:border-secondary outline-none transition"
            />
            <button
                type="submit"
                disabled={isLoading}
                className="bg-secondary p-2 rounded text-sm hover:opacity-90 transition w-full disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
                {isLoading ? 'Signing up...' : 'Sign up'}
            </button>
        </form>
    );
};

