import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import User_cards from '/src/components/cards/user_cards';

export default function Home() {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(true);
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);  // Ajout de l'état pour suivre l'index actuel

    const handleLoginRedirect = () => {
        router.push('/login');
    };

    const getUsers = async () => {
        try {
            const response = await axios.get('/api/users', {
                headers: { 'Content-Type': 'application/json' },
            });
            setUsers(response.data.data);  // Mise à jour des utilisateurs
        } catch (error) {
            console.error('Error fetching users:', error.message);
            setError(error.message);
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            getUsers();  // Récupère les utilisateurs si authentifié
        }
    }, [isAuthenticated]);

    // Fonction pour passer à l'utilisateur suivant
    const handleNext = () => {
        if (currentIndex < users.length - 1) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    // Fonction pour revenir à l'utilisateur précédent
    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    return (
        <main className="min-h-screen bg-cover bg-center p-6 relative" style={{ backgroundImage: 'url(/homepage-background.webp)' }}>
            <div className="absolute inset-0 bg-black opacity-40"></div>
            <div className="relative z-10 max-w-4xl mx-auto bg-white bg-opacity-95 shadow-2xl rounded-xl p-10 text-center">

                {isAuthenticated ? (
                    <>
                        {/* Afficher un utilisateur à la fois */}
                        {users && users.length > 0 ? (
                            <div>
                                <User_cards key={users[currentIndex].id} user={users[currentIndex]} />  {/* Affiche l'utilisateur à l'index actuel */}

                                {/* Boutons pour naviguer entre les utilisateurs */}
                                <div className="flex justify-between mt-4">
                                    <button
                                        onClick={handlePrev}
                                        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700"
                                        disabled={currentIndex === 0}  // Désactiver le bouton si on est au premier utilisateur
                                    >
                                        Précédent
                                    </button>
                                    <button
                                        onClick={handleNext}
                                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
                                        disabled={currentIndex === users.length - 1}  // Désactiver si on est au dernier utilisateur
                                    >
                                        Suivant
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <p className="text-gray-500">Aucun utilisateur trouvé.</p>
                        )}
                    </>
                ) : (
                    <div>
                        <p className="text-gray-500 text-lg mb-4">
                            Connectez-vous pour découvrir des profils intéressants et faire de nouvelles rencontres.
                        </p>
                        <button
                            onClick={handleLoginRedirect}
                            className="bg-gradient-to-r from-blue-400 to-blue-600 text-white px-8 py-3 rounded-full shadow-lg hover:from-blue-500 hover:to-blue-700 transition-transform transform hover:scale-105"
                        >
                            Se connecter
                        </button>
                    </div>
                )}

                {error && <p className="text-red-500 mt-4">{error}</p>}  {/* Affichage des erreurs */}
            </div>
        </main>
    );
}
