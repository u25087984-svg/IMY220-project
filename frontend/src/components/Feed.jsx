import React from 'react';
import { posts } from '../Data.js';
import PostPreview from './PostPreview.jsx';

function Feed() {
    return (
        <div>
            {posts.map((post) => (
                <PostPreview key={post.id} post={post} />
            ))}
        </div>
    );
}

export default Feed;