import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
    return (
        <BrowserRouter>
            <div className="min-h-screen bg-slate-950">
                {/* Header */}
                <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm">
                    <div className="container mx-auto px-4 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                <span className="text-2xl font-display font-bold bg-gold-gradient bg-clip-text text-transparent">
                  TFT Tournament
                </span>
                            </div>
                            <nav className="flex items-center space-x-6">
                                <a
                                    href="/"
                                    className="text-slate-300 hover:text-brand-hextech-500 transition-colors"
                                >
                                    Accueil
                                </a>
                                <a
                                    href="/tournaments"
                                    className="text-slate-300 hover:text-brand-hextech-500 transition-colors"
                                >
                                    Tournois
                                </a>
                                <button className="px-4 py-2 rounded-lg bg-hextech-gradient text-white font-medium hover:shadow-glow-hextech transition-all">
                                    Connexion
                                </button>
                            </nav>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="container mx-auto px-4 py-12">
                    <Routes>
                        <Route
                            path="/"
                            element={
                                <div className="text-center space-y-6">
                                    <h1 className="text-6xl font-display font-extrabold">
                    <span className="bg-gold-gradient bg-clip-text text-transparent">
                      TFT Tournament
                    </span>
                                    </h1>
                                    <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                                        La plateforme ultime pour organiser et jouer des tournois Teamfight Tactics
                                    </p>
                                    <div className="flex items-center justify-center gap-4 pt-4">
                                        <button className="px-6 py-3 rounded-lg bg-gold-gradient text-slate-950 font-semibold hover:shadow-glow-gold transition-all">
                                            Créer un tournoi
                                        </button>
                                        <button className="px-6 py-3 rounded-lg border-2 border-brand-hextech-500 text-brand-hextech-500 font-semibold hover:bg-brand-hextech-500 hover:text-white transition-all">
                                            Parcourir les tournois
                                        </button>
                                    </div>

                                    {/* Features */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-16">
                                        <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800">
                                            <div className="text-4xl mb-4">🚀</div>
                                            <h3 className="text-xl font-display font-semibold mb-2">Rapide</h3>
                                            <p className="text-slate-400">
                                                Créez un tournoi en moins de 5 minutes
                                            </p>
                                        </div>
                                        <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800">
                                            <div className="text-4xl mb-4">🎯</div>
                                            <h3 className="text-xl font-display font-semibold mb-2">Automatisé</h3>
                                            <p className="text-slate-400">
                                                Génération automatique des lobbies Swiss
                                            </p>
                                        </div>
                                        <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800">
                                            <div className="text-4xl mb-4">📊</div>
                                            <h3 className="text-xl font-display font-semibold mb-2">Statistiques</h3>
                                            <p className="text-slate-400">
                                                Profils joueurs avec historique complet
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            }
                        />
                    </Routes>
                </main>

                {/* Footer */}
                <footer className="border-t border-slate-800 bg-slate-900/50 mt-20">
                    <div className="container mx-auto px-4 py-8 text-center text-slate-400">
                        <p>© 2025 TFT Tournament - Made with ❤️ for the TFT Community</p>
                    </div>
                </footer>
            </div>
        </BrowserRouter>
    );
}

export default App;