import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import ProfileCard from "@/components/cards/ProfileCard";
import bcrypt from "bcryptjs";

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

    const liked = (userId) => {
        console.log("User liked:", userId);
        postLikes(userId, 1);
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

                {error && <p className="text-red-500 mt-4">{error}</p>}
            </div>
        </main>
    );
}
