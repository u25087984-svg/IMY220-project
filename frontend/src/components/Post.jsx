import React from 'react';
import Image from './Image.jsx';
import Comments from './Comments.jsx';

function Post({ post }) {
    return (
        <div className="post">
            <p className="post-username">{post.username}</p>
            <p className="post-caption">{post.caption}</p>
            <Image src={post.image} alt={post.caption} />
            <Comments comments={post.comments} />
        </div>
    );
}

export default Post;