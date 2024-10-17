import { useEffect, useState } from 'react';
import axios from "axios";

export default function Profile() {
    const [user, setUser] = useState({});
    const [formData, setFormData] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [errors, setErrors] = useState({});  // Nouvel état pour les erreurs

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`/api/users/1`);
                setUser(response.data.data);
                setFormData(response.data.data);
            } catch (error) {
                console.error('Erreur lors de la récupération des données utilisateur', error);
            }
        };

        fetchUserData();
    }, []);

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
        return Object.keys(newErrors).length === 0; // Si aucun message d'erreur, retourne true
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return; // Si le formulaire n'est pas valide, ne pas soumettre
        }

        try {
            await axios.put(`/api/users/update/${user.id}`, formData); // Mettre à jour l'utilisateur avec les données modifiées
            setUser(formData); // Mettre à jour l'état user avec les nouvelles données
            setIsEditing(false); // Quitter le mode édition
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
                                <option value={"gay"}>Homosexuel</option>
                                <option value={"bisexual"}>Bisexuel</option>
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

/*<form onSubmit={faire fonction} className="flex flex-col gap-5">
    <input className=""
type="text"
value={name}
onChange={(e) => setName(e.target.value)}
placeholder="Name"
required
/>
<input
type="text"
value={surname}
onChange={(e) => setSurname(e.target.value)}
placeholder="Surname"
required
/>
<input
type="email"
value={email}
onChange={(e) => setEmail(e.target.value)}
placeholder="Email"
required
/>
<input
type="password"
value={password}
onChange={(e) => setPassword(e.target.value)}
placeholder="Password"
required
/>
<input
type="date"
value={dateOfBirth}
onChange={(e) => setDateOfBirth(e.target.value)}
placeholder="Date of Birth"
required
/>
<select
value={gender}
onChange={(e) => setGender(e.target.value)}
required
>
<option>Homme</option>
<option>Femme</option>
<option>Autre</option>
</select>

<select
    value={sexualOrientation}
    onChange={(e) => setSexualOrientation(e.target.value)}
    required
>
    <option>Hétérosexuel</option>
    <option>Homosexuel</option>
    <option>Bisexuel</option>
    <option>Autre</option>
</select>
<input
    type="text"
    value={profilePicture}
    onChange={(e) => setProfilPicture(e.target.value)}
    placeholder="Profil picture"
    required
/>
<input
    type="text"
    value={bio}
    onChange={(e) => setBio(e.target.value)}
    placeholder="Bio"
    required
/>
<input
    type="text"
    value={location}
    onChange={(e) => setLocation(e.target.value)}
    placeholder="Location"
    required
/>

<button type="submit">Login</button>
</form>
*/