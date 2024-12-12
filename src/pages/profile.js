import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
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

        const pictureURLs = files.map((file) => URL.createObjectURL(file));
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
        <div className="min-h-screen bg-gradient-to-br from-true-blue to-lilac py-12 pt-32">
            <div className="max-w-5xl mx-auto">
                <h1 className="text-4xl font-bold text-center text-baby-powder mb-12">
                    Mon Profil
                </h1>

                <div className="bg-baby-powder rounded-lg shadow-lg p-8">
                    {isEditing ? (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
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
                                <div>
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
                            <div>
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
                            <div>
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
                                    className="input-text"
                                    placeholder="Parlez-nous de vous..."
                                ></textarea>
                            </div>
                            <div>
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
                                        <div key={index} className="relative">
                                            <img
                                                src={typeof picture === 'string' ? picture : URL.createObjectURL(picture)}
                                                alt={`Profile ${index}`}
                                                className="w-24 h-24 object-cover rounded-lg shadow-md"
                                            />
                                            <button
                                                type="button"
                                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                                                onClick={() => {
                                                    const updatedPictures = profilePictures.filter(
                                                        (_, idx) => idx !== index
                                                    );
                                                    setProfilePictures(updatedPictures);
                                                    setNewProfilePictures(
                                                        newProfilePictures.filter((_, idx) => idx !== index)
                                                    );
                                                }}
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="flex justify-center gap-4 mt-6">
                                <button
                                    type="submit"
                                    className="btn-primary"
                                >
                                    Sauvegarder
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsEditing(false)}
                                    className="btn-secondary"
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
        </div>
    );
}
