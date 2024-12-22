import { useState, useEffect } from 'react';
import bcrypt from "bcryptjs";
import { useRouter } from 'next/router';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const storedUser = localStorage.getItem('loggedUser');
        if (storedUser) {
            router.push('/profile').then(r => r);
        }
    }, [router]);

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`/api/user?email=${encodeURIComponent(email)}`);
            if (!response.ok) {
                throw new Error('Utilisateur non trouvé.');
            }

            const result = await response.json();
            const user = result.data;

            const passwordMatch = await bcrypt.compare(password, user.password);

            if (passwordMatch) {
                localStorage.setItem('loggedUser', JSON.stringify(user));
                const authChangedEvent = new Event("authChanged");
                window.dispatchEvent(authChangedEvent);
                router.push('/profile');
            } else {
                setError("Mot de passe incorrect.");
            }
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-night text-baby-powder px-4">
            <div className="bg-baby-powder text-night max-w-md w-full p-8 rounded-lg shadow-lg">
                <h1 className="text-3xl font-bold text-center text-rusty-red mb-6">Connexion</h1>
                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                            Adresse email
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Votre adresse email"
                            className="w-full border border-gray-300 rounded-lg p-3 text-gray-900 focus:outline-none focus:border-true-blue focus:ring-1 focus:ring-true-blue"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                            Mot de passe
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Votre mot de passe"
                            className="w-full border border-gray-300 rounded-lg p-3 text-gray-900 focus:outline-none focus:border-true-blue focus:ring-1 focus:ring-true-blue"
                            required
                        />
                    </div>
                    {error && <p className="text-rusty-red text-sm">{error}</p>}
                    <div className="flex space-x-4">
                        <button type="submit" className="btn btn-primary w-full">
                            Connexion
                        </button>
                        <button type="reset" className="btn btn-secondary w-full">
                            Réinitialiser
                        </button>
                    </div>
                </form>
                <p className="text-center text-gray-600 mt-6">
                    Pas encore inscrit ?{' '}
                    <button
                        onClick={() => router.push('/signup')}
                        className="btn btn-link"
                    >
                        Créez un compte
                    </button>
                </p>
            </div>
        </div>
    );
}
