import React, { useState } from 'react';
import { api, parseTags, imageToDataUrl } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';

function CreatePost({ onCreated }) {
    const { user } = useAuth();
    const [caption, setCaption] = useState('');
    const [hashtags, setHashtags] = useState('');
    const [image, setImage] = useState('');
    const [error, setError] = useState('');

    async function handleFile(e) {
        const file = e.target.files[0];
        if (!file) return;
        try {
            setImage(await imageToDataUrl(file));
            setError('');
        } catch (err) {
            setError(err.message);
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        if (!image.trim()) {
            setError('Please add an image (upload a file or paste an image URL).');
            return;
        }
        try {
            await api('/posts', {
                method: 'POST',
                body: { username: user.username, caption, image: image.trim(), hashtags: parseTags(hashtags) },
            });
            setCaption('');
            setHashtags('');
            setImage('');
            setError('');
            onCreated();
        } catch (err) {
            setError(err.message);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="card flex max-w-md flex-col gap-3">
            <h3 className="font-bold">Create a post</h3>
            {error && <p className="error">{error}</p>}

            <label className="field">
                Image (upload)
                <input className="input" type="file" accept="image/*" onChange={handleFile} />
            </label>

            <label className="field">
                ...or image URL / path
                <input className="input" type="text" placeholder="/images/robot.jpg"
                    value={image.startsWith('data:') ? '(uploaded image)' : image}
                    onChange={(e) => setImage(e.target.value)} />
            </label>

            {image && (
                <img className="max-h-40 w-auto border border-paper/50 object-cover"
                    src={image} alt="preview" />
            )}

            <label className="field">
                Caption
                <input className="input" type="text" value={caption}
                    onChange={(e) => setCaption(e.target.value)} />
            </label>

            <label className="field">
                Hashtags (separate with spaces)
                <input className="input" type="text" placeholder="#sunset #campus" value={hashtags}
                    onChange={(e) => setHashtags(e.target.value)} />
            </label>

            <button className="btn" type="submit">Post</button>
        </form>
    );
}

export default CreatePost;