import { useState, useEffect } from 'react';
import bcrypt from "bcryptjs";

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);

    // Fonction pour récupérer les utilisateurs via une requête GET
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/api/users');  // Appel API GET
                if (!response.ok) {
                    throw new Error('Failed to fetch users');
                }
                const result = await response.json();
                setUsers(result.data);  // Mise à jour des utilisateurs dans l'état
            } catch (error) {
                setError(error.message);  // Gestion des erreurs
            }
        };

        fetchData();
    }, []); // Le tableau vide [] signifie que l'effet se déclenche après le montage initial

    // Fonction pour comparer les données lors de la soumission du formulaire
    const compareData = async (e) => {
        e.preventDefault();  // Empêche le rechargement de la page
        console.log("Email saisi : ", email);  // Vérifier que l'email est bien récupéré

        // Trouver l'utilisateur correspondant à l'email saisi
        const user = users.find(user => user.email === email);

        if (user) {
            // Comparer le mot de passe saisi avec le mot de passe haché de la base de données
            const passwordMatch = await bcrypt.compare(password, user.password);

            if (passwordMatch) {
                console.log("L'utilisateur existe et le mot de passe est correct.");
            } else {
                console.log("Mot de passe incorrect.");
            }
        } else {
            console.log("Utilisateur non trouvé.");
        }
    };


    return (
        <div>
            <h1>Sign up</h1>
            <form onChange={compareData} className="flex flex-col gap-5">
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
                <button type="submit">Sign Up</button>
            </form>
        </div>
    );
}
