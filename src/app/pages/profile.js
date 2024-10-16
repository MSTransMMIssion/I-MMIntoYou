import { useState, useEffect } from 'react';

export default function Profile() {
    // Simule une récupération de données d'utilisateur
    const [user, setUser] = useState({
        name: 'Antonin MMI',
        bio: 'Étudiant en MMI passionné par le développement et la création de projets.',
        interests: ['Web Development', 'Design', 'Photographie'],
        courses: ['HTML & CSS', 'JavaScript', 'UI/UX'],
        badges: ['MMI Master', 'Hackathon Winner']
    });

    useEffect(() => {
        // Appel à l'API pour récupérer les infos utilisateur
        // fetchUserData().then(data => setUser(data));
    }, []);

    return (
        <div className="container mx-auto p-6">
            {/* Profil Header */}
            <div className="bg-white rounded-lg shadow-lg p-6">
                <h1 className="text-3xl font-bold text-gray-800">{user.name}</h1>
                <p className="text-gray-600 mt-2">{user.bio}</p>
            </div>

            {/* Section Centres d'intérêt */}
            <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-semibold text-gray-800">Centres d'intérêt</h2>
                <ul className="list-disc ml-5 mt-2">
                    {user.interests.map((interest, index) => (
                        <li key={index} className="text-gray-600">{interest}</li>
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
            <div className="mt-6">
                <button className="bg-green-500 text-white px-6 py-2 rounded-lg">
                    Modifier le profil
                </button>
            </div>
        </div>
    );
}
