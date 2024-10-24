import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { NonAuthenticatedView } from '@/components/NonAuthenticatedView'; // Importer les vues
import { AuthenticatedView } from '@/components/AuthenticatedView'; // Importer les vues

export default function Home() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const storedUser = localStorage.getItem('loggedUser');
        setIsAuthenticated(!!storedUser); // Si un utilisateur est trouvé dans le localStorage, il est connecté
    }, []);

    return (
        <main
            className="min-h-screen bg-cover bg-center p-6 relative"
            style={{ backgroundImage: 'url(/homepage-background.webp)' }}
        >
            {/* Overlay pour rendre le texte plus lisible sur l'image de fond */}
            <div className="absolute inset-0 bg-black opacity-40"></div>

            {/* Contenu principal */}
            <div className="relative z-10 max-w-4xl mx-auto bg-white bg-opacity-95 shadow-2xl rounded-xl p-10 text-center">
                <h1 className="text-6xl font-bold text-gray-900 mb-4">I'MMIntoYou</h1>
                <p className="text-xl text-gray-700 mb-6 leading-relaxed">
                    Le site de rencontre exclusif pour les étudiants et passionnés du domaine MMI (Métiers du Multimédia et de l'Internet).
                </p>

                {/* Afficher la vue en fonction de l'état de connexion */}
                {isAuthenticated ? <AuthenticatedView /> : <NonAuthenticatedView />}
            </div>

            {/* Section des fonctionnalités */}
            <section className="mt-16 max-w-6xl mx-auto">
                <h2 className="text-4xl font-semibold text-center text-white mb-12">Pourquoi I'MMIntoYou ?</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    <div className="bg-white shadow-lg rounded-lg p-8 text-center transform transition-transform hover:scale-105">
                        <h3 className="text-2xl font-bold text-blue-500 mb-4">Rencontres ciblées</h3>
                        <p className="text-gray-600">
                            Rencontrez des étudiants et professionnels du domaine MMI partageant vos centres d'intérêt.
                        </p>
                    </div>
                    <div className="bg-white shadow-lg rounded-lg p-8 text-center transform transition-transform hover:scale-105">
                        <h3 className="text-2xl font-bold text-blue-500 mb-4">Événements exclusifs</h3>
                        <p className="text-gray-600">
                            Participez à des événements et projets collaboratifs réservés à la communauté MMI.
                        </p>
                    </div>
                    <div className="bg-white shadow-lg rounded-lg p-8 text-center transform transition-transform hover:scale-105">
                        <h3 className="text-2xl font-bold text-blue-500 mb-4">Sécurité et confidentialité</h3>
                        <p className="text-gray-600">
                            Vos données sont protégées. Nous respectons votre vie privée.
                        </p>
                    </div>
                </div>
            </section>
        </main>
    );
}
