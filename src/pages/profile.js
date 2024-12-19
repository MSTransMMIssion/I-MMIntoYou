import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import ProfileCard from '@/components/cards/ProfileCard';
import Slider from '@mui/material/Slider';

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

        fetchData().catch((error) =>
            console.error("Erreur lors de la récupération de l'utilisateur:", error)
        );
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

        setNewProfilePictures([...newProfilePictures, ...files]);
        setProfilePictures([...profilePictures, ...files]);
    };

    const handleDeletePicture = async (picture, index) => {
        try {
            if (!(picture instanceof File)) {
                // Suppression côté serveur
                await axios.delete(`/api/users/${user.id}/profilePictures/${picture.id}`);
            }
            // Mise à jour de l'état local
            const updatedPictures = profilePictures.filter(
                (p, idx) => idx !== index
            );
            setProfilePictures(updatedPictures);

            // Supprimer des nouvelles photos si nécessaire
            setNewProfilePictures((prev) =>
                prev.filter((_, idx) => idx !== index)
            );
        }
        catch (error) {
            console.error('Erreur lors de la suppression de la photo :', error);
        }
    };

    const handleSetPrimaryPicture = async (picture) => {
        try {
            await axios.put(`/api/users/${user.id}/profilePictures/setPrimary`, { id: picture.id });
            await fetchProfilePictures(user.id);
        } catch (error) {
            console.error('Erreur lors de la définition de la photo principale :', error);
        }
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

            setNewProfilePictures([]);
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

    const handleAgePreferenceChange = (event, newValue) => {
        setFormData({
            ...formData,
            min_age_preference: newValue[0],
            max_age_preference: newValue[1],
        });
    };

    return (
        <main className="min-h-screen bg-gradient-to-br from-true-blue to-lilac py-12 pt-32">
            <div className="max-w-5xl mx-auto">
                <h1 className="text-4xl font-bold text-center text-baby-powder mb-12">
                    Mon Profil
                </h1>

                <div className="rounded-lg p-8">
                    {isEditing ? (
                        <form onSubmit={handleSubmit} className="space-y-6 bg-baby-powder p-6 rounded">
                            <div className="flex w-full gap-6">
                                <div className="w-1/2">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Nom
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="input-text"
                                        placeholder="Nom"
                                        required
                                    />
                                    {errors.name && <p className="text-rusty-red">{errors.name}</p>}
                                </div>
                                <div className="w-1/2">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Prénom
                                    </label>
                                    <input
                                        type="text"
                                        name="surname"
                                        value={formData.surname}
                                        onChange={handleChange}
                                        className="input-text"
                                        placeholder="Prénom"
                                        required
                                    />
                                    {errors.surname && (
                                        <p className="text-rusty-red">{errors.surname}</p>
                                    )}
                                </div>
                            </div>
                            <div className="flex w-full gap-6">
                                <div className="w-1/2">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Adresse Email
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="input-text"
                                        placeholder="Email"
                                        required
                                    />
                                    {errors.email && <p className="text-rusty-red">{errors.email}</p>}
                                </div>
                                <div className="w-1/2">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Date de naissance
                                    </label>
                                    <input
                                        type="date"
                                        name="date_of_birth"
                                        value={formData.date_of_birth}
                                        onChange={handleChange}
                                        className="input-text"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Genre
                                    </label>
                                    <select
                                        name="gender"
                                        value={formData.gender}
                                        onChange={handleChange}
                                        className="input-select"
                                    >
                                        <option value="male">Homme</option>
                                        <option value="female">Femme</option>
                                        <option value="other">Autre</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Orientation sexuelle
                                    </label>
                                    <select
                                        name="sexual_orientation"
                                        value={formData.sexual_orientation}
                                        onChange={handleChange}
                                        className="input-select"
                                    >
                                        <option value="heterosexual">Hétérosexuel</option>
                                        <option value="gay">Homosexuel</option>
                                        <option value="bisexual">Bisexuel</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Bio
                                </label>
                                <textarea
                                    name="bio"
                                    value={formData.bio}
                                    onChange={handleChange}
                                    className="input-text h-48 w-full"
                                    placeholder="Parlez-nous de vous..."
                                ></textarea>
                            </div>
                            <div className="flex w-full gap-6">
                                <div className="w-1/2">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Localisation
                                    </label>
                                    <input
                                        type="text"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleChange}
                                        className="input-text"
                                        placeholder="Localisation"
                                    />
                                </div>
                                <div className="w-1/2">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Préférences d'âge
                                    </label>
                                    <div className="px-4 py-6">
                                        <Slider
                                            value={[formData.min_age_preference || 18, formData.max_age_preference || 30]}
                                            onChange={handleAgePreferenceChange}
                                            valueLabelDisplay="auto"
                                            min={18}
                                            max={30}
                                            step={1}
                                            sx={{color: '#d9344aff'}}
                                        />
                                    </div>
                                </div>
                            </div>
                            {/* Gestion des photos de profil */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Photos de profil
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleProfilePictureChange}
                                    className="input-file"
                                />
                                <p className="text-sm text-gray-500 mt-2">
                                    Vous pouvez ajouter jusqu'à 10 photos. Formats supportés : JPG, PNG.
                                </p>
                                <div className="grid grid-cols-3 sm:grid-cols-5 gap-4 mt-4">
                                    {profilePictures.map((picture, index) => (
                                        <div
                                            key={index}
                                            className="relative group transform hover:scale-105 transition-transform duration-300"
                                        >
                                            <img
                                                src={
                                                    picture instanceof File
                                                        ? URL.createObjectURL(picture)
                                                        : picture.url
                                                }
                                                alt={`Profile ${index}`}
                                                className="w-32 h-32 object-cover rounded-lg shadow-md transition-all duration-300"
                                            />
                                            <div
                                                className="absolute top-1 right-1 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                <button
                                                    type="button"
                                                    title="Supprimer"
                                                    className="bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm"
                                                    onClick={() => handleDeletePicture(picture, index)}
                                                >
                                                    ×
                                                </button>
                                                <button
                                                    type="button"
                                                    title="Définir comme photo principale"
                                                    className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm"
                                                    onClick={() => handleSetPrimaryPicture(picture)}
                                                >
                                                    ★
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="flex justify-center gap-4 mt-6">
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                >
                                    Sauvegarder
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsEditing(false)}
                                    className="btn btn-secondary"
                                >
                                    Annuler
                                </button>
                            </div>
                        </form>
                    ) : (
                        <ProfileCard
                            user={user}
                            profilePictures={profilePictures}
                            isEditable
                            onEdit={() => setIsEditing(true)}
                            showActions={false}
                        />
                    )}
                </div>
            </div>
        </main>
    );
}
