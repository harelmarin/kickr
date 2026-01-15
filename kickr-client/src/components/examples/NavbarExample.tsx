import { type FC, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { LoginDropdown, RegisterDropdown, UserMenu } from '../auth';

/**
 * Exemple de barre de navigation avec authentification
 */
export const NavbarExample: FC = () => {
    const { isAuthenticated } = useAuth();
    const [showLogin, setShowLogin] = useState(false);
    const [showRegister, setShowRegister] = useState(false);

    const handleLoginSuccess = () => {
        setShowLogin(false);
    };

    const handleRegisterSuccess = () => {
        setShowRegister(false);
    };

    const handleSwitchToLogin = () => {
        setShowRegister(false);
        setShowLogin(true);
    };

    return (
        <nav className="bg-primary border-b border-gray-700 px-6 py-4">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <div className="flex items-center gap-8">
                    <h1 className="text-2xl font-bold text-secondary">Kickr</h1>

                    <div className="flex gap-4">
                        <a href="/" className="text-gray-300 hover:text-white transition">
                            Home
                        </a>
                        <a href="/matches" className="text-gray-300 hover:text-white transition">
                            Matches
                        </a>
                        <a href="/competitions" className="text-gray-300 hover:text-white transition">
                            Competitions
                        </a>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {isAuthenticated ? (
                        <UserMenu />
                    ) : (
                        <>
                            <div className="relative">
                                <button
                                    onClick={() => {
                                        setShowLogin(!showLogin);
                                        setShowRegister(false);
                                    }}
                                    className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition"
                                >
                                    Log in
                                </button>
                                {showLogin && <LoginDropdown onSuccess={handleLoginSuccess} />}
                            </div>

                            <div className="relative">
                                <button
                                    onClick={() => {
                                        setShowRegister(!showRegister);
                                        setShowLogin(false);
                                    }}
                                    className="px-4 py-2 text-sm font-medium bg-secondary rounded-sm hover:opacity-90 transition"
                                >
                                    Sign up
                                </button>
                                {showRegister && <RegisterDropdown onSuccess={handleRegisterSuccess} onSwitchToLogin={handleSwitchToLogin} />}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};
