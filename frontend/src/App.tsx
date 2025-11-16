import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider } from '@/features/auth/AuthProvider';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { LoginPage } from '@/pages/LoginPage';
import { AuthCallbackPage } from '@/pages/AuthCallbackPage';
import { ProfilePage } from '@/pages/ProfilePage';
import { useAuth, useLogout } from '@/hooks/useAuth';

function Header() {
    const { isAuthenticated, user } = useAuth();
    const { mutate: logout } = useLogout();

    return (
        <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm">
            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    <Link to="/" className="flex items-center space-x-2">
                        <span className="text-2xl font-display font-bold bg-gold-gradient bg-clip-text text-transparent">
                            TFT Arena
                        </span>
                    </Link>
                    <nav className="flex items-center space-x-6">
                        <Link
                            to="/"
                            className="text-slate-300 hover:text-brand-hextech-500 transition-colors"
                        >
                            Accueil
                        </Link>
                        <Link
                            to="/tournaments"
                            className="text-slate-300 hover:text-brand-hextech-500 transition-colors"
                        >
                            Tournois
                        </Link>
                        {isAuthenticated ? (
                            <div className="flex items-center space-x-4">
                                <Link
                                    to="/profile"
                                    className="flex items-center space-x-2 text-slate-300 hover:text-brand-gold-500 transition-colors"
                                >
                                    {user?.avatarUrl && (
                                        <img
                                            src={user.avatarUrl}
                                            alt={user.username}
                                            className="w-8 h-8 rounded-full border-2 border-brand-gold-500"
                                        />
                                    )}
                                    <span>{user?.username}</span>
                                </Link>
                                <button
                                    onClick={() => logout()}
                                    className="text-slate-400 hover:text-red-500 transition-colors"
                                >
                                    Déconnexion
                                </button>
                            </div>
                        ) : (
                            <Link
                                to="/login"
                                className="px-4 py-2 rounded-lg bg-hextech-gradient text-white font-medium hover:shadow-glow-hextech transition-all"
                            >
                                Connexion
                            </Link>
                        )}
                    </nav>
                </div>
            </div>
        </header>
    );
}

function HomePage() {
    const { isAuthenticated } = useAuth();

    return (
        <div className="text-center space-y-6">
            <h1 className="text-6xl font-display font-extrabold">
                <span className="bg-gold-gradient bg-clip-text text-transparent">
                    TFT Arena
                </span>
            </h1>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                La plateforme ultime pour organiser et jouer des tournois Teamfight Tactics
            </p>
            <div className="flex items-center justify-center gap-4 pt-4">
                {isAuthenticated ? (
                    <>
                        <Link
                            to="/tournaments/create"
                            className="px-6 py-3 rounded-lg bg-gold-gradient text-slate-950 font-semibold hover:shadow-glow-gold transition-all"
                        >
                            Créer un tournoi
                        </Link>
                        <Link
                            to="/tournaments"
                            className="px-6 py-3 rounded-lg border-2 border-brand-hextech-500 text-brand-hextech-500 font-semibold hover:bg-brand-hextech-500 hover:text-white transition-all"
                        >
                            Parcourir les tournois
                        </Link>
                    </>
                ) : (
                    <>
                        <Link
                            to="/login"
                            className="px-6 py-3 rounded-lg bg-gold-gradient text-slate-950 font-semibold hover:shadow-glow-gold transition-all"
                        >
                            Commencer
                        </Link>
                        <Link
                            to="/tournaments"
                            className="px-6 py-3 rounded-lg border-2 border-brand-hextech-500 text-brand-hextech-500 font-semibold hover:bg-brand-hextech-500 hover:text-white transition-all"
                        >
                            Parcourir les tournois
                        </Link>
                    </>
                )}
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-16">
                <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800">
                    <div className="text-4xl mb-4">🚀</div>
                    <h3 className="text-xl font-display font-semibold mb-2 text-slate-50">
                        Rapide
                    </h3>
                    <p className="text-slate-400">Créez un tournoi en moins de 5 minutes</p>
                </div>
                <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800">
                    <div className="text-4xl mb-4">🎯</div>
                    <h3 className="text-xl font-display font-semibold mb-2 text-slate-50">
                        Automatisé
                    </h3>
                    <p className="text-slate-400">Génération automatique des lobbies Swiss</p>
                </div>
                <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800">
                    <div className="text-4xl mb-4">📊</div>
                    <h3 className="text-xl font-display font-semibold mb-2 text-slate-50">
                        Statistiques
                    </h3>
                    <p className="text-slate-400">Profils joueurs avec historique complet</p>
                </div>
            </div>
        </div>
    );
}

function TournamentsPage() {
    return (
        <div className="text-center">
            <h1 className="text-4xl font-display text-slate-50 mb-4">Tournois</h1>
            <p className="text-slate-400">Liste des tournois à venir...</p>
        </div>
    );
}

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <div className="min-h-screen bg-slate-950">
                    <Header />

                    <main className="container mx-auto px-4 py-12">
                        <Routes>
                            {/* Public Routes */}
                            <Route path="/" element={<HomePage />} />
                            <Route path="/login" element={<LoginPage />} />
                            <Route path="/auth/callback" element={<AuthCallbackPage />} />
                            <Route path="/tournaments" element={<TournamentsPage />} />

                            {/* Protected Routes */}
                            <Route
                                path="/profile"
                                element={
                                    <ProtectedRoute>
                                        <ProfilePage />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/tournaments/create"
                                element={
                                    <ProtectedRoute requiredRole="organizer">
                                        <div className="text-center text-slate-50">
                                            <h1 className="text-4xl font-display mb-4">
                                                Créer un tournoi
                                            </h1>
                                            <p className="text-slate-400">
                                                Formulaire de création (à implémenter)
                                            </p>
                                        </div>
                                    </ProtectedRoute>
                                }
                            />

                            {/* 404 */}
                            <Route
                                path="*"
                                element={
                                    <div className="text-center">
                                        <h1 className="text-4xl font-display text-slate-50 mb-4">
                                            404
                                        </h1>
                                        <p className="text-slate-400">Page non trouvée</p>
                                    </div>
                                }
                            />
                        </Routes>
                    </main>

                    <footer className="border-t border-slate-800 bg-slate-900/50 mt-20">
                        <div className="container mx-auto px-4 py-8 text-center text-slate-400">
                            <p>© 2025 TFT Arena - Made with ❤️ for the TFT Community</p>
                        </div>
                    </footer>
                </div>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;
