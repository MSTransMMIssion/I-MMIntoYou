import { useState, useEffect } from 'react';
import bcrypt from "bcryptjs";
import { useRouter } from 'next/router';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);
    const router = useRouter();

    // Vérifier si l'utilisateur est déjà connecté au chargement de la page
    useEffect(() => {
        const storedUser = localStorage.getItem('loggedUser');
        if (storedUser) {
            // Si un utilisateur est trouvé dans le localStorage, rediriger vers le profil
            router.push('/profile');
        }
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/api/users');
                if (!response.ok) {
                    throw new Error('Failed to fetch users');
                }
                const result = await response.json();
                setUsers(result.data);
            } catch (error) {
                setError(error.message);
            }
        };

        fetchData();
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();

        const user = users.find(user => user.email === email);

        if (user) {
            const passwordMatch = await bcrypt.compare(password, user.password);

            if (passwordMatch) {
                console.log("Connexion réussie !");

                // Stocker les informations de l'utilisateur dans le localStorage
                localStorage.setItem('loggedUser', JSON.stringify(user));
                const authChangedEvent = new Event("authChanged");
                window.dispatchEvent(authChangedEvent);

                // Rediriger vers la page de profil
                router.push('/profile');
            } else {
                setError("Mot de passe incorrect.");
            }
        } else {
            setError("Utilisateur non trouvé.");
        }
    };

    return (
        <div>
            <h1>Login</h1>
            <form onSubmit={handleLogin} className="flex flex-col gap-5">
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
                <button type="submit">Login</button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
}
