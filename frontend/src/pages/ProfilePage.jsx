import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header.jsx';
import Profile from '../components/Profile.jsx';
import CreatePost from '../components/CreatePost.jsx';
import EditProfile from '../components/EditProfile.jsx';
import Albums from '../components/Albums.jsx';
import { api, enc } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';

function ProfilePage() {
    const { username } = useParams();
    const { user: loggedIn } = useAuth();
    const [data, setData] = useState(null);
    const [error, setError] = useState('');
    const [showEdit, setShowEdit] = useState(false);

    const load = useCallback(async () => {
        try {
            const [user, me, allUsers, allPosts] = await Promise.all([
                api(`/users/${enc(username)}`),
                api(`/users/${enc(loggedIn.username)}`),
                api('/users'),
                api('/posts'),
            ]);
            setData({
                user,
                me,
                posts: allPosts.filter((p) => p.username === user.username),
                friends: allUsers.filter((u) => user.friends.includes(u.id)),
                requests: allUsers.filter((u) => user.friendRequests.includes(u.id)),
            });
            setError('');
        } catch (err) {
            setData(null);
            setError(err.message);
        }
    }, [username, loggedIn.username]);

    useEffect(() => { load(); }, [load]);

    const isOwn = data && data.me.username === data.user.username;

    return (
        <div>
            <Header />
            <div className="page flex flex-col gap-6">
                {error && <p className="error">{error}</p>}
                {!data && !error && <p>Loading...</p>}
                {data && (
                    <>
                        <Profile user={data.user} me={data.me} posts={data.posts}
                            friends={data.friends} requests={data.requests} onChanged={load} />

                        {isOwn && (
                            <div className="flex flex-col items-start gap-3">
                                <button className="btn btn-sm" onClick={() => setShowEdit(!showEdit)}>
                                    {showEdit ? 'Close editor' : 'Edit profile'}
                                </button>
                                {showEdit && <EditProfile user={data.user} onSaved={load} />}
                                <CreatePost onCreated={load} />
                            </div>
                        )}

                        <Albums owner={data.user.username} isOwn={isOwn} posts={data.posts} />
                    </>
                )}
            </div>
        </div>
    );
}

export default ProfilePage;