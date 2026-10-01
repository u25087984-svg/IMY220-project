import React, { useEffect, useState } from 'react';
import Header from '../components/Header.jsx';
import Feed from '../components/Feed.jsx';
import SearchInput from '../components/SearchInput.jsx';
import ProfilePreview from '../components/ProfilePreview.jsx';
import { api, enc } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';

function Home() {
    const { user } = useAuth();
    const [tab, setTab] = useState('local'); // 'local' | 'global'
    const [posts, setPosts] = useState([]);
    const [users, setUsers] = useState([]);
    const [term, setTerm] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const path = tab === 'local' ? `/posts/feed/${enc(user.username)}` : '/posts';
        api(path).then(setPosts).catch((err) => setError(err.message));
    }, [tab, user.username]);

    useEffect(() => {
        api('/users').then(setUsers).catch((err) => setError(err.message));
    }, []);

    const t = term.trim().toLowerCase();
    const shownPosts = t
        ? posts.filter((p) =>
            p.caption.toLowerCase().includes(t) ||
            p.username.toLowerCase().includes(t) ||
            (p.hashtags || []).some((h) => h.toLowerCase().includes(t)))
        : posts;
    const shownUsers = users
        .filter((u) => u.username !== user.username)
        .filter((u) => !t || u.username.toLowerCase().includes(t));

    return (
        <div>
            <Header />
            <div className="page">
                <SearchInput term={term} setTerm={setTerm} />
                {error && <p className="error mb-2">{error}</p>}

                <h2 className="mb-2 font-bold">People</h2>
                <div className="mb-4 flex gap-5 overflow-x-auto border-b border-paper/40 pb-4">
                    {shownUsers.length === 0 && <p className="text-sm text-paper/60">No users found.</p>}
                    {shownUsers.map((u) => (
                        <ProfilePreview key={u.id} user={u} />
                    ))}
                </div>

                <div className="flex gap-2">
                    <button className={`btn btn-sm ${tab === 'local' ? 'bg-paper text-black' : ''}`}
                        onClick={() => setTab('local')}>Friends feed</button>
                    <button className={`btn btn-sm ${tab === 'global' ? 'bg-paper text-black' : ''}`}
                        onClick={() => setTab('global')}>Global feed</button>
                </div>

                <Feed posts={shownPosts} />
            </div>
        </div>
    );
}

export default Home;