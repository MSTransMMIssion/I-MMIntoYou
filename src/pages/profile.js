import { useState, useEffect } from 'react';
import axios from "axios";

export default function Profile() {
    // Données initiales de l'utilisateur
    const [user, setUser] = useState({
        id: '12345',
        name: 'Antonin',
        surname: 'Pamart',
        email: 'antonin@example.com',
        date_of_birth: '2002-04-10',
        gender: 'male',
        sexual_orientation: 'heterosexual',
        profile_picture: '',
        bio: 'Étudiant en MMI passionné par le développement et la création de projets.',
        location: 'Grenoble, France',
        interests: ['Web Development', 'Design', 'Photographie'],
        courses: ['HTML & CSS', 'JavaScript', 'UI/UX'],
        badges: ['MMI Master', 'Hackathon Winner'],
        createdAt: '2022-01-01',
        updatedAt: '2022-12-01',
    });

    // État pour suivre si l'utilisateur est en mode "édition"
    const [isEditing, setIsEditing] = useState(false);

    // État temporaire pour stocker les modifications pendant l'édition
    const [formData, setFormData] = useState({ ...user });

    // Fonction pour mettre à jour le state local à chaque modification de champs
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    // Fonction pour gérer la soumission du formulaire
    const handleSubmit = (e) => {
        e.preventDefault();
        setUser(formData); // Mettre à jour les données utilisateur avec les nouvelles valeurs
        setIsEditing(false); // Quitter le mode édition
    };

    const fetchMoodleUserData = async (username) => {
        try {
            const moodleResponse = await axios.get(`/moodle-api/webservice/rest/server.php`, {
                params: {
                    wstoken: 'ba545e95bb07afa2256e1dcaa47c07a5',
                    moodlewsrestformat: 'json',
                    wsfunction: 'core_enrol_get_enrolled_users',
                    courseid: 412,
                    'options[4][name]': 'userfields',
                    'options[4][value]': 'profileimageurl',
                },
            });

            const userData = moodleResponse.data.find((user) => user.fullname === username);

            if (userData) {
                setUser((prevUser) => ({
                    ...prevUser,
                    profile_picture: userData.profileimageurl,
                }));
            }
        } catch (error) {
            console.error('Failed to fetch Moodle user data', error);
        }
    };

    useEffect(() => {
        fetchMoodleUserData("Pamart,Antonin");
    }, []);

    return (
        <div className="max-w-4xl mx-auto p-6 bg-gray-100">
            <div className="bg-white rounded-xl shadow-xl p-8 flex items-center space-x-6">
                <img
                    src={user.profile_picture || '/path-to-placeholder-avatar.jpg'}
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
                        </div>
                        <div>
                            <input
                                type="text"
                                name="surname"
                                value={formData.surname}
                                onChange={handleChange}
                                className="text-4xl font-extrabold text-gray-900 p-2 border rounded-lg w-full"
                            />
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
                        </div>
                        <div>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="p-2 border rounded-lg w-full"
                                placeholder="Password"
                            />
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

            <div className="mt-8 bg-white rounded-xl shadow-xl p-8">
                <h2 className="text-2xl font-bold text-gray-900">Centres d'intérêt</h2>
                <ul className="mt-4 grid grid-cols-2 gap-4">
                    {user.interests.map((interest, index) => (
                        <li key={index} className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg shadow-sm">
                            {interest}
                        </li>
                    ))}
                </ul>
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