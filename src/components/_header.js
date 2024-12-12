import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function Header() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const router = useRouter();

    // Vérifier l'état de connexion lors du montage du composant
    useEffect(() => {
        const storedUser = localStorage.getItem('loggedUser');
        if (storedUser) {
            setIsAuthenticated(true);
        }

        // Ajouter un écouteur d'événement pour les changements d'authentification
        const handleAuthChange = () => {
            const updatedUser = localStorage.getItem('loggedUser');
            setIsAuthenticated(!!updatedUser); // Met à jour en fonction de la présence d'un utilisateur
        };

        // Écouter l'événement personnalisé "authChanged"
        window.addEventListener("authChanged", handleAuthChange);

        return () => {
            // Nettoyage de l'écouteur lors du démontage
            window.removeEventListener("authChanged", handleAuthChange);
        };
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('loggedUser');
        setIsAuthenticated(false);
        router.push('/login');

        // Déclencher l'événement personnalisé "authChanged" pour notifier le changement
        const authChangedEvent = new Event("authChanged");
        window.dispatchEvent(authChangedEvent);
    };

    return (
        <header className="bg-night text-baby-powder shadow-md p-4 fixed top-0 left-0 right-0 z-50">
            <div className="container mx-auto flex justify-between items-center">
                {/* Logo / Nom du site */}
                <div className="flex items-center">
                    <img src="/logo.png" alt="I'MMIntoYou Logo" className="h-12 w-12 mr-3" />
                    <h1 className="text-2xl font-bold text-rusty-red">I'MMIntoYou</h1>
                </div>

                {/* Navigation */}
                <nav className="hidden md:flex space-x-6">
                    <a href="/" className="text-baby-powder hover:text-true-blue transition-colors duration-300">
                        Home
                    </a>
                    <a href="/match" className="text-baby-powder hover:text-true-blue transition-colors duration-300">
                        Match
                    </a>
                    <a href="/contact" className="text-baby-powder hover:text-true-blue transition-colors duration-300">
                        Contact
                    </a>
                    {isAuthenticated && (
                        <a href="/messages" className="text-baby-powder hover:text-true-blue transition-colors duration-300">
                            Messages
                        </a>
                    )}
                </nav>

                {/* Boutons de connexion / déconnexion */}
                <div className="hidden md:flex space-x-4">
                    {isAuthenticated ? (
                        <>
                            <button className="btn-primary" onClick={handleLogout}>
                                Déconnexion
                            </button>
                            <button className="btn-secondary" onClick={() => router.push('/profile')}>
                                Mon profil
                            </button>
                        </>
                    ) : (
                        <>
                            <button className="btn-primary" onClick={() => router.push('/login')}>
                                Se connecter
                            </button>
                            <button className="btn-secondary" onClick={() => router.push('/signup')}>
                                S'inscrire
                            </button>
                        </>
                    )}
                </div>

                {/* Menu hamburger pour mobile */}
                <div className="md:hidden">
                    <button className="text-baby-powder focus:outline-none">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-8 w-8"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4 6h16M4 12h16m-7 6h7"
                            />
                        </svg>
                    </button>
                </div>
            </div>
        </header>
    );
}
