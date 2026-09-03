import React from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header.jsx';
import Post from '../components/Post.jsx';
import EditPost from '../components/EditPost.jsx';
import { posts } from '../Data.js';

function PostPage() {
    const { id } = useParams();
    const post = posts.find((p) => p.id === Number(id));

    if (!post) {
        return (
            <div>
                <Header />
                <p>Post not found.</p>
            </div>
        );
    }

    return (
        <div className="post-page">
            <Header />
            <Post post={post} />
            <EditPost post={post} />
        </div>
    );
}

export default PostPage;