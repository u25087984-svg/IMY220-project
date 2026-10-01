import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';

function SignInForm() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();

        if (!username.trim() || !password.trim()) {
            setError('Both username and password are required.');
            return;
        }
        setError('');

        try {
            const data = await api('/signin', {
                method: 'POST',
                body: { username: username.trim(), password },
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
                    onChange={(e) => setUsername(e.target.value)} placeholder="@sarah" required />
            </label>

            <label className="field">
                Password
                <input className="input" type="password" value={password}
                    onChange={(e) => setPassword(e.target.value)} required />
            </label>

            <button className="btn" type="submit">Log In</button>
        </form>
    );
}

export default SignInForm;