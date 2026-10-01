import React from 'react';
import PostPreview from './PostPreview.jsx';

function Feed({ posts }) {
    if (posts.length === 0) {
        return <p className="mt-4 text-sm text-paper/60">No posts to show yet.</p>;
    }

    return (
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {posts.map((post) => (
                <PostPreview key={post.id} post={post} />
            ))}
        </div>
    );
}

export default Feed;