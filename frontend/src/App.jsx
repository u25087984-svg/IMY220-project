import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Splash from './pages/Splash.jsx';
import Home from './pages/Home.jsx';
import ProfilePage from './pages/Profile.jsx';
import PostPage from './pages/PostPage.jsx';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Splash />} />
                <Route path="/home" element={<Home />} />
                <Route path="/profile/:id" element={<ProfilePage />} />
                <Route path="/post/:id" element={<PostPage />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;