import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, enc, parseTags, tagsToText } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';

function EditPost({ post, onSaved }) {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [caption, setCaption] = useState(post.caption);
    const [hashtags, setHashtags] = useState(tagsToText(post.hashtags));
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            const updated = await api(`/posts/${post.id}`, {
                method: 'PUT',
                body: { caption, hashtags: parseTags(hashtags) },
            });
            onSaved(updated);
            setError('');
            setMessage('Changes saved.');
        } catch (err) {
            setError(err.message);
        }
    }

    async function handleDelete() {
        if (!window.confirm('Delete this post permanently?')) return;
        try {
            await api(`/posts/${post.id}`, { method: 'DELETE' });
            navigate(`/profile/${enc(user.username)}`);
        } catch (err) {
            setError(err.message);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="card mx-auto flex max-w-xl flex-col gap-3">
            <h3 className="font-bold">Edit your post</h3>
            {error && <p className="error">{error}</p>}
            {message && <p className="ok">{message}</p>}

            <label className="field">
                Caption
                <input className="input" type="text" value={caption}
                    onChange={(e) => setCaption(e.target.value)} />
            </label>

            <label className="field">
                Hashtags
                <input className="input" type="text" value={hashtags}
                    onChange={(e) => setHashtags(e.target.value)} />
            </label>

            <div className="flex gap-2">
                <button className="btn" type="submit">Save Changes</button>
                <button className="btn btn-danger" type="button" onClick={handleDelete}>Delete Post</button>
            </div>
        </form>
    );
}

export default EditPost;