import React from 'react';
import Image from './Image.jsx';
import Friend from './Friend.jsx';
import PostPreview from './PostPreview.jsx';

function Profile({ user, posts, friends }) {
    return (
        <div className="profile">
            <Image src={user.profilePic} alt={user.username} />
            <p className="profile-username">{user.username}</p>
            <p className="profile-bio">{user.bio}</p>

            <div className="friend-list">
                {friends.map((friend) => (
                    <Friend key={friend.id} friend={friend} />
                ))}
            </div>

            <div className="feed">
                {posts.map((post) => (
                    <PostPreview key={post.id} post={post} />
                ))}
            </div>
        </div>
    );
}

export default Profile;