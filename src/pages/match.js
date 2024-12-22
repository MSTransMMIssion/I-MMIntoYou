import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import ProfileCard from "@/components/cards/ProfileCard";
import MatchModale from "/src/components/modales/matchModale";

export default function Match() {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [profile, setProfile] = useState({});
    const [isMatch, setIsMatch] = useState(false);
    const [isMatchTarget, setIsMatchTarget] = useState(0);
    const [profilePictures, setProfilePictures] = useState([]);

    const handleLoginRedirect = () => {
        router.push('/login').then(r => r);
    };

    // Mémorisation des fonctions pour éviter les dépendances non stables
    const profilFilter = useCallback((allUsers) => {
        const filteredUsers = allUsers.filter(user => user.id !== profile.id);
        const profilGender = profile.gender;
        const profilSexualOrientation = profile.sexual_orientation;

        switch (profilSexualOrientation) {
            case 'heterosexual':
                return filteredUsers.filter(user => user.gender !== profilGender);
            case 'homosexual':
                return filteredUsers.filter(user => user.gender === profilGender);
            case 'bisexual':
            default:
                return filteredUsers;
        }
    }, [profile]);

    const ageFilter = useCallback((users) => {
        const ageMin = profile.min_age_preference;
        const ageMax = profile.max_age_preference;

        return users.filter(user => {
            const userAge = calculateAge(user.date_of_birth);
            return userAge >= ageMin && userAge <= ageMax;
        });
    }, [profile]);

    const excludeLikedUsers = useCallback(async (allUsers) => {
        try {
            const response = await axios.get(`/api/likes/${profile.id}`);
            const likedUserIds = response.data.data.map(like => like.toUserId);
            return allUsers.filter(user => !likedUserIds.includes(user.id));
        } catch (error) {
            console.error('Erreur lors de l\'exclusion des utilisateurs likés:', error.message);
            return allUsers;
        }
    }, [profile]);

    const calculateAge = (dateOfBirth) => {
        const birthDate = new Date(dateOfBirth);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        if (
            today.getMonth() < birthDate.getMonth() ||
            (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate())
        ) {
            age--;
        }
        return age;
    };

    const getUsers = useCallback(async () => {
        try {
            const response = await axios.get('/api/users');
            const allUsers = response.data.data;
            let filteredUsers = profilFilter(allUsers);
            filteredUsers = ageFilter(filteredUsers);
            filteredUsers = await excludeLikedUsers(filteredUsers);
            setUsers(filteredUsers);
        } catch (error) {
            console.error('Error fetching users:', error.message);
            setError(error.message);
        }
    }, [profilFilter, ageFilter, excludeLikedUsers]);

    const fetchProfilePictures = useCallback(async (userId) => {
        try {
            const response = await axios.get(`/api/users/${userId}/profilePictures`);
            setProfilePictures(response.data.data);
        } catch (error) {
            console.error('Erreur lors de la récupération des photos de profil:', error);
        }
    }, []);

    const postLikes = useCallback(async (toUserId, status) => {
        try {
            await axios.post('/api/likes', {
                fromUserId: profile.id,
                toUserId,
                status,
            });
            await getUsers();
        } catch (error) {
            console.error('Erreur lors de l\'ajout du like:', error);
        }
    }, [profile.id, getUsers]);

    const liked = useCallback(async (userId) => {
        try {
            await postLikes(userId, 1);
            const loggedUser = JSON.parse(localStorage.getItem('loggedUser'));
            const isLiked = await axios.get(`/api/likes/${loggedUser.id}/${userId}`);
            if (isLiked.data.data.length > 0) {
                setIsMatch(true);
                setIsMatchTarget(users.find(user => user.id === userId));
            }
        } catch (error) {
            console.error("Erreur lors du processus de 'liked':", error);
        }
    }, [postLikes, users]);

    const refused = useCallback((userId) => {
        postLikes(userId, 0).then(r => r);
    }, [postLikes]);

    useEffect(() => {
        const loggedUser = JSON.parse(localStorage.getItem('loggedUser'));

        if (loggedUser) {
            setIsAuthenticated(true);
            setProfile(loggedUser);
        } else {
            setIsAuthenticated(false);
        }
    }, []);

    useEffect(() => {
        if (isAuthenticated) {
            getUsers();
        }
    }, [isAuthenticated, getUsers]);

    useEffect(() => {
        if (users.length > 0) {
            fetchProfilePictures(users[currentIndex]?.id);
        }
    }, [currentIndex, users, fetchProfilePictures]);

    return (
        <main className="min-h-screen text-baby-powder pt-32">
            <div className="container mx-auto py-12 flex flex-col items-center md:max-w-5xl">
                <h1 className="text-5xl font-bold text-center mb-8">Trouve ton match idéal(e)</h1>
                <div className="w-full">
                    {isAuthenticated ? (
                        <>
                            {users.length > 0 ? (
                                <ProfileCard
                                    user={users[currentIndex]}
                                    profilePictures={profilePictures}
                                    isEditable={false}
                                    showActions={true}
                                    refused={refused}
                                    liked={liked}
                                />
                            ) : (
                                <p className="text-center text-lilac">Aucun utilisateur trouvé.</p>
                            )}
                        </>
                    ) : (
                        <div className="text-center">
                            <p className="text-lg mb-4">Connectez-vous pour accéder aux profils.</p>
                            <button
                                className="btn btn-primary"
                                onClick={handleLoginRedirect}
                            >
                                Se connecter
                            </button>
                        </div>
                    )}
                </div>
            </div>
            {isMatch && <MatchModale target={isMatchTarget} onClose={() => setIsMatch(false)} />}
            {error && <p className="text-rusty-red text-center mt-4">{error}</p>}
        </main>
    );
}
