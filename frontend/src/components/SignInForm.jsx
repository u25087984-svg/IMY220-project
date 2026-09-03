import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function SignInForm() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();

        if (!username.trim() || !password.trim()) {
            setError('Both username and password are required.');
            return;
        }

        setError('');

        try {
            const response = await fetch('http://localhost:3001/api/signin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (data.success) {
                navigate('/home');
            } else {
                setError('Sign in failed.');
            }
        } catch (err) {
            setError('Could not reach the server. Is the backend running?');
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            {error && <p className="form-error">{error}</p>}

            <label>
                Username:
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
            </label>

            <label>
                Password:
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </label>

            <button type="submit">Log In</button>
        </form>
    );
}

export default SignInForm;