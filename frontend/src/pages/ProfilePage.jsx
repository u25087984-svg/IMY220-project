import React from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header.jsx';
import Profile from '../components/Profile.jsx';
import CreatePost from '../components/CreatePost.jsx';
import { users } from '../Data.js';

function ProfilePage() {
    const { id } = useParams();
    const user = users.find((u) => u.id === Number(id));

    if (!user) {
        return (
            <div>
                <Header />
                <p>User not found.</p>
            </div>
        );
    }

    return (
        <div className="profile-page">
            <Header />
            <Profile user={user} />
            <CreatePost />
        </div>
    );
}

export default ProfilePage;