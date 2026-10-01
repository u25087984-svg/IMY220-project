import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { enc } from '../api.js';

function Header() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    function handleLogout() {
        logout();
        navigate('/');
    }

    return (
        <nav className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-paper bg-black px-4 py-3 sm:px-6">
            <div className="flex gap-2">
                <Link className="btn btn-sm" to="/home">Home</Link>
                {user && (
                    <Link className="btn btn-sm" to={`/profile/${enc(user.username)}`}>Profile</Link>
                )}
            </div>

            <h1 className="text-xl font-bold uppercase tracking-[0.3em]">Momentum</h1>

            <button className="btn btn-sm" onClick={handleLogout}>Log Out</button>
        </nav>
    );
}

export default Header;