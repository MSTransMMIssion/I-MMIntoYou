import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import ProfileCard from "@/components/cards/ProfileCard";
import bcrypt from "bcryptjs";
import MatchModale from "/src/components/modales/matchModale"
export default function match() {
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
        router.push('/login');
    };

    const getUsers = async () => {
        try {
            const response = await axios.get('/api/users', {
                headers: { 'Content-Type': 'application/json' },
            });
            const allUsers = response.data.data;
            let filteredUsers = profilFilter(allUsers);
            filteredUsers = ageFilter(filteredUsers);
            filteredUsers = await excludeLikedUsers(filteredUsers);

            setUsers(filteredUsers);
        } catch (error) {
            console.error('Error fetching users:', error.message);
            setError(error.message);
        }
    };
    const getUserById = async (id) => {
        try {
            const response = await axios.get(`/api/users/${id}`, {
                headers: { 'Content-Type': 'application/json' },
            });
            return response.data.data;

        } catch (error) {
            console.error('Error fetching users:', error.message);
            setError(error.message);
        }
    };

    const excludeLikedUsers = async (allUsers) => {
        try {
            const response = await axios.get(`/api/likes/${profile.id}`);
            const likedUserIds = response.data.data.map(like => like.toUserId);

            return allUsers.filter(user => !likedUserIds.includes(user.id));
        } catch (error) {
            console.error("Erreur lors de l'exclusion des utilisateurs likés :", error.message);
            return allUsers; // Retourne tous les utilisateurs si l'API échoue
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

    useEffect(() => {
        if (users.length > 0) {
            fetchProfilePictures(users[currentIndex].id);
        }
    }, [currentIndex, users]);

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

    const fetchProfilePictures = async (userId) => {
        try {
            const response = await axios.get(`/api/users/${userId}/profilePictures`);
            setProfilePictures(response.data.data);
        } catch (error) {
            console.error('Erreur lors de la récupération des photos de profil:', error);
        }
    };

    const liked = async (userId) => {
        try {
            const loggedUser = JSON.parse(localStorage.getItem('loggedUser'));
            console.log("User liked:", userId, loggedUser);
            await postLikes(userId, 1);
            const isLiked = await getLike(loggedUser.id, userId);
            await makeMatch(isLiked);
        } catch (error) {
            console.error("Erreur lors du processus de 'liked':", error);
        }
    };

    const refused = (userId) => {
        console.log("User refused:", userId);
        postLikes(userId, 0);
    };

    const postLikes = async (toUserId, status) => {
        const fromUserId = profile.id;
        console.log("fromUserId:", fromUserId , "toUserId:", toUserId , "status:", status);
        const formData = {
            fromUserId,
            toUserId,
            status,
        };

        try {
            const response = await fetch('/api/likes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const result = await response.json();
            if (response.ok) {
                console.log(result);
                await getUsers();
            } else {
                setError('Erreur un deux : ' + result.error);
            }
        } catch (error) {
            console.error("Erreur lors de l'inscription :", error);
        }
    };

    const getLike = async (fromUser, userLikedId) => {
        try {
            const responseLikes = await axios.get(`/api/likes/${fromUser}/${userLikedId}`, {
                headers: { 'Content-Type': 'application/json' },
            });
            console.log("Has liked", responseLikes.data.data);
            return responseLikes.data.data;
        } catch (error) {
            console.error("Error fetching user data:", error);
            return [];
        }
    };


    const makeMatch = async (isLiked) => {
        if (isLiked.length >= 1) {
            console.log("C'est un MATCH", isLiked[0].id);
            setIsMatch(true);
            setIsMatchTarget(await getUserById(isLiked[0].fromUserId))
        } else {
            console.log("NONONONO");
        }
    };

    const handleCloseModal = () => {
        setIsMatch(false);
        setIsMatchTarget(null);
    };

    return (
        <main className="min-h-screen bg-cover bg-center p-6 relative" style={{ backgroundImage: 'url(/homepage-background.webp)' }}>
            <div className="relative z-10 max-w-4xl mx-auto bg-white flex items-center justify-center bg-opacity-50 shadow-2xl rounded-xl p-10 text-center">
                {isAuthenticated ? (
                    <>
                        {users && users.length > 0 ? (
                            <div className="flex items-center justify-center flex-row">
                                <ProfileCard
                                    user={users[currentIndex]}
                                    profilePictures={profilePictures}
                                    isEditable={false}
                                    onEdit={() => true}
                                    showActions={true}
                                    refused={refused}
                                    liked={liked}
                                />
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
                {isMatch && <MatchModale target={isMatchTarget} onClose={handleCloseModal}/>}
                {error && <p className="text-red-500 mt-4">{error}</p>}
            </div>
        </main>
    );
}
