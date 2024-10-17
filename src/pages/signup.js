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
            <h1>Sign up</h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
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
                    value={date_of_birth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    placeholder="Date of Birth"
                    required
                />
                <button type="submit">Sign Up</button>
            </form>
        </div>
    );
}
