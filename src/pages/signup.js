import { useState } from 'react';
import { useRouter } from 'next/router';
import bcrypt from "bcryptjs";

export default function Signup() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [date_of_birth, setDateOfBirth] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError("Les mots de passe ne correspondent pas !");
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const formData = {
            name,
            surname,
            email,
            password: hashedPassword,
            date_of_birth,
        };

        try {
            const response = await fetch('/api/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const result = await response.json();
            if (response.ok) {
                localStorage.setItem('loggedUser', JSON.stringify(result.data));
                const authChangedEvent = new Event("authChanged");
                window.dispatchEvent(authChangedEvent);
                await router.push('/profile');
            } else {
                setError('Erreur : ' + result.error);
            }
        } catch (error) {
            setError("Une erreur s'est produite. Veuillez réessayer.");
            console.error('Erreur lors de l\'inscription :', error);
        }
    };

    return (
        <div className="flex items-center justify-center bg-night text-baby-powder pt-32 px-4">
            <div className="bg-baby-powder text-night max-w-lg w-full p-8 rounded-lg shadow-lg">
                <h1 className="text-3xl font-bold text-center text-rusty-red mb-6">Créer un compte</h1>
                {error && <p className="text-rusty-red text-center mb-4">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                            Nom
                        </label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Votre nom"
                            className="w-full border border-gray-300 rounded-lg p-3 text-gray-900 focus:outline-none focus:border-true-blue focus:ring-1 focus:ring-true-blue"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="surname" className="block text-sm font-medium text-gray-700 mb-2">
                            Prénom
                        </label>
                        <input
                            type="text"
                            id="surname"
                            value={surname}
                            onChange={(e) => setSurname(e.target.value)}
                            placeholder="Votre prénom"
                            className="w-full border border-gray-300 rounded-lg p-3 text-gray-900 focus:outline-none focus:border-true-blue focus:ring-1 focus:ring-true-blue"
                            required
                        />
                    </div>
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
                    <div className="relative">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                            Mot de passe
                        </label>
                        <div className={'flex'}>
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Votre mot de passe"
                                className="w-full border border-gray-300 rounded-lg p-3 text-gray-900 focus:outline-none focus:border-true-blue focus:ring-1 focus:ring-true-blue"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="px-4 py-2 btn btn-secondary"
                            >
                                {showPassword ? "Cacher" : "Voir"}
                            </button>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                            Confirmer le mot de passe
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirmez votre mot de passe"
                            className="w-full border border-gray-300 rounded-lg p-3 text-gray-900 focus:outline-none focus:border-true-blue focus:ring-1 focus:ring-true-blue"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="date_of_birth" className="block text-sm font-medium text-gray-700 mb-2">
                            Date de naissance
                        </label>
                        <input
                            type="date"
                            id="date_of_birth"
                            value={date_of_birth}
                            onChange={(e) => setDateOfBirth(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg p-3 text-gray-900 focus:outline-none focus:border-true-blue focus:ring-1 focus:ring-true-blue"
                            required
                        />
                    </div>
                    <div className="flex space-x-4">
                        <button type="submit" className="btn btn-primary w-full">
                            Créer son compte
                        </button>
                        <button type="reset" className="btn btn-secondary w-full">
                            Réinitialiser
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
