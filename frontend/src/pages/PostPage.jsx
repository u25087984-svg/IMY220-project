import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header.jsx';
import Post from '../components/Post.jsx';
import EditPost from '../components/EditPost.jsx';
import { api } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';

function PostPage() {
    const { id } = useParams();
    const { user } = useAuth();
    const [post, setPost] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        api(`/posts/${id}`).then(setPost).catch((err) => setError(err.message));
    }, [id]);

    return (
        <div>
            <Header />
            <div className="page flex flex-col gap-4">
                {error && <p className="error">{error}</p>}
                {!post && !error && <p>Loading...</p>}
                {post && (
                    <>
                        <Post post={post} onUpdated={setPost} />
                        {post.username === user.username && (
                            <EditPost post={post} onSaved={setPost} />
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

export default PostPage;