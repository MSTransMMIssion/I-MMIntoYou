import {useEffect, useState} from 'react';
import axios from "axios";

export default function Profile() {
    // Données initiales de l'utilisateur
    const [user, setUser] = useState({
        name: 'pamarta',
        bio: 'Étudiant en MMI passionné par le développement et la création de projets.',
        interests: ['Web Development', 'Design', 'Photographie'],
        courses: ['HTML & CSS', 'JavaScript', 'UI/UX'],
        badges: ['MMI Master', 'Hackathon Winner'],
        profileImageUrl: '',
    });

    // État pour suivre si l'utilisateur est en mode "édition"
    const [isEditing, setIsEditing] = useState(false);

    // État temporaire pour stocker les modifications pendant l'édition
    const [formData, setFormData] = useState({...user});

    // Fonction pour mettre à jour le state local à chaque modification de champs
    const handleChange = (e) => {
        const {name, value} = e.target;
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
                    profileImageUrl: userData.profileimageurl,
                }));
                console.log("(profile.js:50) userData", userData);
            } else {
                console.error("Utilisateur non trouvé dans le cours Moodle");
            }
        } catch (error) {
            console.error('Failed to fetch Moodle user data', error);
        }
    };
    useEffect(() => {
        fetchMoodleUserData("Pamart,Antonin").then(r => console.log);
    }, []);

            return (
        <div className="max-w-4xl mx-auto p-6 bg-gray-100">
            {/* Profil Header */}
            <div className="bg-white rounded-xl shadow-xl p-8 flex items-center space-x-6">
                <img
                    src={user.profileImageUrl}// Remplace avec le chemin réel de l'avatar de l'utilisateur
                    alt="User Avatar"
                    className="w-24 h-24 rounded-full object-cover border-2 border-blue-500"
                />
                {!isEditing ? (
                    <div>
                        <h1 className="text-4xl font-extrabold text-gray-900">{user.name}</h1>
                        <p className="text-lg text-gray-500 mt-1">{user.bio}</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="text-4xl font-extrabold text-gray-900 p-2 border rounded-lg"
                            />
                        </div>
                        <div className="mt-2">
              <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg"
              />
                        </div>
                    </form>
                )}
            </div>

            {/* Section Centres d'intérêt */}
            <div className="mt-8 bg-white rounded-xl shadow-xl p-8">
                <h2 className="text-2xl font-bold text-gray-900">Centres d'intérêt</h2>
                <ul className="mt-4 grid grid-cols-2 gap-4">
                    {user.interests.map((interest, index) => (
                        <li
                            key={index}
                            className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg shadow-sm hover:bg-blue-200 transition duration-200"
                        >
                            {interest}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Section Cours suivis */}
            <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-semibold text-gray-800">Cours suivis</h2>
                <ul className="list-disc ml-5 mt-2">
                    {user.courses.map((course, index) => (
                        <li key={index} className="text-gray-600">{course}</li>
                    ))}
                </ul>
            </div>

            {/* Section Badges */}
            <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-semibold text-gray-800">Badges</h2>
                <div className="flex space-x-4 mt-2">
                    {user.badges.map((badge, index) => (
                        <span key={index} className="bg-blue-500 text-white px-4 py-2 rounded-lg">
              {badge}
            </span>
                    ))}
                </div>
            </div>

            {/* Bouton Modifier le profil */}
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
