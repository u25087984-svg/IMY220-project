import React from 'react';
import Header from '../components/Header.jsx';
import Feed from '../components/Feed.jsx';
import SearchInput from '../components/SearchInput.jsx';
import ProfilePreview from '../components/ProfilePreview.jsx';
import { posts, users } from '../Data.js';

function Home() {
    return (
        <div className="home">
            <Header />
            <SearchInput />

            <div className="suggested-users">
                {users.map((user) => (
                    <ProfilePreview key={user.id} user={user} />
                ))}
            </div>

            <Feed posts={posts} />
        </div>
    );
}

export default Home;