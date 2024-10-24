import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

export default function Profile() {
    const [user, setUser] = useState({});
    const [formData, setFormData] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [errors, setErrors] = useState({});
    const router = useRouter();

    useEffect(() => {
        const storedUser = localStorage.getItem('loggedUser');
        if (storedUser) {
            const userData = JSON.parse(storedUser);
            setUser(userData);
            setFormData(userData);
        } else {
            router.push('/login');
        }
    }, [router]);

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

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            await axios.put(`/api/users/update/${user.id}`, formData);
            setUser(formData);
            setIsEditing(false);
            localStorage.setItem('loggedUser', JSON.stringify(formData));
        } catch (error) {
            console.error('Erreur lors de la mise à jour des données utilisateur', error);
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
        <div className="max-w-5xl mx-auto p-6 bg-gradient-to-br from-blue-50 to-purple-50 min-h-screen flex items-center justify-center">
            <div className="bg-white rounded-3xl shadow-2xl p-10 w-full">
                {/* Header du profil */}
                <div className="flex items-center space-x-8 mb-10">
                    <img
                        src={user.profile_picture || '/placeholder-avatar.png'}
                        alt="User Avatar"
                        className="w-28 h-28 rounded-full object-cover border-4 border-blue-500 shadow-md"
                    />
                    <div>
                        {!isEditing ? (
                            <>
                                <h1 className="text-5xl font-bold text-gray-900">{user.name} {user.surname}</h1>
                                <p className="text-lg text-gray-500 mt-2">{user.bio}</p>
                            </>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6 w-full">
                                <div className="flex space-x-4">
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Nom"
                                        className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition"
                                    />
                                    {errors.name && <p className="text-red-500">{errors.name}</p>}
                                    <input
                                        type="text"
                                        name="surname"
                                        value={formData.surname}
                                        onChange={handleChange}
                                        placeholder="Prénom"
                                        className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition"
                                    />
                                    {errors.surname && <p className="text-red-500">{errors.surname}</p>}
                                </div>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Email"
                                    className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition"
                                />
                                {errors.email && <p className="text-red-500">{errors.email}</p>}
                                <input
                                    type="date"
                                    name="date_of_birth"
                                    value={formData.date_of_birth}
                                    onChange={handleChange}
                                    className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition"
                                />
                                <select
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleChange}
                                    className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition"
                                >
                                    <option value="male">Homme</option>
                                    <option value="female">Femme</option>
                                    <option value="other">Autre</option>
                                </select>
                                <select
                                    className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition"
                                    name="sexual_orientation"
                                    value={formData.sexual_orientation}
                                    onChange={handleChange}
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
                                    className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition"
                                />
                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    placeholder="Localisation"
                                    className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition"
                                />
                            </form>
                        )}
                    </div>
                </div>

                {/* Boutons */}
                <div className="text-center mt-8">
                    {!isEditing ? (
                        <button
                            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold px-8 py-3 rounded-full shadow-lg hover:opacity-90 transition-transform transform hover:scale-105"
                            onClick={() => setIsEditing(true)}
                        >
                            Modifier le profil
                        </button>
                    ) : (
                        <div className="flex justify-center space-x-4">
                            <button
                                onClick={handleSubmit}
                                className="bg-green-500 text-white font-semibold px-8 py-3 rounded-full shadow-lg hover:bg-green-600 transition-transform transform hover:scale-105"
                            >
                                Sauvegarder
                            </button>
                            <button
                                onClick={() => setIsEditing(false)}
                                className="bg-red-500 text-white font-semibold px-8 py-3 rounded-full shadow-lg hover:bg-red-600 transition-transform transform hover:scale-105"
                            >
                                Annuler
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
