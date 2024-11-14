import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import ProfileCard from "@/components/cards/ProfileCard";

export default function Home() {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [profile, setProfile] = useState({});
    const [profilePictures, setProfilePictures] = useState([]);

    const handleLoginRedirect = () => {
        router.push('/login');
    };

    const getUsers = async () => {
        try {
            const response = await axios.get('/api/users', {
                headers: { 'Content-Type': 'application/json' },
            });
            const allUsers = response.data.data;
            const filteredUsersBySexualOrientation = profilFilter(allUsers);
            const filteredUsers = ageFilter(filteredUsersBySexualOrientation);
            setUsers(filteredUsers);
        } catch (error) {
            console.error('Error fetching users:', error.message);
            setError(error.message);
        }
    };

    useEffect(() => {
        const loggedUser = JSON.parse(localStorage.getItem('loggedUser'));

        if (loggedUser) {
            setIsAuthenticated(true);
            setProfile(loggedUser);
        }
        if (isAuthenticated) {
            getUsers();
        }
    }, [isAuthenticated]);

    // Appeler fetchProfilePictures chaque fois que l'index d'utilisateur change
    useEffect(() => {
        if (users.length > 0) {
            fetchProfilePictures(users[currentIndex].id);
        }
    }, [currentIndex, users]);

    const handleNext = () => {
        if (currentIndex < users.length - 1) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    const getOppositeGender = (gender) => {
        return gender === 'male' ? 'female' : 'male';
    };

    const profilFilter = (allUsers) => {
        const profilGender = profile.gender;
        const profilSexualOrientation = profile.sexual_orientation;
        let genderFilter = [];

        switch (profilSexualOrientation) {
            case 'heterosexual':
                genderFilter = allUsers.filter(user => user.gender === getOppositeGender(profilGender));
                break;
            case 'homosexual':
                genderFilter = allUsers.filter(user => user.gender === profilGender);
                break;
            case 'bisexual':
                genderFilter = allUsers;
                break;
            default:
                genderFilter = allUsers.filter(user => user.gender === getOppositeGender(profilGender));
                break;
        }
        return genderFilter;
    };

    const calculateAge = (dateOfBirth) => {
        const [year, month, day] = dateOfBirth.split('-').map(Number);
        const today = new Date();
        let age = today.getFullYear() - year;
        const hasHadBirthdayThisYear = (today.getMonth() > month - 1) || (today.getMonth() === month - 1 && today.getDate() >= day);
        if (!hasHadBirthdayThisYear) {
            age -= 1;
        }
        return age;
    };

    const ageFilter = (users) => {
        const ageMin = profile.min_age_preference;
        const ageMax = profile.max_age_preference;

        return users.filter(user => {
            const userAge = calculateAge(user.date_of_birth);
            return userAge >= ageMin && userAge <= ageMax;
        });
    };

    // Récupérer les photos de profil pour l'utilisateur actuellement affiché
    const fetchProfilePictures = async (userId) => {
        try {
            const response = await axios.get(`/api/users/${userId}/profilePictures`);
            setProfilePictures(response.data.data);
        } catch (error) {
            console.error('Erreur lors de la récupération des photos de profil:', error);
        }
    };

    return (
        <main className="min-h-screen bg-cover bg-center p-6 relative" style={{ backgroundImage: 'url(/homepage-background.webp)' }}>
            <div className="relative z-10 max-w-4xl mx-auto bg-white flex items-center justify-center bg-opacity-50 shadow-2xl rounded-xl p-10 text-center">
                {isAuthenticated ? (
                    <>
                        {users && users.length > 0 ? (
                            <div className="flex items-center justify-center flex-row">

                                <button
                                    onClick={handlePrev}
                                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700"
                                    disabled={currentIndex === 0}
                                >
                                    Précédent
                                </button>

                                <ProfileCard
                                    user={users[currentIndex]}
                                    profilePictures={profilePictures}
                                    isEditable={false}
                                    onEdit={() => {
                                        return true;
                                    }}
                                    showActions={true}
                                />

                                <button
                                    onClick={handleNext}
                                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
                                    disabled={currentIndex === users.length - 1}
                                >
                                    Suivant
                                </button>

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

                {error && <p className="text-red-500 mt-4">{error}</p>}
            </div>
        </main>
    );
}
