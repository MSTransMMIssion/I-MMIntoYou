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
            console.error('Erreur lors de l\'inscription :', error);
        }
    };

    return (
        <div>
            <h1 className="text-center text-4xl m-9">Créer un compte</h1>
            {error && <p className="text-red-500 text-center">{error}</p>}
            <form onSubmit={handleSubmit} className="flex flex-col gap-5 items-center justify-center">
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nom"
                    required
                />
                <input
                    type="text"
                    value={surname}
                    onChange={(e) => setSurname(e.target.value)}
                    placeholder="Prénom"
                    required
                />
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    required
                />
                <div className="relative w-full max-w-md">
                    <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Mot de passe"
                        required
                        className="w-full"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 px-4 py-2"
                    >
                        {showPassword ? "Cacher" : "Voir"}
                    </button>
                </div>
                <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirmer le mot de passe"
                    required
                />
                <input
                    className="placeholder:text-neutral-600"
                    type="date"
                    value={date_of_birth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    required
                />
                <div className="flex flex-row gap-2">
                    <button type="submit" className="border-black border-2 border-solid bg-emerald-500 rounded p-2.5 w-40">
                        Créer son compte
                    </button>
                    <button type="reset" className="border-black border-2 border-solid bg-orange-700 rounded p-2.5 w-40">
                        Réinitialiser
                    </button>
                </div>
            </form>
        </div>
    );
}
