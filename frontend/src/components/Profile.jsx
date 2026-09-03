import React from 'react';
import Image from './Image.jsx';
import Friend from './Friend.jsx';
import PostPreview from './PostPreview.jsx';
import { posts, users } from '../Data.js';

function Profile({ user }) {
    const userPosts = posts.filter((post) => user.posts.includes(post.id));
    const userFriends = users.filter((u) => user.friends.includes(u.id));

    return (
        <div>
            <p>{user.username}</p>
            <p>{user.bio}</p>
            <Image src={user.profilePic} alt={user.username} />

            <div>
                {userFriends.map((friend) => (
                    <Friend key={friend.id} friend={friend} />
                ))}
            </div>

            <div>
                {userPosts.map((post) => (
                    <PostPreview key={post.id} post={post} />
                ))}
            </div>
        </div>
    );
}

export default Profile;