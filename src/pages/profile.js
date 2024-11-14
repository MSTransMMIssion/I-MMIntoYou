import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { PencilIcon } from '@heroicons/react/24/solid';
import ProfileCard from '@/components/cards/ProfileCard';

export default function Profile() {
    const [user, setUser] = useState({});
    const [formData, setFormData] = useState({});
    const [profilePictures, setProfilePictures] = useState([]);
    const [newProfilePictures, setNewProfilePictures] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [errors, setErrors] = useState({});
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            const storedUser = localStorage.getItem('loggedUser');
            if (storedUser) {
                const userData = JSON.parse(storedUser);
                setUser(userData);
                setFormData(userData);
                await fetchProfilePictures(userData.id);
            } else {
                await router.push('/login');
            }
        };

        fetchData().catch(error => console.error("Erreur lors de la récupération de l'utilisateur:", error));
    }, [router]);

    const fetchProfilePictures = async (userId) => {
        try {
            const response = await axios.get(`/api/users/${userId}/profilePictures`);
            setProfilePictures(response.data.data);
        } catch (error) {
            console.error('Erreur lors de la récupération des photos de profil:', error);
        }
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
            await fetchProfilePictures(user.id);
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

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
                {/* ProfileCard Component */}
                <ProfileCard
                    user={user}
                    profilePictures={profilePictures}
                    isEditable={!isEditing}
                    onEdit={() => setIsEditing(true)}
                    showActions={!isEditing}
                />

                {/* Formulaire d'édition des informations */}
                {isEditing && (
                    <div className="p-8">
                        <form onSubmit={handleSubmit} className="space-y-4 text-left">
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Nom"
                                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                            />
                            {errors.name && <p className="text-red-500">{errors.name}</p>}
                            <input
                                type="text"
                                name="surname"
                                value={formData.surname}
                                onChange={handleChange}
                                placeholder="Prénom"
                                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                            />
                            {errors.surname && <p className="text-red-500">{errors.surname}</p>}
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Email"
                                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                            />
                            {errors.email && <p className="text-red-500">{errors.email}</p>}
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
                                    type="submit"
                                    className="bg-green-500 text-white font-semibold px-6 py-3 rounded-full hover:bg-green-600"
                                >
                                    Sauvegarder
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsEditing(false)}
                                    className="bg-red-500 text-white font-semibold px-6 py-3 rounded-full hover:bg-red-600"
                                >
                                    Annuler
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
    );
}
