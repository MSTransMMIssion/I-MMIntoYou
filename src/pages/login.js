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
        <div className="py-16 flex justify-center items-center">
            <div className="w-full max-w-md">
                <h1 className="text-center text-4xl m-16">Se connecter</h1>
                <form onSubmit={compareData} className="flex flex-col gap-5 items-center justify-center">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                        className="border-3 border-[var(--foreground)] bg-[var(--background)] rounded p-2.5 text-white w-full"
                        required
                    />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        className="border-3 border-[var(--foreground)] bg-[var(--background)] rounded p-2.5 text-white w-full"
                        required
                    />
                    <div className="flex flex-row gap-2 my-6">
                        <button type="submit"
                                className="border-black border-2 border-solid bg-emerald-500 rounded p-2.5 w-40">
                            Se connecter
                        </button>
                        <button type="reset"
                                className="border-black border-2 border-solid bg-orange-700 rounded p-2.5 w-40">
                            Réinitialiser
                        </button>
                    </div>
                </form>
            </div>
        </div>

    );
}
