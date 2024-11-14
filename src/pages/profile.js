import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { PencilIcon, XMarkIcon, ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/solid';

export default function Profile() {
    const [user, setUser] = useState({});
    const [formData, setFormData] = useState({});
    const [profilePictures, setProfilePictures] = useState([]);
    const [newProfilePictures, setNewProfilePictures] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [errors, setErrors] = useState({});
    const [currentIndex, setCurrentIndex] = useState(0);
    const router = useRouter();

    useEffect(() => {
        const storedUser = localStorage.getItem('loggedUser');
        if (storedUser) {
            const userData = JSON.parse(storedUser);
            setUser(userData);
            setFormData(userData);
            fetchProfilePictures(userData.id);
        } else {
            router.push('/login');
        }
    }, [router]);

    const fetchProfilePictures = async (userId) => {
        try {
            const response = await axios.get(`/api/users/${userId}/profilePictures`);
            setProfilePictures(response.data.data);
        } catch (error) {
            console.error('Erreur lors de la récupération des photos de profil:', error);
        }
    };

    const handleNextImage = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === profilePictures.length - 1 ? 0 : prevIndex + 1
        );
    };

    const handlePreviousImage = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? profilePictures.length - 1 : prevIndex - 1
        );
    };

    const validateForm = () => {
        let newErrors = {};
        if (!formData.name || formData.name.trim() === '') {
            newErrors.name = 'Le champ "Nom" est requis';
        }
        if (!formData.surname || formData.surname.trim() === '') {
            newErrors.surname = 'Le champ "Prénom" est requis';
        }
        if (!formData.email || formData.email.trim() === '') {
            newErrors.email = 'Le champ "Email" est requis';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleProfilePictureChange = (e) => {
        const files = Array.from(e.target.files);

        if (profilePictures.length + files.length > 10) {
            alert('Vous ne pouvez télécharger que 10 photos au maximum.');
            return;
        }

        const pictureURLs = files.map(file => URL.createObjectURL(file));
        setNewProfilePictures([...newProfilePictures, ...files]);
        setProfilePictures([...profilePictures, ...pictureURLs]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        const formDataToSend = new FormData();
        newProfilePictures.forEach((file) => {
            formDataToSend.append('profilePictures', file);
        });

        try {
            await axios.post(`/api/users/${user.id}/uploadProfilePicture`, formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            await axios.put(`/api/users/update/${user.id}`, formData);

            setUser(formData);
            setIsEditing(false);
            localStorage.setItem('loggedUser', JSON.stringify(formData));
        } catch (error) {
            console.error('Erreur lors de la mise à jour des données utilisateur:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleRemovePicture = (index) => {
        const newPictures = profilePictures.filter((_, picIndex) => picIndex !== index);
        setProfilePictures(newPictures);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
            <div className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden">
                <div className="relative">
                    {/* Carousel for profile pictures */}
                    <div className="flex items-center justify-center overflow-hidden relative">
                        {profilePictures.length > 0 ? (
                            <img
                                src={profilePictures[currentIndex].url}
                                alt={`Profile ${currentIndex}`}
                                className="w-full h-80 object-cover"
                            />
                        ) : (
                            <div className="w-full h-80 bg-gray-200 flex items-center justify-center text-gray-500">
                                Aucune photo de profil disponible
                            </div>
                        )}
                        {/* Carousel Controls */}
                        <button
                            onClick={handlePreviousImage}
                            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-lg hover:bg-gray-100"
                        >
                            <ArrowLeftIcon
                                className="h-6 w-6 text-black"
                            />
                        </button>
                        <button
                            onClick={handleNextImage}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-lg hover:bg-gray-100"
                        >
                            <ArrowRightIcon
                                className="h-6 w-6 text-black"
                            />

                        </button>
                        {isEditing && (
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleProfilePictureChange}
                                className="absolute top-2 right-2 p-2 rounded-lg border bg-white shadow-md cursor-pointer"
                            />
                        )}
                    </div>
                </div>

                {/* Profile Details */}
                <div className="p-8 text-center">
                    <div className="flex justify-center items-center mb-4">
                        <h1 className="text-3xl font-bold text-gray-900">
                            {user.name} {user.surname}
                        </h1>
                        {!isEditing && (
                            <PencilIcon
                                className="h-6 w-6 ml-3 text-gray-400 cursor-pointer hover:text-gray-600"
                                onClick={() => setIsEditing(true)}
                            />
                        )}
                    </div>
                    {!isEditing ? (
                        <>
                            <p className="text-lg text-gray-600 mb-4">{user.bio}</p>
                            <div className="text-left text-gray-700 space-y-2">
                                <p><strong>Email :</strong> {user.email}</p>
                                <p><strong>Date de naissance :</strong> {user.date_of_birth}</p>
                                <p><strong>Genre :</strong> {user.gender}</p>
                                <p><strong>Orientation :</strong> {user.sexual_orientation}</p>
                                <p><strong>Localisation :</strong> {user.location}</p>
                            </div>
                        </>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4 text-left">
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Nom"
                                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                            />
                            <input
                                type="text"
                                name="surname"
                                value={formData.surname}
                                onChange={handleChange}
                                placeholder="Prénom"
                                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                            />
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Email"
                                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                            />
                            <input
                                type="date"
                                name="date_of_birth"
                                value={formData.date_of_birth}
                                onChange={handleChange}
                                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                            />
                            <select
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                            >
                                <option value="male">Homme</option>
                                <option value="female">Femme</option>
                                <option value="other">Autre</option>
                            </select>
                            <select
                                name="sexual_orientation"
                                value={formData.sexual_orientation}
                                onChange={handleChange}
                                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                            >
                                <option value="heterosexual">Hétérosexuel</option>
                                <option value="gay">Homosexuel</option>
                                <option value="bisexual">Bisexuel</option>
                            </select>
                            <textarea
                                name="bio"
                                value={formData.bio}
                                onChange={handleChange}
                                placeholder="Parlez-nous de vous..."
                                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                            />
                            <input
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                placeholder="Localisation"
                                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                            />
                            <div className="flex justify-center space-x-4 mt-6">
                                <button
                                    onClick={handleSubmit}
                                    className="bg-green-500 text-white font-semibold px-6 py-3 rounded-full hover:bg-green-600"
                                >
                                    Sauvegarder
                                </button>
                                <button
                                    onClick={() => setIsEditing(false)}
                                    className="bg-red-500 text-white font-semibold px-6 py-3 rounded-full hover:bg-red-600"
                                >
                                    Annuler
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );

}
