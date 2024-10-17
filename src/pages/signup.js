import { useState } from 'react';

export default function Signup() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [gender, setGender] = useState('');
    const [sexualOrientation, setSexualOrientation] = useState('');
    const [profilePicture, setProfilPicture] = useState('');
    const [bio, setBio] = useState('');
    const [location, setLocation] = useState('');
    const [createdAt, setCreatedAt] = useState('');
    const [updateAt, setUpdateAt] = useState('');

    return (
        <div>
            <h1>Login</h1>
            <form /*onSubmit={faire fonction}*/ className="flex flex-col gap-5">
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
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    placeholder="Date of Birth"
                    required
                />
                <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    required
                >
                    <option>Homme</option>
                    <option>Femme</option>
                    <option>Autre</option>
                </select>

                <select
                    value={sexualOrientation}
                    onChange={(e) => setSexualOrientation(e.target.value)}
                    required
                >
                    <option>Hétérosexuel</option>
                    <option>Homosexuel</option>
                    <option>Bisexuel</option>
                    <option>Autre</option>
                </select>
                <input
                    type="text"
                    value={profilePicture}
                    onChange={(e) => setProfilPicture(e.target.value)}
                    placeholder="Profil picture"
                    required
                />
                <input
                    type="text"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Bio"
                    required
                />
                <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Location"
                    required
                />

                <button type="submit">Login</button>
            </form>
        </div>
    );
}
