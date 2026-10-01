import React, { useState } from 'react';
import { api, enc, imageToDataUrl } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';

function EditProfile({ user, onSaved }) {
    const { login } = useAuth();
    const [bio, setBio] = useState(user.bio);
    const [profilePic, setProfilePic] = useState(user.profilePic);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    async function handleFile(e) {
        const file = e.target.files[0];
        if (!file) return;
        try {
            setProfilePic(await imageToDataUrl(file, 400));
        } catch (err) {
            setError(err.message);
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            const updated = await api(`/users/${enc(user.username)}`, {
                method: 'PUT',
                body: { bio, profilePic },
            });
            login(updated);
            onSaved();
            setError('');
            setMessage('Profile updated.');
        } catch (err) {
            setError(err.message);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="card flex max-w-md flex-col gap-3">
            <h3 className="font-bold">Edit profile</h3>
            {error && <p className="error">{error}</p>}
            {message && <p className="ok">{message}</p>}

            <label className="field">
                Bio
                <input className="input" type="text" value={bio}
                    onChange={(e) => setBio(e.target.value)} />
            </label>

            <label className="field">
                Profile picture (upload)
                <input className="input" type="file" accept="image/*" onChange={handleFile} />
            </label>

            <img className="h-16 w-16 rounded-full border border-paper/50 object-cover" src={profilePic} alt="preview" />

            <button className="btn" type="submit">Save Changes</button>
        </form>
    );
}

export default EditProfile;