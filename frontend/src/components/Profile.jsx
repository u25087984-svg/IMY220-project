import React, { useState } from 'react';
import Image from './Image.jsx';
import Friend from './Friend.jsx';
import PostPreview from './PostPreview.jsx';
import { api, enc } from '../api.js';

// user = profile being viewed, me = the logged-in user (fresh from the API)
function Profile({ user, me, posts, friends, requests, onChanged }) {
    const [error, setError] = useState('');

    const isOwn = me.username === user.username;
    const isFriend = user.friends.includes(me.id);
    const iRequested = user.friendRequests.includes(me.id);
    const theyRequested = me.friendRequests.includes(user.id);

    async function run(path) {
        try {
            await api(path, { method: 'POST' });
            setError('');
            onChanged();
        } catch (err) {
            setError(err.message);
        }
    }

    const me_ = enc(me.username);

    return (
        <div className="flex flex-col items-center gap-3 text-center">
            <Image className="h-32 w-32 rounded-full border-2 border-paper object-cover"
                src={user.profilePic} alt={user.username} />
            <p className="text-xl font-bold">{user.username}</p>
            <p className="text-sm text-paper/80">{user.bio || 'No bio yet.'}</p>
            {error && <p className="error">{error}</p>}

            {!isOwn && (
                <div>
                    {isFriend && (
                        <button className="btn btn-danger" onClick={() => run(`/users/${me_}/unfriend/${user.id}`)}>
                            Unfriend
                        </button>
                    )}
                    {!isFriend && theyRequested && (
                        <button className="btn" onClick={() => run(`/users/${me_}/accept/${user.id}`)}>
                            Accept friend request
                        </button>
                    )}
                    {!isFriend && !theyRequested && iRequested && (
                        <button className="btn" disabled>Request sent</button>
                    )}
                    {!isFriend && !theyRequested && !iRequested && (
                        <button className="btn" onClick={() => run(`/users/${me_}/friend-request/${enc(user.username)}`)}>
                            Add friend
                        </button>
                    )}
                </div>
            )}

            {isOwn && requests.length > 0 && (
                <div className="card w-full max-w-md">
                    <h3 className="mb-2 font-bold">Friend requests</h3>
                    {requests.map((r) => (
                        <div key={r.id} className="flex items-center justify-between gap-2 py-1">
                            <span>{r.username}</span>
                            <button className="btn btn-sm" onClick={() => run(`/users/${me_}/accept/${r.id}`)}>
                                Accept
                            </button>
                        </div>
                    ))}
                </div>
            )}

            <h3 className="mt-4 w-full border-b border-paper/40 pb-1 text-left font-bold">
                Friends ({friends.length})
            </h3>
            <div className="flex w-full flex-wrap gap-2">
                {friends.length === 0 && <p className="text-sm text-paper/60">No friends yet.</p>}
                {friends.map((friend) => (
                    <Friend key={friend.id} friend={friend} />
                ))}
            </div>

            <h3 className="mt-4 w-full border-b border-paper/40 pb-1 text-left font-bold">
                Posts ({posts.length})
            </h3>
            <div className="grid w-full grid-cols-2 gap-4 text-left sm:grid-cols-3 lg:grid-cols-4">
                {posts.map((post) => (
                    <PostPreview key={post.id} post={post} />
                ))}
            </div>
        </div>
    );
}

export default Profile;