import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
    return (
        <nav className="header">
            <div className="header-left">
                <Link to="/home">Home</Link>
                <Link to="/home">Search</Link>
            </div>

            <h1 className="header-title">MOMENTUM</h1>

            <div className="header-right">
                <Link to="/profile/1">Profile</Link>
                <Link to="/">Log Out</Link>
            </div>
        </nav>
    );
}

export default Header;