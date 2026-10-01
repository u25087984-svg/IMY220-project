import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Image from './Image.jsx';
import Comments from './Comments.jsx';
import { api, enc } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';

function Post({ post, onUpdated }) {
    const { user } = useAuth();
    const [text, setText] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    async function addComment(e) {
        e.preventDefault();
        if (!text.trim()) return;
        try {
            const updated = await api(`/posts/${post.id}/comments`, {
                method: 'POST',
                body: { commUname: user.username, comment: text.trim() },
            });
            onUpdated(updated);
            setText('');
            setError('');
        } catch (err) {
            setError(err.message);
        }
    }

    async function deleteComment(commentId) {
        try {
            const updated = await api(`/posts/${post.id}/comments/${commentId}`, { method: 'DELETE' });
            onUpdated(updated);
        } catch (err) {
            setError(err.message);
        }
    }

    async function report() {
        try {
            await api(`/posts/${post.id}/report`, { method: 'POST' });
            setMessage('Post reported. Thank you.');
        } catch (err) {
            setError(err.message);
        }
    }

    return (
        <div className="card mx-auto flex max-w-xl flex-col gap-3">
            <Link className="font-bold hover:text-accent" to={`/profile/${enc(post.username)}`}>
                {post.username}
            </Link>
            <Image className="w-full border border-paper/50" src={post.image} alt={post.caption} />
            <p>{post.caption}</p>
            <p className="tag">{(post.hashtags || []).join(' ')}</p>

            {post.username !== user.username && (
                <button className="btn btn-sm btn-danger self-start" onClick={report}>Report post</button>
            )}
            {message && <p className="ok">{message}</p>}
            {error && <p className="error">{error}</p>}

            <h3 className="border-t border-paper/40 pt-3 font-bold">Comments</h3>
            <Comments comments={post.comments} currentUser={user.username}
                postOwner={post.username} onDelete={deleteComment} />

            <form onSubmit={addComment} className="flex gap-2">
                <input className="input" type="text" placeholder="Write a comment..."
                    value={text} onChange={(e) => setText(e.target.value)} />
                <button className="btn" type="submit">Send</button>
            </form>
        </div>
    );
}

export default Post;