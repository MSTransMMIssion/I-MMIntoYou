import { useState } from 'react';
import bcrypt from "bcryptjs";

export default function Signup() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [date_of_birth, setDateOfBirth] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const hashedPassword = await bcrypt.hash(password, 10)
        // Collect form data
        const formData = {
            name,
            surname,
            email,
            password: hashedPassword,
            date_of_birth,
        };

        // Send data to backend
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
                alert('User registered successfully');
            } else {
                alert('Error: ' + result.error);
            }
        } catch (error) {
            console.error('Error during user signup:', error);
        }
    };


    return (
        <div>
            <h1 className="text-center text-4xl m-9 ">Créer un compte</h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-5 items-center justify-center">
                <input
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
                <input className="placeholder:text-neutral-600"
                       type="date"
                       value={date_of_birth}
                       onChange={(e) => setDateOfBirth(e.target.value)}
                       required
                />
                <div className="flex flex-row gap-2">
                    <button type="submit" className="border-black border-2 border-solid boder-s-3-black bg-[var(--background)] rounded p-2.5 bg-emerald-500 w-40">Créer son compte</button>
                    <button type="reset" className="border-black border-2 border-solid boder-s-3-black bg-[var(--background)] rounded p-2.5 bg-orange-700 w-40">Réinitialiser</button>
                </div>
            </form>
        </div>
    );
}
