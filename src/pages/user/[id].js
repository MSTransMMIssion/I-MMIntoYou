import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Slider from 'react-slick';

export default function UserProfile() {
    const router = useRouter();
    const { id } = router.query; // Récupère l'ID de l'utilisateur depuis l'URL
    const [user, setUser] = useState(null);
    const [profilePictures, setProfilePictures] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (id) {
            fetchUserDetails(id);
            fetchProfilePictures(id);
        }
    }, [id]);

    const fetchUserDetails = async (userId) => {
        try {
            const response = await axios.get(`/api/users/${userId}`);
            setUser(response.data.data);
        } catch (error) {
            console.error('Erreur lors de la récupération des détails utilisateur :', error);
            setError("Utilisateur introuvable.");
        }
    };

    const fetchProfilePictures = async (userId) => {
        try {
            const response = await axios.get(`/api/users/${userId}/profilePictures`);
            setProfilePictures(response.data.data);
        } catch (error) {
            console.error('Erreur lors de la récupération des photos de profil :', error);
        }
    };

    const calculateAge = (date_of_birth) => {
        const birthDate = new Date(date_of_birth);
        const difference = Date.now() - birthDate.getTime();
        const ageDate = new Date(difference);
        return Math.abs(ageDate.getUTCFullYear() - 1970);
    };

    if (error) {
        return <p className="text-center text-red-500 mt-6">{error}</p>;
    }

    if (!user) {
        return <p className="text-center text-gray-500 mt-6">Chargement des informations...</p>;
    }

    const sliderSettings = {
        dots: true,
        arrows: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
    };

    return (
        <main className="min-h-screen py-16">
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden mt-8">
                {/* Carrousel des images */}
                <div className="relative">
                    {profilePictures.length > 1 ? (
                        <Slider {...sliderSettings}>
                            {profilePictures.map((picture, index) => (
                                <div key={index} className="relative h-96 flex items-center justify-center overflow-hidden">
                                    {/* Image de fond floutée */}
                                    <div
                                        className="absolute inset-0 bg-cover bg-center filter blur-md scale-125"
                                        style={{
                                            backgroundImage: `url(${picture.url})`,
                                        }}
                                    ></div>
                                    {/* Image principale */}
                                    <img
                                        src={picture.url}
                                        alt={`Photo ${index}`}
                                        className="relative z-10 w-full h-full object-contain"
                                    />
                                </div>
                            ))}
                        </Slider>
                    ) : profilePictures.length === 1 ? (
                        <div className="relative h-96 flex items-center justify-center overflow-hidden">
                            {/* Image de fond floutée */}
                            <div
                                className="absolute inset-0 bg-cover bg-center filter blur-md scale-125"
                                style={{
                                    backgroundImage: `url(${profilePictures[0].url})`,
                                }}
                            ></div>
                            {/* Image principale */}
                            <img
                                src={profilePictures[0].url}
                                alt="Photo unique"
                                className="relative z-10 w-full h-full object-contain"
                            />
                        </div>
                    ) : (
                        <div className="h-96 flex items-center justify-center bg-gray-200 text-gray-500">
                            Aucune photo disponible
                        </div>
                    )}
                </div>

                {/* Informations utilisateur */}
                <div className="p-6">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">{user.name} {user.surname}</h1>
                    <p className="text-gray-600 mb-4 whitespace-pre-line">{user.bio || "Aucune biographie disponible."}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
                        <p><strong>Email :</strong> {user.email}</p>
                        <p><strong>Âge :</strong> {calculateAge(user.date_of_birth)}</p>
                        <p><strong>Genre :</strong> {user.gender}</p>
                        <p><strong>Orientation :</strong> {user.sexual_orientation}</p>
                        <p><strong>Localisation :</strong> {user.location}</p>
                    </div>
                </div>
            </div>
        </main>
    );
}
