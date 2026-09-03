import React from 'react';
import PostPreview from './PostPreview.jsx';

function Feed({ posts }) {
    return (
        <div className="feed">
            {posts.map((post) => (
                <PostPreview key={post.id} post={post} />
            ))}
        </div>
    );
}

export default Feed;