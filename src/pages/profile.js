import { useEffect, useState } from 'react';
import axios from "axios";
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
            // Si l'utilisateur n'est pas connecté, rediriger vers la page de login
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
            await axios.put(`/api/users/update/${user.id}`, formData); // Mettre à jour les données utilisateur
            setUser(formData); // Mettre à jour les données dans l'état
            setIsEditing(false); // Quitter le mode édition
            // Mettre à jour les informations dans localStorage
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
        <div className="max-w-4xl mx-auto p-6 bg-gray-100">
            <div className="bg-white rounded-xl shadow-xl p-8 flex items-center space-x-6">
                <img
                    src={user.profile_picture || '/placeholder-avatar.png'}
                    alt="User Avatar"
                    className="w-24 h-24 rounded-full object-cover border-2 border-blue-500"
                />
                {!isEditing ? (
                    <div>
                        <h1 className="text-4xl font-extrabold text-gray-900">{user.name} {user.surname}</h1>
                        <p className="text-lg text-gray-500 mt-1">{user.bio}</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="text-4xl font-extrabold text-gray-900 p-2 border rounded-lg w-full"
                            />
                            {errors.name && <p className="text-red-500">{errors.name}</p>}
                        </div>
                        <div>
                            <input
                                type="text"
                                name="surname"
                                value={formData.surname}
                                onChange={handleChange}
                                className="text-4xl font-extrabold text-gray-900 p-2 border rounded-lg w-full"
                            />
                            {errors.surname && <p className="text-red-500">{errors.surname}</p>}
                        </div>
                        <div>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="p-2 border rounded-lg w-full"
                                placeholder="Email"
                            />
                            {errors.email && <p className="text-red-500">{errors.email}</p>}
                        </div>
                        <div>
                            <input
                                type="date"
                                name="date_of_birth"
                                value={formData.date_of_birth}
                                onChange={handleChange}
                                className="p-2 border rounded-lg w-full"
                            />
                        </div>
                        <div>
                            <select
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                className="p-2 border rounded-lg w-full"
                            >
                                <option value="male">Homme</option>
                                <option value="female">Femme</option>
                                <option value="other">Autre</option>
                            </select>
                        </div>
                        <div>
                            <select
                                className="p-2 border rounded-lg w-full"
                                name="sexual_orientation"
                                value={formData.sexual_orientation}
                                onChange={handleChange}
                            >
                                <option value="heterosexual">Hétérosexuel</option>
                                <option value="gay">Homosexuel</option>
                                <option value="bisexual">Bisexuel</option>
                            </select>
                        </div>
                        <div>
                            <textarea
                                name="bio"
                                value={formData.bio}
                                onChange={handleChange}
                                className="p-2 border rounded-lg w-full"
                                placeholder="Bio"
                            />
                        </div>
                        <div>
                            <input
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                className="p-2 border rounded-lg w-full"
                                placeholder="Location"
                            />
                        </div>
                    </form>
                )}
            </div>

            <div className="mt-8 text-center">
                {!isEditing ? (
                    <button
                        className="bg-blue-500 text-white font-semibold px-8 py-3 rounded-lg shadow-lg hover:bg-blue-600 transition duration-300"
                        onClick={() => setIsEditing(true)}
                    >
                        Modifier le profil
                    </button>
                ) : (
                    <div className="flex justify-center space-x-4">
                        <button
                            onClick={handleSubmit}
                            className="bg-green-500 text-white font-semibold px-8 py-3 rounded-lg shadow-lg hover:bg-green-600 transition duration-300"
                        >
                            Sauvegarder
                        </button>
                        <button
                            onClick={() => setIsEditing(false)}
                            className="bg-red-500 text-white font-semibold px-8 py-3 rounded-lg shadow-lg hover:bg-red-600 transition duration-300"
                        >
                            Annuler
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
