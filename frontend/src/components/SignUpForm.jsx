import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';

function SignUpForm() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();

        if (!username.trim() || !password.trim() || !confirmPassword.trim()) {
            setError('All fields are required.');
            return;
        }
        if (password.length < 8) {
            setError('Password must be at least 8 characters.');
            return;
        }
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        setError('');

        // usernames in the database all start with "@"
        const name = username.trim().startsWith('@') ? username.trim() : `@${username.trim()}`;

        try {
            const data = await api('/signup', {
                method: 'POST',
                body: { username: name, password },
            });
            login(data.user);
            navigate('/home');
        } catch (err) {
            setError(err.message);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="card flex w-full max-w-sm flex-col gap-3 text-left">
            {error && <p className="error">{error}</p>}

            <label className="field">
                Username
                <input className="input" type="text" value={username}
                    onChange={(e) => setUsername(e.target.value)} required />
            </label>

            <label className="field">
                Password
                <input className="input" type="password" value={password}
                    onChange={(e) => setPassword(e.target.value)} required />
            </label>

            <label className="field">
                Confirm Password
                <input className="input" type="password" value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)} required />
            </label>

            <button className="btn" type="submit">Sign Up</button>
        </form>
    );
}

export default SignUpForm;